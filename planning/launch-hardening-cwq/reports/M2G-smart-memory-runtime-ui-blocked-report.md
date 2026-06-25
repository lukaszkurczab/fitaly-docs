# M2G Smart Memory Runtime UI Evidence Report

Status: `qa_passed`
Created: `2026-06-21T15:38:45Z`
Updated: `2026-06-21T17:02:43Z`

## Scope

M2G is the runtime UI evidence slice for the M2 Smart Memory controls/apply
gate. The original slice was limited to proving existing Smart Memory Maestro
flows in a local, non-provider runtime with Smart Memory enabled only for E2E.
This update supersedes the earlier disk-blocked attempt after local disk was
freed and the controller repaired two local-only runtime blockers.

Non-goals:

- no Smart Memory production activation;
- no smoke or production provider access;
- no Firebase, RevenueCat, Sentry, bundle ID, package ID, or secret changes;
- no broad auth-form, release-gate, or production feature refactor.

## Repo Snapshot

Before repair/evidence closeout:

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state: dirty with intended local repair files:
  - `e2e/maestro/smoke/login.yaml`
  - `src/services/e2e/deepLink.ts`
  - `src/services/e2e/deepLink.test.ts`
  - branch `ahead 5` of `origin/codex/smart-memory-core-loop-fe`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state: dirty with intended local emulator repair files:
  - `app/db/firebase.py`
  - `tests/test_firebase.py`

## Confirmed Facts

- `npm run e2e:release-gate -- --validate` passed:
  `release-gate: 40 flow(s) validated`.
- Local disk pressure was no longer the active blocker after cleanup; the
  rerun environment had about `31GiB` free.
- Active release-gate contains Smart Memory UI flows:
  - `e2e/maestro/release-gate/memory-center-controls.yaml`
  - `e2e/maestro/release-gate/memory-center-sync-failed.yaml`
  - `e2e/maestro/release-gate/memory-center-offline-active.yaml`
  - `e2e/maestro/release-gate/review-memory-explanation.yaml`
  - `e2e/maestro/release-gate/review-memory-disabled-precedence.yaml`
  - `e2e/maestro/release-gate/review-memory-new-candidate-row.yaml`
  - `e2e/maestro/release-gate/smart-memory-backend-pull.yaml`
- `scripts/run-e2e-local.sh` auto-enables
  `EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION=true` only for Review-memory
  flows. Smart Memory itself must be explicitly enabled for local E2E with
  `EXPO_PUBLIC_ENABLE_SMART_MEMORY=true`.
- Local runtime prerequisites were available or started without using smoke or
  production providers:
  - booted iOS simulator: `Fitaly-MJ050`
    `D046BCAF-0BDE-4025-BBB5-965E5E954D58`;
  - Maestro version: `2.6.1`;
  - existing Firestore emulator on `127.0.0.1:8080`;
  - started local Auth emulator on `127.0.0.1:9099`;
  - started separate local backend on `127.0.0.1:8010` with
    `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` and
    `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`;
  - local backend health returned `{"status":"ok","service":"fitaly-backend"}`;
  - `scripts/seed_smart_memory_backend_e2e.py` seeded local emulator auth and
    Smart Memory state for `e2e@example.com`.
- No production API, smoke API, provider credentials, or production data were
  used.
- Shared Maestro login was repaired for local E2E by replacing unstable login
  form typing in `e2e/maestro/smoke/login.yaml` with the E2E-only
  `fitaly://e2e/login` deep link. The deep link is gated by
  `isE2EModeEnabled()` and calls the real mobile `authLogin` path.
- Local backend profile bootstrap against Firebase Auth/Firestore emulators was
  repaired by initializing Firebase Admin with `AnonymousCredentials` when
  `ENVIRONMENT` is `local` or `development`, a local Firestore or Storage
  emulator env var is set, and no service-account credentials are configured.
  Production/no-emulator initialization, production data-emulator
  initialization, and auth-emulator-only initialization still require the
  existing configured credentials path.

## Runtime Command Attempted

```bash
env E2E_EXPO_PORT=8099 E2E_PLATFORM=ios \
  E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 \
  E2E_API_BASE_URL=http://127.0.0.1:8010 \
  FIREBASE_PROJECT_ID=demo-fitaly-local \
  FIRESTORE_DATABASE_ID='(default)' \
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 \
  EXPO_PUBLIC_ENABLE_SMART_MEMORY=true \
  EXPO_PUBLIC_ENABLE_TELEMETRY=false \
  E2E_RESULTS_DIR=/private/tmp/fitaly-m2g-runtime/reports \
  E2E_RESULTS_PATH=/private/tmp/fitaly-m2g-runtime/results.xml \
  E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-m2g-runtime/screenshots \
  E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-m2g-runtime/logs \
  E2E_SUITE_NAME=m2g-smart-memory-local \
  E2E_CONTINUE_ON_FAILURE=1 \
  bash scripts/run-e2e-local.sh \
    e2e/maestro/release-gate/memory-center-controls.yaml \
    e2e/maestro/release-gate/memory-center-sync-failed.yaml \
    e2e/maestro/release-gate/memory-center-offline-active.yaml \
    e2e/maestro/release-gate/review-memory-explanation.yaml \
    e2e/maestro/release-gate/review-memory-disabled-precedence.yaml \
    e2e/maestro/release-gate/review-memory-new-candidate-row.yaml \
    e2e/maestro/release-gate/smart-memory-backend-pull.yaml
```

## Repair Verification

Targeted local gates passed before accepting the Maestro rerun:

- Mobile: `npm run test:targeted -- src/services/e2e/deepLink.test.ts`
  passed (`12` tests).
- Mobile: `npm run typecheck` passed.
- Backend:
  `./.venv/bin/pytest tests/test_firebase.py tests/test_api_ai_auth.py -q`
  passed (`11` tests after the auth-emulator-only and production data-emulator
  fail-fast regressions were added).
- Backend: `./.venv/bin/ruff check app/db/firebase.py tests/test_firebase.py`
  passed.
- Backend: `./.venv/bin/pyright` passed (`0` errors).
- Backend: `./.venv/bin/python -m compileall app` passed.
- Backend: `./.venv/bin/pytest -q` passed
  (`1324` passed, `36` skipped, `3` warnings).
- Manual local auth/profile contract against local Auth emulator, Firestore
  emulator and backend `8010` passed:
  `GET /api/v1/users/me/profile` returned `200` for `e2e@example.com`.
- Focused shared Maestro login repair passed:
  `e2e/maestro/smoke/login.yaml` passed in `25s`.

## Runtime Results

The first repaired M2G run used local Auth/Firestore/backend emulators and no
smoke/prod provider access. Result: `6/7` flows passed.

Passed:

- `memory-center-controls.yaml` passed in `1m21s`.
- `memory-center-sync-failed.yaml` passed in `44s`.
- `memory-center-offline-active.yaml` passed in `43s`.
- `review-memory-explanation.yaml` passed in `37s`.
- `review-memory-disabled-precedence.yaml` passed in `37s`.
- `review-memory-new-candidate-row.yaml` passed in `41s`.

Failed:

- `smart-memory-backend-pull.yaml` failed on
  `e2e-ready-smartMemory-backendPull`.

Failure classification: local backend configuration issue, not evidence of a UI
product failure. Manual API checks showed Smart Memory endpoints returned
`503 {"code":"smart_memory_disabled"}` because the local backend was started
without `SMART_MEMORY_ENABLED=true`.

After restarting the local backend with `SMART_MEMORY_ENABLED=true`, manual API
checks returned `200` for:

- `/api/v2/users/me/smart-memory/items?limit=100`, including seeded item
  `e2e-memory-portion-yogurt`;
- `/api/v2/users/me/smart-memory/settings`, with `enabled: true`.

The isolated backend-pull flow then passed:

- `smart-memory-backend-pull.yaml` passed in `37s`.

Artifacts:

- Shared login pass: `/private/tmp/fitaly-login-repair-3`
- M2G repaired `6/7` run:
  `/private/tmp/fitaly-m2g-runtime-2`
- Backend-pull rerun:
  `/private/tmp/fitaly-m2g-backend-pull`

## Independent QA

Independent QA returned `QA_PASS_WITH_GAPS` after a focused re-check of the
final backend hardening patch.

Accepted non-blocking gaps:

- In `local`/`development`, `FIREBASE_STORAGE_EMULATOR_HOST` alone can permit
  anonymous Firebase Admin initialization; a later Firestore call without
  `FIRESTORE_EMULATOR_HOST` would fail at use. Production is protected by the
  `ENVIRONMENT` gate. This is acceptable for M2G because M2G uses the Firestore
  emulator explicitly.
- The re-QA did not rerun Maestro; it reviewed the final backend credential
  hardening patch. The controller had already run the M2G Maestro evidence
  before the backend guard tightening.
- The global E2E service imports the Auth feature service to exercise the real
  login path. This is boundary debt but not a blocker for the E2E-gated repair.
- `login.yaml` fails bad login by readiness timeout rather than a targeted
  `e2e-error-*` assertion. Login errors remain observable in-app through the
  E2E status markers.

## Classification

M2G local runtime UI evidence is `qa_passed` with accepted non-blocking gaps.

The blocking Maestro path for M2G is repaired, and all seven targeted Smart
Memory runtime UI flows have passed locally across the repaired combined run
plus the isolated backend-pull rerun. Independent QA found no blocking issues
after the credential guard repair.

Smart Memory production flags must stay off.

## Acceptance Criteria For M2 Closure

- independent QA reviews the mobile and backend repair diffs;
- independent QA reruns or accepts the targeted local gates above;
- the local M2G runtime setup starts backend-pull with
  `SMART_MEMORY_ENABLED=true`;
- no smoke/prod provider access or production credentials are used;
- no Firebase credentials, RevenueCat keys, Sentry tokens, bundle IDs, package
  IDs, or production flags are changed.

## Stop Conditions

- Stop if runtime requires smoke/prod providers or real credentials.
- Stop if local Auth/Firestore/backend cannot be configured without production
  credentials.
- Stop if disk pressure reappears before Maestro can complete assertions.
- Stop if any flow fails for an unexplained product/runtime reason.
- Stop if auth-form text-entry flows become part of the active gate; this
  repair proves the shared M2G login bootstrap, not full login-form UI typing.

## Controller Decision

M2G: `qa_passed` with accepted non-blocking gaps.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
