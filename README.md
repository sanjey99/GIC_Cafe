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

### Run with Docker Compose

```bash
docker compose up --build
```

Open **http://localhost:3000** in your browser.

### Run Locally (Development)

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