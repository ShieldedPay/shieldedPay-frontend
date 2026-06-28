# ShieldedPay Frontend 🔒

**Privacy-first global payroll built on Stellar with zero-knowledge compliance — frontend web application.**

This repository contains the Next.js admin dashboard, landing page, and claim portal for ShieldedPay. Employers manage payrolls, employees, and treasury through the admin panel. Contractors receive secure claim links to withdraw funds directly to their self-custodied wallets.

---

## Features

- **Zero-Knowledge Privacy** — Salaries and wallet addresses are protected using ZK-style commitments (SHA256 Merkle trees). Employers never see contractor wallet addresses.
- **Global Payments** — Pay contractors in 150+ countries with instant Stellar blockchain settlement.
- **Self-Custodied Claims** — Contractors receive a unique claim token to withdraw funds directly to their own Stellar wallet. No signup needed.
- **Treasury Yield** — Earn 4–5% APY on idle payroll funds through DeFi integration.
- **Auditor View Keys** — Grant selective, time-bound read access to external auditors.
- **Admin Dashboard** — Full analytics, payroll management, employee tracking, and treasury operations.

---

## Related Repositories

- [ShieldedPay Backend](https://github.com/ShieldedPay/ShieldedPay-backend) — API server, database, and crypto module
- [ShieldedPay Contracts](https://github.com/ShieldedPay/ShieldedPay-contract) — Stellar smart contracts for payroll and claims

---

## Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Next.js 16 (App Router)                 |
| Language    | TypeScript (strict)                     |
| UI          | React 19, Tailwind CSS 4, shadcn/ui     |
| Charts      | Recharts                                |
| Data Fetch  | SWR                                     |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

No database setup is required — the frontend uses mock data out of the box for development.

### API Proxy Configuration

To connect the frontend to the [ShieldedPay Backend](https://github.com/ShieldedPay/ShieldedPay-backend), configure the `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:3001` when proxying through `next.config.mjs`).

---

## Contributing

1. Fork the repo and create a feature branch (`git checkout -b feat/amazing-feature`).
2. Make your changes following existing conventions (TypeScript strict, shadcn/ui patterns).
3. Run `pnpm lint` and ensure no new errors.
4. Commit with a descriptive message (`git commit -m 'feat: add amazing feature'`).
5. Push and open a Pull Request against `main`.

### Guidelines

- Keep PRs focused — one feature or fix per PR.
- Use existing Radix UI primitives before adding new UI dependencies.
- Follow the established component structure under `components/ui/` and `components/admin/`.

---

## Status

**MVP / Prototype.** The UI is feature-complete for the admin dashboard, landing page, and claim flow. Mock data is used for development; integrate with the backend and contracts for full functionality. Not yet audited for production use.
