const express = require("express");

const { pool } = require("../db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const ALLOWED_GAMES = new Set(["baloane", "trenulet", "pescuit", "racheta", "cursa", "labirint_batman", "gradinita_vesela"]);
const ALLOWED_DIFFICULTIES = new Set(["usor", "mediu", "greu"]);
const ALLOWED_SPEEDS = new Set(["incet", "normal", "rapid"]);

function normalizeGamePreferences(value) {
  const source = value && typeof value === "object" ? value : {};
  const rawSpeedByGame = source.speedByGame && typeof source.speedByGame === "object" ? source.speedByGame : {};
  const rawHintSeenByGame = source.hintSeenByGame && typeof source.hintSeenByGame === "object" ? source.hintSeenByGame : {};

  const speedByGame = {};
  for (const [gameId, speedId] of Object.entries(rawSpeedByGame)) {
    if (ALLOWED_GAMES.has(gameId) && ALLOWED_SPEEDS.has(speedId)) {
      speedByGame[gameId] = speedId;
    }
  }

  const hintSeenByGame = {};
  for (const [gameId, seen] of Object.entries(rawHintSeenByGame)) {
    if (ALLOWED_GAMES.has(gameId) && seen === true) {
      hintSeenByGame[gameId] = true;
    }
  }

  return {
    speedByGame,
    hintSeenByGame,
  };
}

function normalizeProfile(row, history = []) {
  return {
    id: row.id,
    name: row.name,
    personaj: row.personaj,
    steleGlobale: row.stele_globale,
    sunetActivat: row.sunet_activat,
    gamePreferences: normalizeGamePreferences(row.game_preferences),
    lastSessionAt: row.last_session_at,
    history,
  };
}

async function loadProfiles(userId) {
  const [profilesResult, historyResult] = await Promise.all([
    pool.query(
      `
        SELECT id, name, personaj, stele_globale, sunet_activat, game_preferences, last_session_at, created_at
        FROM profiluri_copii
        WHERE user_id = $1
        ORDER BY created_at ASC
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT id, profile_id, joc_id, dificultate, scor, max_exercitii, played_at
        FROM rezultate_copii
        WHERE user_id = $1
        ORDER BY played_at DESC
      `,
      [userId]
    ),
  ]);

  const historyByProfile = new Map();
  for (const row of historyResult.rows) {
    const entry = {
      id: row.id,
      jocId: row.joc_id,
      dificultate: row.dificultate,
      scor: row.scor,
      maxExercitii: row.max_exercitii,
      playedAt: row.played_at,
    };

    if (!historyByProfile.has(row.profile_id)) {
      historyByProfile.set(row.profile_id, []);
    }
    historyByProfile.get(row.profile_id).push(entry);
  }

  return profilesResult.rows.map((row) => normalizeProfile(row, historyByProfile.get(row.id) || []));
}

router.get("/account/:playerId", authRequired, async (req, res) => {
  try {
    const profiles = await loadProfiles(req.user.id);
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut incarca profilurile." });
  }
});

router.post("/account/:playerId/profiles", authRequired, async (req, res) => {
  const id = String(req.body?.id || "").trim();
  const name = String(req.body?.name || "").trim();
  const personaj = req.body?.personaj ?? null;
  const steleGlobale = Number.isInteger(req.body?.steleGlobale) ? req.body.steleGlobale : 0;
  const sunetActivat = req.body?.sunetActivat !== false;
  const gamePreferences = normalizeGamePreferences(req.body?.gamePreferences);
  const lastSessionAt = req.body?.lastSessionAt ? new Date(req.body.lastSessionAt) : null;

  if (!id) {
    return res.status(400).json({ error: "Profilul are nevoie de id." });
  }
  if (name.length < 2) {
    return res.status(400).json({ error: "Numele profilului trebuie sa aiba cel putin 2 caractere." });
  }
  if (!Number.isInteger(steleGlobale) || steleGlobale < 0) {
    return res.status(400).json({ error: "Numar invalid de stele." });
  }
  if (lastSessionAt && Number.isNaN(lastSessionAt.getTime())) {
    return res.status(400).json({ error: "Data sesiunii este invalida." });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO profiluri_copii (id, user_id, name, personaj, stele_globale, sunet_activat, game_preferences, last_session_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, personaj, stele_globale, sunet_activat, game_preferences, last_session_at
      `,
      [
        id,
        req.user.id,
        name,
        personaj,
        steleGlobale,
        sunetActivat,
        JSON.stringify(gamePreferences),
        lastSessionAt ? lastSessionAt.toISOString() : null,
      ]
    );

    return res.status(201).json(normalizeProfile(result.rows[0], []));
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Profilul exista deja." });
    }
    return res.status(500).json({ error: "Nu am putut crea profilul." });
  }
});

router.put("/account/:playerId/profiles/:profileId/state", authRequired, async (req, res) => {
  const profileId = String(req.params.profileId || "").trim();
  const name = String(req.body?.name || "").trim();
  const personaj = req.body?.personaj ?? null;
  const steleGlobale = Number(req.body?.steleGlobale);
  const sunetActivat = req.body?.sunetActivat !== false;
  const gamePreferences = normalizeGamePreferences(req.body?.gamePreferences);
  const lastSessionAt = req.body?.lastSessionAt ? new Date(req.body.lastSessionAt) : null;

  if (!profileId) {
    return res.status(400).json({ error: "Lipseste profilul." });
  }
  if (name.length < 2) {
    return res.status(400).json({ error: "Numele profilului trebuie sa aiba cel putin 2 caractere." });
  }
  if (!Number.isInteger(steleGlobale) || steleGlobale < 0) {
    return res.status(400).json({ error: "Numar invalid de stele." });
  }
  if (lastSessionAt && Number.isNaN(lastSessionAt.getTime())) {
    return res.status(400).json({ error: "Data sesiunii este invalida." });
  }

  try {
    const result = await pool.query(
      `
        UPDATE profiluri_copii
        SET name = $3,
            personaj = $4,
            stele_globale = $5,
            sunet_activat = $6,
            game_preferences = $7,
            last_session_at = $8
        WHERE id = $1 AND user_id = $2
        RETURNING id, name, personaj, stele_globale, sunet_activat, game_preferences, last_session_at
      `,
      [
        profileId,
        req.user.id,
        name,
        personaj,
        steleGlobale,
        sunetActivat,
        JSON.stringify(gamePreferences),
        lastSessionAt ? lastSessionAt.toISOString() : null,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Profilul nu a fost gasit." });
    }

    return res.json(normalizeProfile(result.rows[0], []));
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut salva profilul." });
  }
});

router.post("/account/:playerId/profiles/:profileId/results", authRequired, async (req, res) => {
  const resultId = String(req.body?.id || "").trim();
  const profileId = String(req.params.profileId || "").trim();
  const jocId = String(req.body?.jocId || "").trim();
  const dificultate = String(req.body?.dificultate || "").trim();
  const scor = Number(req.body?.scor);
  const maxExercitii = Number(req.body?.maxExercitii);
  const playedAt = req.body?.playedAt ? new Date(req.body.playedAt) : new Date();

  if (!resultId) {
    return res.status(400).json({ error: "Rezultatul are nevoie de id." });
  }
  if (!profileId) {
    return res.status(400).json({ error: "Lipseste profilul." });
  }
  if (!ALLOWED_GAMES.has(jocId)) {
    return res.status(400).json({ error: "Joc invalid." });
  }
  if (!ALLOWED_DIFFICULTIES.has(dificultate)) {
    return res.status(400).json({ error: "Dificultate invalida." });
  }
  if (!Number.isInteger(scor) || scor < 0) {
    return res.status(400).json({ error: "Scor invalid." });
  }
  if (!Number.isInteger(maxExercitii) || maxExercitii < 0 || scor > maxExercitii) {
    return res.status(400).json({ error: "Scor maxim invalid." });
  }
  if (Number.isNaN(playedAt.getTime())) {
    return res.status(400).json({ error: "Data jocului este invalida." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const profileResult = await client.query(
      `SELECT id FROM profiluri_copii WHERE id = $1 AND user_id = $2`,
      [profileId, req.user.id]
    );

    if (profileResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Profilul nu a fost gasit." });
    }

    await client.query(
      `
        INSERT INTO rezultate_copii (id, user_id, profile_id, joc_id, dificultate, scor, max_exercitii, played_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [resultId, req.user.id, profileId, jocId, dificultate, scor, maxExercitii, playedAt.toISOString()]
    );

    await client.query(
      `
        INSERT INTO scoruri (user_id, joc, scor, scor_maxim, dificultate, data_joc)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [req.user.id, jocId, scor, maxExercitii, dificultate, playedAt.toISOString()]
    );

    await client.query(
      `
        UPDATE profiluri_copii
        SET last_session_at = $3
        WHERE id = $1 AND user_id = $2
      `,
      [profileId, req.user.id, playedAt.toISOString()]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      id: resultId,
      jocId,
      dificultate,
      scor,
      maxExercitii,
      playedAt: playedAt.toISOString(),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === "23505") {
      return res.status(409).json({ error: "Rezultatul exista deja." });
    }
    return res.status(500).json({ error: "Nu am putut salva rezultatul." });
  } finally {
    client.release();
  }
});

module.exports = router;