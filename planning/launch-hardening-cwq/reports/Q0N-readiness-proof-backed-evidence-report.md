# Q0N Readiness Proof-Backed Evidence Report

Status: `qa_passed_with_gaps`
Generated: `2026-06-22T08:36:53Z`
QA accepted: `2026-06-22T09:46:09Z`

## Objective

Close the readiness-evidence gap where `CORE_RC_READY` or `FULL_1_1_RC_READY` could be rendered with generic release-critical field values such as `passed` or `done`.

## Repo Snapshot

Mobile repo:

- Path: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: dirty before and after this slice. Q0N intentionally changed `.github/workflows/release-candidate.yml`, `scripts/render-release-evidence.mjs`, and `src/services/release/releaseEvidenceScripts.test.ts`; other dirty mobile files are pre-existing from earlier hardening packets.

Backend repo:

- Path: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: dirty from earlier backend hardening packets; Q0N made no backend changes.

## Confirmed Facts

- Before Q0N, the readiness guard blocked missing, placeholder, local-only, dirty-worktree, SHA-mismatch, non-JUnit release gate, and missing smoke runtime SHA evidence.
- Before Q0N, most release-critical readiness fields could still contain generic non-evidence values such as `passed` without being rejected.
- The RC workflow render step also used generic values such as `MOBILE_CI_STATUS=passed`, `BACKEND_CI_STATUS=passed`, `SMOKE_E2E_STATUS=passed`, and `SMOKE_EXPORT_STATUS=passed`.

## Changes Made

- `scripts/render-release-evidence.mjs` now requires every required release-critical field for `CORE_RC_READY` / `FULL_1_1_RC_READY` to have proof-backed evidence:
  - a `verified` marker paired with recognized evidence/source terms,
  - an external `http(s)` URL,
  - or a named `GitHub Actions artifact` reference.
- The readiness blocker list now rejects `not verified`, `unverified`, and `unproven` so negated proof language cannot satisfy the `verified` marker.
- `CORE_RC_READY` now requires `RELEASE_GATE_EXPECTED_SUITE_KEY=core-release-gate`; `FULL_1_1_RC_READY` requires `RELEASE_GATE_EXPECTED_SUITE_KEY=release-gate`.
- `.github/workflows/release-candidate.yml` now renders proof-backed status strings with GitHub Actions run URLs/attempts for mobile CI, backend CI, smoke E2E, smoke export, smoke flow contracts, target SDK, AAB, chat integrity, onboarding contract, and weekly report premium gate.
- The release E2E artifact reference now includes the GitHub Actions run URL.
- The default manual delete note now starts with `verified ...`; owner-supplied delete notes still must be proof-backed if a readiness decision is ever claimed.
- `src/services/release/releaseEvidenceScripts.test.ts` adds regressions for:
  - generic `passed` / `done` evidence fields,
  - self-attesting `verified ok` / `verified passed` evidence fields,
  - negated `not verified` evidence,
  - `FULL_1_1_RC_READY` backed only by the core suite key,
  - RC workflow render-step proof-backed status strings.

## Verification

All commands ran in `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`.

| Command | Result |
| --- | --- |
| `npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts` | pass, `36/36` tests |
| `npm run lint` | pass |
| `npm run typecheck` | pass |
| `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/release-candidate.yml"); puts "workflow yaml parsed"'` | pass, `workflow yaml parsed` |
| `node --check scripts/render-release-evidence.mjs` | pass |
| `git diff --check` | pass |
| `npm run e2e:coverage:check` | pass, `18 covered, 2 gap(s), 37 flow reference(s)` |
| `npm run e2e:dynamic-text:check` | pass, `12 release-relevant suite(s), 69 unique Maestro flow(s)` |
| `node scripts/e2e/run-suite.mjs core-release-gate --validate` | pass, `20 flow(s) validated` |

## Classification

- Introduced during Q0N: no failing verification observed.
- Pre-existing blockers: both repos remain dirty; no live self-hosted RC workflow run exists; authenticated smoke/provider/billing/backup/restore/production smoke/deployed backend SHA/manual evidence still requires owner authorization or external artifacts.
- Unknown / needs evidence: whether the modified GitHub Actions proof-backed labels render as expected in a live run.

## Independent QA

Verdict: `QA_PASS_WITH_GAPS`.

Confirmed repairs:

- `FULL_1_1_RC_READY` rejects evidence backed only by `core-release-gate`.
- Generic `passed`, `done`, `verified ok`, and `verified passed` values are rejected.
- The RC workflow render step no longer supplies bare status labels and does not set `EVIDENCE_DECISION`.
- No new production/provider/smoke credentials were added by Q0N.

Accepted residual gaps:

- No live self-hosted RC workflow run was verified.
- Proof-backed checks remain pattern-based; they validate evidence shape, not the external URL/artifact contents.
- External addressability of release-gate JUnit evidence still depends on the paired GitHub Actions artifact field.

## Decision Impact

Q0N strengthens readiness denial. It does not change the current release decision.

Current decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.

## Stop Conditions

- Do not mark `CORE_RC_READY` or `FULL_1_1_RC_READY` from local/static Q0N evidence.
- Do not run provider/prod smoke or use credentials without explicit owner authorization.
- Do not treat generic `passed` status text as launch evidence.
- Full 1.1 `release-gate` remains out of scope for core RC until its domains pass their own gates.
