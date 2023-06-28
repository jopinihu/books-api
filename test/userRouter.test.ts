import request from "supertest";
import server from "../src/server";

describe("Server", () => {
  it("Checking if a user can register", async () => {
    const res = await request(server).post("/api/v1/users/register").send({
      username: "joonas",
      password: "kettukuittaa",
    });
    expect(res.statusCode).toBe(200);
  });
  it("can login after registering", async () => {
    const res = await request(server).post("/api/v1/users/login").send({
      username: "Joonas",
      password: "kettukuittaa",
    });
    expect(res.statusCode).toBe(200);
  });
});
describe("Server", () => {
  it("Checking if user can add new book", async () => {
    const res = await request(server).post("/api/v1/books").send({
      id: 2,
      name: "Harry Potter ja liekehtivä pikari",
      author: "J.K.Rowling",
      read: true,
    });
    expect(res.statusCode).toBe(201);
  });
  it("Checking if user can edit book", async () => {
    const res = await request(server).put("/api/v1/books/2").send({
      id: 2,
      name: "Harry Potter ja Kuoleman varjelukset",
      author: "J.K.Rowling",
      read: false,
    });
    expect(res.statusCode).toBe(201);
  });
  it("Checking if user can delete book", async () => {
    const res = await request(server).delete("/api/v1/books/2").send({
      id: 2,
      name: "Harry Potter ja liekehtivä pikari",
      author: "J.K.Rowling",
      read: true,
    });
    expect(res.statusCode).toBe(204);
  });
});
