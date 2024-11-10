import express from "express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../model/user";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userRes = await userModel.findOne({ username });
    if (userRes) {
      res.status(400).json({ error: "username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({ username, password: hashedPassword });

    res.json({ message: "User signed up successfully" });
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userRes = await userModel.findOne({ username });
    if (!userRes) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, userRes!.password);
    if (!passwordMatch) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const token = jwt.sign({ userId: userRes!._id }, "my-secret-key", {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

export default router;
