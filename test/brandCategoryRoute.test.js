const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing Brand Category Route API", () => {
  let cookies;
  let categoryId;
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
    userId = res.body._id;
  });

  it("POST /api/brandCategory/ Create a new category", async () => {
    const mockCategory = {
      title: "Apple",
    };
    const res = await request(app)
      .post("/api/brandCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple",
      })
    );
    categoryId = res.body._id;
  });

  it("POST /api/brandCategory/ Create a newer category", async () => {
    const mockCategory = {
      title: "Microsoft",
    };
    const res = await request(app)
      .post("/api/brandCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Microsoft",
      })
    );
  });

  it("POST /api/brandCategory/ Create a more newer category", async () => {
    const mockCategory = {
      title: "Nokia",
    };
    const res = await request(app)
      .post("/api/brandCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Nokia",
      })
    );
  });

  it("PUT /api/brandCategory/:id Update a category", async () => {
    const mockCategory = {
      title: "Xiaomi",
    };
    const res = await request(app)
      .put(`/api/brandCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Xiaomi",
      })
    );
  });

  it("GET /api/brandCategory/:id Get a category", async () => {
    const res = await request(app)
      .get(`/api/brandCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Xiaomi",
      })
    );
  });

  it("Delete /api/brandCategory/:id Delete a category", async () => {
    const res = await request(app)
      .delete(`/api/brandCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Xiaomi",
      })
    );
  });

  it("GET /api/brandCategory/all-category Get all category", async () => {
    const res = await request(app)
      .get("/api/brandCategory/all-category")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    console.log(res.body);
  });
});
