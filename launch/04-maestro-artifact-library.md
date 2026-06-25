# 04 — Biblioteka artefaktów Maestro

Status: required launch evidence

## Cel

Zbudować kompletną, przeglądalną bibliotekę ekranów i flow dla aktualnego RC.
Nie wystarczy wynik `20/20`; release owner musi widzieć rzeczywisty produkt i
ocenić gotowość każdego launchowego surface'u.

## Źródła prawdy

- `fitaly/package.json`;
- `fitaly/scripts/e2e/suites.json`;
- `fitaly/scripts/e2e/run-suite.mjs`;
- `fitaly/scripts/run-e2e-local.sh`;
- `npm run e2e:visual-audit`;
- targeted suites dla auth, add-meal, home/history/statistics, AI chat,
  premium/billing, notifications, share i platform layout.

## Wymagany model artefaktu

Każdy run ma:

```text
<rc-id>/<platform>/<suite>/<run-id>/
  manifest.md
  junit/
  logs/
  screenshots/
  optional-video/
```

Raw bundle może pozostać jako CI/EAS artifact lub zewnętrzny, kontrolowany ZIP.
W repo dokumentacji przechowuj indeks, oceny i wybrane, zredagowane screenshoty,
nie nieograniczone logi/wideo.

## Minimalne metadane

- RC id;
- FE SHA;
- BE SHA;
- deployed/local backend target;
- platform, OS i device profile;
- build profile;
- locale;
- suite i flow;
- start/end time;
- result i failed step;
- feature flag snapshot;
- artifact locations;
- redaction status.

Użyj [template manifestu](./templates/maestro-run-manifest.md).

## Screen capture contract

Screenshot rób:

1. po wejściu na ekran;
2. dla głównego ready state;
3. dla kluczowej akcji przed/po;
4. dla loading, empty, error, offline i permission state, jeśli istnieją;
5. dla paywall/free/premium states;
6. po zmianie layoutu lub naprawie findingu.

Nazewnictwo:

```text
<order>__<surface>__<state>__<locale>__<platform>.png
```

Przykład:

```text
030__review-meal__ai-result-ready__pl__ios.png
```

## Completeness matrix

Biblioteka musi objąć co najmniej:

- startup/splash/update state;
- auth i session restore;
- onboarding/profile;
- Home;
- Add Meal methods;
- photo/text/manual/barcode zgodnie z launch scope;
- Review/edit/save/error;
- offline pending/failure/retry;
- History/Meal Details/Statistics;
- AI Chat;
- notifications/reminders;
- weekly report, jeśli aktywny;
- paywall/purchase/restore/premium state;
- Share;
- Profile/Settings;
- export/delete/logout;
- permissions;
- generic loading/empty/error/degraded states;
- disabled 1.1 entrypoints lub potwierdzenie ich braku.

## Quality rules

- Nie używaj production user data.
- Nie zapisuj tokenów, emaili, raw promptów, zdjęć prywatnych ani receiptów.
- Screenshot z debug overlay, test fixture bannerem lub niesanitowanym system
  alertem nie jest store-quality evidence.
- Jeżeli flow przechodzi, ale screenshot ujawnia błąd wizualny, wynik UI gate
  pozostaje failed/partial.
- Po naprawie zachowaj tylko aktualny accepted screenshot w indeksie; poprzedni
  może zostać w raw bundle jako repair evidence.

## Output

Dla każdego RC powstają:

- manifest runów;
- screen inventory;
- screen audit records;
- lista brakujących states;
- lista P0/P1/P2 findings;
- accepted screenshot set dla iOS i Androida.
