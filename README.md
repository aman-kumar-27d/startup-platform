# Startup Platform

## Short Description (2 Versions)

1. **Based on repo name + repository content:**  
   Startup Platform is a full-stack Next.js application for managing startup operations in one place, including users, clients, projects, tasks, content, SEO, and contact workflows.

2. **Based on your sentence:**  
   Startup Platform is a centralized platform to manage end-to-end flow.

## Description

Startup Platform is a centralized business operations system built with Next.js App Router, Prisma, and PostgreSQL.  
It combines a public-facing site and an authenticated internal workspace for teams to run day-to-day startup operations from a single platform.

Core capabilities include:
- Role-based internal access (Admin, Employee)
- User and password management
- Client lifecycle and history tracking
- Project and task management
- Public content and service management
- SEO metadata management
- Contact submission capture

## Architecture

### High-Level Architecture
- **Frontend/UI**: Next.js 16 (App Router) + React 19 + Tailwind CSS
- **Backend/API**: Next.js Route Handlers under `src/app/api`
- **Authentication**: NextAuth (Credentials provider) + JWT sessions
- **Authorization**: Route protection via `src/proxy.ts` and role checks
- **Database Layer**: Prisma ORM with PostgreSQL

### Application Zones
- **Public app routes**: `src/app/(public)`  
  Marketing/service pages and public contact form.
- **Internal app routes**: `src/app/internal`  
  Authenticated dashboard and operational modules.
- **API routes**:
  - Public APIs: `src/app/api/contact`, `src/app/api/content`
  - Internal APIs: `src/app/api/internal/*`
  - Auth API: `src/app/api/auth/[...nextauth]`

## Project Structure

```text
startup-platform/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed/
├─ src/
│  ├─ app/
│  │  ├─ (public)/              # Public pages
│  │  ├─ internal/              # Authenticated internal app
│  │  └─ api/                   # Route handlers (public/internal/auth)
│  ├─ lib/                      # Auth, DB client, utilities
│  ├─ components/ui/            # Shared UI components
│  ├─ types/
│  └─ proxy.ts                  # Route protection and role-based gating
├─ package.json
├─ prisma.config.ts
└─ README.md
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (`pg` + `@prisma/adapter-pg`)
- NextAuth.js (credentials-based login)
- ESLint + Prettier

## Installation

### Prerequisites
- Node.js (recommended: 20+)
- npm
- PostgreSQL database

### 1) Clone and install dependencies

```bash
npm ci
```

### 2) Configure environment variables

Create your local environment file (for example `.env.development`) and set:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Secret used by NextAuth JWT/session handling |
| `NEXTAUTH_URL` | Yes | App base URL (example: `http://localhost:3000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `ALLOW_ADMIN_SETUP` | Optional | Enable first-time admin setup route when `true` |
| `SETUP_TOKEN` | Optional | Extra bearer token protection for setup endpoint |

### 3) Generate Prisma client and apply migrations

```bash
npx prisma generate --schema=./prisma/schema.prisma
npx prisma migrate dev --schema=./prisma/schema.prisma
```

### 4) (Optional) Seed initial data

```bash
npx prisma db seed
```

## Running Setup

### Development

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Production

```bash
npm run build
npm run start
```

### Render-focused commands (if using Render)

```bash
npm run build:render
npm run start:render
```

## Initial Admin Setup (One-Time)

If you are setting up a fresh environment:
1. Set `ALLOW_ADMIN_SETUP=true` (and optionally `SETUP_TOKEN`).
2. Open `/internal/setup` and create the first admin.
3. After setup, set `ALLOW_ADMIN_SETUP=false`.

> Keep admin setup disabled in production after initialization.

## Available Scripts

- `npm run dev` – Generate Prisma client and start development server
- `npm run build` – Generate Prisma client and create production build
- `npm run start` – Start production server
- `npm run lint` – Run ESLint
- `npm run build:render` – Render-oriented migration + build flow
- `npm run start:render` – Run migration deploy and start server

## Prisma Quick Commands

- Generate client: `npx prisma generate --schema=./prisma/schema.prisma`
- Apply production migrations: `npx prisma migrate deploy --schema=./prisma/schema.prisma`
- Open Prisma Studio: `npx prisma studio`
