import * as request from "supertest";
import * as mongoose from "mongoose";
import { TodoSchema } from "../models/todoModel";

const Todo = mongoose.model("todo", TodoSchema);
let server;
let todoId;
let todo;
let todoItem;
describe("api/todos", () => {
  beforeEach(async () => {
    server = require("../server");
    todoId = mongoose.Types.ObjectId();
    todoItem = {
      id: todoId,
      title: "Buy Some Milk",
      description: "Some Description: buy from Hassan dairy",
      done: true
    };
    todo = new Todo(todoItem);
    await todo.save();
  });

  // GET endpoint tests
  describe("GET api/todos", () => {
    it("Should return 200 OK", async () => {
      let result = await request(server).get("/api/todos");
      expect(result.status).toBe(200);
    });
  });

  //TEST DB tests
  describe("DB test", () => {
    it("Should match the returned value", async () => {
      let result = await Todo.findById(todo._id);
      expect(result._id).toEqual(todo._id);
      expect(result.title).toEqual(todo.title);
      expect(result.description).toEqual(todo.description);
      expect(result.done).toEqual(todo.done);
    });
  });

  //POST endpoint tests
  describe("POST api/todos", () => {
    it("Should return 400 error", async () => {
      let result = await request(server)
        .post("/api/todos")
        .send({
          id: todoId,
          description: "Some Description: buy from Hassan dairy",
          done: true
        });
      expect(result.status).toBe(400);
    });
    it("Should return 400 error", async () => {
      let result = await request(server)
        .post("/api/todos")
        .send({
          id: todoId,
          title: "some title",
          done: true
        });
      expect(result.status).toBe(400);
    });
    it("Should return the body", async () => {
      let result = await request(server)
        .post("/api/todos")
        .send(todoItem);
      expect(result.body.title).toBe("Buy Some Milk");
      expect(result.body.description).toBe(
        "Some Description: buy from Hassan dairy"
      );
    });
    it("Should return 200 OK", async () => {
      let result = await request(server)
        .post("/api/todos")
        .send(todoItem);
      expect(result.status).toBe(200);
    });
  });

  //PUT endpoint tests
  describe("PUT api/todos/:id", () => {
    it("Should return 200 OK on Update", async () => {
      let result = await request(server)
        .put(`/api/todos/todo._id`)
        .send({ done: true });
      expect(result.status).toBe(200);
    });
  });

  //DELETE endpoint tests
  describe("DELETE api/todos/:id", () => {
    it("Should return 200 OK on Delete", async () => {
      let result = await request(server).delete(`/api/todos/todo._id`);
      expect(result.status).toBe(200);
    });
  });

  afterEach(async () => {
    await server.close();
    await Todo.remove({});
  });
});
