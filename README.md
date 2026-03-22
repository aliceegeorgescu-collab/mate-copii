# Mate Copii Web

Aplicatie web de matematica pentru copii, cu autentificare, profiluri de copii, jocuri interactive si salvare in PostgreSQL.

## Structura proiectului

```text
mate-copii/
  backend/      # API Express + PostgreSQL
  frontend/     # aplicatia React
  api/          # Vercel Functions pentru /api/*
  db/           # fisiere SQL ajutatoare
  render.yaml   # configuratie Render
  vercel.json   # configuratie Vercel
```

## Tehnologii

- React
- Node.js + Express
- PostgreSQL
- JWT in cookie HTTP-only
- bcrypt
- Vercel sau Render pentru deploy

## Rulare locala

1. Instaleaza dependentele din radacina:

```bash
npm install
```

2. Copiaza `.env.example` in `.env` si completeaza valorile reale:

```env
DATABASE_URL=postgresql://postgres:parola@localhost:5432/mate_copii
JWT_SECRET=o_cheie_lunga_si_sigura
PORT=4000
PGSSL=false
REACT_APP_API_BASE_URL=
REACT_APP_PLAYER_ID=default-player
```

3. Porneste backend-ul:

```bash
npm run dev:backend
```

4. Intr-un al doilea terminal, porneste frontend-ul:

```bash
npm run dev:frontend
```

Frontend-ul ruleaza pe `http://localhost:3000`, iar backend-ul pe `http://localhost:4000`.

## Endpoint-uri API

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/profil`
- `POST /api/scor`
- `GET /api/scoruri`
- `GET /api/top`
- `GET /api/account/:playerId`
- `POST /api/account/:playerId/profiles`
- `PUT /api/account/:playerId/profiles/:profileId/state`
- `POST /api/account/:playerId/profiles/:profileId/results`
- `GET /api/health`

## Deploy pe Vercel

### Ce trebuie sa stii inainte

- Vercel va servi frontend-ul React din `frontend/build`.
- Vercel va rula backend-ul Express prin Vercel Functions din folderul `api/`.
- Fisierul `render.yaml` este doar pentru Render. Vercel il ignora.
- Pentru productie, `DATABASE_URL` nu poate fi `localhost`. Ai nevoie de un PostgreSQL online, de exemplu Neon, Supabase sau Render PostgreSQL.

### Variabile de mediu necesare in Vercel

Adauga aceste variabile in Vercel Dashboard, la `Project -> Settings -> Environment Variables`:

1. `DATABASE_URL`
   - Valoare: conexiunea completa catre baza PostgreSQL online.
   - Exemplu:

   ```env
   postgresql://USER:PAROLA@HOST:5432/mate_copii
   ```

2. `JWT_SECRET`
   - Valoare: un sir lung si greu de ghicit, folosit pentru autentificare.
   - Exemplu:

   ```env
   BiancaMateSecret-2026-foarte-lung-si-sigur
   ```

3. `PGSSL`
   - Valoare: de obicei `true` pe Vercel daca baza este in cloud.
   - Pune `false` doar daca furnizorul bazei de date iti spune explicit ca SSL nu trebuie activat.

4. `REACT_APP_API_BASE_URL`
   - Valoare: lasa gol.
   - Motiv: frontend-ul si API-ul vor fi pe acelasi domeniu Vercel, deci aplicatia va folosi direct `/api/...`.

5. `REACT_APP_PLAYER_ID`
   - Valoare recomandata: `default-player`
   - Folosit pentru profilul implicit de copil.

6. `PORT`
   - Nu este necesar pe Vercel.
   - Il folosesti doar local. Poti sa nu-l adaugi in Vercel.

### Setari recomandate in Vercel Dashboard

La importul proiectului din GitHub:

- `Framework Preset`: `Other`
- `Root Directory`: lasa gol, adica radacina repo-ului
- `Build Command`: `npm run build`
- `Output Directory`: `frontend/build`
- `Install Command`: lasa implicit sau `npm install`

### De ce Root Directory trebuie lasat in radacina

Pentru ca proiectul tau are:
- frontend-ul in `frontend/`
- backend-ul in `backend/`
- functiile Vercel in `api/`

Daca ai pune `Root Directory=frontend`, Vercel nu ar mai vedea folderul `api/` si backend-ul nu ar mai functiona.

### Pas cu pas in Vercel

1. Intra pe `https://vercel.com`.
2. Apasa `Log In` si alege `Continue with GitHub`.
3. Dupa login, apasa `Add New...` si apoi `Project`.
4. La lista de repository-uri, alege `aliceegeorgescu-collab/mate-copii`.
5. Apasa `Import`.
6. La ecranul de configurare:
   - la `Framework Preset` alege `Other`
   - la `Root Directory` lasa proiectul in radacina repo-ului
   - la `Build Command` scrie `npm run build`
   - la `Output Directory` scrie `frontend/build`
7. Deschide sectiunea `Environment Variables`.
8. Adauga pe rand valorile pentru:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PGSSL`
   - `REACT_APP_API_BASE_URL`
   - `REACT_APP_PLAYER_ID`
9. Apasa `Deploy`.
10. Asteapta finalizarea build-ului.
11. Dupa succes, Vercel iti va da un link de forma:

```text
https://numele-proiectului.vercel.app
```

Acesta este linkul pe care il poti trimite Biancai.

### Cum obtii un link frumos, de exemplu `bianca-mate.vercel.app`

Cel mai simplu este sa creezi proiectul Vercel cu numele `bianca-mate` sau sa redenumesti proiectul ulterior in Vercel Dashboard.
De regula, subdomeniul default `.vercel.app` foloseste numele proiectului.

### Cum verifici dupa deploy

Dupa ce Vercel termina deploy-ul:

1. Deschide linkul public.
2. Verifica daca pagina principala se incarca.
3. Creeaza un cont nou.
4. Fa login.
5. Incepe un joc si termina o runda.
6. Verifica daca profilul, scorurile si clasamentul se actualizeaza.
7. Deschide direct `https://numele-proiectului.vercel.app/api/health`.
   - Daca totul este bine, ar trebui sa vezi `{"ok":true}`.

### Daca apare eroare la build

1. Intra in proiectul tau din Vercel.
2. Deschide tab-ul `Deployments`.
3. Apasa pe deploy-ul care a esuat.
4. Citeste sectiunea `Build Logs`.
5. Verifica in special:
   - daca `Build Command` este `npm run build`
   - daca `Output Directory` este `frontend/build`
   - daca toate variabilele de mediu sunt completate
   - daca `DATABASE_URL` este un PostgreSQL online, nu `localhost`
   - daca `JWT_SECRET` este setat
6. Dupa ce corectezi problema, apasa `Redeploy`.

## Deploy pe Render

`render.yaml` ramane util doar daca vrei sa publici proiectul pe Render. Pentru Vercel nu este folosit.

## Verificare rapida dupa orice deploy

- `GET /api/health` trebuie sa raspunda cu `{"ok":true}`
- aplicatia trebuie sa permita register si login
- scorurile trebuie sa se salveze in PostgreSQL
- refresh-ul paginii nu trebuie sa scoata utilizatorul din sesiune
