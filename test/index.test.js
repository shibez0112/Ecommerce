const request = require("supertest");
const app = require("../index");

describe("Test routing", () => {
  it("GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("Hello from server side");
  });
});
