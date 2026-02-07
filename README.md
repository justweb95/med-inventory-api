# Medication Inventory REST API

REST API for tracking controlled medication inventory in a healthcare facility. Nurses check out controlled substances, can return remainders, and must record waste with a witness for audit purposes.

## Tech stack
- Node.js, Express, TypeScript
- PostgreSQL
- Prisma ORM (migrations + seed)
- Zod validation
- Docker + Docker Compose
- Vitest + Supertest (Prisma mocked for tests)

## Features
- Medication inventory tracking with schedules (II–V) and units (mg/ml/mcg)
- Transactions: CHECKOUT, RETURN, WASTE
- Audit logging for every transaction
- Input validation via Zod
- Consistent HTTP error responses

## Requirements
- Node.js 20+
- npm
- Docker + Docker Compose

## Environment variables
Create a `.env` file in the project root:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/med_inventory  
PORT=3000

## Run with Docker (recommended)
Start PostgreSQL:
sudo docker compose up -d db

Run migrations:
npx prisma migrate dev --name init

Seed initial data:
npm run prisma:seed

Start the API (hot reload):
npm run dev

API base URL:
http://localhost:3000/api

Quick check:
curl http://localhost:3000/api/medications

## Docker Compose warning about version
If you see a warning that `version` is obsolete in `docker-compose.yml`, you can remove the top-level `version:` key. Docker Compose v2 ignores it.

## Running tests
Tests mock Prisma so they run without a real database:
npm test

Watch mode:
npm run test:watch

## API endpoints
All endpoints are prefixed with /api.

### Medications
GET /api/medications?schedule=II  
List all medications (optional filter by schedule).

GET /api/medications/:id  
Get a single medication with its transaction history.

### Transactions
POST /api/transactions  
Create a transaction (CHECKOUT / RETURN / WASTE).

Body example:
{
  "medicationId": 1,
  "nurseId": 1,
  "witnessId": 2,
  "type": "CHECKOUT",
  "quantity": 10,
  "notes": "Optional (required for WASTE)"
}

GET /api/transactions?type=CHECKOUT&medicationId=1  
List transactions with optional filters.

### Audit log
GET /api/audit-log?entityType=Transaction  
List audit log entries with optional filter by entityType.

## Transaction rules
- CHECKOUT reduces medication stock; request fails if stock is insufficient.
- RETURN increases medication stock.
- WASTE does not change stock; notes is required.
- Every transaction must include a witnessId that is different from nurseId.
- Every transaction automatically creates an AuditLog entry.

## Seed data
Seed script creates:
- 3 users (NURSE, WITNESS, ADMIN)
- 5 medications with initial stock

Run:
npm run prisma:seed

## Design decisions / tradeoffs
- Business rules live in a service layer (stock calculations, transaction rules), controllers are kept thin.
- Prisma $transaction is used so transaction creation, stock update, and audit log insertion are atomic.
- AuditLog is modeled generically using entityType + entityId and a details JSON field (flexible, but not enforced with strict foreign keys).
- Tests mock Prisma to avoid requiring a real database during test execution (fast and deterministic, but closer to unit tests than full integration tests).