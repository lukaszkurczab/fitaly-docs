# E2E I Testing Runbook

Kanoniczne zrodla dla Maestro:

- `fitaly/package.json`
- `fitaly/scripts/e2e/suites.json`
- `fitaly/scripts/e2e/run-suite.mjs`
- `fitaly/scripts/run-e2e-local.sh`

## Package Scripts

Aktualne skrypty z `fitaly/package.json`:

```bash
npm run e2e
npm run e2e:smoke
npm run e2e:auth
npm run e2e:add-meal
npm run e2e:home-history-statistics
npm run e2e:ai-chat
npm run e2e:premium-billing
npm run e2e:notifications-retention
npm run e2e:share
npm run e2e:platform-layout
npm run e2e:coverage:check
npm run e2e:dynamic-text:check
npm run e2e:visual-audit
npm run e2e:release-gate
npm run e2e:full-review
```

`npm run e2e` jest aliasem do `npm run e2e:release-gate`. `e2e:coverage:check` i `e2e:dynamic-text:check` sa statycznymi walidatorami pokrycia/selektorow, nie uruchamiaja Maestro suite.

Nie zakladaj istnienia dodatkowych package scripts poza lista powyzej; aktualnym zrodlem prawdy jest `package.json`.

## Kiedy Uruchamiac Maestro

- Dokumentacja-only: nie uruchamiac E2E.
- Simple copy/layout polish: nie uruchamiac domyslnie, chyba ze prompt prosi o E2E albo zmiana dotyka navigation/state/business logic.
- Critical flows: uruchomic targeted Maestro.
- Release gate/full review: uzyc smoke/release-gate/full-review zgodnie z celem.

Critical flows:

- auth/session routing,
- onboarding completion,
- add meal save,
- local-first sync,
- premium/restore,
- reminders,
- account deletion,
- navigation.

## Suite Role

- `smoke`: minimal launch/account/add-meal/chat/offline confidence.
- `release-gate`: stabilny release candidate gate.
- `visual-audit`: screenshot coverage dla przegladu wizualnego.
- `full-review`: szeroki manual/product review z `--continue-on-failure`.
- Targeted suites (`auth`, `add-meal`, `home-history-statistics`, `ai-chat`, `premium-billing`, `notifications-retention`, `share`, `platform-layout`) sa preferowane przy zmianach ograniczonych do jednego obszaru.

## E2E Fixture Contract

Fixture paths sa fail-closed za `E2E=true`. Poza E2E deep linki nie powinny zmieniac produkcyjnych sciezek SDK/backend.

Seed deep link:

```text
fitaly://e2e/seed?fixture=activated-user-empty&credits=ok&ai=textSuccess
```

Wspierane klucze obejmuja: `fixture`, `credits`, `ai`, `barcode`, `billing`, `chat`, `shareExport`, `notificationPermission`, `reminder`, `weeklyReport`.

Connectivity:

```text
fitaly://e2e/connectivity?offline=1
fitaly://e2e/connectivity?offline=0
```

## Selector Contract

Nowe asercje powinny uzywac stabilnych `testID`. Tekst tlumaczony jest akceptowalny tylko, gdy test sprawdza copy.

## Cross-repo Contract Alignment

Contract tests chronia tylko jawnie wskazany zakres fixtures i snapshots. Nie
zakladaj, ze pokrywaja cale API.

Aktywne powierzchnie do sprawdzenia przy zmianie kontraktu:

- meal schema fields i enum values: `MealType`, `MealSyncState`,
  `MealInputMethod`, `MealSource`
- `NutritionState` response/type shape
- AI gateway reject reasons
- habit signal enums
- AI response shape i credit-cost fields
- mobile fixtures: `fitaly/src/__contract_fixtures__/*.json`
- backend fixtures: `fitaly-backend/tests/contract_fixtures/*.json`
- mobile sync helper: `fitaly/scripts/verify-backend-contract.sh`
- mobile alignment tests: `contractAlignment`
- backend alignment tests: `fitaly-backend/tests/test_contract_alignment.py`

Minimalna ogolna weryfikacja przy zmianie protected fixture:

```bash
cd fitaly
bash scripts/verify-backend-contract.sh
npx jest contractAlignment --runInBand --watchman=false --no-coverage
```

```bash
cd fitaly-backend
pytest tests/test_contract_alignment.py
```

Targeted package scripts, np. `npm run test:profile-contract` albo
`npm run test:reminders`, sa przydatne przy waskim zakresie, ale nie zastepuja
ogolnego sprawdzenia, jesli zmieniany fixture ma szerszy cross-repo blast
radius.

Jesli zmieniasz tylko dokumentacje, nie uruchamiaj tych testow domyslnie.
Jesli zmieniasz enum, shape albo fixture uzywany przez oba repo, aktualizuj
obie strony w tej samej paczce pracy.

## Zrodla

Szczegolowa lista flow pozostaje w `fitaly/scripts/e2e/suites.json`.
