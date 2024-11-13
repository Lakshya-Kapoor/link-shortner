import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import authRouter from "./route/authRouter";
import urlRouter from "./route/urlRouter";
import CustomError from "./utils/CustomErrorClass";
import rateLimiter from "./middleware/rateLimiter";

const app = express();
const PORT = 8080;

async function connectToDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/URL-Shortner");
}

connectToDB().catch((error) => {
  console.error("Error connecting to database");
  console.error(error);
});

// parsing JSON request body
app.use(express.json());
app.use(rateLimiter);

app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);

app.use(
  (
    err: CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

// TODO: redis caching to make retrieval faster
// TODO: api rate limiter with redis maybe
// TODO: Zod validation

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
