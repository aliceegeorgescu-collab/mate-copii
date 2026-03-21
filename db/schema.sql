CREATE TABLE IF NOT EXISTS useri (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  nume_complet TEXT NOT NULL,
  parola_criptata TEXT NOT NULL,
  data_inregistrare TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scoruri (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES useri(id) ON DELETE CASCADE,
  joc TEXT NOT NULL CHECK (joc IN ('adunare', 'scadere', 'contra_timp')),
  scor INTEGER NOT NULL CHECK (scor >= 0),
  scor_maxim INTEGER NOT NULL CHECK (scor_maxim >= 0),
  dificultate TEXT NOT NULL CHECK (dificultate IN ('usor', 'mediu', 'greu')),
  data_joc TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_useri_username ON useri(username);
CREATE INDEX IF NOT EXISTS idx_scoruri_user_data ON scoruri(user_id, data_joc DESC);
