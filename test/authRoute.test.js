const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing User Route API", () => {
  let cookies;
  let loginUserId;
  let userId;
  let productId;
  let products = [];

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

  test("POST /api/user/register Create another new user in database", async () => {
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

  test("POST /api/user/register Create duplicate user with same email in database", async () => {
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
    loginUserId = res.body._id;
  });

  test("POST /api/user/login Login with incorrect password", async () => {
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

  test("GET /api/user/all-users Get all user from db", async () => {
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

  test("PUT /api/user/block-user/:id Block user ginta2777@gmail.com ", async () => {
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

  test("PUT /api/user/block-user/:id Unblock user ginta2777@gmail.com ", async () => {
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

  test("PUT /api/user/save-address Save address of user ", async () => {
    const res = await request(app)
      .put("/api/user/save-address")
      .set("Cookie", cookies)
      .send({ address: "ThuDuc Province" })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        firstname: "Toan",
        lastname: "Pham",
        email: "ginta2888@gmail.com",
        mobile: "0918322179",
        role: "admin",
        address: "ThuDuc Province",
      })
    );
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
        price: 500,
        quantity: 100,
        category: "Phone",
        brand: "Apple",
        color: "Red",
      })
    );
    products.push(res.body._id);
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
    products.push(res.body._id);
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

  test("GET /api/user/wishlist Check wishlist of user ", async () => {
    const res = await request(app)
      .get("/api/user/wishlist")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.wishlist.length).toBeGreaterThan(0);
  });

  test("POST /api/user/cart Add to cart products", async () => {
    const mockCart = {
      cart: [
        {
          _id: products[0],
          count: 4,
          color: "yellow",
        },
        {
          _id: products[1],
          count: 5,
          color: "red",
        },
      ],
    };

    const res = await request(app)
      .post("/api/user/cart")
      .set("Cookie", cookies)
      .send(mockCart)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        products: [
          expect.objectContaining({
            product: products[0],
            count: 4,
            color: "yellow",
            price: 500,
          }),
          expect.objectContaining({
            product: products[1],
            count: 5,
            color: "red",
            price: 1500,
          }),
        ],
        cartTotal: 9500,
        orderby: loginUserId,
      })
    );
    console.log(res.body);
  });

  test("PUT /api/user/block-user/:id Block user ginta2777@gmail.com but unauthorized", async () => {
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

  test("PUT /api/user/password Reset user password", async () => {
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
