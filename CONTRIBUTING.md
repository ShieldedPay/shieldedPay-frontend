# Contributing to ShieldedPay Frontend

Thank you for your interest in contributing to ShieldedPay Frontend! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following existing conventions (TypeScript strict, shadcn/ui patterns)
4. Run `pnpm lint` and ensure no new errors
5. Commit with a descriptive message
6. Push and open a Pull Request against `main`

## Guidelines

- **Keep PRs focused** — one feature or fix per PR
- Use existing Radix UI primitives before adding new UI dependencies
- Follow the established component structure under `components/ui/` and `components/admin/`
- **Mock data** lives alongside the components that use it during MVP phase — check for an existing mock source before adding a new one
- **Update documentation** when adding or changing features

## Code Style

- TypeScript strict mode — no implicit `any`
- Run `pnpm lint` (ESLint) before committing
- Match existing Tailwind/shadcn/ui conventions rather than introducing new styling patterns

## Commit Messages

Use conventional commit format:

- `feat: add new feature`
- `fix: correct bug`
- `docs: update documentation`
- `chore: maintenance tasks`
- `refactor: code restructuring`

## Reporting Issues

- Check existing issues before creating a new one
- Provide a clear description of the problem, including which view/route it affects
- Include steps to reproduce and screenshots for UI issues
- Suggest a solution if you have one

## Security issues

Do not open a public issue for a security vulnerability — see [SECURITY.md](SECURITY.md).

## Questions?

Open a discussion or issue for any questions about contributing.
