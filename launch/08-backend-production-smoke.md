# 08 — Backend Production/Smoke Readiness

Status: required launch gate
Last reconciled: 2026-06-25

## Cel

Potwierdzić, że deployment odpowiada dokładnemu backend SHA, ma prawidłową
konfigurację i obsługuje launchowe flow bez opierania się na production data.

## Baseline endpoints

- `GET /api/v1/health`;
- `GET /api/v1/version`;
- opcjonalny deep Firestore health tylko w kontrolowanym infra check;
- middleware request id jest obserwowalne tam, gdzie wymaga tego kontrakt.

`/version` musi pozwolić powiązać deployment z pełnym BE SHA. Brak deployed SHA
jest blockerem.

## Authenticated flow contracts

Na disposable smoke userze:

- auth i profile/onboarding;
- AI credits;
- meal save/history/changes/delete;
- export;
- Weekly Reports expected tier behavior;
- telemetry ingest;
- AI Chat v2 thread/message contract;
- account delete na osobnym disposable userze.

Użyj istniejących repo scripts, jeśli ich kontrakt odpowiada aktualnemu API:

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

Skrypty nie zastępują ręcznej inspekcji ich aktualnego zakresu. Jeżeli nie
sprawdzają launchowego flow, dopisz targeted check albo zapisz ręczne evidence.

## Wymagany bounded OpenAI smoke

Add Meal AI i AI Chat v2 są częścią Launch 1.0, dlatego wymagane jest kontrolowane
potwierdzenie realnego provider wiring na smoke backendzie:

- maksymalnie 1 Chat text call;
- maksymalnie 1 Add Meal text call albo 1 Add Meal photo call;
- smoke-only/quota-limited API key;
- disposable smoke user;
- kontrolowany limit kosztu;
- cleanup danych po runie.

Oceniamy:

- routing i auth;
- structured success/error;
- usage/run/request metadata;
- credit deduction/rejection;
- timeout/provider failure mapping;
- brak raw provider leak.

Nie oceniamy jakości produktu na podstawie semantyki jednej odpowiedzi.

## RevenueCat backend boundary

Realny app purchase/restore jest zamykany w gate Billing. Backend smoke obejmuje:

- invalid webhook secret rejection;
- signature/authorization boundary;
- idempotency/replay;
- entitlement mapping;
- observable sanitized error/success;
- opcjonalny pojedynczy sandbox webhook delivery, jeśli webhook jest częścią
  aktywnej architektury.

Mocked webhook tests nie zastępują app sandbox purchase/restore, a app sandbox
nie zastępuje deterministycznych webhook tests.

## Negative/degraded checks

- invalid/missing auth;
- insufficient credits;
- AI provider timeout/error;
- telemetry disabled;
- invalid RevenueCat webhook secret;
- Firestore unavailable;
- malformed payload;
- rate/size limit;
- disabled 1.1 endpoints zwracają jawny 503/disabled code;
- brak legacy fallbacku.

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
- FE SHA, BE SHA i deployment id;
- config/environment label;
- cleanup status.

Nie zapisuj raw promptów, odpowiedzi, obrazów, request/response bodies, tokenów,
maili, receiptów ani pełnych provider payloadów.

## Acceptance

- deployed SHA zgodny;
- health/version i flow contracts passed;
- bounded OpenAI smoke passed;
- disabled 1.1 behavior passed;
- wymagane backend billing/webhook boundaries passed;
- rollback target i monitoring gotowe;
- brak P0/P1 i brak wrażliwych danych w evidence.
