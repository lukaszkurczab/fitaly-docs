# K1C Known Patterns Runtime Maestro Report

Status: `QA_PASS_WITH_GAPS`
Created: `2026-06-22T14:17:51Z`
Controller: Codex

## Objective

Close the remaining local K1 runtime/Maestro evidence gap for Known Patterns
after K1A content identity and K1B alias/overlap hardening, without enabling
Known Patterns in production.

## Scope

Repositories changed in this local runtime repair/evidence slice:

- Mobile: `fitaly`

Files changed by the E2E auth/runtime repair used by this slice include:

- `e2e/maestro/smoke/login.yaml`
- `e2e/maestro/smoke/auth-bootstrap.yaml`
- `scripts/run-e2e-local.sh`
- `app.config.js`
- `src/FirebaseConfig.ts`
- `src/services/core/runtimeConfig.ts`
- `src/services/core/apiClient.ts`
- `src/services/e2e/authSession.ts`
- `src/services/e2e/authToken.ts`
- `src/services/e2e/deepLink.ts`
- `src/services/e2e/fixtures.ts`
- `src/context/AuthContext.tsx`
- `src/navigation/AppNavigator.tsx`
- `src/services/user/userProfileRepository.ts`

Non-goals:

- no Known Patterns production activation;
- no provider, smoke-backend, production, RevenueCat, Sentry, or credentialed
  runtime;
- no Home Next Action activation;
- no Android runtime evidence;
- no backend Known Patterns implementation change in K1C.

## Repo Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: existing launch-hardening diffs plus the E2E auth/runtime repair
  and K1C fixture/runtime evidence changes.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: pre-existing R1/M2/K1 backend launch-hardening diffs.

## Confirmed Facts

- The local backend was available at the canonical health endpoint:
  `GET http://127.0.0.1:8010/api/v1/health` returned
  `{"status":"ok","service":"fitaly-backend",...}`.
- A temporary return to UI-form login was tested with the backend available and
  still failed to reach Home reliably, so it was not kept.
- A temporary removal of the E2E token bridge was tested and produced backend
  `401 Authentication required` failures during local seed/API bootstrap, so it
  was not kept.
- Known Patterns fixture content needed unique ingredient names per seed because
  the backend K1 identity now uses content signatures; repeating identical
  fixture content after dismiss correctly suppresses the same subject.
- Known Patterns remains production-off by default and is enabled only for the
  targeted local runtime flow.

## Behavior Before

- Local Known Patterns runtime evidence could be confused with environment
  failures when the backend was not running.
- UI-form login was flaky for local Maestro after backend/emulator startup.
- The E2E seed/API path could run before native Firebase `currentUser` was
  available, causing authenticated backend calls to miss a bearer token.
- Repeated Known Patterns seed attempts could reuse the same content signature
  and be suppressed after a dismiss.

## Behavior After

- The local runtime runner performs an API health check against the configured
  backend before Maestro starts.
- Shared Maestro login uses an E2E-only deep link and waits for
  `e2e-ready-home` before asserting `tab-home`.
- E2E session/token handling is gated by E2E mode and local emulator config.
- Known Patterns seed content includes a per-seed token in ingredient names, so
  repeated seeds have distinct content signatures.
- The local Known Patterns runtime flow passes against the current local
  backend/emulator setup.

## Verification

```bash
curl -fsS http://127.0.0.1:8010/api/v1/health
```

Result: passed; returned `{"status":"ok","service":"fitaly-backend",...}`.

```bash
npm run typecheck
```

Result: passed.

```bash
npm run test:targeted -- src/services/core/apiClient.test.ts src/services/e2e/authSession.test.ts src/context/AuthContext.test.tsx src/services/user/userProfileRepository.test.ts src/services/e2e/deepLink.test.ts src/navigation/AppNavigator.test.ts src/services/e2e/fixtures.test.ts src/services/core/runtimeConfig.test.ts src/services/core/apiVersioning.test.ts src/services/core/envValidation.test.ts src/services/core/errorLogger.test.ts src/services/reminders/reminderService.test.ts src/services/telemetry/telemetryClient.test.ts src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx
```

Result: passed, `14` suites / `209` tests.

```bash
npm run lint
```

Result: passed.

```bash
npm run e2e:known-pattern-runtime -- --validate
```

Result: passed, `1` flow validated.

```bash
bash -n scripts/run-e2e-local.sh
```

Result: passed.

```bash
git diff --check
```

Result: passed.

```bash
env E2E_EXPO_CLEAR_CACHE=1 E2E_EXPO_PORT=8099 E2E_PLATFORM=ios E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 E2E_API_BASE_URL=http://127.0.0.1:8010 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS=true EXPO_PUBLIC_ENABLE_TELEMETRY=false E2E_ARTIFACT_DIR=/private/tmp/fitaly-k1c-known-pattern-runtime-resume-1 E2E_RESULTS_DIR=/private/tmp/fitaly-k1c-known-pattern-runtime-resume-1/reports E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-k1c-known-pattern-runtime-resume-1/logs E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-k1c-known-pattern-runtime-resume-1/screenshots npm run e2e:known-pattern-runtime
```

Result: passed, `known-pattern-review-draft` `1/1` in `25s`.

Runtime JUnit:

- `/private/tmp/fitaly-k1c-known-pattern-runtime-resume-1/reports/release-gate-known-pattern-review-draft.xml`
- repo-owned snapshot:
  `reports/k1c-known-pattern-runtime-artifacts/release-gate-known-pattern-review-draft.xml`

The Maestro command artifact confirms:

- E2E app booted;
- `fitaly://e2e/reset?logout=1` reached login readiness;
- `fitaly://e2e/login?...` reached `e2e-ready-home` and `tab-home`;
- Known Pattern candidate seed reached
  `e2e-ready-knownPattern-candidate`;
- the Known Pattern card, review button and dismiss button appeared;
- dismiss hid the card;
- a second seed showed a Known Pattern card again;
- review opened `review-meal-screen` with `review-meal-save-button`.

## Independent QA

Independent QA verdict: `QA_PASS_WITH_GAPS`.

QA reran:

- `git diff --check` in `fitaly`: passed.
- `git diff --check` in `fitaly-backend`: passed.
- `bash -n scripts/run-e2e-local.sh`: passed.
- `npm run e2e:known-pattern-runtime -- --validate`: passed, `1` flow
  validated.

QA findings:

- Non-blocking gap: this K1C report did not exist before the QA pass.
- Non-blocking gap: runtime evidence is credible but the original `/private/tmp`
  artifact does not itself record the full API/emulator environment; this report
  captures the exact command/env and the runner guard.

QA confirmed:

- E2E login/session/token handling is E2E-gated.
- App deep-link handling is active only in E2E mode.
- The API token fallback only returns an E2E token through the gated token
  reader.
- Known Patterns remains production-off by default/backend gate.
- The local runner enables Known Patterns only for the targeted flow and refuses
  the implicit smoke API for that flow without explicit owner authorization.
- Known Pattern seed readiness is backend-backed through remote meal writes and
  candidate polling.

## Unverified Areas

- No Android runtime.
- No production, smoke-provider, RevenueCat, Sentry, or real credential path.
- No Home Next Action integration.
- No clean-worktree RC artifact.

## Controller Decision

K1C is locally accepted with `QA_PASS_WITH_GAPS`.

K1 Known Patterns identity/runtime gate is locally accepted after K1A, K1B and
K1C. Known Patterns production activation remains off until Q0 release evidence
and explicit feature rollout authorization.

Current overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
