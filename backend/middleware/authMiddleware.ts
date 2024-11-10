import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "Access denied" });
  }

  try {
    const payload: any = jwt.verify(token!, "my-secret-key");
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}
