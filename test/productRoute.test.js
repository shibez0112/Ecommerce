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
    cookies = res.headers['set-cookie']
  });

  it("POST /api/product/ Create a new product", async () => {
    const mockProduct = {
      title: "Apple Watch",
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
      .set("Cookie", cookies)
      .send(mockProduct)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch",
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
      .set("Cookie", cookies)
      .send(mockProduct)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 2",
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

  it("POST /api/product/ Create a third product", async () => {
    const mockProduct = {
      title: "HP Laptop",
      description: "This is a HP laptop",
      price: 2000,
      quantity: 1100,
      category: "Computer",
      brand: "HP",
      color: "Black",
    };

    const res = await request(app)
      .post("/api/product/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockProduct)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "HP Laptop",
        description: "This is a HP laptop",
        price: 2000,
        quantity: 1100,
        category: "Computer",
        brand: "HP",
        color: "Black",
      })
    );
  });

  it("GET /api/product/:id Get a product", async () => {
    const res = await request(app)
      .get(`/api/product/${productId}`)
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 2",
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
    //console.log(res.body);
  });

  it ("PUT /api/product/:id Update a product", async() =>{
    const updateData = {
      title: "Apple Watch 3",
      description: "This is a newer apple product",
      price: 2500,
      quantity: 2100,
      category: "Phone",
      brand: "Apple",
      color: "Red",
    };

    const res = await request(app)
    .put(`/api/product/${productId}`)
    .set("Cookie", cookies)
    .send(updateData)
    .expect(200);
    expect(res.body).toEqual(expect.objectContaining({
      title: "Apple Watch 3",
      description: "This is a newer apple product",
      price: 2500,
      quantity: 2100,
      category: "Phone",
      brand: "Apple",
      color: "Red",
    }));
    //console.log(res.body);
  });

  it("DELETE /api/product/:id Delete a product", async() =>{
    const res = await request(app)
    .delete(`/api/product/${productId}`)
    .set("Cookie", cookies)
    .expect(200);
    expect(res.body).toEqual(expect.objectContaining({
      title: "Apple Watch 3",
      description: "This is a newer apple product",
      price: 2500,
      quantity: 2100,
      category: "Phone",
      brand: "Apple",
      color: "Red",
    }));
  });

  it("GET /api/product/all-product Get all HP product", async () => {
    const res = await request(app)
      .get("/api/product/all-product?sort=category.brand")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    //console.log(res.body);
  });

  it("GET /api/product/all-product Get all HP product", async () => {
    const res = await request(app)
      .get("/api/product/all-product?fields=title,price,category")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
    console.log(res.body);
  });


});
