import { createClient } from "redis";

const client = createClient({ url: "redis://localhost:6379" });

client.on("error", (error) => console.error("Redis client error", error));

// Connect once when the application starts
(async () => {
  await client.connect();
  console.log("Connected to Redis");
})();

export async function getFromCache(key: string): Promise<string | null> {
  try {
    const value = await client.get(key);
    return value;
  } catch (error) {
    throw error;
  }
}

export async function setInCache(key: string, value: string): Promise<void> {
  try {
    await client.set(key, value);
  } catch (error) {
    throw error;
  }
}

process.on("SIGINT", async () => {
  try {
    await client.disconnect();
    console.log("Redis client disconnected");
    process.exit(0);
  } catch (err) {
    console.error("Error disconnecting Redis client:", err);
    process.exit(1);
  }
});

export default client;
