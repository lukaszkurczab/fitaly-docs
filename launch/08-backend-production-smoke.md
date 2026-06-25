# 08 — Backend Production/Smoke Readiness

Status: required launch gate

## Cel

Potwierdzić, że deployment odpowiada dokładnemu backend SHA, ma prawidłową
konfigurację i obsługuje launchowe flow bez opierania się na production data.

## Baseline endpoints

- `GET /api/v1/health`;
- `GET /api/v1/version`;
- opcjonalny deep Firestore health tylko w kontrolowanym infra check;
- każdy response ma `X-Request-ID`.

`/version` lub równoważny endpoint musi pozwolić powiązać deployment z BE SHA.
Brak deployed SHA jest blockerem.

## Authenticated flow contracts

Na disposable smoke userze:

- auth i profile/onboarding;
- AI credits;
- meal save/history/changes/delete;
- export;
- weekly report expected tier behavior;
- telemetry ingest;
- AI Chat v2 thread/message projections, jeśli launch scope;
- account delete na osobnym disposable userze.

Użyj istniejących repo scripts, jeśli ich contract odpowiada aktualnemu API:

```bash
cd fitaly-backend
python scripts/check-flow-contracts.py \
  --base-url https://fitaly-backend-smoke.up.railway.app \
  --env smoke
```

```bash
cd fitaly
node scripts/verify-smoke-flow-contracts.mjs
node scripts/verify-smoke-export.mjs
```

## Bounded provider smoke

Uruchamiaj wyłącznie z decyzji ownera i limitem kosztu:

- maksymalnie 1 Chat text i 1 Add Meal text/photo provider call;
- RevenueCat max 1 purchase/restore per platform;
- nie zapisuj raw prompt/response/image/receipt/token;
- oceniaj wiring, structured response/error, credits i request metadata, nie
  jakość konkretnej odpowiedzi żywieniowej.

## Negative/degraded checks

- invalid/missing auth;
- insufficient credits;
- AI provider timeout/error;
- telemetry disabled;
- invalid RevenueCat webhook secret;
- Firestore unavailable;
- malformed payload;
- rate/size limit;
- disabled 1.1 endpoints zwracają jawny 503/disabled code.

## Operational readiness

- startup fail-fast dla krytycznych sekretów/config;
- Sentry environment i alerting;
- latency oraz 5xx visibility;
- Railway deploy/rollback steps;
- previous stable deployment identified;
- no dependency on notebook/research ML packages.

## Evidence

Zapisuj wyłącznie:

- endpoint/check name;
- status code i wynik contractu;
- latency;
- request/run id;
- structured error code;
- sanitized smoke user ref;
- BE SHA i deployment id.

## Acceptance

- deployed SHA zgodny;
- health/version i flow contracts passed;
- wymagany bounded provider smoke passed lub ma jawny owner-approved status;
- disabled 1.1 behavior passed;
- rollback target i monitoring gotowe.
