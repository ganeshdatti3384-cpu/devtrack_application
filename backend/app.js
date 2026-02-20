const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: "postgres",
  user: "postgres",
  password: "postgres",
  database: "devtrack",
  port: 5432
});

const redisClient = redis.createClient({
  url: "redis://redis:6379"
});

redisClient.connect();

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      status VARCHAR(50)
    )
  `);
}

app.get("/health", (req, res) => {
  res.json({ status: "DevTrack Backend Running 🚀" });
});

app.post("/issues", async (req, res) => {
  const { title, status } = req.body;
  await pool.query(
    "INSERT INTO issues(title,status) VALUES($1,$2)",
    [title, status]
  );
  await redisClient.del("issues_cache");
  res.json({ message: "Issue created" });
});

app.get("/issues", async (req, res) => {
  const cache = await redisClient.get("issues_cache");
  if (cache) return res.json(JSON.parse(cache));

  const result = await pool.query("SELECT * FROM issues");
  await redisClient.set("issues_cache", JSON.stringify(result.rows));
  res.json(result.rows);
});

app.listen(5000, async () => {
  await initDB();
  console.log("Backend running on port 5000");
});
