const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing Product Route API", () => {
  let cookies;
  let productId;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it("POST /api/product/ Create a new product", async () => {
    const mockProduct = {
      title: "Apple Watch",
      slug: "abc",
      description: "This is an apple product",
      price: 500,
      quantity: 100,
      category: "Phone",
      brand: "Apple",
      color: "Red",
    };

    const res = await request(app)
      .post("/api/product/")
      .set("Content-type", "application/json")
      .send(mockProduct)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch",
        slug: "abc",
        description: "This is an apple product",
        quantity: 100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );
  });

  it("POST /api/product/ Create a second product", async () => {
    const mockProduct = {
      title: "Apple Watch 2",
      slug: "abcd",
      description: "This is a new apple product",
      price: 1500,
      quantity: 1100,
      category: "Phone",
      brand: "Apple",
      color: "Red",
    };

    const res = await request(app)
      .post("/api/product/")
      .set("Content-type", "application/json")
      .send(mockProduct)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 2",
        slug: "abcd",
        description: "This is a new apple product",
        price: 1500,
        quantity: 1100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );

    productId = res.body._id;
  });

  it("GET /api/product/:id Get a product", async () => {
    const res = await request(app)
      .get(`/api/product/${productId}`)
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 2",
        slug: "abcd",
        description: "This is a new apple product",
        price: 1500,
        quantity: 1100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );
  });

  it("GET /api/product/all-product Get all product", async () => {
    const res = await request(app)
      .get("/api/product/all-product")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
//    console.log(res.body);
  });
});
