# Q0L Readiness Decision Guard Report

Status: `QA_PASS_WITH_GAPS`
Date: 2026-06-22

## Objective

Prevent release evidence from claiming `CORE_RC_READY` or `FULL_1_1_RC_READY` when the artifact still contains dirty worktrees, local-only evidence, placeholder fields, missing external artifacts, or unverified release-gate/runtime evidence.

## Confirmed Repo Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state before Q0L work: `27 modified, 2 untracked`

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state before Q0L work: `10 modified, 3 untracked`

## Scope

Changed mobile files:

- `scripts/render-release-evidence.mjs`
- `src/services/release/releaseEvidenceScripts.test.ts`

Generated documentation artifact:

- `reports/Q0L-readiness-guard-current-evidence.md`

Runtime evidence artifact:

- `fitaly/e2e/artifacts/core-release-gate-maestro-repair-20260622/reports/`

## Implementation

The release-evidence renderer now treats `CORE_RC_READY` and `FULL_1_1_RC_READY` as guarded decisions.

For either readiness decision, the renderer now requires:

- `TARGET_ENVIRONMENT=production`;
- git-derived clean mobile and backend worktree evidence;
- git `HEAD` matching the declared `MOBILE_SHA` and `BACKEND_SHA`;
- complete evidence for the launch/Q0 critical fields instead of default placeholders such as `unknown`, `missing`, `not provided`, `not run`, `not built`, `pending`, `placeholder`, `failed`, or `error`;
- no local-only release-critical evidence markers such as `local`, `no-provider`, `simulator`, `emulator`, mocks/fakes, or local artifact paths;
- JUnit-derived `Release gate E2E` evidence from an explicit `RELEASE_GATE_RESULTS_DIR`, not a manually supplied `RELEASE_GATE_E2E_STATUS`;
- explicit release-gate breadth evidence via `RELEASE_GATE_EXPECTED_FLOW_COUNT` plus `RELEASE_GATE_EXPECTED_SUITE_KEY` or `RELEASE_GATE_EXPECTED_FLOW_IDS`;
- smoke runtime backend SHA evidence that starts with `verified`.

`BLOCKED_EXTERNAL_DEPENDENCY` still allows an artifact with explicit gaps, so the controller can honestly record why readiness is blocked.

## Generated Artifact

Artifact: `reports/Q0L-readiness-guard-current-evidence.md`

Key evidence-backed fields:

- `Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY`
- `Release gate E2E: verified 20/20 flow report(s), 20 testcase(s), failures=0, errors=0, skipped=0 from e2e/artifacts/core-release-gate-maestro-repair-20260622/reports`
- production new-domain flags remain `false`
- mobile worktree status remains dirty
- backend worktree status remains dirty

## Verification

- `npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts`
  - Result after QA repairs: passed, `32` tests.
  - Note: the command prints expected error output from negative-path tests.
- `env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 E2E_ARTIFACT_DIR=e2e/artifacts/core-release-gate-maestro-repair-20260622 npm run e2e:core-release-gate -- --continue-on-failure`
  - Result: passed, `20/20` local iOS no-provider Maestro flows.
  - Reports: `fitaly/e2e/artifacts/core-release-gate-maestro-repair-20260622/reports/`.
  - Constraint: loopback API with health check skipped; no smoke/prod provider or credentials were used.
- JUnit count check for `e2e/artifacts/core-release-gate-maestro-repair-20260622/reports`
  - Result: passed, `20` XML files, `20` testcases, failures `0`, errors `0`, skipped `0`.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `node scripts/e2e/run-suite.mjs core-release-gate --validate`
  - Result: passed, `20 flow(s) validated`.
- `npm run e2e:coverage:check`
  - Result: passed, static coverage definition validated `18` covered / `2` gaps / `37` flow references.
- `npm run e2e:dynamic-text:check`
  - Result: passed, `12` release-relevant suites and `69` unique Maestro flows validated.
- `git diff --check`
  - Result: passed.
- Generated `reports/Q0L-readiness-guard-current-evidence.md` in `BLOCKED_EXTERNAL_DEPENDENCY` mode with the fresh JUnit-backed local release-gate evidence.
- Negative readiness probe:
  - Command changed only `EVIDENCE_DECISION=CORE_RC_READY` on the current dirty/local-only state.
  - Result: failed before writing an artifact with `Mobile worktree status must be clean when clean worktree evidence is required; got dirty: 27 modified, 2 untracked.`
- Q0L invariant check passed:
  - verified JUnit-backed `20/20` release-gate status present;
  - `BLOCKED_EXTERNAL_DEPENDENCY` present;
  - production new-domain flags off;
  - dirty worktree statuses present;
  - no readiness decision present;
  - negative readiness probe did not write `/tmp/q0l-should-not-exist.md`.

## Independent QA

Initial independent QA returned `fail`.

Blocking finding:

- `CORE_RC_READY` could still be written from clean unrelated temp repos with local/no-provider wording and local artifacts because the first guard only rejected placeholder terms and required `verified` prefixes.

Controller repair:

- Added git `HEAD` checks so readiness decisions require declared `MOBILE_SHA` / `BACKEND_SHA` to match the actual repo `HEAD`.
- Added local-only evidence rejection for release-critical fields, including local/no-provider/simulator/emulator/mock/fake wording and local artifact path patterns.
- Added focused regression tests for SHA mismatch and local-only readiness evidence bypass.

Independent re-QA returned `fail`.

Blocking finding:

- Literal `placeholder` evidence could still pass readiness because the first repair blocked default placeholders such as `unknown`, `missing`, `not provided`, and `pending`, but not the word `placeholder`.

Controller repair:

- Added `placeholder` to the readiness blocking evidence patterns.
- Added focused regression coverage proving `BACKUP_RUN_URL=placeholder` fails readiness before writing an artifact.

Second independent re-QA returned `fail`.

Blocking finding:

- Local `file://` artifact evidence could still pass readiness because the local-only path guard did not catch `file:///Users/...` URLs.

Controller repair:

- Added `file://`, localhost, loopback, and home-directory local path markers to the local-only evidence patterns.
- Added focused regression coverage proving `E2E_RESULTS_ARTIFACT_PATH=file:///Users/...` fails readiness before writing an artifact.

Third independent re-QA returned `fail`.

Blocking finding:

- A manually supplied `RELEASE_GATE_E2E_STATUS` beginning with `verified` could still pass readiness when `RELEASE_GATE_RESULTS_DIR` was absent, so a claimed Maestro pass could replace JUnit-backed evidence.

Controller repair:

- Added an explicit readiness guard requiring `RELEASE_GATE_RESULTS_DIR` for `Release gate E2E`.
- Updated focused regression coverage so `RELEASE_GATE_E2E_STATUS="verified manually claimed release gate without junit ..."` fails readiness before writing an artifact.
- Reran the local no-provider `core-release-gate` Maestro suite and regenerated the blocked Q0L artifact from the fresh `20/20` JUnit reports.

Fourth independent re-QA returned `fail`.

Blocking findings:

- A single successful JUnit XML report could still claim readiness when `RELEASE_GATE_EXPECTED_FLOW_COUNT` and flow/suite identity metadata were omitted.
- Absolute local artifact paths such as `/var/folders/...` and `/Volumes/...` could still pass the local-only evidence guard.

Controller repair:

- Added a readiness-only requirement for `RELEASE_GATE_EXPECTED_FLOW_COUNT`.
- Added a readiness-only requirement for `RELEASE_GATE_EXPECTED_SUITE_KEY` or `RELEASE_GATE_EXPECTED_FLOW_IDS`.
- Broadened local-only evidence detection to reject absolute local paths and artifact/report/build/log path patterns in release-critical evidence fields.
- Added focused regression coverage for single-JUnit readiness claims without expected breadth metadata and for `/var/folders/...` plus `/Volumes/...` local artifact evidence.

Fifth independent re-QA returned `QA_PASS_WITH_GAPS`.

Accepted non-blocking gaps:

- QA did not rerun full Maestro, Android runtime, provider-backed smoke, billing, backup/restore, deployed backend SHA, Sentry, compliance, rollback, or external CI checks.
- Both worktrees remain dirty, so final RC readiness is still externally blocked by design.

## Unverified Areas

- Q0L reran only the local iOS no-provider `core-release-gate`; it did not run full `release-gate`, feature-wave flows, Android runtime, or provider-backed smoke.
- Q0L did not collect provider, billing, production smoke, backup/restore, Sentry, compliance, rollback, deployed backend SHA, remote CI, or Android device evidence.
- Current evidence is still not clean RC evidence because both worktrees are dirty and external/manual release gates remain open.

## Controller Decision

Q0L passes the local controller gate for readiness-claim hardening. Q0 remains `BLOCKED_EXTERNAL_DEPENDENCY`.
