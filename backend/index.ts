import express, { NextFunction, Request, Response } from "express";

const app = express();
const PORT = 8080;

const mapURL = new Map<string, string>();

// parsing JSON request body
app.use(express.json());

// create short URL
app.post("/api/short-url", (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ message: "URL is required" });
  }

  const shortURL = Date.now().toString();
  mapURL.set(shortURL, url);

  res.status(201).json({ shortURL });
});

// get long URL from short URL
app.get("/api/long-url/:shortURL", (req: Request, res: Response) => {
  const { shortURL } = req.params;

  if (!mapURL.has(shortURL)) {
    res.status(404).json({ message: "URL not found" });
  }

  const originalURL = mapURL.get(shortURL);
  res.json({ originalURL });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
