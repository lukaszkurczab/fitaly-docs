# 04 — Biblioteka artefaktów Maestro

Status: required launch evidence
Last reconciled with current runner: 2026-06-25

## Cel

Zbudować kompletną, przeglądalną bibliotekę ekranów i flow dla aktualnego RC.
Nie wystarczy wynik `20/20`; release owner musi widzieć rzeczywisty produkt i
ocenić gotowość każdego launchowego surface'u.

## Kanoniczne źródła

- `fitaly/package.json`;
- `fitaly/scripts/e2e/suites.json`;
- `fitaly/scripts/e2e/run-suite.mjs`;
- `fitaly/scripts/run-e2e-local.sh`;
- `fitaly/scripts/e2e/run-visual-suite.mjs`;
- `npm run e2e:core-release-gate`;
- `npm run e2e:visual-audit`;
- targeted suites dla auth, add-meal, home/history/statistics, AI chat,
  premium/billing, notifications, share i platform layout.

Broad `release-gate` oraz `full-review` obejmują 1.1 i nie są kanoniczną
biblioteką Launch 1.0.

## Aktualny surowy output runnera

Obecny `run-visual-suite.mjs` zapisuje:

```text
fitaly/e2e/artifacts/visual-audit/<run-id>/
  manifest.json
  reports/
  logs/
  screenshots/
```

oraz aktualizuje:

```text
fitaly/e2e/artifacts/visual-audit/latest
```

Aktualny `manifest.json` obejmuje m.in. suite, run id, start/finish, platformę,
listę flow, ścieżki outputu, expected screenshots, faktyczne screenshoty,
reports, status, exit code i signal.

To jest poprawny raw bundle, ale sam w sobie nie spełnia jeszcze pełnego
kontraktu release evidence.

## Brakujące pola tożsamości RC

Przed zamknięciem visual gate wymagane są:

- `candidateId`;
- FE branch i pełny FE SHA;
- BE branch i pełny BE SHA;
- platforma oraz simulator/AVD/device model;
- build profile i app version/build number;
- backend environment/base URL label oraz deployed BE SHA;
- locale;
- niesekretny snapshot krytycznych feature flags;
- data/godzina;
- suite i flow list;
- wynik, failures i znane ograniczenia.

## Dopuszczalne rozwiązania

Wybierz jedno i stosuj konsekwentnie:

### A. Rozszerzenie `manifest.json`

Runner automatycznie dodaje brakujące pola z env/git/runtime i failuje, jeśli
wymaganej tożsamości RC nie da się ustalić.

### B. Companion Maestro run manifest

Raw `manifest.json` pozostaje bez zmian, a obok bundle albo w repo dokumentacji
powstaje plik utworzony z `launch/templates/maestro-run-manifest.md`, który:

- wskazuje ścieżkę/hash raw manifestu;
- dodaje brakującą tożsamość RC;
- zawiera review status i podpis ownera.

Nie wolno ręcznie przepisywać wyniku bez wskazania raw bundle.

## Docelowy model evidence

Surowe artefakty pozostają w repo mobile, CI/EAS artifact albo kontrolowanym ZIP.
Repo dokumentacji przechowuje indeks, review records i tylko wybrane,
zredagowane screenshoty:

```text
launch/evidence/<candidate-id>/
  README.md
  ios/
    visual-audit-manifest.md
    core-release-gate-manifest.md
  android/
    visual-audit-manifest.md
    core-release-gate-manifest.md
  screen-audit/
  findings.md
```

## Wymagane powierzchnie

Co najmniej:

- auth entry, login, register, reset i validation;
- onboarding/profile completion;
- Home empty i populated;
- Add Meal options, manual, text, photo, barcode i saved template;
- Review, edit, save i error states;
- History, Details, edit/delete;
- Statistics empty i populated;
- AI Chat consent, empty, history, no credits i error;
- paywall, purchase/restore/degraded;
- notification preferences i permission states;
- Weekly Reports entry/open/unavailable/premium boundary;
- Share Quick/Customize/save/share/error/no-photo;
- Settings, export, account delete/cancel;
- offline, pending, failed, retry i conflict;
- small-screen, keyboard i dark-mode paths rzeczywiście wspierane przez app.

Domeny 1.1 production-off nie są częścią wymaganej biblioteki Launch 1.0.
Mogą mieć osobne diagnostyczne artefakty, ale nie zwiększają completeness core.

## Screenshot quality

Każdy screenshot musi:

- pochodzić z bieżącego RC;
- mieć stabilną, opisową nazwę;
- nie zawierać tokenów, maili, raw AI content, receiptów ani PII;
- pokazywać cały stan potrzebny do oceny;
- zostać powiązany z flow, platformą i locale;
- być ponowiony po naprawie P0/P1.

## Acceptance

- raw bundle jest kompletny i powtarzalny;
- identity manifest wskazuje dokładną parę FE/BE i runtime;
- expected screenshots zgadzają się z outputem albo każdy brak jest wyjaśniony;
- iOS i Android mają osobne evidence;
- PL i EN mają wymagane pokrycie;
- screen audit został wykonany;
- wszystkie P0/P1 visual findings są zamknięte i re-fotografowane.
