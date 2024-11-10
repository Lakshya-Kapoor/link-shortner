import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import urlModel from "./model/url";
import authRouter from "./route/authRouter";

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

app.use("/api/auth", authRouter);

// create short URL
app.post("/api/short-url", async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: "URL is required" });
  }

  const urlRes = await urlModel.findOne({ originalURL: url });

  if (urlRes) {
    res.json({ shortURL: urlRes.shortURL });
  } else {
    const shortURL = Date.now().toString();
    await urlModel.create({
      shortURL,
      originalURL: url,
    });
    res.json({ shortURL });
  }
});

// get long URL from short URL
app.get("/api/long-url/:shortURL", async (req: Request, res: Response) => {
  const { shortURL } = req.params;

  if (!shortURL) {
    res.status(400).json({ error: "short URL is required" });
  }

  const urlRes = await urlModel.findOne({ shortURL });

  if (urlRes) {
    res.json({ orignalURL: urlRes.originalURL });
  } else {
    res.json({ error: "Invalid short URL" });
  }
});

// TODO: user auth to save shortened URLS to dashboard
// TODO: redis caching to make retrieval faster
// TODO: api rate limiter with redis maybe
// TODO: alias url feature

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
