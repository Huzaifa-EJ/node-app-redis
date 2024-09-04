// index.js
const express = require("express");
const redis = require("redis");

// Create an Express application
const app = express();

// Create a Redis client
// Modify this line to use the REDIS_URL environment variable
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Connect to Redis
client
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

// Endpoint to get the greeting
app.get("/", async (req, res) => {
  try {
    // Check if the greeting is already in Redis
    let greeting = await client.get("greeting");

    if (!greeting) {
      // If not, set a default greeting
      greeting = "Hello, World!";
      await client.set("greeting", greeting);
    }

    // Respond with the greeting
    res.send(greeting);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
