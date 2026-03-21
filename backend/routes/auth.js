const express = require("express");
const bcrypt = require("bcrypt");

const { pool } = require("../db");
const { authRequired, clearAuthCookie, setAuthCookie, signToken } = require("../middleware/auth");

const router = express.Router();

const GAMES = ["adunare", "scadere", "contra_timp"];

function sanitizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function buildBestScores(rows) {
  const initial = {
    adunare: { scor: 0, scorMaxim: 0 },
    scadere: { scor: 0, scorMaxim: 0 },
    contra_timp: { scor: 0, scorMaxim: 0 },
  };

  for (const row of rows) {
    initial[row.joc] = {
      scor: row.scor,
      scorMaxim: row.scor_maxim,
    };
  }

  return initial;
}

function buildMedals(totalStele, jocuriPerfecte, totalJocuri) {
  const medals = [];

  if (totalStele >= 25) {
    medals.push({ id: "bronz", label: "Stea de Bronz", icon: "BR", color: "#cd7f32" });
  }
  if (totalStele >= 60) {
    medals.push({ id: "argint", label: "Stea de Argint", icon: "AG", color: "#9ea7b8" });
  }
  if (totalStele >= 120) {
    medals.push({ id: "aur", label: "Stea de Aur", icon: "AU", color: "#f4b400" });
  }
  if (jocuriPerfecte >= 3) {
    medals.push({ id: "perfect", label: "Campion Perfect", icon: "PF", color: "#ff7a59" });
  }
  if (totalJocuri >= 15) {
    medals.push({ id: "perseverenta", label: "Perseverenta", icon: "PV", color: "#5c6ac4" });
  }

  if (medals.length === 0) {
    medals.push({ id: "inceput", label: "Primii pasi", icon: "ST", color: "#4d96ff" });
  }

  return medals;
}

async function loadProfile(userId) {
  const [userResult, totalsResult, bestScoresResult, progressResult] = await Promise.all([
    pool.query(
      `
        SELECT id, username, nume_complet, data_inregistrare
        FROM useri
        WHERE id = $1
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT
          COALESCE(SUM(scor), 0)::int AS total_stele,
          COUNT(*)::int AS total_jocuri,
          COALESCE(SUM(CASE WHEN scor = scor_maxim THEN 1 ELSE 0 END), 0)::int AS jocuri_perfecte
        FROM scoruri
        WHERE user_id = $1
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT joc, MAX(scor)::int AS scor, MAX(scor_maxim)::int AS scor_maxim
        FROM scoruri
        WHERE user_id = $1
        GROUP BY joc
      `,
      [userId]
    ),
    pool.query(
      `
        SELECT
          DATE(day_bucket) AS zi,
          COALESCE(SUM(s.scor), 0)::int AS total
        FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, INTERVAL '1 day') AS day_bucket
        LEFT JOIN scoruri s
          ON s.user_id = $1
         AND DATE(s.data_joc) = DATE(day_bucket)
        GROUP BY DATE(day_bucket)
        ORDER BY DATE(day_bucket)
      `,
      [userId]
    ),
  ]);

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const totals = totalsResult.rows[0] || {
    total_stele: 0,
    total_jocuri: 0,
    jocuri_perfecte: 0,
  };

  return {
    user: {
      id: user.id,
      username: user.username,
      numeComplet: user.nume_complet,
      dataInregistrare: user.data_inregistrare,
    },
    totalStele: totals.total_stele,
    totalJocuri: totals.total_jocuri,
    bestScores: buildBestScores(bestScoresResult.rows),
    progress: progressResult.rows.map((row) => ({
      zi: row.zi,
      total: row.total,
    })),
    medals: buildMedals(totals.total_stele, totals.jocuri_perfecte, totals.total_jocuri),
  };
}

router.post("/register", async (req, res) => {
  const numeComplet = String(req.body?.numeComplet || "").trim();
  const username = sanitizeUsername(req.body?.username);
  const parola = String(req.body?.parola || "");
  const confirmaParola = String(req.body?.confirmaParola || "");

  if (numeComplet.length < 2) {
    return res.status(400).json({ error: "Numele complet trebuie sa aiba cel putin 2 caractere." });
  }
  if (!/^[a-z0-9_]{3,20}$/i.test(username)) {
    return res.status(400).json({ error: "Username-ul trebuie sa aiba 3-20 de caractere si poate contine doar litere, cifre si underscore." });
  }
  if (parola.length < 6) {
    return res.status(400).json({ error: "Parola trebuie sa aiba cel putin 6 caractere." });
  }
  if (parola !== confirmaParola) {
    return res.status(400).json({ error: "Parolele nu coincid." });
  }

  try {
    const parolaCriptata = await bcrypt.hash(parola, 10);
    const result = await pool.query(
      `
        INSERT INTO useri (username, nume_complet, parola_criptata)
        VALUES ($1, $2, $3)
        RETURNING id, username, nume_complet, data_inregistrare
      `,
      [username, numeComplet, parolaCriptata]
    );

    const user = result.rows[0];
    const token = signToken({ id: user.id, username: user.username });
    setAuthCookie(res, token);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        numeComplet: user.nume_complet,
        dataInregistrare: user.data_inregistrare,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Username-ul este deja folosit." });
    }

    return res.status(500).json({ error: "Nu am putut crea contul." });
  }
});

router.post("/login", async (req, res) => {
  const username = sanitizeUsername(req.body?.username);
  const parola = String(req.body?.parola || "");

  if (!username || !parola) {
    return res.status(400).json({ error: "Completeaza username-ul si parola." });
  }

  try {
    const result = await pool.query(
      `
        SELECT id, username, nume_complet, parola_criptata, data_inregistrare
        FROM useri
        WHERE username = $1
      `,
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Date de autentificare invalide." });
    }

    const parolaCorecta = await bcrypt.compare(parola, user.parola_criptata);
    if (!parolaCorecta) {
      return res.status(401).json({ error: "Date de autentificare invalide." });
    }

    const token = signToken({ id: user.id, username: user.username });
    setAuthCookie(res, token);

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        numeComplet: user.nume_complet,
        dataInregistrare: user.data_inregistrare,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Login-ul a esuat." });
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get("/profil", authRequired, async (req, res) => {
  try {
    const profile = await loadProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: "Profilul nu a fost gasit." });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: "Nu am putut incarca profilul." });
  }
});

module.exports = router;



