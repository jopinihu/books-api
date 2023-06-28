import "dotenv/config";
import express from "express";
import { authenticate, errorHandler, userAuthor } from "./middleware";
import router from "./books";
import user from "./users";
const server = express();
server.use(express.json());

server.use("/api/v1/books", authenticate, router);
server.use("/api/v1/users", userAuthor, user);
server.use(errorHandler);

export default server;
