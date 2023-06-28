import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import argon2 from "argon2";
interface CustomRequest extends Request {
  username?: JwtPayload;
  isAdmin?: boolean;
}

export const checkBookParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name, author, read } = req.body;
  if (!id || !name || !author || read === undefined) {
    return res.status(404).send("Error: Missing params");
  }
  next();
};
export const errorHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(404).send();
};
export const userAuthor = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).send("Error: Missing username or password");
  }

  next();
};
export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.get("Authorization");

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).send("Invalid token");
  }

  const token = auth.substring(7);

  const secret = process.env.SECRET ?? "";
  if (secret === undefined)
    throw new Error("Missing SECRET environment variable");
  try {
    const decodedToken = jwt.verify(token, secret) as JwtPayload;
    // console.log("decodedAdminToken: ", decodedToken);
    req.username = decodedToken;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }

  next();
};
export const checkIsAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME ?? "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  let isAdmin: boolean;
  if (username === adminUsername) {
    const checkPasword = await argon2.verify(adminPasswordHash, password);
    if (!checkPasword) {
      console.log("Wrong password");
      return res.status(401).send();
    }
    isAdmin = true;
    const payload = { username, isAdmin: true };
    const secret = process.env.SECRET || "";
    const options = { expiresIn: "24h" };
    const token = jwt.sign(payload, secret, options);
    return res.status(200).send({ token, isAdmin });
  }
  next();
};
