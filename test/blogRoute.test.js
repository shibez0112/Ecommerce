const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Testing Blog Route API", () => {
  let cookies;
  let blogId;

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

  it("POST /api/blog/ create a new blog", async()  => {
    const mockBlog = {
        title: "How to code effectively",
        description: "This is a starter article for the dumbers",
        category: "Coding",
    };
    const res = await request(app)
    .post("/api/blog/")
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .send(mockBlog)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to code effectively",
        description: "This is a starter article for the dumbers",
        category: "Coding",
    }));
    blogId = res.body._id;
  });

  it("POST /api/blog/ create a new sample blog", async()  => {
    const mockBlog = {
        title: "How to write a book",
        description: "This is a starter article for the dumbers 1",
        category: "Book",
    };
    const res = await request(app)
    .post("/api/blog/")
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .send(mockBlog)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to write a book",
        description: "This is a starter article for the dumbers 1",
        category: "Book",
    }));
  });

  it("POST /api/blog/ create a newer sample blog", async()  => {
    const mockBlog = {
        title: "How to debug effectively",
        description: "This is a starter article for the dumbers to debugging",
        category: "Coding",
    };
    const res = await request(app)
    .post("/api/blog/")
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .send(mockBlog)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to debug effectively",
        description: "This is a starter article for the dumbers to debugging",
        category: "Coding",
    }));
  });

  it("GET /api/blog/:id find a blog with id", async()  => {
    const res = await request(app)
    .get(`/api/blog/${blogId}`)
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to code effectively",
        description: "This is a starter article for the dumbers",
        category: "Coding",
        numViews: 1,
    }));
  });


  it("PUT /api/blog/:id update a new blog", async()  => {
    const mockBlog = {
        title: "How to code clean",
        description: "This is a starter article for the dumbers to code cleaer",
        category: "Coding",
    };
    const res = await request(app)
    .put(`/api/blog/${blogId}`)
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .send(mockBlog)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to code clean",
        description: "This is a starter article for the dumbers to code cleaer",
        category: "Coding",
    }));
  });

  it("GET /api/blog/delete/:id delete a blog with id", async()  => {
    const res = await request(app)
    .delete(`/api/blog/${blogId}`)
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .expect(200);

    expect(res.body).toEqual(expect.objectContaining({
        title: "How to code clean",
        description: "This is a starter article for the dumbers to code cleaer",
        category: "Coding",
    }));
  });


  it("GET /api/blog/ find all blog", async()  => {
    const res = await request(app)
    .get("/api/blog/all-blog")
    .set("Content-type", "application/json")
    .set("Cookie", cookies)
    .expect(200);

    expect(res.body.length).toBeGreaterThan(0);
    console.log(res.body);
  });










});