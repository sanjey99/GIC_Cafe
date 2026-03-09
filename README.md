# ☕ Cafe Employee Manager

A production-ready full-stack application for managing cafes and their employees, built with Clean Architecture principles.

![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx (port 3000)                 │
│            Reverse Proxy / Load Balancer             │
├──────────────────────┬──────────────────────────────┤
│ /cafes,/cafe → API  │   /* → Frontend              │
│ /employees,/employee │                              │
├──────────────────────┴──────────────────────────────┤
│                                                      │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │  React SPA   │         │  .NET 8 Web API      │  │
│  │  Vite + TS   │  ←───→  │  Clean Architecture  │  │
│  │  Ant Design  │         │  CQRS + MediatR      │  │
│  │  AgGrid      │         │  Autofac DI          │  │
│  └──────────────┘         └──────────┬───────────┘  │
│                                      │               │
│                           ┌──────────▼───────────┐  │
│                           │    PostgreSQL 16      │  │
│                           │    EF Core 8          │  │
│                           └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Backend — Clean Architecture Layers

| Layer | Responsibility |
|---|---|
| **Domain** | Entities (`Cafe`, `Employee`), Enums, Value Objects |
| **Application** | CQRS Commands/Queries, DTOs, Interfaces, Validators |
| **Infrastructure** | EF Core DbContext, Repositories, Migrations, Seeding |
| **API** | Controllers, Exception Middleware, DI, Swagger |

### Frontend — Feature-Based Structure

```
frontend/src/
├── api/          # Axios services (cafeService, employeeService)
├── components/   # Reusable UI components
├── hooks/        # TanStack Query hooks (useCafes, useEmployees)
├── pages/        # Route-level pages (Cafes, Employees, Add/Edit)
└── utils/        # Shared utilities
```

---

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

### Infrastructure
- Docker multi-stage builds
- Docker Compose orchestration
- Nginx reverse proxy
- PostgreSQL 16

---

## Quick Start

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

## API Endpoints

### Cafes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cafes?location={loc}` | List cafes, optionally filter by location. Sorted by employee count DESC |
| `POST` | `/cafes` | Create a new cafe |
| `PUT` | `/cafes` | Update an existing cafe |
| `DELETE` | `/cafes?id={cafeId}` | Delete cafe and cascade-delete its employees |

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/employees?cafe={name}` | List employees, optionally filter by cafe name. Sorted by days worked DESC |
| `POST` | `/employees` | Create a new employee (auto-generates UIXXXXXXX ID) |
| `PUT` | `/employees` | Update an existing employee |
| `DELETE` | `/employees?id={id}` | Delete an employee |

### Request/Response Examples

**Create Cafe:**
```json
POST /cafes
{
  "name": "BeansBrew",
  "description": "Quality craft coffee",
  "logo": "data:image/png;base64,...",
  "location": "Tanjong Pagar"
}
```

**Create Employee:**
```json
POST /employees
{
  "name": "AliceTan",
  "emailAddress": "alice@mail.com",
  "phoneNumber": "91234567",
  "gender": "Female",
  "cafeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

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

## Database Seeding

On first startup, the database is auto-seeded with:
- **5 cafes** across different Singapore locations (Tanjong Pagar, Orchard, Bugis, Raffles Place, Marina Bay)
- **20 employees** — 16 assigned to cafes, 4 unassigned

---

## Key Design Decisions

1. **CQRS Pattern** — Separate command/query models for clarity and scalability
2. **MediatR Pipeline** — Validation behavior runs before every command handler
3. **Autofac DI** — Registration of repositories, services, and MediatR handlers
4. **Centralized Error Handling** — Exception middleware catches validation, not-found, and unhandled errors
5. **Cascade Delete** — Deleting a cafe automatically removes all its employees
6. **AgGrid** — Enterprise-grade grid with sorting, filtering, and pagination
7. **TanStack Query** — Automatic cache invalidation on mutations
8. **Logo as Base64** — File upload stored as base64 data URL in the database
9. **Reusable TextInput** — Custom text input component wrapping Ant Design for consistency
10. **DayJS Integration** — Human-friendly date formatting (e.g. "1y 3m", "45d")
11. **Code Splitting** — Vendor chunk splitting for optimized production builds
12. **Unsaved Changes Guard** — Modal confirmation when navigating away from dirty forms

---

## Project Structure

```
GIC_Cafe/
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── CafeEmployee.Api/          # Controllers, Middleware, Program.cs
│       ├── CafeEmployee.Application/  # CQRS, DTOs, Validators, Interfaces
│       ├── CafeEmployee.Domain/       # Entities, Enums, Value Objects
│       ├── CafeEmployee.Infrastructure/ # EF Core, Repositories, Migrations
│       └── CafeEmployee.sln
├── frontend/
│   ├── Dockerfile
│   └── src/
│       ├── api/        # Service layer
│       ├── components/ # Reusable components
│       ├── hooks/      # TanStack Query hooks
│       └── pages/      # Route pages
├── docker/
│   └── nginx/          # Reverse proxy config
├── docker-compose.yml
└── README.md
```

---

## License

MIT
