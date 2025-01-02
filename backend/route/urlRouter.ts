import express, { NextFunction, Request, Response } from "express";
import userModel from "../model/userModel";
import urlModel from "../model/urlModel";
import verifyToken from "../middleware/verifyToken";
import CustomError from "../utils/CustomErrorClass";
import { getFromCache, setInCache } from "../utils/redisConnection";
import ShortUniqueId from "short-unique-id";

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
          await urlModel.create({ shortURL: aliasURL, originalURL });
          res.json({ shortURL: aliasURL });
        }
      }
      // alias URL not provided
      else {
        const uid = new ShortUniqueId({ length: 7 });
        const shortURL = uid.randomUUID();
        await urlModel.create({ shortURL, originalURL });
        res.json({ shortURL });
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

      const cachedURL = await getFromCache(shortURL);
      if (cachedURL) {
        console.log("Retrieved from cache");
        res.json({ originalURL: cachedURL });
        return;
      }

      const urlRes = await urlModel.findOne({ shortURL });
      if (urlRes) {
        await setInCache(shortURL, urlRes.originalURL);
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
      const { shortURL } = req.body;

      if (!shortURL) {
        throw new CustomError("Provide the short URL to save", 400);
      }

      const urlRes = await urlModel.findOne({ shortURL });
      if (!urlRes) {
        throw new CustomError("Invalid URL id", 400);
      }

      const matchingURL = await userModel.findOne({
        _id: userId,
        myURLs: { $elemMatch: { $eq: urlRes._id } },
      });

      // If the URL is not already saved by the user, save it
      if (matchingURL) {
        res.json({ message: "URL already saved" });
      } else {
        await userModel.findByIdAndUpdate(userId, {
          $push: { myURLs: urlRes._id },
        });
        res.json({ message: "URL saved successfully" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
