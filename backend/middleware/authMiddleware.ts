import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomErrorClass";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      throw new CustomError("Authentication token missing", 401);
    }

    jwt.verify(token!, "my-secret-key", (err, payload) => {
      if (err) {
        throw new CustomError("Invalid token", 401);
      }
      req.user = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
}
