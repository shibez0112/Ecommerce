const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing Coupon Category Route API", () => {
  let cookies;
  let couponId;
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

  
  it("POST /api/coupon/ Create a new coupon", async () => {
    const mockCoupon = {
      name: "HELLO",
      expiry: "2023-03-05T07:33:58.000Z",
      discount: 20,
    };
    const res = await request(app)
      .post("/api/coupon/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCoupon)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "HELLO",
        expiry: "2023-03-05T07:33:58.000Z",
        discount: 20,
      })
    );
    couponId = res.body._id;
  });

  it("POST /api/coupon/ Create a second coupon", async () => {
    const mockCoupon = {
      name: "WORLD",
      expiry: "2023-04-05T07:33:58.000Z",
      discount: 80,
    };
    const res = await request(app)
      .post("/api/coupon/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCoupon)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "WORLD",
        expiry: "2023-04-05T07:33:58.000Z",
        discount: 80,
      })
    );
  });

  it("POST /api/coupon/ Create a new coupon", async () => {
    const mockCoupon = {
      name: "HAHA",
      expiry: "2023-05-05T07:33:58.000Z",
      discount: 10,
    };
    const res = await request(app)
      .post("/api/coupon/")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCoupon)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "HAHA",
        expiry: "2023-05-05T07:33:58.000Z",
        discount: 10,
      })
    );
  });

  it("PUT /api/coupon/:id update a new blog", async () => {
    const mockCoupon = {
        name: "HEYJUDES",
        expiry: "2023-09-09T02:33:58.000Z",
        discount: 50,
    };
    const res = await request(app)
      .put(`/api/coupon/${couponId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .send(mockCoupon)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "HEYJUDES",
        expiry: "2023-09-09T02:33:58.000Z",
        discount: 50,
      })
    );
  });

  it("GET /api/coupon/:id find a coupon with id", async () => {
    const res = await request(app)
      .get(`/api/coupon/${couponId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "HEYJUDES",
        expiry: "2023-09-09T02:33:58.000Z",
        discount: 50,
      })
    );
  });

  it("DELETE /api/coupon/delete/:id delete a coupon with id", async () => {
    const res = await request(app)
      .delete(`/api/coupon/${couponId}`)
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        name: "HEYJUDES",
        expiry: "2023-09-09T02:33:58.000Z",
        discount: 50,
      })
    );
  });

  
  it("GET /api/blog/all-blog find all blog", async () => {
    const res = await request(app)
      .get("/api/coupon/all-coupon")
      .set("Content-type", "application/json")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
  });



});