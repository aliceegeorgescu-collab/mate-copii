# Mate Copii Web

Aplicatie web completa pentru copii, cu autentificare, profil, jocuri de matematica, scoruri, clasament si salvare in PostgreSQL.

## Structura proiectului

```text
/backend
  server.js
  db.js
  routes/auth.js
  routes/scoruri.js
  middleware/auth.js
/frontend
  public/
  src/
    App.js
    api.js
    App.css
    index.css
```

## Tehnologii folosite

- Frontend: React
- Backend: Node.js + Express
- Baza de date: PostgreSQL
- Autentificare: JWT (cookie + token JSON)
- Criptare parole: bcrypt
- Hosting recomandat: Render.com

## Functionalitati incluse

- Login si register
- Parole criptate cu bcrypt
- JWT cu expirare la 7 zile
- Logout
- Rute protejate pentru utilizatori logati
- Salvare scoruri in PostgreSQL
- Profil cu:
  - avatar derivat din initiale
  - total stele
  - cel mai bun scor pe joc
  - progres pe ultimele 7 zile
  - medalii
- Clasament global Top 10
- Evidentierea utilizatorului curent in clasament

## Tabele PostgreSQL

### useri
- id
- username (unic)
- nume_complet
- parola_criptata
- data_inregistrare

### scoruri
- id
- user_id
- joc
- scor
- scor_maxim
- dificultate
- data_joc

## Rulare locala

### 1. Instaleaza dependentele

Din radacina proiectului:

```bash
npm install
```

### 2. Configureaza mediul

Copiaza `.env.example` in `.env` si completeaza valorile reale:

```env
DATABASE_URL=postgresql://postgres:parola@localhost:5432/mate_copii
JWT_SECRET=o_cheie_lunga_si_sigura
PORT=4000
PGSSL=false
REACT_APP_API_BASE_URL=
```

### 3. Porneste backend-ul

```bash
npm run dev:backend
```

Backend-ul ruleaza pe `http://localhost:4000`.

### 4. Porneste frontend-ul

Intr-un terminal separat:

```bash
npm run dev:frontend
```

Frontend-ul ruleaza pe `http://localhost:3000`.

## Endpoint-uri API

### Auth
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/profil`

### Scoruri
- `POST /api/scor`
- `GET /api/scoruri`
- `GET /api/top`

### Health
- `GET /api/health`

## Deploy gratuit pe Render.com

Proiectul include deja [`render.yaml`](./render.yaml) pentru un deploy simplu.

### Ce creeaza Render
- un `Web Service` Node.js
- o baza `PostgreSQL`

### Pasi exacti

1. Pune proiectul pe GitHub.
2. Intra pe https://render.com si creeaza un cont.
3. Apasa `New +` -> `Blueprint`.
4. Conecteaza repository-ul GitHub.
5. Render va detecta automat fisierul [`render.yaml`](./render.yaml).
6. Confirma resursele propuse:
   - `mate-copii-web`
   - `mate-copii-db`
7. Apasa `Apply` sau `Create`.
8. Asteapta finalizarea build-ului.
9. Deschide URL-ul public generat de Render.

### Variabile de mediu folosite in Render

Sunt configurate in [`render.yaml`](./render.yaml):
- `NODE_ENV=production`
- `DATABASE_URL` din baza Render
- `JWT_SECRET` generat automat
- `PGSSL=false`

### Comenzi Render
- Build: `npm install && npm run build`
- Start: `npm start`
- Health check: `/api/health`

## Cum functioneaza in productie

- Render ruleaza backend-ul Express din `/backend`
- backend-ul serveste automat build-ul React din `/frontend/build`
- frontend-ul si API-ul sunt pe acelasi domeniu public
- autentificarea functioneaza cu cookie de sesiune + JWT cu expirare 7 zile

## Verificare dupa deploy

1. Deschide URL-ul aplicatiei.
2. Creeaza un cont nou.
3. Fa login.
4. Joaca un joc si finalizeaza-l.
5. Verifica profilul, scorurile si clasamentul.
6. Da refresh si confirma ca sesiunea este pastrata.

## Note despre planul gratuit Render

Conform documentatiei oficiale Render, baza PostgreSQL gratuita exista, dar are limite si poate expira dupa o perioada de inactivitate/termenul planului gratuit. Verifica mereu pagina actuala de docs si pricing inainte de deploy:
- https://render.com/docs/infrastructure-as-code
- https://render.com/docs/databases
- https://render.com/docs/postgresql-credentials
