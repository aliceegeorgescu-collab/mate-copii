const express = require("express");

const { pool } = require("../db");
const { authRequired } = require("../middleware/auth");

const router = express.Router();

const ALLOWED_GAMES = new Set(["adunare", "scadere", "contra_timp", "baloane", "trenulet", "pescuit", "racheta", "cursa", "labirint_batman", "gradinita_vesela"]);
const ALLOWED_DIFFICULTIES = new Set(["usor", "mediu", "greu"]);

router.post("/scor", authRequired, async (req, res) => {
  const joc = String(req.body?.joc || "").trim();
  const dificultate = String(req.body?.dificultate || "").trim();
  const scor = Number(req.body?.scor);
  const scorMaxim = Number(req.body?.scorMaxim);

  if (!ALLOWED_GAMES.has(joc)) {
    return res.status(400).json({ error: "Joc invalid." });
  }
  if (!ALLOWED_DIFFICULTIES.has(dificultate)) {
    return res.status(400).json({ error: "Dificultate invalida." });
  }
  if (!Number.isInteger(scor) || scor < 0) {
    return res.status(400).json({ error: "Scor invalid." });
  }
  if (!Number.isInteger(scorMaxim) || scorMaxim < 0) {
    return res.status(400).json({ error: "Scor maxim invalid." });
  }
  if (scor > scorMaxim) {
    return res.status(400).json({ error: "Scorul nu poate depasi scorul maxim." });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO scoruri (user_id, joc, scor, scor_maxim, dificultate)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, joc, scor, scor_maxim, dificultate, data_joc
      `,
      [req.user.id, joc, scor, scorMaxim, dificultate]
    );

    const row = result.rows[0];
    return res.status(201).json({
      id: row.id,
      joc: row.joc,
      scor: row.scor,
      scorMaxim: row.scor_maxim,
      dificultate: row.dificultate,
      dataJoc: row.data_joc,
    });
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut salva scorul." });
  }
});

router.get("/scoruri", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT id, joc, scor, scor_maxim, dificultate, data_joc
        FROM scoruri
        WHERE user_id = $1
        ORDER BY data_joc DESC
      `,
      [req.user.id]
    );

    return res.json({
      scoruri: result.rows.map((row) => ({
        id: row.id,
        joc: row.joc,
        scor: row.scor,
        scorMaxim: row.scor_maxim,
        dificultate: row.dificultate,
        dataJoc: row.data_joc,
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut incarca scorurile." });
  }
});

router.get("/top", authRequired, async (req, res) => {
  try {
    const result = await pool.query(
      `
        WITH totaluri AS (
          SELECT
            u.id,
            u.username,
            u.nume_complet,
            COALESCE(SUM(s.scor), 0)::int AS scor_total
          FROM useri u
          LEFT JOIN scoruri s ON s.user_id = u.id
          GROUP BY u.id
        ),
        clasament AS (
          SELECT
            *,
            RANK() OVER (ORDER BY scor_total DESC, username ASC) AS pozitie
          FROM totaluri
        )
        SELECT id, username, nume_complet, scor_total, pozitie
        FROM clasament
        ORDER BY pozitie ASC, username ASC
      `
    );

    const rows = result.rows;
    const top = rows.slice(0, 10).map((row) => ({
      id: row.id,
      username: row.username,
      numeComplet: row.nume_complet,
      scorTotal: row.scor_total,
      pozitie: row.pozitie,
    }));

    const currentUserRank = rows.find((row) => row.id === req.user.id) || null;

    return res.json({
      top,
      currentUserRank: currentUserRank
        ? {
            id: currentUserRank.id,
            username: currentUserRank.username,
            numeComplet: currentUserRank.nume_complet,
            scorTotal: currentUserRank.scor_total,
            pozitie: currentUserRank.pozitie,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut incarca clasamentul." });
  }
});

module.exports = router;



