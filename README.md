# Divy Makwana — Portfolio (P-v2)

Recruiter-facing personal portfolio: warm creative studio look, scroll-first content, light/dark themes, and a CMS-backed API.

**P-v1 is unchanged.** Develop and run this folder on its own.

---

## Features

- Single-page scroll: Hero → About → Experience → Skills → Projects → Contact
- Selected work includes **TravelMind** (React, TypeScript, Vite, Hono, Neon Postgres, Tailwind)
- Theme-split hero atmosphere (CSS, no 3D hero)
  - **Light:** Soft ivory gold — ivory base, peach linen mist, gold glow, light grain
  - **Dark:** dusk base, colored diagonal light beams, film grain
- Button hover: light = soft gold sweep (`#D4A35A`); dark = blue/yellow neon sweep
- Default theme: **light** on every new visit / shared link (toggle kept for the tab session only)
- Split name style: **Divy** upright ink/cream + **Makwana** italic coral/gold
- Project gallery with case-study pages (`/projects/:id`) and GitHub README rendering
- Admin panel (`/admin`) for profile/projects (JWT)
- Contact form, page analytics, optional GitHub / LeetCode integrations
- Fallback content when the API is offline

---

## Visual direction

| Token | Choice |
|-------|--------|
| **Mood** | Warm studio / atmospheric (not night glass, not game world) |
| **Palette** | Linen paper, ink charcoal, sage `#5A6B4E`, coral/gold accents |
| **Type** | Fraunces (display) + DM Sans (body) |
| **Layout** | Scroll sections, editorial project rows |
| **Hero FX** | CSS washes, soft directional light, grain — `prefers-reduced-motion` safe |
| **Button hover** | Light: soft gold `#D4A35A` sweep; dark: blue/yellow neon |

Avoided: purple gradients, heavy glow spam, click-to-travel spatial UX.

---

## Stack

| Layer | Tech |
|--------|------|
| **Frontend** | React 18, Vite (**port 5174**), TypeScript, Tailwind, Framer Motion, React Router |
| **Backend** | FastAPI, Motor (MongoDB), JWT (python-jose), optional Redis |
| **Fonts** | `@fontsource-variable/fraunces`, `@fontsource-variable/dm-sans` |

Three.js / R3F may still be in dependencies from earlier experiments; the live hero uses **CSS atmosphere** (`HeroAtmosphere`), not a Canvas sculpture.

---

## Project structure

```
P-v2/
├── frontend/          # Vite + React app
│   ├── src/
│   │   ├── components/   # HeroAtmosphere, Navbar, UI…
│   │   ├── sections/     # Hero, About, Experience, Skills, Projects, Contact
│   │   ├── pages/        # ProjectDetail, Admin
│   │   ├── api/          # Axios clients
│   │   ├── hooks/
│   │   └── lib/          # fallbacks, project config
│   ├── .env.example
│   └── vercel.json       # SPA rewrites
├── backend/           # FastAPI API
│   ├── app/
│   │   ├── routes/       # auth, profile, projects, contact, analytics…
│   │   └── main.py
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
└── README.md
```

---

## Selected projects

Gallery order on `/` (`VISIBLE_PROJECTS` in `frontend/src/lib/projectConfig.ts`):

| # | Project | Stack | Links |
|---|---------|--------|--------|
| 1 | **CrimePulse** (featured) | Python, Flask, LightGBM, Chart.js, Leaflet, SQLite | — |
| 2 | **CareerLens** (featured) | React, Vite, Tailwind, FastAPI, Gemini, Exa | [GitHub](https://github.com/divy1105/CareerLens) · [Live](https://career-lens-alpha.vercel.app) |
| 3 | **TravelMind** (featured) | React, TypeScript, Vite, Hono, Neon Postgres, Tailwind | [GitHub](https://github.com/divy1105/TravelMind) |
| 4 | Manager_Task_Ai | FastAPI, React, Vite, Neon Postgres, Groq API | [GitHub](https://github.com/divy1105/Manager_Task_Ai) |
| 5 | Event-Management-System-MCA | C# / ASP.NET, React, TypeScript, Vite, Ant Design | [GitHub](https://github.com/divy1105/Event-Management-System-MCA) |
| 6 | Sporties | HTML, CSS, JavaScript, PHP, MySQL | — |

Skills on the site mirror these stacks. TravelMind added **Hono** under Backend / APIs; React, TypeScript, Vite, Tailwind, and Neon Postgres were already listed.

PDF download stays in the hero and navbar. There is no on-page Resume / Credentials preview section.

---

## Routes

### Frontend

| Path | Page |
|------|------|
| `/` | Home (scroll sections) |
| `/projects/:id` | Case study |
| `/admin` | Admin CMS |

### Backend (prefix `/api`)

| Area | Prefix |
|------|--------|
| Auth | `/api/auth` |
| Admin | `/api/admin` |
| Profile | `/api/profile` |
| Projects | `/api/projects` |
| Contact | `/api/contact` |
| Analytics | `/api/analytics` |
| Media | `/api/media` |
| GitHub | `/api/github` |
| LeetCode | `/api/leetcode` |
| Health | `/api/health` |

---

## Run locally

### 1. Backend

```bash
cd P-v2/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1      # Windows PowerShell (run from P-v2/backend)
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt
copy .env.example .env            # then edit secrets
python run.py
```

API: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend

```bash
cd P-v2/frontend
npm install
copy .env.example .env            # optional; leave empty to use Vite proxy
npm run dev
```

App: [http://127.0.0.1:5174](http://127.0.0.1:5174)

Vite proxies `/api` → `http://127.0.0.1:8000`, so with both running you usually do **not** need `VITE_API_BASE_URL`.

---

## Environment

### Frontend (`frontend/.env`)

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Absolute API origin if not using the Vite proxy (e.g. production API URL). Leave empty for local proxy. |

### Backend (`backend/.env`)

Copy from `backend/.env.example`. Important keys:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` / `DB_NAME` | MongoDB connection |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin login |
| `JWT_SECRET` | Auth signing secret |
| `CORS_ORIGINS` | Allowed frontends (include `http://127.0.0.1:5174`) |
| `GITHUB_USERNAME` / `GITHUB_TOKEN` | GitHub enrichment (token optional) |
| `RESUME_URI` | Resume / Drive link |
| `ADMIN_EMAIL` | Inbox for contact form (via FormSubmit) |
| `REDIS_URL` | Optional cache |

Never commit real `.env` files (listed in `.gitignore`).

---

## Scripts

| Where | Command | What |
|-------|---------|------|
| Frontend | `npm run dev` | Dev server (5174) |
| Frontend | `npm run build` | Typecheck + production build |
| Frontend | `npm run preview` | Preview `dist/` |
| Backend | `python run.py` | API with reload on 8000 |

---

## Deploy notes

- Frontend is a SPA; `frontend/vercel.json` rewrites all paths to `index.html`.
- Point production `VITE_API_BASE_URL` at your deployed API.
- Set backend `CORS_ORIGINS` to your live site origin(s).
- Keep `.netlify/` / build artifacts out of git (see `.gitignore`).

---

## Relationship to P-v1

| Folder | Role |
|--------|------|
| `P-v1/` | Original portfolio — leave as-is |
| `P-v2/` | Current studio redesign — iterate here |

---

## License / ownership

Personal portfolio for **Divy Makwana**.
