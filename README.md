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

## Deploy the demo

The frontend and API deploy as separate services. Do not use real customer, banking, or payment data.

### Netlify frontend

Import the repository from GitHub. The root [`netlify.toml`](./netlify.toml) sets the client base directory, Vite build command, publish directory, and SPA fallback. In Netlify site environment variables, set:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

Trigger a new deploy after setting or changing this variable; Vite reads it at build time.

### Render API

Create a Render Blueprint from the repository using [`render.yaml`](./render.yaml), or create a Web Service with root directory `server`, build command `npm ci`, and start command `npm start`. The Blueprint configures the health check, production mode, the Netlify origin shown above, and a generated JWT secret. Supply `MONGODB_URI` as a private Render environment variable. If your Netlify site has a different URL or a custom domain, update `CLIENT_ORIGIN` on Render to that exact origin and redeploy.

Copy the Render service URL into Netlify's `VITE_API_URL` (with `/api` appended), then redeploy Netlify. Never commit `.env` files, `JWT_SECRET`, or database credentials.

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
