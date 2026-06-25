# Q0M Release Candidate JUnit Wiring Report

Status: `QA_PASS_WITH_GAPS`
Generated: `2026-06-22T08:16:49Z`

## Objective

Make the mobile release-candidate workflow consume JUnit-backed `core-release-gate` evidence instead of passing a manual `RELEASE_GATE_E2E_STATUS=passed` value into release evidence rendering.

## Repo Snapshot

Mobile repo:

- Path: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: dirty before and after this slice. This slice added/changed `.github/workflows/release-candidate.yml` and `src/services/release/releaseEvidenceScripts.test.ts`; other dirty mobile files are pre-existing from earlier hardening packets.

Backend repo:

- Path: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: dirty from prior backend hardening packets; Q0M made no backend code changes.

## Confirmed Facts

- `.github/workflows/release-candidate.yml` previously ran `npm run e2e:release-gate`, uploaded `e2e-release-gate-*`, and rendered release evidence with `RELEASE_GATE_E2E_STATUS: passed`.
- `scripts/e2e/suites.json` defines a separate `core-release-gate` suite with 20 flows for the core release path while new domains remain production-off.
- The broader `release-gate` suite includes Smart Memory, Recipe Catalog, Known Patterns, Planning, and Home Next Action flows. Those domains are not production-ready in the current packet status.

## Changes Made

- `release-gate-e2e` now runs `npm run e2e:core-release-gate`.
- The workflow writes JUnit reports to `release-gate-reports` and uploads them as `e2e-core-release-gate-${{ env.E2E_PLATFORM }}`.
- Debug artifacts are uploaded separately as `e2e-core-release-gate-debug-${{ env.E2E_PLATFORM }}`.
- `release-evidence` downloads the core release-gate JUnit artifact before rendering.
- The renderer env now passes:
  - `RELEASE_GATE_RESULTS_DIR=release-gate-reports`
  - `RELEASE_GATE_EXPECTED_FLOW_COUNT=20`
  - `RELEASE_GATE_EXPECTED_SUITE_KEY=core-release-gate`
  - `RELEASE_GATE_SUITE_NAME=core-release-gate`
- The manual `RELEASE_GATE_E2E_STATUS: passed` path was removed from the RC workflow.
- Added a focused Jest contract test to prevent the RC workflow from reverting to a manual passed status or the broader 1.1 `release-gate` suite for core RC evidence.
- After QA feedback, the workflow contract test now scopes assertions to the active `release-gate-e2e` and `release-evidence` job blocks plus their named steps, and rejects both unquoted and quoted manual pass/readiness values.

## Verification

All commands ran in `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`.

| Command | Result |
| --- | --- |
| `npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts` | pass, `33/33` tests |
| `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/release-candidate.yml"); puts "workflow yaml parsed"'` | pass, `workflow yaml parsed` |
| `node --check scripts/render-release-evidence.mjs` | pass |
| `node scripts/e2e/run-suite.mjs core-release-gate --validate` | pass, `20 flow(s) validated` |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run e2e:coverage:check` | pass, `18 covered, 2 gap(s), 37 flow reference(s)` |
| `npm run e2e:dynamic-text:check` | pass, `12 release-relevant suite(s), 69 unique Maestro flow(s)` |
| `git diff --check` | pass |

## Classification

- Introduced during Q0M: no failing verification observed.
- Pre-existing blockers: both repos remain dirty; authenticated smoke/provider/billing/backup/restore/production smoke/deployed backend SHA/manual evidence still requires owner authorization or external artifacts.
- Unknown / needs evidence: the modified GitHub Actions workflow has not been executed on a self-hosted runner in this loop.

## Independent QA

Final QA result: `QA_PASS_WITH_GAPS`.

QA initially found two P2 test-hardening issues:

- The first test version used global substring checks that could pass if the expected strings appeared outside the active workflow steps.
- The first repair did not reject quoted YAML values such as `RELEASE_GATE_E2E_STATUS: "passed"` or `EVIDENCE_DECISION: "CORE_RC_READY"`.

Controller repairs:

- Scoped workflow assertions to the `release-gate-e2e` and `release-evidence` job blocks and active named steps.
- Updated negative regex checks to reject quoted and unquoted manual pass/readiness values.

Final QA confirmed no findings. Residual gaps:

- QA did not rerun the full verification list in the final narrow pass.
- The modified GitHub Actions workflow has not been proven by a live self-hosted runner execution.

## Decision Impact

Q0M improves the live RC evidence path but does not change the current decision. The decision remains `BLOCKED_EXTERNAL_DEPENDENCY` because no clean external/provider-backed RC evidence package exists for this exact FE/BE pair.

## Stop Conditions

- Do not mark `CORE_RC_READY` from this slice alone.
- Do not run provider/prod smoke or use credentials without explicit owner authorization.
- Do not run H1/Home Next Action before source domains pass their gates.
- Full 1.1 `release-gate` remains out of scope for core RC and must be handled only after its domains pass their own gates.
