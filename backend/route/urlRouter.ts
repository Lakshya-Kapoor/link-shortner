import express, { Request, Response } from "express";
import userModel from "../model/user";
import urlModel from "../model/url";
import verifyToken from "../middleware/authMiddleware";

const router = express.Router();

// Shortens a long URL
router.post("/shorten", async (req: Request, res: Response) => {
  try {
    const { originalURL } = req.body;
    const { aliasURL } = req.query;

    if (!originalURL) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    // If an alias URL is provided
    if (aliasURL) {
      const urlRes = await urlModel.findOne({ shortURL: aliasURL });
      if (urlRes) {
        res.status(400).json({ error: "This alias URL already exists" });
      } else {
        const newURL = await urlModel.create({
          shortURL: aliasURL,
          originalURL,
        });
        res.json({ shortURL: newURL.shortURL, urlId: newURL._id });
      }
    }

    // Checks if shortened URL already exists in the database
    const urlRes = await urlModel.findOne({ originalURL });
    if (urlRes) {
      res.json({ shortURL: urlRes.shortURL, urlId: urlRes._id });
    } else {
      const shortURL = Date.now().toString();
      const newURL = await urlModel.create({ shortURL, originalURL });
      res.json({ shortURL: newURL.shortURL, urlId: newURL._id });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Expands a short URL
router.get("/expand/:shortURL", async (req: Request, res: Response) => {
  const { shortURL } = req.params;

  if (!shortURL) {
    res.status(400).json({ error: "short URL is required" });
    return;
  }

  const urlRes = await urlModel.findOne({ shortURL });
  if (urlRes) {
    res.json({ orignalURL: urlRes.originalURL });
  } else {
    res.json({ error: "Invalid short URL" });
  }
});

// Lists all the URLs saved by the user
router.get("/list", verifyToken, async (req: Request, res: Response) => {
  const { userId } = req.user;
  try {
    const urlIdList = (await userModel.findById(userId))?.myURLs;
    const urls = await urlModel.find({ _id: { $in: urlIdList } });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Saves a URL for the user
router.post("/save", verifyToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { urlId } = req.body;

    if (!urlId || urlId.length != 24) {
      res.status(400).json({ error: "Invalid URL id" });
      return;
    }

    const url = await urlModel.findById(urlId);
    if (!url) {
      res.status(400).json({ error: "Invalid URL id" });
      return;
    }

    const matchingURL = await userModel.findOne({
      _id: userId,
      myURLs: { $elemMatch: { $eq: urlId } },
    });

    // If the URL is not already saved by the user, save it
    if (!matchingURL) {
      await userModel.findByIdAndUpdate(userId, { $push: { myURLs: urlId } });
    }

    res.json({ message: "URL saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
