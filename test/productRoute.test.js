const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");


describe("Testing Product Route API", () => {
  let cookies;
  let productId;
  let userId;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("POST /api/user/register Create new user in database", async () => {
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

  test("POST /api/user/login Login with correct password", async () => {
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

  test("POST /api/product/ Create a new product", async () => {
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

  test("POST /api/product/ Create a second product", async () => {
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

  test("POST /api/product/ Create a third product", async () => {
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

  test("GET /api/product/:id Get a product", async () => {
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

  test("PUT /api/product/:id Update a product", async () => {
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

    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 3",
        description: "This is a newer apple product",
        price: 2500,
        quantity: 2100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );
  });

  test("GET /api/product/all-product Get all product", async () => {
    const res = await request(app)
      .get("/api/product/all-product")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("PUT /api/product/wishlist Wishlist a product", async () => {
    const res = await request(app)
      .put("/api/product/wishlist")
      .set("Cookie", cookies)
      .send({ productId: productId })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918322179",
        role: "admin",
        wishlist: [productId],
      })
    );
  });

  test("PUT /api/product/rating Rate a product", async () => {
    const res = await request(app)
      .put("/api/product/rating")
      .set("Cookie", cookies)
      .send({ productId: productId, star: 4, comment: "This is so good!!" })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining(
        {
          title: "Apple Watch 3",
          description: "This is a newer apple product",
          price: 2500,
          quantity: 2100,
          category: "Phone",
          brand: "Apple",
          color: "Red",
          totalrating: "4",
        },
        expect.objectContaining({
          ratings: [
            { star: 4, postedby: userId, comment: "This is so good!!" },
          ],
        })
      )
    );
  });

  test("DELETE /api/product/:id Delete a product", async () => {
    const res = await request(app)
      .delete(`/api/product/${productId}`)
      .set("Cookie", cookies)
      .expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        title: "Apple Watch 3",
        description: "This is a newer apple product",
        price: 2500,
        quantity: 2100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );
  });

  test("GET /api/product/all-product Get all HP product", async () => {
    const res = await request(app)
      .get("/api/product/all-product?sort=category.brand")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/product/all-product Get all HP product", async () => {
    const res = await request(app)
      .get("/api/product/all-product?fields=title,price,category")
      .set("Content-type", "application/json")
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // test("PUT /api/product/upload/:id Upload image for a product", (done) => {
  //   const testImage = "C:/Users/Toan Pham/Pictures/ejtfyurzip3a1.jpg";

  //   const res = request(app)
  //     .put(`/api/product/upload/${productId}`)
  //     .set("content-type", "application/octet-stream")
  //     .set("Cookie", cookies)
  //     .expect(200);

  //   const imgStream = fs.createReadStream(testImage);
  //   imgStream.on("end", () => res.end(done));
  //   imgStream.pipe(res, { end: false });

  //   console.log(res.body);
  // });
});
