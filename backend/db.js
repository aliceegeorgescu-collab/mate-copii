const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { Pool } = require("pg");

function buildSslConfig() {
  if (process.env.PGSSL === "false") return false;
  if (process.env.PGSSL === "true") return { rejectUnauthorized: false };
  return process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;
}

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL. Add it to your environment before starting the backend.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: buildSslConfig(),
});

async function ensureScoruriSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scoruri (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES useri(id) ON DELETE CASCADE,
      joc TEXT NOT NULL,
      scor INTEGER NOT NULL CHECK (scor >= 0),
      scor_maxim INTEGER NOT NULL CHECK (scor_maxim >= 0),
      dificultate TEXT NOT NULL,
      data_joc TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE scoruri DROP CONSTRAINT IF EXISTS scoruri_joc_check;`);
  await pool.query(`ALTER TABLE scoruri DROP CONSTRAINT IF EXISTS scoruri_dificultate_check;`);

  await pool.query(`
    ALTER TABLE scoruri
    ADD CONSTRAINT scoruri_joc_check
    CHECK (joc IN ('adunare', 'scadere', 'contra_timp', 'baloane', 'trenulet', 'pescuit', 'racheta', 'cursa', 'labirint_batman', 'gradinita_vesela'));
  `);

  await pool.query(`
    ALTER TABLE scoruri
    ADD CONSTRAINT scoruri_dificultate_check
    CHECK (dificultate IN ('usor', 'mediu', 'greu'));
  `);
}

async function ensureProfileSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiluri_copii (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES useri(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      personaj JSONB,
      stele_globale INTEGER NOT NULL DEFAULT 0 CHECK (stele_globale >= 0),
      sunet_activat BOOLEAN NOT NULL DEFAULT TRUE,
      game_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
      last_session_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE profiluri_copii ADD COLUMN IF NOT EXISTS game_preferences JSONB;`);
  await pool.query(`UPDATE profiluri_copii SET game_preferences = '{}'::jsonb WHERE game_preferences IS NULL;`);
  await pool.query(`ALTER TABLE profiluri_copii ALTER COLUMN game_preferences SET DEFAULT '{}'::jsonb;`);
  await pool.query(`ALTER TABLE profiluri_copii ALTER COLUMN game_preferences SET NOT NULL;`);
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS useri (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      nume_complet TEXT NOT NULL,
      parola_criptata TEXT NOT NULL,
      data_inregistrare TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await ensureScoruriSchema();
  await ensureProfileSchema();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rezultate_copii (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES useri(id) ON DELETE CASCADE,
      profile_id TEXT NOT NULL REFERENCES profiluri_copii(id) ON DELETE CASCADE,
      joc_id TEXT NOT NULL,
      dificultate TEXT NOT NULL,
      scor INTEGER NOT NULL CHECK (scor >= 0),
      max_exercitii INTEGER NOT NULL CHECK (max_exercitii >= 0),
      played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE rezultate_copii DROP CONSTRAINT IF EXISTS rezultate_copii_joc_id_check;`);
  await pool.query(`ALTER TABLE rezultate_copii DROP CONSTRAINT IF EXISTS rezultate_copii_dificultate_check;`);

  await pool.query(`
    ALTER TABLE rezultate_copii
    ADD CONSTRAINT rezultate_copii_joc_id_check
    CHECK (joc_id IN ('baloane', 'trenulet', 'pescuit', 'racheta', 'cursa', 'labirint_batman', 'gradinita_vesela'));
  `);

  await pool.query(`
    ALTER TABLE rezultate_copii
    ADD CONSTRAINT rezultate_copii_dificultate_check
    CHECK (dificultate IN ('usor', 'mediu', 'greu'));
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_scoruri_user_data
    ON scoruri (user_id, data_joc DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_useri_username
    ON useri (username);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_profiluri_copii_user
    ON profiluri_copii (user_id, created_at DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_rezultate_copii_profile_data
    ON rezultate_copii (profile_id, played_at DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_rezultate_copii_user_data
    ON rezultate_copii (user_id, played_at DESC);
  `);
}

module.exports = {
  pool,
  initDb,
};