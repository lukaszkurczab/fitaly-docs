# Architektura Backend

Backend to FastAPI app w `fitaly-backend/`.

## Zasady

- HTTP layer ma pozostac cienki: walidacja, wywolanie serwisu, mapowanie odpowiedzi.
- Logika biznesowa nalezy do `app/services`, `app/domain` albo dedykowanych warstw repozytoriow.
- Firestore access powinien byc izolowany w adapterach, repozytoriach lub serwisach.
- Kontrakty request/response maja byc jawne i typowane.
- Sekrety nigdy nie trafiaja do dokumentacji ani logow.

## API

- `/api/v1` pozostaje stabilnym surface dla istniejacych produkcyjnych przeplywow.
- `/api/v2` obsluguje nowsze powierzchnie: telemetry, nutrition state, habits, coach, smart reminders, weekly reports i AI Chat.
- AI Chat jest kanonicznie backend-owned przez v2. Mobile nie buduje promptow ani nie wysyla historii posilkow do OpenAI.
- Add Meal photo/text AI nadal uzywa backend v1 `/api/v1/ai/*`.
- Nie dokumentuj juz ogolnej zasady "cale AI jest pod `/api/v1/ai/*`"; aktywna architektura jest split v1/v2 wedlug powierzchni.

## Backend-Owned Surfaces

- AI provider access
- AI prompt/context construction and provider error mapping
- Credits/access enforcement
- Weekly reports access
- Smart reminders decision endpoint
- Telemetry ingest
- User profile/onboarding persistence
- RevenueCat webhook/sync
- Firestore security-critical writes

## Kill Switche

Kill switche sa dozwolone dla AI, reminders, weekly reports, payments i kosztownych backend surfaces. Wylaczenie surface ma dawac jawny disabled/degraded response, nie ukryty fallback do starej architektury.

## Cross-repo Contracts

- Backend-owned shapes chronione przez paired fixtures musza byc aktualizowane razem z mobile.
- Backend fixtures sa w `fitaly-backend/tests/contract_fixtures/*.json`.
- Mobile fixtures sa w `fitaly/src/__contract_fixtures__/*.json`.
- Szczegoly komend i zakresu sa w [E2E/testing runbook](../runbooks/e2e-testing.md#cross-repo-contract-alignment).

## Repo Evidence

Przed zmiana backend-owned flow potwierdz aktualny stan w
`fitaly-backend/app/api`, `fitaly-backend/app/services`,
`fitaly-backend/tests`, contract fixtures oraz runtime config.

Kanoniczny runbook konfiguracji: [Runtime config](../runbooks/runtime-config.md).
