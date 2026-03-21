const { Pool } = require("pg");

function buildSslConfig() {
  if (process.env.PGSSL === "false") return false;
  if (process.env.PGSSL === "true") {
    return { rejectUnauthorized: false };
  }
  return process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL. Add it to your environment before starting the API server.");
}

const pool = new Pool({
  connectionString,
  ssl: buildSslConfig(),
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS child_profiles (
      id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      name TEXT NOT NULL,
      personaj JSONB,
      stele_globale INTEGER NOT NULL DEFAULT 0,
      sunet_activat BOOLEAN NOT NULL DEFAULT TRUE,
      last_session_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_child_profiles_player_id
    ON child_profiles (player_id);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_results (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
      joc_id TEXT NOT NULL,
      dificultate TEXT NOT NULL,
      scor INTEGER NOT NULL,
      max_exercitii INTEGER NOT NULL,
      played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_game_results_profile_id_played_at
    ON game_results (profile_id, played_at DESC);
  `);
}

module.exports = {
  pool,
  initDb,
};
