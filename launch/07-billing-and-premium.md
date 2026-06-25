# 07 — Billing i Premium

Status: required launch gate, jeśli premium jest aktywne w 1.0

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
- brak kluczy i receiptów w repo/logach/artifacts.

## Test matrix

Na obu platformach:

1. Free user widzi prawidłowy paywall i zachowuje free core.
2. Sandbox purchase kończy się jednoznacznym sukcesem lub bezpiecznym błędem.
3. Entitlement pojawia się po purchase i po restarcie aplikacji.
4. Restore purchases działa po reinstall/login na właściwe konto.
5. Cancel/expired/revoked/grace-period ma prawidłowy state.
6. Offline/RevenueCat unavailable nie odbiera cicho istniejącego dostępu.
7. Brak offering/product daje bezpieczny degraded state, nie pusty lub
   nieskończony loader.
8. User nie może wielokrotnie zużyć tej samej transakcji do niespójnego stanu.

## Free/premium boundaries

Zweryfikuj:

- AI credits free/premium;
- photo/text/chat costs;
- weekly report premium denial/success, jeśli w scope;
- paywall entrypoints;
- restore w Settings/Paywall;
- brak przypadkowego gatingu podstawowego meal logging;
- backend i mobile pokazują ten sam tier.

## Evidence

- FE/BE SHA i build profile;
- platforma i sandbox account type;
- product/offering/entitlement names bez receiptów i transaction IDs;
- screenshoty success/degraded/restore;
- wynik backend webhook testów i ewentualnego bounded sandbox rehearsal;
- cleanup/reset informacji testowej.

## Acceptance

- purchase i restore passed na iOS i Android;
- entitlement jest spójny po restart/login;
- free core nie jest zablokowany;
- brak nierozwiązanych P0/P1;
- evidence nie zawiera wrażliwych danych płatniczych.
