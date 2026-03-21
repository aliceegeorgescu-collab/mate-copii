require("dotenv").config();

const express = require("express");
const path = require("path");
const { initDb, pool } = require("./db");

const app = express();
const port = process.env.PORT || 4000;
const buildPath = path.resolve(__dirname, "..", "build");

app.use(express.json());

function mapProfile(row, history = []) {
  return {
    id: row.id,
    playerId: row.player_id,
    name: row.name,
    personaj: row.personaj,
    steleGlobale: row.stele_globale,
    sunetActivat: row.sunet_activat,
    lastSessionAt: row.last_session_at,
    history,
  };
}

function mapResult(row) {
  return {
    id: row.id,
    jocId: row.joc_id,
    dificultate: row.dificultate,
    scor: row.scor,
    maxExercitii: row.max_exercitii,
    playedAt: row.played_at,
  };
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/account/:playerId", async (req, res) => {
  const { playerId } = req.params;

  try {
    const profilesResult = await pool.query(
      `
        SELECT id, player_id, name, personaj, stele_globale, sunet_activat, last_session_at, created_at, updated_at
        FROM child_profiles
        WHERE player_id = $1
        ORDER BY created_at ASC
      `,
      [playerId]
    );

    const historyResult = await pool.query(
      `
        SELECT id, profile_id, joc_id, dificultate, scor, max_exercitii, played_at
        FROM game_results
        WHERE profile_id IN (
          SELECT id FROM child_profiles WHERE player_id = $1
        )
        ORDER BY played_at DESC
      `,
      [playerId]
    );

    const historyByProfile = new Map();
    for (const row of historyResult.rows) {
      const current = historyByProfile.get(row.profile_id) ?? [];
      if (current.length < 20) {
        current.push(mapResult(row));
      }
      historyByProfile.set(row.profile_id, current);
    }

    res.json({
      profiles: profilesResult.rows.map((row) => mapProfile(row, historyByProfile.get(row.id) ?? [])),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/account/:playerId/profiles", async (req, res) => {
  const { playerId } = req.params;
  const { id, name, personaj = null, steleGlobale = 0, sunetActivat = true } = req.body ?? {};

  if (!id || !name) {
    return res.status(400).json({ error: "Missing profile id or name" });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO child_profiles (id, player_id, name, personaj, stele_globale, sunet_activat)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, player_id, name, personaj, stele_globale, sunet_activat, last_session_at
      `,
      [id, playerId, name, personaj, steleGlobale, sunetActivat]
    );

    res.status(201).json(mapProfile(result.rows[0], []));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/account/:playerId/profiles/:profileId/state", async (req, res) => {
  const { playerId, profileId } = req.params;
  const { name, personaj = null, steleGlobale = 0, sunetActivat = true, lastSessionAt = null } = req.body ?? {};

  try {
    const result = await pool.query(
      `
        UPDATE child_profiles
        SET
          name = COALESCE($3, name),
          personaj = $4,
          stele_globale = $5,
          sunet_activat = $6,
          last_session_at = COALESCE($7, last_session_at),
          updated_at = NOW()
        WHERE player_id = $1 AND id = $2
        RETURNING id, player_id, name, personaj, stele_globale, sunet_activat, last_session_at
      `,
      [playerId, profileId, name ?? null, personaj, steleGlobale, sunetActivat, lastSessionAt]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(mapProfile(result.rows[0], []));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/account/:playerId/profiles/:profileId/results", async (req, res) => {
  const { playerId, profileId } = req.params;
  const { id, jocId, dificultate, scor, maxExercitii, playedAt } = req.body ?? {};

  if (!id || !jocId || !dificultate) {
    return res.status(400).json({ error: "Missing result data" });
  }

  try {
    const profileExists = await pool.query(
      `SELECT 1 FROM child_profiles WHERE player_id = $1 AND id = $2`,
      [playerId, profileId]
    );

    if (profileExists.rowCount === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const result = await pool.query(
      `
        INSERT INTO game_results (id, profile_id, joc_id, dificultate, scor, max_exercitii, played_at)
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()))
        RETURNING id, profile_id, joc_id, dificultate, scor, max_exercitii, played_at
      `,
      [id, profileId, jocId, dificultate, scor, maxExercitii, playedAt]
    );

    await pool.query(
      `
        UPDATE child_profiles
        SET last_session_at = COALESCE($3, NOW()), updated_at = NOW()
        WHERE player_id = $1 AND id = $2
      `,
      [playerId, profileId, playedAt]
    );

    return res.status(201).json(mapResult(result.rows[0]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(buildPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(path.join(buildPath, "index.html"));
  });
}

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API server:", error.message);
    process.exit(1);
  });
