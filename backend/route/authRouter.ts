import express, { NextFunction } from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/user";
import CustomError from "../utils/CustomErrorClass";

const router = express.Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const userRes = await userModel.findOne({ username });
      if (userRes) {
        throw new CustomError("Username already exists", 401);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.create({ username, password: hashedPassword });

      res.json({ message: "User signed up successfully" });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/signin",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const userRes = await userModel.findOne({ username });
      if (!userRes) {
        throw new CustomError("Username not found", 404);
      }

      const passwordMatch = await bcrypt.compare(password, userRes!.password);
      if (!passwordMatch) {
        throw new CustomError("Invalid password", 400);
      }

      const token = jwt.sign({ userId: userRes!._id }, "my-secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
