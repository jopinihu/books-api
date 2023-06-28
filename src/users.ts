import express, { Request, Response } from "express";
import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userAuthor, checkIsAdmin } from "./middleware";
const user = express.Router();

interface User {
  username: string;
  hashedPassword: string;
}
interface UserRequest extends Request {
  username?: JwtPayload;
}
const userMemory: User[] = [];

const findUserByUsername = (username: string) => {
  return userMemory.find((user) => user.username === username);
};
user.post(
  "/login",
  checkIsAdmin,

  async (req: UserRequest, res: Response) => {
    const { username, password } = req.body;
    const user = findUserByUsername(username);
    if (user) {
      return res.status(401).send("User already exist");
    }
    const hashedPassword = await argon2.hash(password);
    userMemory.push({ username, hashedPassword });
    const token = jwt.sign(
      { username: req.body.username },
      process.env.SECRET ?? ""
    );
    return res.status(200).send({ token });
  }
);

user.post("/register", async (req: UserRequest, res: Response) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME) {
    return res.status(401).send("Admin username is not allowed");
  } else {
    const userExist = findUserByUsername(username);
    if (userExist === undefined) {
      const hashedPassword = await argon2.hash(password);
      userMemory.push({ username, hashedPassword });
      return res.status(200).send("User added");
    } else {
      return res.status(401).send("User already exists");
    }
  }
});
export default user;
