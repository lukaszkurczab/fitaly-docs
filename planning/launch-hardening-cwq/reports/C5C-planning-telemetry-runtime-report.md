# C5C Planning Telemetry Runtime Report

Date: 2026-06-22
Controller: Codex
Decision: `pass_with_gaps`

## Objective

Prove local runtime telemetry evidence for the Planning domain without enabling
Planning in production and without using smoke/provider/prod credentials.

## Branch Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: dirty before and after C5C; dirty tree includes prior Q0/M1/M2/K1/R1/C5 hardening changes plus C5C Planning telemetry changes.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: dirty before and after C5C; no C5C backend code edit was needed because the Planning telemetry allowlist and contract tests were already present in the current backend diff.

## Confirmed Facts

- Planning production remains off by default.
- The Planning runtime flow explicitly enables only the local E2E runtime flags it needs.
- Planning telemetry props are bounded and content-free: `sourceType`, `estimateState`, `surface`, `featureState`, and optional `actionResult`.
- The mobile Planning screen emits telemetry only after successful create, edit, reschedule, delete, or Review handoff actions.
- Telemetry is best-effort and does not roll back Planning actions.
- The E2E runtime assertion path uses backend telemetry summary counts, not only navigation or visible UI.
- The first C5C runtime attempt failed at telemetry baseline with visible marker `e2e-error:seed-api-http-error`.
- Re-running the same C5C flow against an isolated local backend configured with Firestore/Auth emulators, `TELEMETRY_ENABLED=true`, `PLANNED_MEALS_ENABLED=true`, and `KNOWN_PATTERNS_ENABLED=true` passed.
- No production API, smoke API, provider credentials, billing provider, production data, Firebase production credentials, RevenueCat keys, Sentry tokens, bundle IDs, or package IDs were used.

## C5C Code Scope

Intentional C5C mobile changes:

- `src/feature/Planning/screens/PlanningScreen.tsx`
  - Adds bounded Planning telemetry for successful local Planning actions.
  - Keeps telemetry best-effort so failed telemetry enqueue does not break the user action.
- `src/feature/Planning/screens/PlanningScreen.test.tsx`
  - Covers emitted props, disabled Planning, validation failures, remote mutation failures, Review handoff failure, and telemetry enqueue failure.
- `src/services/e2e/fixtures.ts`
  - Adds `plannedMealConfirmed` telemetry baseline/assert support.
  - Adds runtime flag assertions for `telemetryEnabled`, `knownPatternsEnabled`, and `planningEnabled`.
- `src/services/e2e/fixtures.test.ts`
  - Covers Planning telemetry count baseline/assert and runtime flag failure modes.
- `e2e/maestro/release-gate/planning-runtime-telemetry.yaml`
  - Logs in through the existing E2E local bootstrap, asserts telemetry and Planning flags, records a `planned_meal_confirmed` baseline, performs Planning-to-Review handoff, then asserts the backend summary count increased.
- `package.json`, `scripts/e2e/suites.json`, `scripts/run-e2e-local.sh`
  - Add the focused `planning-telemetry` suite and local runtime guards.

No C5C backend edit was required. Backend contract evidence is supplied by the
existing C5 telemetry schema and tests for Planning events.

## Post Backend-Off / Maestro Repair Audit

The failed C5C runtime attempt did not prove a Maestro selector or navigation
defect. `maestro hierarchy` after the failed run showed
`e2e-error:seed-api-http-error`, which points to the E2E seed/API baseline
request path.

The shared E2E login/session/token bridge remains in the worktree, but it is
not attributed to C5C. It was introduced and documented in prior local runtime
hardening slices (`Q0G`, `K1C`, `M2G`) to support local no-provider runtime
evidence. It is gated to E2E mode and is still required for the local emulator
runtime gates already recorded in this pass.

Controller revert decision:

- Reverted changes in C5C: none.
- Reason: the failed C5C runtime was reproduced as an API/environment failure,
  and the remaining shared E2E auth/session changes are prior local runtime
  infrastructure, not a C5C fix attempt.
- Risk: shared smoke UI-login coverage is still weaker than a provider-backed
  auth smoke. That gap is already part of Q0 external/provider readiness and
  must not be counted as production auth readiness.

## Runtime Evidence

Failed first runtime attempt:

```sh
env E2E_EXPO_CLEAR_CACHE=1 E2E_EXPO_PORT=8099 E2E_PLATFORM=ios E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 E2E_API_BASE_URL=http://127.0.0.1:8000 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 E2E_ARTIFACT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-1 E2E_RESULTS_DIR=/private/tmp/fitaly-c5c-planning-telemetry-1/reports E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-1/logs E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-1/screenshots npm run e2e:planning-telemetry
```

Result: failed `1/1` at
`e2e-ready-telemetryBaseline-plannedMealConfirmed`.

Diagnostic evidence:

- `maestro hierarchy` showed `e2e-error:seed-api-http-error`.
- The flow had already passed `telemetryRuntime=telemetryEnabled` and `telemetryRuntime=planningEnabled`.
- Classification: local backend/API environment failure, not a verified Maestro navigation or selector failure.

Isolated backend used for accepted runtime evidence:

```sh
ENVIRONMENT=local FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= EAGER_FIREBASE_INIT=false TELEMETRY_ENABLED=true KNOWN_PATTERNS_ENABLED=true PLANNED_MEALS_ENABLED=true ./.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8012
```

Accepted runtime command:

```sh
env E2E_EXPO_CLEAR_CACHE=1 E2E_EXPO_PORT=8099 E2E_PLATFORM=ios E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 E2E_API_BASE_URL=http://127.0.0.1:8012 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 E2E_ARTIFACT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-2 E2E_RESULTS_DIR=/private/tmp/fitaly-c5c-planning-telemetry-2/reports E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-2/logs E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-c5c-planning-telemetry-2/screenshots npm run e2e:planning-telemetry
```

Result:

- `planning-runtime-telemetry`: passed.
- Flow summary: `1/1 Flow Passed in 40s`.
- Backend log showed telemetry summary baseline and assert requests returning `200`, telemetry batch requests returning `202`, planned-meal create returning `201`, and planned-meal list returning `200`.

Repo-owned JUnit snapshot:

- `reports/c5c-planning-telemetry-artifacts/release-gate-planning-runtime-telemetry.xml`
- JUnit result: `tests="1"`, `failures="0"`, testcase `planning-runtime-telemetry`, `status="SUCCESS"`.

## Verification

Mobile:

```sh
npm run test:targeted -- src/feature/Planning/screens/PlanningScreen.test.tsx src/services/e2e/fixtures.test.ts src/services/e2e/deepLink.test.ts src/services/telemetry/telemetryInstrumentation.test.ts src/__contract_fixtures__/contractAlignment.test.ts
```

Result: passed, 5 suites / 180 tests.

```sh
npm run e2e:planning-telemetry -- --validate
```

Result: passed, `planning-telemetry: 1 flow(s) validated`.

Earlier C5C focused checks also passed before the accepted runtime rerun:

- `npx jest --runInBand --watchman=false --no-coverage src/feature/Planning/screens/PlanningScreen.test.tsx`: passed, 11 tests.
- `bash -n scripts/run-e2e-local.sh`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `git diff --check`: passed in mobile repo.

Backend:

```sh
./.venv/bin/pytest tests/test_api_telemetry.py tests/test_contract_alignment.py -q
```

Result: passed, 180 tests.

Earlier C5C backend diff check also passed:

- `git diff --check`: passed in backend repo.

Independent QA:

- Verdict: `pass_with_gaps`.
- Blocking findings: none after this report is created.
- Accepted gap: shared E2E login/session remains broader local runtime
  infrastructure from Q0/K1/M2 and must not be counted as C5C-specific work or
  production auth readiness.

## Unverified Areas

- No production or smoke telemetry verification was run.
- No provider-backed login, billing, backup/restore, RevenueCat, Sentry, or production Firebase evidence was collected.
- No Android runtime C5C pass was collected.
- Planning production activation remains blocked by Q0 and explicit feature rollout authorization.
- Home Next Action remains blocked until its source domains pass their gates.

## Stop Conditions

Stop before claiming `CORE_RC_READY` or `FULL_1_1_RC_READY` until:

- both worktrees are clean for the exact release pair;
- Q0 external/owner-authorized evidence is supplied;
- smoke/provider/prod checks are explicitly authorized and bounded;
- production feature flags remain off unless the relevant feature gate has passed and the owner authorizes rollout.

## Controller Decision

C5C is locally accepted as Planning runtime telemetry evidence.

Overall C5 remains `partial`: Smart Memory/Planning contracts, Known Patterns
runtime telemetry, and Planning runtime telemetry now have local evidence, but
full feature-wave telemetry readiness still needs authorized external/runtime
evidence before production activation.

Overall launch decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
