# Runtime Config

Minimalny kontrakt mobile/backend dla launch-critical srodowisk Fitaly. Nie zapisuj tu sekretow.

## Environment Matrix

| Contract env | Mobile profile | Mobile API base URL | Backend Railway env | Backend `ENVIRONMENT` | Kluczowe oczekiwania |
| --- | --- | --- | --- | --- | --- |
| `prod` | `production` | `https://fitaly-backend-production.up.railway.app` | `prod` | `production` | Telemetry on, Smart Reminders on, billing enabled, production RevenueCat/Firebase/OpenAI/Sentry secrets, `EAGER_FIREBASE_INIT=true`. |
| `smoke` | `smoke`, czasem `internal`/`e2e-test` | `https://fitaly-backend-smoke.up.railway.app` | `smoke` | `production` | Launch-like behavior, telemetry/reminders/billing enabled, sandbox/smoke secrets, smoke backend health and flow contracts. |
| `dev/local` | local Expo/dev-client; EAS `development` extends smoke unless overridden | `http://localhost:8000/` dla lokalnego CLI albo smoke URL dla zdalnego dev-client profile | local backend | `local` lub `development` | Telemetry default off locally, billing may be disabled, secrets optional unless tested locally. |

## Sanity Gate

Mobile `scripts/check-launch-readiness.mjs` sprawdza niesekretne czesci kontraktu:

- smoke i production maja telemetry enabled,
- smoke i production maja Smart Reminders enabled,
- smoke i production maja billing enabled,
- profile dev/smoke wskazuja smoke backend, production wskazuje production backend.

Komendy:

```bash
cd fitaly
npm run check:runtime-config
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

`check:runtime-config` sprawdza smoke runtime contract. Produkcyjne komendy sprawdzaja dodatkowo legal URLs, build artifact, Android target SDK, Firebase config, RevenueCat keys, iOS App Store bundle identifier `com.lkurczab.foodscannerai` oraz runtime contract z `eas.json`.

## Smoke Checklist Po Zmianach Runtime Config

1. Sprawdz `fitaly/eas.json` dla smoke API URL, telemetry, reminders, billing i `SENTRY_ENVIRONMENT=smoke`.
2. Sprawdz Railway smoke env: `ENVIRONMENT=production`, `SENTRY_ENVIRONMENT=smoke`, telemetry/reminders/weekly reports wlaczone oraz AI flags: `AI_CHAT_ENABLED=true`, `AI_MEAL_ANALYSIS_ENABLED=true`, `AI_GATEWAY_ENABLED=true`.
   `AI_MEAL_ANALYSIS_ENABLED` wlacza v1 Add Meal photo/text analysis; `AI_GATEWAY_ENABLED=false` omija tylko gateway enforcement/logging.
3. Potwierdz, ze smoke uzywa oddzielnych albo jawnie ograniczonych sekretow/API quota. Smoke domyslnie moze miec `EAGER_FIREBASE_INIT=false` dla lekkiego runtime; ustaw `true` tylko dla celowego Firestore startup readiness check.
4. Zbuduj albo uruchom smoke profile i potwierdz, ze app wskazuje smoke backend.
5. Sprawdz health:
   - `GET https://fitaly-backend-smoke.up.railway.app/api/v1/health`
   - deep Firestore health tylko dla celowego infra readiness check.
6. Gdy sa smoke credentials, uruchom flow-contract checks:
   - mobile `node scripts/verify-smoke-flow-contracts.mjs`
   - mobile `node scripts/verify-smoke-export.mjs`
   - backend `python scripts/check-flow-contracts.py --base-url https://fitaly-backend-smoke.up.railway.app --env smoke`

## Bounded Provider Smoke Matrix

Live/provider smoke is optional, intentional operator evidence. It is not part
of default local checks, pytest, CI, Maestro release-gate, full-review, or
flow-contract acceptance unless the release owner explicitly schedules a
bounded run. Routine acceptance remains emulator-backed, mocked/provider-fake,
contract-tested, and Maestro-verified.

Provider smoke never replaces:

- backend pytest plus Firestore/Storage emulator evidence,
- backend mocked/provider-fake tests, including existing RevenueCat webhook
  behavior tests,
- mobile static/unit/contract checks,
- Maestro simulator gates for release-critical journeys.

Evidence must not use production users, production data, uncontrolled provider
spend, raw prompts, raw provider responses, raw images, raw tokens, auth
headers, request bodies, response bodies, or user-authored text. Release
artifacts may record only endpoint/check name, status, latency, request/run id,
structured error code, disposable smoke user id, and other sanitized
operational metadata.

| Surface | Command or manual check | Required env/secrets | Max calls/events per scheduled run | Cleanup/redaction | Expected pass/fail behavior | Evidence role |
| --- | --- | --- | --- | --- | --- | --- |
| OpenAI Chat/Add Meal wiring | Manual bounded authenticated call against smoke or local backend AI endpoint; no default script is currently designated for live OpenAI. | Smoke/local backend URL; smoke-only or quota-limited `OPENAI_API_KEY`; `AI_CHAT_ENABLED=true`; `AI_MEAL_ANALYSIS_ENABLED=true`; `AI_GATEWAY_ENABLED=true`; non-production Firebase/Firestore such as `FIRESTORE_DATABASE_ID=fitaly-smoke`; disposable authenticated smoke user. | Max 2 total OpenAI provider calls. Preferred: 1 Chat v2 text run and 1 Add Meal text-meal analysis. Photo analysis is avoided by default; owner may replace the text-meal call with 1 photo analysis only when image cleanup/redaction is the purpose. | Delete disposable smoke user/thread/meal data when applicable. Do not attach prompts, responses, images, request/response bodies, tokens, or raw provider payloads. | Pass if endpoint returns structured success with valid run/usage/credit/request metadata, or a structured product-safe provider error. Fail if raw provider text leaks, credits/provider charging is ambiguous, or the check depends on nutrition answer wording. | Wiring-only rehearsal, not acceptance evidence. |
| RevenueCat sandbox app purchase / restore | Manual sandbox purchase or restore in RC smoke build/profile. Backend webhook acceptance remains emulator/mocked evidence unless owner schedules a real sandbox webhook. | RC smoke/mobile profile with sandbox offerings; sandbox Apple/Google tester; disposable smoke app user; smoke backend if entitlement sync is checked. | Max 1 sandbox purchase or restore attempt per platform under review. Max 1 resulting webhook event per attempt when webhook delivery is part of the rehearsal. | Remove/reset sandbox entitlement state for the disposable user where possible. Redact RC subscriber ids, transaction ids, receipts, auth headers, payload bodies, and app-user identifiers except sanitized smoke id. | Pass if paywall/restore reaches an explicit success or product-safe failure state and any webhook processing is observable without raw receipt/payload evidence. Fail if production offerings/users are used, entitlement state is ambiguous, or emulator/mocked payment gates are treated as replaceable. | Wiring-only rehearsal; Maestro paywall and backend RevenueCat webhook tests remain acceptance evidence. |
| RevenueCat webhook boundary | Local non-live baseline: `cd fitaly-backend && ./.venv/bin/python scripts/run-backend-evidence.py --base-url http://127.0.0.1:8000`. Optional real sandbox webhook delivery is manual and owner-scheduled. | Local backend for baseline. For optional sandbox webhook: smoke backend URL, configured webhook secret, RC sandbox project, disposable user. | Local baseline sends 1 invalid-secret webhook request and must not process entitlement state. Optional sandbox delivery: max 1 webhook event. | Keep generated evidence sanitized. Redact webhook secret, Authorization, receipts, payload body, transaction id, and subscriber id. | Pass if invalid-secret request returns explicit reject/unconfigured behavior locally, or sandbox webhook produces one observable entitlement update/error without leaking payload. Fail if webhook accepts invalid secret or live webhook is used as the only payment proof. | Local baseline is request evidence; real sandbox delivery is wiring-only rehearsal. |
| Railway health / smoke backend readiness | `cd fitaly-backend && bash scripts/check-health-endpoint.sh smoke-health https://fitaly-backend-smoke.up.railway.app/api/v1/health 2000`. Deep Firestore health only for intentional infra readiness. | Smoke Railway deployment; no user secrets for lightweight health. Deep Firestore health requires smoke backend env only, not production data. | Max 1 lightweight health request and max 1 deep Firestore health request when intentionally scheduled. | Do not attach response bodies if they include env details beyond status/version. Record status and latency only. | Pass if lightweight health returns HTTP 200 with `status=ok|healthy` inside latency threshold. Fail if startup depends on external providers or deep health is required for normal liveness. | Wiring/readiness rehearsal; not a substitute for backend tests or emulator evidence. |
| Railway authenticated flow contracts | Backend: `cd fitaly-backend && python scripts/check-flow-contracts.py --base-url https://fitaly-backend-smoke.up.railway.app --env smoke`. Mobile equivalents: `cd fitaly && node scripts/verify-smoke-flow-contracts.mjs` and `cd fitaly && node scripts/verify-smoke-export.mjs`. | `FIREBASE_WEB_API_KEY`; `SMOKE_EXPORT_TEST_EMAIL`; `SMOKE_EXPORT_TEST_PASSWORD`; optional `SMOKE_API_BASE_URL`; optional `MAX_FLOW_LATENCY_MS`; optional `WEEKLY_EXPECTED_STATUS`. Disposable smoke user only. | Backend script: 1 Firebase sign-in, 1 export, 1 AI credits, 1 weekly report request. Mobile flow script: 1 sign-in, 1 AI credits, 1 weekly report request. Mobile export script: 1 sign-in, 1 export request. No provider-generation calls are expected. | Delete/reset disposable smoke data if the account is not meant to persist. Redact email, Firebase token, auth headers, export bodies, and response bodies. Mobile summaries emit `smokeUserRef` only, plus endpoint names, status, latency, tier, counts. | Pass if contract shapes, expected weekly status, and latency thresholds match. Fail if required smoke env is missing, auth fails, response shape drifts, or production user/data is used. | Smoke contract rehearsal. Acceptance still requires local/backend contract tests, emulator evidence, and Maestro gates. |
| Telemetry ingest | Local baseline: `cd fitaly-backend && ./.venv/bin/python scripts/run-backend-evidence.py --base-url http://127.0.0.1:8000`. Optional smoke ingest check may POST one synthetic batch to `/api/v2/telemetry/events/batch` only when owner-scheduled. | Local backend baseline needs no live telemetry secret. Optional smoke check needs smoke backend URL, telemetry enabled for smoke, disposable anonymous/session ids, and no production user data. | Local baseline sends 1 synthetic telemetry batch. Optional smoke check sends max 1 synthetic batch with max 1 event. | Delete or allow documented smoke retention for synthetic event only. Redact device ids, IPs, auth tokens, raw request/response body, and any user-authored props. | Pass if enabled telemetry returns accepted behavior or disabled telemetry returns explicit degraded/disabled behavior. Fail if telemetry silently falls back, logs raw payloads, or requires production data. | Local baseline is request evidence; smoke ingest is wiring-only rehearsal, not telemetry export/delete acceptance. |
| Backend/mobile flow-contract checks | Same commands as Railway authenticated flow contracts above. These checks are listed separately because they validate backend/mobile contract shape, not provider behavior. | Same smoke Firebase and disposable user env as above. | Same request budgets as above; no live OpenAI, RC purchase, or other provider-generation call. | Same redaction and disposable-user cleanup rules as above. | Pass if shape/status/latency contracts match. Fail on drift, missing env, auth failure, or unsafe evidence capture. | Smoke contract rehearsal only. |

## Zrodla

Kontrakt zostal skondensowany z dawnych dokumentow mobilnych i backendowych. Szczegoly backend-only pozostaja w backendowym runtime-config.
