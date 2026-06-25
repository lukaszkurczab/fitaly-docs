# Decyzje techniczne i guardraile

Status: aktywny dokument kanoniczny
Data aktualizacji: 2026-06-25

Ten plik zawiera tylko aktywne decyzje wpływające na pracę nad Fitaly. Repo,
kod, manifesty, testy i runbooki pozostają źródłem prawdy. Przy konflikcie
najpierw zweryfikuj repo evidence, potem popraw dokumentację.

## Pre-launch posture

- Fitaly jest pre-launch / release-hardening do podpisania `CORE_RC_READY`.
- Aktywny zakres to release 1.0 opisany w
  [Launch Scope](../launch/00-release-scope.md).
- Rozwój 1.1 jest zawieszony do launchu.
- Legacy paths, duplicate snapshots, stare endpointy i ukryte fallbacki są
  removal scope, nie compatibility promise.
- Kill switche są dozwolone dla AI, reminders, reports/coach, payments,
  provider-cost surfaces i kontrolowanych eksperymentów.
- Disabled/degraded state musi być jawny. Kill switch nie może przywracać
  starego zachowania ani wykonywać pracy w tle.

## Launch scope freeze i 1.1

W produkcji pozostają wyłączone:

- Food Library;
- Smart Memory capture/apply/UI;
- Known Patterns;
- Recipe Catalog;
- Planning;
- Home Next Action;
- Review Memory Explanation.

Zmiana któregokolwiek z tych flag na `true` wymaga nowej decyzji scope i
osobnego feature rollout gate. Nie wykonuj takiej zmiany jako efektu ubocznego
launch hardeningu.

## Evidence policy

- Każdy release artifact musi wskazywać FE SHA, BE SHA, platformę, build/runtime
  profile, backend target, czas i wynik.
- Wynik testu na wcześniejszym SHA nie zamyka gate'u dla aktualnego kandydata.
- Lokalny simulator/emulator, remote CI, smoke deployment i store build są
  osobnymi warstwami dowodu.
- `pass_with_gaps` nie może ukrywać P0. Waiver dotyczy wyłącznie jawnego P1 z
  ownerem i planem po release.
- Raw tokeny, payloady, prompty, zdjęcia i dane użytkownika nie mogą trafiać do
  evidence.

## Mobile architecture

### Feature-first

Nowe mobile functionality trafia domyślnie do `fitaly/src/feature/*`. Feature
jest prywatny domyślnie. Kod współdzielony przenoś do globalnych warstw dopiero,
gdy ma rzeczywiste użycie między domenami.

### React Context zamiast centralnego store

Domyślny model stanu to domenowe React Context providers i typed hooks. Nie
dodawaj Redux-style centralnego store bez nowej, repo-potwierdzonej decyzji.

## Meal i offline-first

### Local-first read model

Home, History i Statistics reagują na save/edit/delete przez lokalny read model,
nie przez backend refetch wymagany do natychmiastowej spójności UI.

Kanoniczny zapis:

```text
ReviewMealScreen
  -> saveMeal
  -> saveMealTransaction
  -> upsertMealLocal
  -> enqueueUpsert
```

Każda zmiana wymaga przeglądu Review, meal services, offline queue/repository,
local read model, testów i E2E.

### Konflikty są jawne

Sync musi ujawniać `pending`, `failed`, `dead-letter`, `retry` i konflikt tam,
gdzie merge jest niejednoznaczny. Nie ukrywaj konfliktu przez silent overwrite
lub timestamp fallback.

## Backend architecture

### Cienki HTTP layer

FastAPI route handlers odpowiadają za walidację, wywołanie serwisu i mapowanie
odpowiedzi. Logika biznesowa należy do `app/services`, `app/domain`, `app/infra`,
`app/db` albo typowanych schema/model layers.

### Backend-owned AI

Mobile nie wykonuje bezpośrednich OpenAI requests i nie przechowuje provider
secrets. Provider access, prompt/context, credits, cost/rate enforcement i error
mapping są backend-owned.

Aktywne launchowe powierzchnie:

- Add Meal photo/text analysis: backend v1 `/api/v1/ai/*`;
- AI Chat: `POST /api/v2/ai/chat/runs` i read projections v2.

Nie przywracaj legacy chat v1 fallbacku.

## Cross-repo contracts

Zmiana chronionego contractu wymaga parzystej aktualizacji mobile/backend i
testów alignment. Dotyczy co najmniej:

- meal schema i enumów;
- NutritionState shape;
- AI gateway reject reasons;
- habit signal enums;
- AI response i credit-cost fields;
- fixtures mobile/backend.

Contract tests chronią tylko jawnie wskazany zakres, nie całe API.

Kanoniczny runbook: [E2E i testing](../runbooks/e2e-testing.md).

## Update rules

- Ten plik nie jest historią ADR.
- Martwe decyzje usuń, chyba że krótka nota aktywnie chroni przed błędem.
- Szczegóły flow trzymaj w repo i runbookach.
- Przy konflikcie repo wygrywa, a dokumentację trzeba poprawić.
