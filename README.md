# Startup Platform

## Stack

- Next.js (App Router)
- Prisma ORM
- PostgreSQL
- NextAuth.js (credentials)
- Tailwind CSS

## Production Deployment on Render

This repository now uses PostgreSQL in Prisma and is ready for Render.

### Option A: Blueprint (recommended)

1. Push this repo to GitHub.
2. In Render, choose New > Blueprint.
3. Select this repo.
4. Render will use `render.yaml` to create:
   - Web Service: `startup-platform`
   - PostgreSQL: `startup-platform-db`
5. Set `NEXTAUTH_URL` in Render to your public service URL.

### Option B: Manual service setup

- Build command: `npm ci && npx prisma migrate deploy --schema=./prisma/schema.prisma && npm run build`
- Start command: `npm run start`

Required environment variables:

- `NODE_ENV=production`
- `DATABASE_URL=<Render Postgres connection string>`
- `NEXTAUTH_SECRET=<strong random secret>`
- `NEXTAUTH_URL=https://your-service.onrender.com`
- `ALLOW_ADMIN_SETUP=false`

## Prisma commands

- Generate client: `npx prisma generate`
- Apply migrations: `npx prisma migrate deploy --schema=./prisma/schema.prisma`
- Open Studio: `npx prisma studio`
