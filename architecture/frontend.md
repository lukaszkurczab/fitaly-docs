# Architektura Frontend

Frontend to aplikacja Expo/React Native w `fitaly/`.

## Zasady

- Domyslna organizacja kodu jest feature-first pod `fitaly/src/feature/*`.
- Kod feature jest prywatny domyslnie. Cross-feature reuse wymaga ekstrakcji do globalnej warstwy.
- Globalna warstwa (`components`, `hooks`, `services`, `utils`, `theme`, `navigation`, `types`) jest dla prawdziwie wspolnych prymitywow.
- Preferowane sa importy przez alias `@/`.
- UI stringi powinny przechodzic przez i18next.
- Nie importuj prywatnych modulow jednego feature z innego feature. Jesli sharing jest potrzebny, najpierw ustal globalnego ownera.

## Glowne Obszary

- `Auth` i session bootstrap
- `Home`, `History`, `Statistics`
- `Meals` i Add Meal flow
- `AI`
- `Subscription`
- `UserProfile`
- `Onboarding`

## Stan I Dane

- App uzywa domenowych kontekstow Reacta i typed hooks zamiast jednego centralnego Redux-style store.
- Nie dodawaj centralnego store bez nowej decyzji architektonicznej potwierdzonej repo evidence.
- Posiłki sa lokal-first: natychmiastowy UI opiera sie o lokalny read model i shared selectors.
- Backend sync jest trwaly i konieczny, ale nie jest fallbackiem dla natychmiastowej spojnosci Home/History/Statistics.

## Cross-repo Contracts

- Mobile i backend utrzymuja wybrane paired fixtures i tests dla contract alignment.
- Zmiana enumu, response shape albo shared fixture w chronionym zakresie wymaga aktualizacji obu repo.
- Nie zakladaj, ze contract testing pokrywa cale API. Pokrywa tylko jawnie chronione fixtures i tests.
- Szczegoly sa w [E2E/testing runbook](../runbooks/e2e-testing.md#cross-repo-contract-alignment).

## Repo Evidence

Przed zmiana flow potwierdz aktualny stan w `fitaly/src/feature/*`,
`fitaly/src/services/*`, `fitaly/src/__contract_fixtures__/*`, testach oraz
Maestro flows. Dla cross-repo kontraktow uzyj
[E2E/testing runbook](../runbooks/e2e-testing.md).

## Guardraile

- Nie dodawaj backend refetchu jako sposobu na natychmiastowa spojnosc UI.
- Nie dodawaj duplicate nutrition state.
- Nie przywracaj timestamp range fallback jako kanonicznego modelu UI.
- Nie importuj prywatnych modulow jednego feature z innego feature.
- Nie dodawaj hidden compatibility path do legacy endpointow, jesli release-hardening wymaga usuniecia ambiguity.
