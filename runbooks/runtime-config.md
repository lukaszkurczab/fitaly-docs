# Runtime Config

Status: aktywny
Last reconciled: 2026-06-25

Minimalny kontrakt mobile/backend dla launch-critical środowisk Fitaly. Nie
zapisuj tu sekretów ani pełnych environment dumpów.

## Environment matrix

| Contract env | Mobile profile | Mobile API base URL | Backend env | Backend `ENVIRONMENT` | Kluczowe oczekiwania |
| --- | --- | --- | --- | --- | --- |
| `prod` | `production` | `https://fitaly-backend-production.up.railway.app` | Railway prod | `production` | Telemetry, AI, reminders, weekly reports i billing on; 1.1 off; production secrets |
| `smoke` | `smoke`, czasem `internal`/`e2e-test` | `https://fitaly-backend-smoke.up.railway.app` | Railway smoke | `production` | Launch-like behavior, sandbox/ograniczone secrets, 1.1 off |
| `dev/local` | local Expo/dev-client | `http://localhost:8000/` albo jawny smoke URL | local | `local`/`development` | Telemetry/billing mogą być wyłączone; emulatory i fake providers do testów deterministycznych |

## Mobile sanity gate

```bash
cd fitaly
npm run check:runtime-config
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Produkcyjne checki powinny sprawdzać co najmniej:

- API URL;
- legal URLs;
- build artifact;
- Android target SDK;
- Firebase config;
- RevenueCat keys;
- iOS App Store bundle identifier;
- Sentry config;
- launch-like flags;
- 1.1 production-off.

Brak sekretu w lokalnym repo nie jest błędem sam w sobie. Brak wymaganego sekretu
w EAS/Railway/CI release environment jest blockerem.

## Smoke checklist

1. Sprawdź `fitaly/eas.json` dla smoke API URL, telemetry, reminders, weekly
   reports, billing i `SENTRY_ENVIRONMENT=smoke`.
2. Sprawdź Railway smoke env: `ENVIRONMENT=production`, AI flags on, telemetry,
   reminders i weekly reports on, wszystkie domeny 1.1 off.
3. Potwierdź oddzielne albo jawnie ograniczone credentials i quota.
4. Zbuduj/uruchom launch-like smoke profile.
5. Sprawdź health i version.
6. Uruchom authenticated flow-contract checks.
7. Uruchom wymagany bounded OpenAI smoke.
8. Billing zamknij osobnym realnym sandbox purchase/restore na obu platformach.

## Warstwy weryfikacji

Release wymaga równolegle:

- unit/static/contract tests;
- Firestore/Storage emulator tests;
- Maestro simulator/emulator runtime;
- deployed smoke contracts;
- bounded real-provider/sandbox checks dla aktywnych integracji.

Żadna warstwa nie zastępuje pozostałych.

## Wymagany bounded OpenAI smoke

Ponieważ Add Meal AI i AI Chat są w frozen scope:

- maksymalnie 1 Chat text call;
- maksymalnie 1 Add Meal text albo photo call;
- smoke-only/quota-limited `OPENAI_API_KEY`;
- disposable smoke user;
- jawny cost cap;
- brak production data;
- cleanup po runie.

Pass oznacza działające wiring, auth, structured success/error, usage/run/credit
metadata i bezpieczne provider failure mapping. Nie zapisuj promptów, odpowiedzi,
obrazów, request bodies ani tokenów.

## Wymagany RevenueCat sandbox

Ponieważ premium jest w frozen scope:

- iOS: co najmniej jeden udany sandbox purchase i restore;
- Android: co najmniej jeden udany sandbox purchase i restore;
- entitlement po restarcie i loginie;
- backend/mobile tier consistency;
- product-safe degraded behavior.

Provider-fake, Maestro fixtures i mocked webhook tests pozostają obowiązkowe, ale
nie zastępują realnego StoreKit/Play Billing sandbox.

## Railway readiness

Wymagane:

```text
GET /api/v1/health
GET /api/v1/version
```

`/version` musi zwrócić deployed commit SHA. Dodatkowo uruchom aktualne
repozytoryjne flow-contract scripts z disposable smoke userem.

Przykład:

```bash
cd fitaly-backend
python scripts/check-flow-contracts.py \
  --base-url https://fitaly-backend-smoke.up.railway.app \
  --env smoke
```

oraz odpowiednie mobile verifiers.

## Telemetry smoke

Jeśli telemetry jest aktywna w production, wykonaj jeden synthetic smoke event
na smoke backendzie. Event nie może zawierać user-authored content, PII, raw
meal/chat data ani device identifiers niepotrzebnych do testu.

## Dowody i redakcja

Release artifact może przechowywać:

- endpoint/check name;
- status i latency;
- request/run id;
- structured error code;
- sanitized smoke user ref;
- platform/profile/environment;
- FE SHA, BE SHA, deployed SHA;
- cleanup status.

Nie przechowuj:

- credentials;
- auth headers/tokens;
- raw prompts/responses/images;
- receiptów i transaction IDs;
- pełnych request/response bodies;
- danych produkcyjnych.

## Drift policy

Zmiana API URL, build profile, AI/billing key mapping, critical flag, Sentry env,
backend deployment lub exact SHA unieważnia zależne evidence i wymaga
powtórzenia odpowiednich gate'ów.
