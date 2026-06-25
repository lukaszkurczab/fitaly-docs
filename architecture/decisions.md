# Decyzje Techniczne I Guardraile

Status: aktywny dokument kanoniczny
Data aktualizacji: 2026-06-12

Ten plik zastapil historyczny katalog `docs/adr/`. Nie jest dziennikiem
wszystkich dawnych decyzji. Jest krotkim zestawem aktywnych decyzji, ktore
czlowiek i asystent AI powinni sprawdzic przed zmiana architektury, flow albo
kontraktu.

Repo, kod, manifesty, testy i runbooki pozostaja zrodlem prawdy. Jesli ten
plik konfliktuje z aktualnym kodem albo nowszym core-flow doc, zatrzymaj sie i
zweryfikuj repo evidence przed edycja.

## Pre-launch Posture

- Fitaly jest pre-launch / release-hardening, dopoki release owner nie zamknie
  osobnego release acceptance.
- Legacy paths, duplicate snapshots, old endpoint behavior i hidden fallbacks sa
  removal scope, nie compatibility promise.
- Kill switche sa dozwolone tylko dla powierzchni wysokiego ryzyka: AI,
  reminders, weekly/coach, payments, provider-cost surfaces i kontrolowane
  eksperymenty.
- Disabled/degraded state musi byc jawny. Kill switch nie moze wracac do starej
  architektury po cichu.

Smart Memory implementation pass jest zamkniety. Kolejne prace traktuj jako
bugfixy, hardening albo nowe male iteracje z wlasnymi acceptance criteria.
Krotki status zamkniecia jest w
[Smart Memory implementation closure](../planning/smart-memory-core-release-acceptance-packet.md).

## Mobile Architecture

### Feature-first Jest Domyslem

Nowe mobile functionality trafia domyslnie do `fitaly/src/feature/*`.
Feature jest prywatny domyslnie: nie importuj prywatnych modulow jednego
feature z innego feature. Jesli UI, hook albo service jest realnie wspolny dla
co najmniej dwoch feature, wyciagnij go do warstwy globalnej:
`components`, `hooks`, `services`, `utils`, `theme`, `navigation` albo `types`.

Kanoniczny opis: [frontend architecture](./frontend.md).

### React Context Zamiast Centralnego Store

Domyslny model stanu to domenowe React Context providers i typed hooks. Nie
dodawaj Redux-style centralnego store bez nowej, repo-potwierdzonej decyzji.
Optymalizuj provider values i selektory, gdy domena zaczyna powodowac zbedne
rerendery.

Kanoniczny opis: [frontend architecture](./frontend.md).

## Meal I Offline-first

### Local-first Read Model

Zalogowane posilki sa lokal-first. Home, History i Statistics maja reagowac na
save/edit/delete przez lokalny read model i shared selectors, nie przez backend
refetch wymagany do natychmiastowej spojnosci UI.

Kanoniczny zapis posilku:

```text
ReviewMealScreen
  -> saveMeal
  -> saveMealTransaction
  -> upsertMealLocal
  -> enqueueUpsert
```

Przed zmiana tego flow potwierdz aktualny stan w repo mobile: `ReviewMeal`,
meal services, offline queue/repository, local read model, tests i E2E flows.

### Konflikty Sa Jawne

Historyczna decyzja "last-write-wins" nie jest juz aktywnym uproszczeniem dla
release-critical sync. Operacje sync musza ujawniac `pending`, `failed`,
`dead-letter`, `retry` i konflikt/review tam, gdzie merge jest niejednoznaczny.
Nie ukrywaj konfliktu przez cichy backend overwrite albo timestamp fallback.

Nie przywracaj starych controller planow jako aktywnego backlogu. Jesli konflikt
sync wraca jako bug, zdefiniuj nowy maly zakres i test reprodukujacy problem.

## Backend Architecture

### Cienki HTTP Layer

Backend FastAPI trzyma route handlers cienkie: walidacja, wywolanie serwisu,
mapowanie odpowiedzi. Logika biznesowa nalezy do `app/services`, `app/domain`,
`app/infra`, `app/db` albo typowanych schema/model layers.

Kanoniczny opis: [backend architecture](./backend.md).

### Backend-owned AI

Mobile nigdy nie wykonuje bezposrednich OpenAI requests i nie nosi provider
secrets. AI provider access, prompt/context construction, rate/cost/credits
enforcement i provider error mapping sa backend-owned.

Aktywne powierzchnie:

- Add Meal photo/text analysis: backend v1 `/api/v1/ai/*`.
- AI Chat: backend v2 `POST /api/v2/ai/chat/runs` plus read projections under
  `/api/v2/users/me/chat/*`.

Nie przywracaj ogolnej decyzji, ze wszystkie AI paths sa pod `/api/v1/ai/*`.
To jest stary opis. Wersja v2 jest kanoniczna dla AI Chat.

Kanoniczne opisy zaczynaja sie od [backend architecture](./backend.md), ale
konkretny runtime zawsze potwierdzaj w aktualnym backend/mobile kodzie,
fixture'ach i testach.

## Cross-repo Contracts

Mobile i backend ewoluuja w osobnych repozytoriach, ale wybrane fixtures,
enumy i response shapes sa kontraktami cross-repo. Zmiana chronionego
kontraktu wymaga parzystej aktualizacji obu repo i testow alignment.

Minimalna zasada:

- chronione powierzchnie obejmuja co najmniej:
  - meal schema fields i enum values: `MealType`, `MealSyncState`,
    `MealInputMethod`, `MealSource`,
  - `NutritionState` response/type shape,
  - AI gateway reject reasons,
  - habit signal enums,
  - AI response shape i credit-cost fields,
- mobile fixtures: `fitaly/src/__contract_fixtures__/*.json`
- backend fixtures: `fitaly-backend/tests/contract_fixtures/*.json`
- mobile alignment tests: `contractAlignment`
- backend alignment tests: `tests/test_contract_alignment.py`

Nie zakladaj, ze contract testing chroni cale API. Chroni tylko zakres
pokryty fixtures, sync scripts i testami.

Kanoniczny runbook: [E2E i testing](../runbooks/e2e-testing.md).

## Update Rules

- Aktualizuj ten plik tylko dla decyzji, ktore maja aktywny skutek dla pracy
  nad aplikacja.
- Szczegoly flow trzymamy w core-flow docs; ten plik ma byc szybkim indeksem.
- Nie przenos tu starych ADR jako historii. Jesli decyzja jest martwa, usun ja
  albo opisz jako retired tylko wtedy, gdy nadal chroni przed blednym ruchem.
- Przy konflikcie miedzy docs a repo: repo wygrywa, a docs trzeba poprawic.
