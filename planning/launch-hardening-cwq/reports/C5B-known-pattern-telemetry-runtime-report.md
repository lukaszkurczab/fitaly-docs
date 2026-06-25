# C5B Known Patterns Telemetry Runtime Report

Status: qa_passed  
Controller: Codex  
Updated: 2026-06-22T21:12:22Z

## Scope

C5B covers Known Patterns telemetry only. The slice adds privacy-safe mobile
instrumentation for Known Pattern candidate exposure/review/dismiss actions,
extends the shared C5 telemetry contract, and proves local runtime event
delivery through backend daily summary.

Non-goals:

- No Known Patterns production activation.
- No Home Next Action implementation or activation.
- No smoke/prod/provider credentials or production data access.
- No Recipe Catalog/Food Library/Smart Memory rollout decision changes.

## Confirmed Facts

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD during this slice: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend HEAD during this slice: `6565a21514261444e9fed278296ef0e27b678e93`
- Both repos remain dirty with broader launch-hardening work in progress.
- Local backend runtime used for final C5B evidence was an isolated process on
  `http://127.0.0.1:8011` with:
  - `ENVIRONMENT=local`
  - `FIREBASE_PROJECT_ID=demo-fitaly-local`
  - `FIRESTORE_DATABASE_ID=(default)`
  - `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`
  - `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`
  - `EAGER_FIREBASE_INIT=false`
  - `TELEMETRY_ENABLED=true`
  - `KNOWN_PATTERNS_ENABLED=true`
- Existing local backend on `127.0.0.1:8010` was not used for final C5B
  telemetry evidence because mobile `.env` and backend `.env` defaults had
  telemetry disabled or smoke-like database settings.

## Root Cause From Resume

The earlier Maestro/runtime failure was not navigation or login:

- With backend disabled, E2E seed/API calls failed before meaningful runtime
  evidence could be produced.
- After starting a backend, the first C5B telemetry run failed at
  `e2e-ready-telemetryBaseline-knownPatternCandidateDismissed` with
  `e2e-error:seed-api-http-error`.
- A safe local backend on port `8011` moved the failure to final telemetry
  assertion, proving auth/navigation/backend availability were no longer the
  blocker.
- Diagnostic E2E showed `telemetryRuntime=telemetryEnabled` failed because
  `scripts/run-e2e-local.sh` sourced mobile `.env` after caller env was passed;
  local `.env` had `EXPO_PUBLIC_ENABLE_TELEMETRY=false`, overriding explicit
  `EXPO_PUBLIC_ENABLE_TELEMETRY=true`.
- Runner precedence was repaired so explicit caller env values for E2E,
  Expo public flags and Firebase emulator settings survive `.env` sourcing.

Rejected as unnecessary after evidence:

- Reverting to UI-form Maestro login: tested earlier with backend available and
  did not reliably reach Home; reverted.
- Removing the E2E token bridge: caused local seed/API auth failures; reverted.

Retained as necessary:

- E2E-only login/session/token bridge and Firebase project override for local
  emulator-backed runtime tests.
- Unique Known Pattern fixture content per seed, because K1 content-signature
  identity requires unique ingredient names/quantified content across repeated
  local runs.
- Runner guard against implicit smoke API for Known Patterns runtime flows.
- Runner caller-env precedence repair.

## Intentional C5B Changes

Mobile:

- `src/services/telemetry/telemetryTypes.ts`
  - Added `known_pattern_candidate_shown`,
    `known_pattern_review_started`, and
    `known_pattern_candidate_dismissed`.
- `src/services/telemetry/telemetryInstrumentation.ts`
  - Added bounded Known Patterns C5 helpers with only:
    `surface`, `confidenceBucket`, `sourceCountBucket`, `actionResult`, and
    `featureState`.
- `src/feature/Meals/hooks/useMealAddMethodState.ts`
  - Emits candidate shown/review started/dismissed telemetry from successful
    Known Pattern runtime paths.
  - Review/dismiss action telemetry awaits enqueue best-effort so immediate E2E
    flush/summary assertions do not race an ignored Promise.
- `src/services/e2e/fixtures.ts`
  - Adds Known Pattern telemetry baseline/assert support.
  - Adds E2E-only telemetry runtime diagnostics and controlled diagnostic emit
    support for future false-negative triage.
- `scripts/run-e2e-local.sh`
  - Preserves explicit caller env over `.env` for E2E/API/Firebase/Expo public
    flags.
  - Enables Known Patterns runtime flags for known-pattern runtime flows.
  - Enables mobile telemetry automatically for the Known Patterns telemetry
    runtime flow, so local `.env` cannot silently leave the tested runtime with
    `EXPO_PUBLIC_ENABLE_TELEMETRY=false`.
  - Refuses implicit smoke API for Known Patterns runtime flows unless explicitly
    authorized.
- `e2e/maestro/release-gate/known-pattern-runtime-telemetry.yaml`
  - Asserts mobile runtime flags `telemetryEnabled` and `knownPatternsEnabled`
    before baseline.
  - Proves dismissing a Known Pattern candidate increases backend telemetry
    summary for `known_pattern_candidate_dismissed`.
- `scripts/e2e/suites.json` and `package.json`
  - Adds `known-pattern-telemetry` suite/script.
- Mobile/backend `c5_new_domain_telemetry.json` fixtures and contract alignment
  tests updated with byte-identical Known Patterns telemetry definitions.

Backend:

- `app/schemas/telemetry.py`
  - Adds three Known Patterns events to the telemetry allowlist.
  - Allows only bounded props.
  - Restricts Known Pattern confidence to `medium`/`high`; backend no longer
    accepts Smart Memory's broader `low` bucket for Known Patterns.
- `tests/test_api_telemetry.py`
  - Accepts valid Known Patterns C5 events.
  - Rejects unbounded Known Pattern surface/count/confidence enum values.
  - Rejects Known Pattern privacy/raw identity props including
    `candidateId`, `subjectKeyHash`, `createdByRuleVersion`, `sourceHash`,
    `sourceRefs`, raw prompt/response/reason, meal/ingredient names and notes.
- `tests/test_contract_alignment.py`
  - Aligns backend expectations with the updated shared fixture.

## Privacy Contract

Allowed Known Patterns props are bounded and content-free:

- `surface`: `meal_add_method`
- `confidenceBucket`: `medium` or `high`
- `sourceCountBucket`: `3_4` or `5_plus`
- `actionResult`: `succeeded`, `queued`, `blocked`, or `failed` where relevant
- `featureState`: `enabled`, `disabled`, or `shadow`

Rejected/non-emitted:

- `candidateId`
- `subjectKeyHash`
- `createdByRuleVersion`
- `sourceHash`
- `sourceRefs`
- meal names, ingredient names, notes, raw reason, raw prompt, raw response
- exact counts or exact confidence scores

## Verification

Mobile:

- `npm run typecheck` - pass.
- `npm run lint` - pass.
- `npm run test:targeted -- src/services/e2e/fixtures.test.ts src/services/e2e/deepLink.test.ts src/feature/Meals/hooks/useMealAddMethodState.test.ts src/services/telemetry/telemetryInstrumentation.test.ts src/__contract_fixtures__/contractAlignment.test.ts` - pass, 5 suites / 181 tests.
- `npm run e2e:known-pattern-telemetry -- --validate` - pass, 1 flow validated.
- `bash -n scripts/run-e2e-local.sh` - pass.
- `git diff --check` - pass.

Backend:

- `./.venv/bin/pytest tests/test_api_telemetry.py tests/test_contract_alignment.py -q` - pass, 180 tests.
- `./.venv/bin/ruff check app/schemas/telemetry.py tests/test_api_telemetry.py tests/test_contract_alignment.py` - pass.
- `./.venv/bin/pyright` - pass, 0 errors.
- `git diff --check` - pass.

Cross-repo:

- `cmp -s fitaly/src/__contract_fixtures__/c5_new_domain_telemetry.json fitaly-backend/tests/contract_fixtures/c5_new_domain_telemetry.json` - pass.

Runtime:

- Started isolated backend:
  `env ENVIRONMENT=local FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= EAGER_FIREBASE_INIT=false TELEMETRY_ENABLED=true KNOWN_PATTERNS_ENABLED=true ./.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8011`
- Health check: `curl -fsS http://127.0.0.1:8011/api/v1/health` - pass.
- Diagnostic temporary flow after runner repair:
  `bash scripts/run-e2e-local.sh e2e/maestro/release-gate/_tmp-c5b-telemetry-diagnostic.yaml`
  - pass, 1/1; temporary flow removed after use.
- Final runtime:
  `npm run e2e:known-pattern-telemetry` with local backend/emulators and no
  explicit `EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS` or
  `EXPO_PUBLIC_ENABLE_TELEMETRY` passed by the caller - pass, 1/1,
  `known-pattern-runtime-telemetry` in 25s.
- Backend log for final run showed:
  - `POST /api/v2/users/me/known-patterns/candidates/.../control` - `200 OK`
  - `POST /api/v2/telemetry/events/batch` - `202 Accepted`
  - `GET /api/v2/telemetry/events/summary/daily?days=1` - `200 OK`
- Repo-owned JUnit snapshot:
  `reports/c5b-known-pattern-telemetry-artifacts/release-gate-known-pattern-runtime-telemetry.xml`
  records 1 test, 0 failures.

## QA

Initial independent QA returned `pass_with_gaps`:

- P2: runtime evidence was not self-contained because the suite did not force
  mobile telemetry on and did not assert telemetry runtime flags.
- P3: Known Patterns telemetry allowed `home_next_action` even though C5B only
  emits `meal_add_method` and H1 is not in scope.
- P3: deep-link unit coverage did not include new diagnostic seed params.

Controller repairs:

- `known-pattern-runtime-telemetry.yaml` now asserts
  `telemetryRuntime=telemetryEnabled` and
  `telemetryRuntime=knownPatternsEnabled` before baseline.
- `run-e2e-local.sh` now sets mobile telemetry on for the Known Patterns
  telemetry flow.
- Known Patterns C5 surface is narrowed to `meal_add_method` across mobile,
  backend and shared fixtures.
- `deepLink.test.ts` now covers `telemetryEmit` and `telemetryRuntime` query
  propagation.
- Fresh final runtime evidence was generated without caller-provided
  `EXPO_PUBLIC_ENABLE_TELEMETRY` or `EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS`.

Re-QA returned `pass` with no findings. Controller accepted C5B as
`qa_passed`. Residual unverified areas are unchanged and out of C5B scope.

## Unverified Areas

- No smoke/prod runtime telemetry run; not authorized in this packet.
- No production Firebase, RevenueCat, Sentry, provider, or store credential use.
- No Home Next Action telemetry runtime evidence.
- No full release readiness decision; Q0 remains blocked by external evidence
  and dirty worktrees.

## Controller Decision

Controller result: pass.  
Readiness decision remains `BLOCKED_EXTERNAL_DEPENDENCY`; this slice does not
authorize Known Patterns production activation.
