# Dokumentacja Fitaly

Status: aktywny indeks dokumentacji workspace
Last updated: 2026-06-19

Ten katalog jest kanonicznym indeksem dokumentacji workspace Fitaly. Repozytoria
`fitaly/` i `fitaly-backend/` pozostaja zrodlami prawdy dla implementacji;
dokumentacja ma pomagac szybko znalezc aktualne kontrakty, runbooki i
guardraile bez dublowania kodu.

## Aktualny Stan

- Workspace sklada sie z mobilnej aplikacji Expo/React Native w `fitaly/` oraz
  backendu FastAPI w `fitaly-backend/`.
- Root workspace nie jest git repo.
- Projekt pozostaje pre-launch / release-hardening, dopoki release owner nie
  zamknie osobnego release acceptance.
- Smart Memory implementation pass `00-09` jest zakonczony. Kolejne prace wokol
  Smart Memory traktuj jako bugfixy, hardening albo nowe male iteracje, nie jako
  kontynuacje starych planow.
- Mobile uzywa lokalnego, offline-first read modelu dla posilkow. Backend jest
  trwalym zapisem i wlascicielem wybranych kontraktow, ale Home/History/Stats
  nie czekaja na backend refetch dla natychmiastowej spojnosci UI.
- AI, credits, weekly reports, smart reminders, telemetry i kosztowne backend
  surfaces maja jawne kill switche. Kill switch nie moze wracac do starej
  architektury po cichu.

## Szybki Pakiet Dla Czlowieka I AI

Przy nowej pracy zacznij od tych plikow:

- [Kierunek rozwoju aplikacji](./app-development.md)
- [Decyzje techniczne i guardraile](./architecture/decisions.md)
- [Stack technologiczny](./stack.md)
- [Architektura frontend](./architecture/frontend.md)
- [Architektura backend](./architecture/backend.md)
- [Kierunek stylistyczny UI i brand](./design/ui-direction.md)
- [E2E/testing runbook](./runbooks/e2e-testing.md)
- [Runtime config](./runbooks/runtime-config.md)
- [Launch runbook](./runbooks/launch.md)
- [Smart Memory implementation closure](./planning/smart-memory-core-release-acceptance-packet.md)
- [Launch Hardening CWQ workspace](./planning/launch-hardening-cwq/)
- [Post Release Intelligence](./Fitaly_Post_Release_Intelligence.md)

## Planning

Aktywne plany implementacyjne Smart Memory zostaly usuniete po zamknieciu prac.
Zachowany zostal tylko krotki status zamkniecia:

- [Smart Memory Implementation Closure](./planning/smart-memory-core-release-acceptance-packet.md)

Aktywny swiezy pakiet roboczy:

- [Launch Hardening CWQ workspace](./planning/launch-hardening-cwq/)

Nowe prace powinny powstawac z aktualnego repo evidence i miec osobne acceptance
criteria. Nie traktuj starych planow `00-09` jako backlogu.

## Zasady Pracy Z Dokumentacja

- Najpierw sprawdz kod, manifesty, README, AGENTS, skrypty i testy.
  Dokumentacja nie moze zgadywac.
- Krotkie pliki tematyczne sa preferowane nad monolitycznymi raportami.
- Nie dokumentujemy legacy fallbackow jako aktywnego zachowania.
- Jesli twierdzenie nie jest potwierdzone w kodzie, oznacz je jako
  niepotwierdzone albo pomin.
- Nie zakladaj istnienia `fitaly/docs/**` jako aktywnego zrodla.
- Wizualne evidence i artefakty projektowe najpierw potwierdzaj z repo, np. z
  aktualnych `e2e/artifacts`, screenshotow albo plikow wskazanych przez aktywny
  task.

## Aktywne Decyzje Architektoniczne

Historyczny katalog `docs/adr/` zostal zastapiony przez
[decyzje techniczne i guardraile](./architecture/decisions.md). Ten plik
zawiera tylko aktywne decyzje. Stare ADR-y nie sa juz osobnym zrodlem prawdy.

## Usuniete Kategorie Dokumentow

Nie trzymamy tu:

- historycznych Smart Memory controller planow `00-09`,
- jednorazowych Smart Memory handoffow i diff-auditow po zamknieciu etapu,
- generycznych raportow opartych na przykladach spoza Fitaly,
- dated readiness notes po przeniesieniu aktualnych checkow do runbookow,
- archiwalnych rollout notes,
- monolitycznych release-hardening archives po przeniesieniu aktualnych
  wnioskow do aktualnych plikow tematycznych,
- `.DS_Store` i innych lokalnych artefaktow systemowych.
