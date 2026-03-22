const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const express = require("express");
const { app, ensureBackendReady } = require("./app");

const port = process.env.PORT || 4000;
const frontendBuildPath = path.resolve(__dirname, "..", "frontend", "build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

ensureBackendReady()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  });
