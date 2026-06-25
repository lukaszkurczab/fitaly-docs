# Dokumentacja Fitaly

Status: aktywny indeks dokumentacji workspace
Last updated: 2026-06-25

Repozytoria `fitaly/` i `fitaly-backend/` pozostają źródłami prawdy dla
implementacji. Dokumentacja opisuje aktywne decyzje, kontrakty, runbooki i
release evidence; nie może zastępować inspekcji aktualnego kodu, testów,
manifestów i branchy.

## Aktualny priorytet

Fitaly jest w trybie **Launch 1.0 Release Hardening**.

- aktywny zakres obejmuje wyłącznie core release 1.0;
- Smart Memory, Food Library production autocomplete, Recipe Catalog, Planning,
  Known Patterns, Home Next Action i Review Memory Explanation są zawieszone do
  czasu launchu;
- domeny 1.1 mogą pozostać w kodzie tylko za bezpiecznymi flagami `false` w
  produkcji;
- projekt nie jest release-ready, dopóki release owner nie zamknie wszystkich
  wymaganych gate'ów i nie podpisze decyzji `CORE_RC_READY`;
- bieżąca decyzja pozostaje `NO_GO` do czasu zamknięcia wszystkich P0.

Aktywny punkt wejścia:

- [Launch 1.0](./launch/README.md)
- [Aktualny status release](./launch/01-current-release-status.md)
- [Release readiness gates](./launch/02-release-readiness-gates.md)
- [Kolejka pracy](./launch/11-work-queue.md)

## Szybki pakiet orientacyjny

- [Release scope](./launch/00-release-scope.md)
- [Decyzje techniczne i guardraile](./architecture/decisions.md)
- [Stack technologiczny](./stack.md)
- [Architektura frontend](./architecture/frontend.md)
- [Architektura backend](./architecture/backend.md)
- [Kierunek stylistyczny UI i brand](./design/ui-direction.md)
- [E2E/testing runbook](./runbooks/e2e-testing.md)
- [Runtime config](./runbooks/runtime-config.md)
- [Launch runbook](./runbooks/launch.md)
- [Nota zawieszenia 1.1](./archive/2026-06-1-1-suspended.md)

## Kanoniczna suite runtime Launch 1.0

```bash
cd fitaly
npm run e2e:core-release-gate
```

`npm run e2e` jest obecnie aliasem do szerokiego `release-gate`, który obejmuje
zawieszone domeny 1.1. Nie używaj go jako dowodu gotowości core release.

## Zasady pracy z dokumentacją

- Najpierw sprawdź aktualny branch, SHA, kod, manifesty, README, AGENTS, skrypty
  i testy.
- Nie przenoś statusu z wcześniejszego SHA na aktualny release candidate.
- `implemented`, `locally verified`, `remote CI green`, `production verified` i
  `release-approved` to różne stany.
- Artefakt bez dokładnego FE SHA, BE SHA, platformy, profilu runtime i daty nie
  jest release evidence.
- Mock, emulator i provider-fake nie zastępują wymaganego bounded smoke na
  realnej integracji; realny smoke nie zastępuje testów deterministycznych.
- Disabled/degraded state musi być jawny. Kill switch nie może wracać do starej
  architektury po cichu.
- Historycznych planów Smart Memory nie traktuj jako aktywnego backlogu.
- W razie konfliktu repo wygrywa, a dokumentację trzeba poprawić.

## Planning

Katalog `planning/` nie zawiera aktywnego planu produktowego. Aktywna praca
release jest śledzona wyłącznie w `launch/`.
