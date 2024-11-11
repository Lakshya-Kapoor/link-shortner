import express, { NextFunction, Request, Response } from "express";
import userModel from "../model/user";
import urlModel from "../model/url";
import verifyToken from "../middleware/authMiddleware";
import CustomError from "../utils/CustomErrorClass";

const router = express.Router();

// Shortens a long URL
router.post(
  "/shorten",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { originalURL } = req.body;
      const { aliasURL } = req.query;

      if (!originalURL) {
        throw new CustomError("URL is required", 400);
      }

      // If an alias URL is provided
      if (aliasURL) {
        const urlRes = await urlModel.findOne({ shortURL: aliasURL });
        if (urlRes) {
          throw new CustomError("This alias URL already exists", 400);
        } else {
          const newURL = await urlModel.create({
            shortURL: aliasURL,
            originalURL,
          });
          res.json({ shortURL: aliasURL, urlId: newURL._id });
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
      next(error);
    }
  }
);

// Expands a short URL
router.get(
  "/expand/:shortURL",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shortURL } = req.params;

      if (!shortURL) {
        throw new CustomError("short URL is required", 400);
      }

      const urlRes = await urlModel.findOne({ shortURL });
      if (urlRes) {
        res.json({ originalURL: urlRes.originalURL });
      } else {
        throw new CustomError("Invalid short URL", 400);
      }
    } catch (error) {
      next(error);
    }
  }
);

// Lists all the URLs saved by the user
router.get(
  "/list",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user;
    try {
      const urlIdList = (await userModel.findById(userId))?.myURLs;
      const urls = await urlModel.find({ _id: { $in: urlIdList } });
      res.json(urls);
    } catch (error) {
      next(error);
    }
  }
);

// Saves a URL for the user
router.post(
  "/save",
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user;
      const { urlId } = req.body;

      if (!urlId || urlId.length != 24) {
        throw new CustomError("Invalid URL id", 400);
      }

      const urlRes = await urlModel.findById(urlId);
      if (!urlRes) {
        throw new CustomError("Invalid URL id", 400);
      }

      const matchingURL = await userModel.findOne({
        _id: userId,
        myURLs: { $elemMatch: { $eq: urlId } },
      });

      // If the URL is not already saved by the user, save it
      if (matchingURL) {
        res.json({ message: "URL already saved" });
      } else {
        await userModel.findByIdAndUpdate(userId, { $push: { myURLs: urlId } });
        res.json({ message: "URL saved successfully" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
