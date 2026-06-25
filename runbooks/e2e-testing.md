# E2E i Testing Runbook

Status: aktywny
Last reconciled with mobile repo: 2026-06-25

## Kanoniczne źródła

- `fitaly/package.json`;
- `fitaly/scripts/e2e/suites.json`;
- `fitaly/scripts/e2e/run-suite.mjs`;
- `fitaly/scripts/e2e/run-visual-suite.mjs`;
- `fitaly/scripts/run-e2e-local.sh`;
- aktywne flow pod `fitaly/e2e/maestro/`.

Zawsze potwierdź aktualne skrypty i suite w repo przed wykonaniem pracy.

## Najważniejsza zasada Launch 1.0

Jedyną kanoniczną suite runtime dla core release jest:

```bash
cd fitaly
npm run e2e:core-release-gate
```

Obecnie:

```text
npm run e2e
```

jest aliasem do szerokiego `e2e:release-gate`. Broad `release-gate` oraz
`full-review` zawierają zawieszone domeny 1.1, m.in. Smart Memory, Recipe Catalog,
Known Patterns, Planning, Home Next Action i Food Library autocomplete. Nie mogą
zamykać Launch 1.0 ani generować obowiązkowego backlogu napraw 1.1.

Mogą być używane:

- diagnostycznie;
- przy osobnym utrzymaniu kodu za flagami;
- po launchu;
- gdy właściciel jawnie wybierze konkretny flow poza core gate.

## Aktualne package scripts

### Core i ogólne

```bash
npm run e2e:core-release-gate
npm run e2e:release-gate
npm run e2e:smoke
npm run e2e:full-review
npm run e2e:visual-audit
npm run e2e:local-runtime-preflight
npm run e2e:android-simulator:preflight
npm run e2e:coverage:check
npm run e2e:dynamic-text:check
```

### Targeted launch suites

```bash
npm run e2e:auth
npm run e2e:add-meal
npm run e2e:home-history-statistics
npm run e2e:ai-chat
npm run e2e:premium-billing
npm run e2e:notifications-retention
npm run e2e:share
npm run e2e:platform-layout
```

### Zawieszone lub diagnostyczne 1.1

```bash
npm run e2e:known-pattern-runtime
npm run e2e:known-pattern-telemetry
npm run e2e:planning-telemetry
npm run e2e:smart-memory-telemetry
npm run e2e:ingredient-autocomplete-runtime
```

Nie uruchamiaj ich jako warunku Launch 1.0.

## Rola suite

| Suite | Rola |
| --- | --- |
| `core-release-gate` | Kanoniczny runtime gate Launch 1.0 |
| `smoke` | Szybka, ograniczona diagnoza launch/account/add-meal/chat/offline |
| targeted suites | Wąska walidacja po zmianie jednego obszaru |
| `visual-audit` | Generowanie screenshot library do manualnego audytu |
| `platform-layout` | Małe ekrany, keyboard, layout platformowy |
| broad `release-gate` | Diagnostyczny miks core + 1.1; nie jest core gate'em |
| `full-review` | Szeroki review z 1.1 i continue-on-failure; nie jest core gate'em |

## Kiedy uruchamiać Maestro

- Dokumentacja-only: nie uruchamiaj E2E.
- Prosty copy/layout polish: targeted flow albo visual audit tylko wtedy, gdy
  zmiana wpływa na ekran akceptacyjny.
- Navigation/state/business logic: targeted suite obowiązkowa.
- Critical flow: targeted suite oraz zależny fragment core gate.
- Kandydat release: pełny `core-release-gate` na iOS i Androidzie.
- Visual acceptance: `visual-audit` oraz targeted screenshot gaps.

Critical flows:

- auth/session routing;
- onboarding completion;
- Add Meal manual/text/photo/barcode;
- Review/save;
- local-first sync;
- Home/History/Statistics;
- AI Chat;
- premium purchase/restore;
- notifications/Weekly Reports boundary;
- share;
- export i account deletion;
- navigation i permissions.

## iOS runtime

Uruchom `core-release-gate` na launch-like buildzie dla aktualnego RC. Evidence
musi wskazywać FE SHA, BE SHA, build profile, backend target i platformę.

Nie akceptuj:

- E2E-only auth bypassu w production path;
- mieszania artefaktów z kilku SHA;
- sumowania izolowanych rerunów jako jednej green suite bez jawnego failure
  record;
- historycznego `20/20` jako dowodu nowego RC.

## Android runtime

Najpierw:

```bash
cd fitaly
npm run e2e:android-simulator:preflight
```

Preflight musi failować przy braku AVD/booted emulatora. Po wyniku ready uruchom
kanoniczny `core-release-gate` i dodatkowo sprawdź:

- system back;
- keyboard;
- permissions;
- camera/media;
- notifications;
- billing;
- layout na właściwym viewport/DP.

Physical device może być dodatkowym evidence, ale nie zastępuje uzgodnionego
simulator/emulator gate, jeśli ten jest kontraktem release.

## Visual audit i artefakty

Aktualny runner `scripts/e2e/run-visual-suite.mjs` zapisuje raw bundle w:

```text
e2e/artifacts/visual-audit/<run-id>/
  manifest.json
  reports/
  logs/
  screenshots/
```

oraz aktualizuje `e2e/artifacts/visual-audit/latest`.

Raw manifest zawiera wynik runnera, ale release evidence musi dodatkowo zawierać:

- candidate id;
- FE SHA i BE SHA;
- build profile/version;
- backend target/deployed SHA;
- platformę;
- locale;
- feature flags;
- review status.

Rozszerz runner albo dodaj companion review manifest zgodnie z
`launch/04-maestro-artifact-library.md`.

## E2E fixture contract

Fixture paths są fail-closed za `E2E=true`. Poza E2E deep linki nie powinny
zmieniać produkcyjnych ścieżek SDK/backend.

Przykładowy seed deep link:

```text
fitaly://e2e/seed?fixture=activated-user-empty&credits=ok&ai=textSuccess
```

Connectivity:

```text
fitaly://e2e/connectivity?offline=1
fitaly://e2e/connectivity?offline=0
```

Fixture nie jest provider smoke. Wynik mockowany nie dowodzi działania OpenAI,
RevenueCat, Firebase production config ani deployed backendu.

## Selector contract

Nowe asercje powinny używać stabilnych `testID`. Tekst tłumaczony jest
akceptowalny tylko, gdy test sprawdza copy. Nie osłabiaj asercji, żeby ukryć
realny drift UI lub state.

## Cross-repo contract alignment

Contract tests chronią tylko jawnie wskazany zakres fixtures i snapshots. Nie
zakładaj, że pokrywają całe API.

Aktywne powierzchnie do sprawdzenia przy zmianie kontraktu:

- meal schema fields i enum values;
- Nutrition State response/type shape;
- AI gateway reject reasons;
- habit signal enums;
- AI response shape i credit-cost fields;
- mobile fixtures: `fitaly/src/__contract_fixtures__/*.json`;
- backend fixtures: `fitaly-backend/tests/contract_fixtures/*.json`;
- mobile sync helper: `fitaly/scripts/verify-backend-contract.sh`;
- mobile alignment tests: `contractAlignment`;
- backend alignment tests: `fitaly-backend/tests/test_contract_alignment.py`.

Minimalna ogólna weryfikacja przy zmianie protected fixture:

```bash
cd fitaly
bash scripts/verify-backend-contract.sh
npx jest contractAlignment --runInBand --watchman=false --no-coverage
```

```bash
cd fitaly-backend
pytest tests/test_contract_alignment.py
```

Jeśli zmieniasz tylko dokumentację, nie uruchamiaj tych testów domyślnie.
Jeśli zmieniasz enum, shape albo fixture używany przez oba repo, aktualizuj obie
strony w tej samej paczce pracy.

## Finalna zasada evidence

Green suite zamyka gate tylko wtedy, gdy:

- dotyczy kanonicznego zakresu;
- ma pełną tożsamość aktualnego RC;
- uruchomiono ją na właściwej platformie i konfiguracji;
- raport i screenshoty są dostępne;
- nie opiera się na wyłączonej domenie 1.1;
- realne integracje wymagane przez scope mają osobne bounded smoke evidence.
