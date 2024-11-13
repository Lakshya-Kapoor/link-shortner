import { Request, Response, NextFunction } from "express";
import client from "../utils/redisConnection";
import CustomError from "../utils/CustomErrorClass";

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip;
  const key = `request:${ip}`;

  const countVal = await client.get(key);
  const count = countVal ? parseInt(countVal) : 0;

  if (count === 0) {
    await client.set(key, 1);
    await client.expire(key, 15 * 60);
  } else {
    await client.incr(key);
  }

  if (count >= 100) {
    next(new CustomError(`${count + 1} requests from this ip: ${ip}`, 429));
  } else {
    next();
  }
}
