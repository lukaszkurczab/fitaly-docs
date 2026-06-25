# C5D Smart Memory Telemetry Runtime Report

Date: 2026-06-22
Controller: Codex
Decision: `pass_with_gaps`

## Objective

Close the remaining local Smart Memory runtime telemetry evidence gap by
proving one UI-triggered Smart Memory event increments backend telemetry counts
in an emulator-backed local run, without enabling Smart Memory in production.

## Branch Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: dirty before and after C5D; dirty tree includes prior Q0/M1/M2/K1/R1/C5 hardening changes plus C5C/C5D telemetry runtime changes.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: dirty before and after C5D; no C5D backend code edit was required.

## Confirmed Facts

- Smart Memory production remains off by default.
- M1G wired `memory_muted` and `memory_deleted` from Memory Center, but its QA gap explicitly said no device/emulator flow had captured actual outgoing telemetry.
- C5D adds E2E count support for `memoryDeleted`, mapped to backend event `memory_deleted`.
- The new runtime flow records a backend summary baseline, performs the Memory Center delete UI action, then asserts the backend summary count increased.
- The flow does not use the diagnostic `telemetryEmit` path for the accepted event; the event is triggered by the Memory Center UI.
- The event props are bounded/content-free: `memoryType`, `surface`, `actionResult`, and `featureState`.
- No production API, smoke API, provider credentials, billing provider, production data, Firebase production credentials, RevenueCat keys, Sentry tokens, bundle IDs, or package IDs were used.

## C5D Code Scope

Intentional C5D mobile changes:

- `src/services/e2e/fixtures.ts`
  - Adds `memoryDeleted` telemetry baseline/assert support.
  - Adds `smartMemoryEnabled` runtime flag assertion.
  - Keeps diagnostic `telemetryEmit` support bounded to enum/category props.
- `src/services/e2e/fixtures.test.ts`
  - Covers Smart Memory telemetry baseline/assert, diagnostic emit props, and `smartMemoryEnabled` runtime-flag failure.
- `e2e/maestro/release-gate/smart-memory-runtime-telemetry.yaml`
  - Asserts telemetry and Smart Memory runtime flags, records a `memory_deleted` baseline, seeds active Smart Memory, deletes a Memory Center item, and asserts count increase.
- `package.json`, `scripts/e2e/suites.json`, `scripts/run-e2e-local.sh`
  - Add the focused `smart-memory-telemetry` suite and local runtime guard.

No C5D backend edit was required. Existing backend C5 telemetry allowlist tests
cover Smart Memory events and forbidden prop rejection.

## Runtime Evidence

Isolated backend used for accepted runtime evidence:

```sh
ENVIRONMENT=local FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= EAGER_FIREBASE_INIT=false TELEMETRY_ENABLED=true KNOWN_PATTERNS_ENABLED=true PLANNED_MEALS_ENABLED=true SMART_MEMORY_ENABLED=true ./.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8013
```

Accepted runtime command:

```sh
env E2E_EXPO_CLEAR_CACHE=1 E2E_EXPO_PORT=8099 E2E_PLATFORM=ios E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 E2E_API_BASE_URL=http://127.0.0.1:8013 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 E2E_ARTIFACT_DIR=/private/tmp/fitaly-c5d-smart-memory-telemetry-1 E2E_RESULTS_DIR=/private/tmp/fitaly-c5d-smart-memory-telemetry-1/reports E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-c5d-smart-memory-telemetry-1/logs E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-c5d-smart-memory-telemetry-1/screenshots npm run e2e:smart-memory-telemetry
```

Result:

- `smart-memory-runtime-telemetry`: passed.
- Flow summary: `1/1 Flow Passed in 28s`.
- Backend log showed telemetry summary baseline/assert requests returning `200` and telemetry batch requests returning `202`.
- The local backend was stopped after the run.

Repo-owned JUnit snapshot:

- `reports/c5d-smart-memory-telemetry-artifacts/release-gate-smart-memory-runtime-telemetry.xml`
- JUnit result: `tests="1"`, `failures="0"`, testcase `smart-memory-runtime-telemetry`, `status="SUCCESS"`.

## Verification

Mobile:

```sh
npm run test:targeted -- src/services/e2e/fixtures.test.ts src/services/e2e/deepLink.test.ts src/services/telemetry/telemetryInstrumentation.test.ts src/__contract_fixtures__/contractAlignment.test.ts src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx
```

Result: passed, 5 suites / 187 tests.

```sh
bash -n scripts/run-e2e-local.sh
```

Result: passed.

```sh
npm run e2e:smart-memory-telemetry -- --validate
```

Result: passed, `smart-memory-telemetry: 1 flow(s) validated`.

```sh
npm run typecheck
```

Result: passed.

```sh
npm run lint
```

Result: passed.

```sh
git diff --check
```

Result: passed in mobile repo.

Backend:

```sh
./.venv/bin/pytest tests/test_api_telemetry.py tests/test_contract_alignment.py -q
```

Result: passed, 180 tests.

Independent QA:

- Verdict: `pass_with_gaps`.
- Blocking findings: none.
- Controller accepted gaps:
  - JUnit alone lacks env/log context; this report records the exact backend and runtime commands plus observed backend status evidence.
  - The local runner auto-enables targeted flags but does not sanitize unrelated pre-set flags. This is acceptable for local targeted evidence and is not production activation. Production/offline readiness remains governed by Q0 feature-flag and clean-release checks.

## Unverified Areas

- No production or smoke telemetry verification was run.
- No provider-backed auth, billing, backup/restore, RevenueCat, Sentry, or production Firebase evidence was collected.
- No Android runtime C5D pass was collected.
- Smart Memory production activation remains blocked by Q0 and explicit feature rollout authorization.
- Home Next Action remains blocked until its source domains pass their gates.

## Stop Conditions

Stop before claiming `CORE_RC_READY` or `FULL_1_1_RC_READY` until:

- both worktrees are clean for the exact release pair;
- Q0 external/owner-authorized evidence is supplied;
- smoke/provider/prod checks are explicitly authorized and bounded;
- production feature flags remain off unless the relevant feature gate has passed and the owner authorizes rollout.

## Controller Decision

C5D is locally accepted as Smart Memory runtime telemetry evidence.

Overall C5 remains `partial`: the current local C5 evidence covers telemetry
contracts plus local runtime count evidence for Known Patterns, Planning, and
Smart Memory, but full feature-wave telemetry readiness still needs authorized
external/runtime evidence before production activation.

Overall launch decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
