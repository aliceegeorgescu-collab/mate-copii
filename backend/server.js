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
const port = process.env.PORT || 4000;
const frontendBuildPath = path.resolve(__dirname, "..", "frontend", "build");

app.use(express.json());
app.use(cookieParser());

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  });
