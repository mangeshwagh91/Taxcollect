# TaxCollect Backend

Express + TypeScript backend for the TaxCollect project.

## Features

- JWT authentication (admin/citizen)
- Property CRUD and status tracking
- Payments and receipt generation
- Notifications
- Analytics summary endpoints
- Simple chatbot endpoint for FAQ-style replies
- JSON file persistence (`src/data/db.json`)

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

API base URL: `http://localhost:5000/api`

## Default Seed Users

- Admin: `admin@tax.local` / `admin123`
- Citizen: `citizen@tax.local` / `citizen123`

## Key Endpoints

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/properties`
- `POST /api/properties`
- `PATCH /api/properties/:id/payment-status`
- `GET /api/payments`
- `POST /api/payments`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/analytics/summary`
- `POST /api/chatbot`
