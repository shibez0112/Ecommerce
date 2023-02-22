const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing User Route API", () => {
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
      mobile: "0918377256",
      password: "$ecret123",
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
        mobile: "0918377256",
        role: "user",
      })
    );
  });

  it("POST /api/user/register Create another user in database", async () => {
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
      .expect(200);
    expect(res.body).toEqual([
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918377256",
        role: "user",
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
});
