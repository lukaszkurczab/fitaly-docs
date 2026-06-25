# 07 — Billing i Premium

Status: required launch gate
Last reconciled: 2026-06-25

Premium jest częścią zamrożonego scope Launch 1.0. Brak realnego sandbox evidence
na którejkolwiek platformie blokuje release albo musi zostać jawnie
zaklasyfikowany jako zewnętrzny blocker. Nie może zostać oznaczony jako passed na
podstawie provider-fake.

## Kontrakt

RevenueCat jest źródłem entitlementu zakupowego, a backend/mobile muszą
interpretować ten sam entitlement `premium`. UI nie może opierać się wyłącznie
na lokalnym, nieweryfikowanym stanie.

## Configuration

Potwierdź:

- iOS i Android app/project mapping;
- production i sandbox keys;
- offering i package IDs;
- App Store / Play product IDs;
- `premium` entitlement;
- webhook secret i backend mapping, jeśli webhook jest aktywny;
- `DISABLE_BILLING=false` dla launch-like buildów;
- brak kluczy, receiptów i transaction IDs w repo/logach/artifacts.

## Wymagane warstwy weryfikacji

### 1. Deterministyczne testy

- mobile unit/integration tests;
- Maestro paywall/restore/degraded paths;
- backend webhook signature, replay/idempotency i entitlement mapping;
- free/premium credits i access boundaries;
- offline oraz provider unavailable.

### 2. Realny sandbox

Na obu platformach, na buildzie przypisanym do aktualnego RC:

1. Free user widzi prawidłowy paywall i zachowuje free core.
2. Sandbox purchase dochodzi do realnego StoreKit/Play Billing success.
3. Entitlement pojawia się w aplikacji oraz, jeśli dotyczy, w backend access
   state.
4. Entitlement pozostaje prawidłowy po restarcie aplikacji.
5. Restore purchases działa po reinstall lub ponownym loginie na właściwe konto.
6. Brak offering/product daje bezpieczny degraded state.
7. RevenueCat unavailable/offline nie odbiera cicho istniejącego dostępu.

Bezpieczny błąd jest wartościowym negative-path evidence, ale nie zastępuje co
najmniej jednego udanego purchase i restore na każdej platformie.

## Dodatkowe stany

Zweryfikuj deterministycznie lub przez kontrolowany sandbox, zależnie od
możliwości:

- cancel;
- expired;
- revoked;
- grace period/billing issue;
- retry/replay webhooku;
- user switch;
- brak możliwości wielokrotnego wykorzystania tej samej transakcji do
  niespójnego stanu.

## Free/premium boundaries

- AI credits free/premium;
- photo/text/chat costs;
- Weekly Reports premium denial i success/unavailable contract;
- paywall entrypoints;
- restore w Settings i Paywall;
- brak przypadkowego gatingu podstawowego meal logging;
- backend i mobile pokazują ten sam tier.

## Evidence

Zapisuj:

- FE/BE SHA i build profile;
- app version/build number;
- platformę, OS i sandbox account type;
- product/offering/entitlement names;
- sanitized timestamps i wynik;
- screenshoty success, restore i degraded;
- backend webhook test result i sanitized event correlation;
- cleanup/reset informacji testowej.

Nie zapisuj:

- receiptów;
- transaction IDs;
- subscriber IDs bez sanitization;
- auth headers;
- sandbox credentials;
- pełnych webhook payloadów.

## Acceptance

- deterministyczne tests green;
- realny purchase passed na iOS i Androidzie;
- realny restore passed na iOS i Androidzie;
- entitlement jest spójny po restart/login;
- free core nie jest zablokowany;
- brak nierozwiązanych P0/P1;
- evidence nie zawiera wrażliwych danych płatniczych.
