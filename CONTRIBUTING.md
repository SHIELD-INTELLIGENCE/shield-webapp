# Contributing to SHIELD Intelligence (Internal Only)

Internal Use Only — External contributions are not accepted unless a signed SHIELD Contributor Agreement is on file.

---

## Prerequisites

- You are a SHIELD Intelligence employee or an approved contractor with a signed Contributor Agreement (on file with Legal).
- You have read and understand the repository license: SHIELD Intelligence Internal-Use MPL 2.0.

---

## Workflow

1. Create a feature branch from `main`:
   - Naming: `feat/<short-name>`, `fix/<short-name>`, or `chore/<short-name>`
2. Write clear, scoped commits:
   - Conventional style recommended: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`
3. Keep changes minimal and focused; avoid unrelated refactors.
4. Ensure code builds and passes linting locally before opening a PR.
5. Open a Pull Request to `main`:
   - Fill in PR template (if present) with context, risks, test plan.
   - Add relevant reviewers from SHIELD core maintainers.
   - Link to any related tickets or incident reports.

---

## Code Quality

- Follow existing project patterns and conventions.
- Write small, composable components and prefer explicit over clever.
- Add or update tests when changing behavior.
- Keep secrets out of source control—use environment variables and secret stores.

---

## Security & Compliance

- Follow the Security Policy (`SECURITY.md`).
- Do not introduce dependencies with unknown provenance.
- Ensure third-party licenses are compatible with internal-use terms.

---

## Documentation

- Update `README.md` if behavior or usage changes.
- Document environment variables and configuration in code comments or docs.

---

## Release & Deployment

- Coordinate with release owners for versioned builds.
- Netlify/Android deployment settings must be reviewed by maintainers.

---

## Contact

- Legal and Contributor Agreements: legal@shieldintelligence.in
- Security: security@shieldintelligence.in

© 2025 SHIELD Intelligence · All rights reserved.
