const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const cookieParser = require("cookie-parser");
const express = require("express");

const { initDb, pool } = require("./db");
const authRoutes = require("./routes/auth");
const scoruriRoutes = require("./routes/scoruri");
const accountRoutes = require("./routes/account");

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET. Add it to your environment before starting the backend.");
}

const app = express();
let initPromise = null;

function ensureBackendReady() {
  if (!initPromise) {
    initPromise = initDb().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
}

app.use(express.json());
app.use(cookieParser());

app.use(async (_req, _res, next) => {
  try {
    await ensureBackendReady();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.use("/api", authRoutes);
app.use("/api", scoruriRoutes);
app.use("/api", accountRoutes);

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Unhandled backend error:", error);
  return res.status(500).json({ error: "A aparut o eroare de server." });
});

module.exports = {
  app,
  ensureBackendReady,
};
