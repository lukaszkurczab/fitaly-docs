# Controller Loop Runbook

Status: active runbook
Created: 2026-06-20

## Operating Contract

Act as controller. Keep the user-level objective stable, split work into verifiable slices, assign workers only scoped work, and run independent QA when risk warrants it.

Default stop rule: if a slice needs credentials, production data, destructive migration, provider cost beyond documented smoke bounds, or unclear ownership, stop and report the blocker.

## Required Start Context For Each New Controller Conversation

Read, in this order:

1. root `AGENTS.md`
2. `docs/README.md`
3. `docs/architecture/decisions.md`
4. `docs/runbooks/launch.md`
5. `fitaly/AGENTS.md`
6. `fitaly-backend/AGENTS.md`
7. `docs/planning/launch-hardening-cwq/README.md`
8. `docs/planning/launch-hardening-cwq/01-packet-status.md`
9. current packet file, starting with `03-first-packet-c0-baseline.md`

Read external downloaded SoT docs only as needed for the active slice. Repo evidence wins over downloaded docs.

## Loop Steps

1. Select the earliest incomplete packet unless repo evidence proves a later P0 is blocking.
2. Define one small slice.
3. Restate facts and assumptions.
4. Inspect enough repo evidence to define acceptance criteria.
5. Write acceptance criteria before implementation.
6. Assign a worker or perform a local worker pass if agent tooling is unavailable.
7. Require targeted verification.
8. Inspect diff and classify changes.
9. Run independent QA for P0, cross-repo, privacy, billing, telemetry, release or data-integrity slices.
10. Compare QA against original acceptance criteria.
11. If QA fails, create a repair slice.
12. Update status/evidence/report files.

## Slice Size Rules

- One behavior, contract, packet gate, or migration step per slice.
- Do not mix mechanical refactors with behavior changes.
- Do not start feature waves before C0.
- Do not activate Home Next Action before its source domains pass.
- Do not preserve legacy fallback paths unless explicitly required by current repo evidence or owner decision.
- Do not add hidden fallbacks.

## Diff Hygiene

Before QA or final reporting:

- Inspect `git status --short` in each affected repo.
- Inspect relevant diffs.
- Classify changes as intentional, generated/lockfile, unrelated pre-existing, or accidental.
- Do not attribute unrelated dirty state to a worker.
- Do not revert user changes unless explicitly authorized.

## Verification Policy

Use the narrowest meaningful verification per slice.

Mobile examples:

- `npm run lint`
- `npm run typecheck`
- targeted `npm test -- --runInBand`
- `BACKEND_REPO=<paired-backend-path> ./scripts/verify-backend-contract.sh`
- targeted E2E only when the slice touches release-critical flows.

Backend examples:

- `pytest <target>`
- `python -m compileall app`
- `ruff check .`
- `./.venv/bin/pyright`
- Firestore emulator tests when Firestore rules, indexes, export/delete, idempotency, or data integrity are touched.

Do not claim verification if the command was not run.

## Reporting Cadence

After each packet or repair loop, add a report under `reports/` with:

- packet/slice id
- objective
- facts and assumptions
- files inspected
- changes made
- verification commands and exact result
- QA verdict
- evidence paths
- unverified areas
- remaining risks
- controller decision

After any runtime/smoke evidence, attach sanitized artifacts under `evidence/` or reference the repo-owned evidence path.

