# Alum Plus — API (Express + Prisma + PostgreSQL)

Standalone backend. Includes `shared/` (Zod schemas) and `prisma/`.

## Setup

```bash
cp .env.example .env
# edit DATABASE_URL and secrets
npm install
npm run build
npx prisma migrate deploy
npm run db:seed
npm run start
```

## Docker

See `Dockerfile` in this folder.

## Push to its own GitHub repo

See **`PUSH-TO-GITHUB.md`**.
