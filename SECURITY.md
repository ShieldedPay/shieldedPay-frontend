# Security Policy

## Reporting a Vulnerability

We take the security of ShieldedPay seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** disclose the vulnerability publicly
2. Email us at security@shieldedpay.com or open a private security advisory on GitHub
3. Include a description of the vulnerability and steps to reproduce
4. Allow us reasonable time to address the issue before public disclosure

## What to Expect

- Acknowledgment of your report within 48 hours
- Regular updates on the progress of the fix
- Credit for the discovery if you wish

## Scope

This policy covers the frontend application in this repository: the admin dashboard, landing page, and claim portal.

Note that this repository currently runs on **mock data** by default (no live backend connection required for local dev) and holds no private keys or contractor wallet secrets client-side — claim/withdraw flows submit to the backend, which is in scope of [ShieldedPay-backend's security policy](https://github.com/ShieldedPay/ShieldedPay-backend/blob/main/SECURITY.md). Smart contract concerns are covered by [ShieldedPay-contract's security policy](https://github.com/ShieldedPay/ShieldedPay-contract/blob/main/SECURITY.md).

Frontend-specific concerns in scope here:
- XSS / injection in dashboard or claim-portal inputs
- Auth/session handling in the admin dashboard
- Leakage of contractor wallet addresses or salary data in client-side code, network requests, or browser storage (the whole point of the zero-knowledge design is that employers never see contractor wallet addresses — any regression here is a priority report)

## Supported Versions

| Version | Supported          |
|---------|---------------------|
| 0.1.x   | :white_check_mark: |

## Status

This project is an MVP/prototype and **has not been audited for production use**. Treat all reports responsibly, but also expect immature areas — see the README's Status section for what's implemented vs. mocked.
