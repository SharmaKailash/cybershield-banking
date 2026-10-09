# CyberShield Banking

**Secure Digital Banking & Cyber Defense Demonstration**

An academic cybersecurity prototype. It uses fictional records and simulated banking workflows; it is not connected to a bank or a real payment network. No real funds move.

## Run locally

Requirements: Node.js 20+ and (optionally) MongoDB.

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`.
Set `MONGODB_URI` in `server/.env` to your MongoDB connection string to use your database. Keep this file private and never commit it. If `MONGODB_URI` is unset, the API uses fictional in-memory seed data instead.
`npm run dev` starts both the client and API. Do not start another API with `npm run dev --prefix server` at the same time; if port 4000 is already occupied, stop the existing API process before starting another one.
The Vite development server proxies `/api` requests to the API. For direct API requests, local development accepts localhost and private-network origins. In production, set `CLIENT_ORIGIN` in `server/.env` to the exact frontend origin (or a comma-separated list of origins); production does not automatically allow local development origins.

## Deploy the demo to Netlify

The Netlify site serves the Vite frontend and runs the Express API through a Netlify Function. The root [`netlify.toml`](./netlify.toml) installs both package sets, builds the frontend, publishes `client/dist`, routes `/api/*` to the function, and falls back to the SPA entry page. No separate Render service or `VITE_API_URL` is required.

After importing this repository in Netlify, add these private site environment variables and redeploy:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `CLIENT_ORIGIN` | The exact site origin, e.g. `https://cybersecuritybanking.netlify.app` |
| `JWT_SECRET` | A newly generated random secret with at least 32 characters |
| `MONGODB_URI` | Your MongoDB connection URI |

The function returns API endpoints under the same Netlify site, including `/api/health`. If `MONGODB_URI` is omitted, the demo falls back to in-memory data that is not persistent. Never commit `.env` files, `JWT_SECRET`, or database credentials, and use only fictional demo data.

## Demo access

| Role | Customer ID | Password | Demo OTP |
|---|---|---|---|
| Customer | CUST1001 | Shield@2026 | 246810 |
| Security administrator | ADMIN1001 | Shield@2026 | 246810 |
| Approver / checker | CHECK1001 | Shield@2026 | 246810 |

Credentials and OTP are public demo values. Do not reuse them for any real account.
To demonstrate maker-checker controls, submit a simulated transfer as the customer, then sign out and sign in as the checker to review any high-value approval.

## Included demonstrations

- JWT login with a separate demo MFA step and role-scoped navigation/API authorization.
- Simulated transfers, fraud scoring, high-value maker-checker approval, alerts, and audit events.
- PBKDF2-HMAC-SHA256 password derivation and verification.
- AES-256-GCM authenticated encryption and tamper detection.
- A safe SQL-injection teaching simulation; no user input is executed as SQL.
- Fictional threat, risk, security-event, and defense-architecture views.

## Project layout

- `client/`: React, Vite, Tailwind CSS, Recharts, Lucide, Framer Motion, Axios.
- `server/`: Express REST API, Mongoose models, JWT middleware, controllers, services, and routes.

All displayed values are simulated. This project is for classroom demonstration and is not production banking software.
