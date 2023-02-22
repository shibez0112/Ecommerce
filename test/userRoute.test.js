const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");
const {MongoMemoryServer} = require("mongodb-memory-server");

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
    expect(res.body).toEqual(expect.objectContaining(mockUser));
  });

  it("POST /api/user/register Create duplicate email in database", async () => {
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
    .expect(200);
    expect(res.body).toEqual({
        msg: "User Already Exists",
        success: false,
    });
  });
});
