const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing Product Category Route API", () => {
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

  it("POST /api/prodCategory/ Create a new category", async () => {
    const mockCategory = {
      title: "Phone",
    };
    const res = await request(app)
      .post("/api/prodCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Phone",
      })
    );
    categoryId = res.body._id;
  });

  it("POST /api/prodCategory/ Create a newer category", async () => {
    const mockCategory = {
      title: "PC",
    };
    const res = await request(app)
      .post("/api/prodCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "PC",
      })
    );
  });

  it("POST /api/prodCategory/ Create a more newer category", async () => {
    const mockCategory = {
      title: "AC",
    };
    const res = await request(app)
      .post("/api/prodCategory/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "AC",
      })
    );
  });

  it("PUT /api/prodCategory/:id Update a category", async () => {
    const mockCategory = {
      title: "Laptop",
    };
    const res = await request(app)
      .put(`/api/prodCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCategory)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Laptop",
      })
    );
  });

  it("GET /api/prodCategory/:id Get a category", async () => {
    const res = await request(app)
      .get(`/api/prodCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Laptop",
      })
    );
  });

  it("Delete /api/prodCategory/:id Delete a category", async () => {
    const res = await request(app)
      .delete(`/api/prodCategory/${categoryId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Laptop",
      })
    );
  });

  it("GET /api/prodCategory/all-category Get all category", async () => {
    const res = await request(app)
      .get("/api/prodCategory/all-category")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    console.log(res.body);
  });
});
