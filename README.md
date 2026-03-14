# ☕ GIC Full Stack Cafe App

![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

A full stack app made for the technical assessment process.

## Tech Stack

### Backend
- .NET 8 Web API
- Clean Architecture + CQRS
- MediatR (Mediator Pattern)
- Autofac (Dependency Injection)
- Entity Framework Core 8 + PostgreSQL
- FluentValidation
- Serilog structured logging
- Swagger/OpenAPI

### Frontend
- React 18 + Vite
- TypeScript
- Ant Design component library
- AG Grid for data tables
- TanStack Query (data fetching & caching)
- React Router v6
- DayJS
- Tailwind CSS (minimal usage)
- Axios HTTP client

---

## Database Seeding

On first startup, the database is auto-seeded with:
- **5 cafes** across different Singapore locations (Tanjong Pagar, Orchard, Bugis, Raffles Place, Marina Bay)
- **20 employees** — 16 assigned to cafes, 4 unassigned

---

## Installation

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- .NET 8 SDK (for non-Docker local backend run)
- Node.js 20+ (for non-Docker local frontend run)

### Option A — Run Everything with Docker (recommended)

```bash
docker compose up --build
```

Open **http://localhost:3000**.

This starts:
- Frontend (via Nginx): `http://localhost:3000`
- API (proxied by Nginx): `/cafes`, `/employees`
- PostgreSQL: `localhost:5432` (`postgres/postgres`, db `cafeemployee`)

### Option B — Run Locally (without Docker for app processes)

**Backend:**
```bash
cd backend/src
dotnet run --project CafeEmployee.Api
```
API available at `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
App available at `http://localhost:5173` (proxies API to :5000)

### Environment Configuration

Copy env templates and adjust values if needed:

**Bash / Git Bash:**

```bash
cp frontend/.env.example frontend/.env
cp backend/src/CafeEmployee.Api/.env.example backend/src/CafeEmployee.Api/.env
```

**PowerShell:**

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/src/CafeEmployee.Api/.env.example backend/src/CafeEmployee.Api/.env
```

**Frontend (optional for local, required for split online deploy):**
- `VITE_API_BASE_URL`
  - Local Docker/Nginx: not required (defaults to `/`)
  - Local Vite dev server: not required (proxy handles `/cafes` and `/employees`)
  - Online split deploy: set backend URL, e.g. `https://your-api.onrender.com`

**Backend:**
- `ConnectionStrings__DefaultConnection`
  - Local default: already set in appsettings to localhost postgres
  - Online: set to managed Postgres connection string
- `Cors__AllowedOrigins__0`, `Cors__AllowedOrigins__1`, ...
  - Local defaults already allow `http://localhost:3000` and `http://localhost:5173`
  - Online: add your frontend URL(s), e.g. `https://your-app.vercel.app`

---


**Steps:**
1. Deploy database and copy the Postgres connection string
2. Set backend env: `ConnectionStrings__DefaultConnection=<your postgres conn str>`
3. Set backend CORS env to include your frontend domain (for example `Cors__AllowedOrigins__0=https://your-app.vercel.app`)
4. Set frontend env: `VITE_API_BASE_URL=https://<your-backend-domain>`
5. Redeploy backend and frontend

This keeps one codebase working for both local Docker deployment and online split deployment.

---
## Validation Rules

### Cafe
- **Name**: 6–10 characters
- **Description**: Max 256 characters
- **Logo**: File upload — max 2MB, stored as base64 (PNG/JPG/GIF/WebP)
- **Location**: Required

### Employee
- **Name**: 6–10 characters
- **Email**: Valid email format
- **Phone**: Starts with 8 or 9, exactly 8 digits (Singapore format)
- **Gender**: Male or Female (radio buttons)
- **Employee ID**: Auto-generated `UIXXXXXXX` format

---

## License

MIT