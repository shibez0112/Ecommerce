const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing User Route API", () => {
  let cookies;
  let userId;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it("POST /api/user/register Create new user in database", async () => {
    const mockUser = {
      firstname: "Toan",
      lastname: "Pham",
      email: "ginta2888@gmail.com",
      mobile: "0918322179",
      password: "$ecret123",
      role: "admin",
    };

    const res = await request(app)
      .post("/api/user/register")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918322179",
        role: "admin",
      })
    );
  });

  it("POST /api/user/register Create another new user in database", async () => {
    const mockUser = {
      firstname: "Toane",
      lastname: "Phame",
      email: "ginta2777@gmail.com",
      mobile: "0918377259",
      password: "$ecret123",
    };

    const res = await request(app)
      .post("/api/user/register")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toane",
        lastname: "Phame",
        email: "ginta2777@gmail.com",
        mobile: "0918377259",
        role: "user",
      })
    );

    // Get user Id for further testing
    userId = res.body._id;
  });

  it("POST /api/user/register Create duplicate user with same email in database", async () => {
    const mockUser = {
      firstname: "Toan",
      lastname: "Phan",
      email: "ginta2888@gmail.com",
      mobile: "0918377556",
      password: "$ecret123",
    };

    const res = await request(app)
      .post("/api/user/register")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "User Already Exists",
      })
    );
  });

  it("POST /api/user/login Login with correct password", async () => {
    const mockUser = {
      email: "ginta2888@gmail.com",
      password: "$ecret123",
    };

    const res = await request(app)
      .post("/api/user/login")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(200);

    // get cookies for authentication
    cookies = res.headers["set-cookie"];
  });

  it("POST /api/user/login Login with incorrect password", async () => {
    const mockUser = {
      email: "ginta2888@gmail.com",
      password: "ecret123",
    };

    const res = await request(app)
      .post("/api/user/login")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Invalid Credentials",
      })
    );
  });

  it("GET /api/user/all-users Get all user from db", async () => {
    const res = await request(app)
      .get("/api/user/all-users")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).toEqual([
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918322179",
        role: "admin",
      }),
      expect.objectContaining({
        firstname: "Toane",
        lastname: "Phame",
        email: "ginta2777@gmail.com",
        mobile: "0918377259",
        role: "user",
      }),
    ]);
  });

  it("PUT /api/user/block-user/:id Block user ginta2777@gmail.com ", async () => {
    const res = await request(app)
      .put(`/api/user/block-user/${userId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toane",
        lastname: "Phame",
        email: "ginta2777@gmail.com",
        mobile: "0918377259",
        role: "user",
        isBlocked: true,
      })
    );
  });

  it("PUT /api/user/block-user/:id Unblock user ginta2777@gmail.com ", async () => {
    const res = await request(app)
      .put(`/api/user/unblock-user/${userId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toane",
        lastname: "Phame",
        email: "ginta2777@gmail.com",
        mobile: "0918377259",
        role: "user",
        isBlocked: false,
      })
    );
  });

  it("PUT /api/user/block-user/:id Block user ginta2777@gmail.com but unauthorized", async () => {
    const mockUser = {
      email: "ginta2777@gmail.com",
      password: "$ecret123",
    };

    const resLogin = await request(app)
      .post("/api/user/login")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(200);

    // get cookies for authentication
    cookies = resLogin.headers["set-cookie"];

    const res = await request(app)
      .put(`/api/user/block-user/${userId}`)
      .set("Cookie", cookies)
      .expect(500);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "You re not an admin",
      })
    );
  });

  it("PUT /api/user/password Reset user password", async () => {
    let mockUser = {
      email: "ginta2888@gmail.com",
      password: "$ecret123",
    };

    // Login
    const resLogin = await request(app)
      .post("/api/user/login")
      .set("Content-type", "application/json")
      .send(mockUser)
      .expect(200);

    cookies = resLogin.headers["set-cookie"];

    const mockPassword = {
      email: "ginta2888@gmail.com",
      password: "Secret123",
    };

    // Change password
    const resPassword = await request(app)
      .put("/api/user/password")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockPassword)
      .expect(200);
      console.log("Change password success");

    // Login
    const loginAgain = await request(app)
      .post("/api/user/login")
      .set("Content-type", "application/json")
      .send(mockPassword)
      .expect(200);

    expect(loginAgain.body).toEqual(
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918322179",
      })
    );
  });
});
