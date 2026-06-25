# 01 — Aktualny status release

Status dokumentu: active snapshot
Snapshot date: 2026-06-25
Decision: `NO_GO`

## Znaczenie decyzji

Globalna decyzja ma dokładnie jedną wartość. Część gate'ów może być
`blocked_external`, ale release pozostaje `NO_GO`, ponieważ istnieją również
niewykonane P0 zależne od projektu: aktualny baseline, bieżące CI, runtime obu
platform, visual acceptance, security, billing, smoke, backup/restore i store
readiness.

## Repo baseline widoczny z remote

Poniższe wartości są punktem orientacyjnym, nie finalnym RC evidence:

| Repo | Branch | Remote HEAD odczytany 2026-06-25 |
| --- | --- | --- |
| Mobile | `codex/smart-memory-core-loop-fe` | `59feb230b74914ef5a7963b05d2a19dd695edef4` |
| Backend | `codex/smart-memory-core-loop-be` | `fe01fbaf92921271968e9d7bde329530b42513eb` |
| Docs baseline przed reconciliation v2 | `main` | `773c3f65c18fcc6858f8bc775eb7539e7e41e185` |

Nadal trzeba lokalnie potwierdzić:

- `git fetch --prune`;
- branch names;
- `git rev-parse HEAD`;
- clean worktrees;
- brak diffu do origin;
- czy powyższa para jest faktycznie wybieranym release candidate;
- nowy docs SHA po zastosowaniu paczki.

## Historyczne evidence, którego nie wolno przepisać na RC

- wcześniejszy lokalny iOS `core-release-gate` miał wynik `20/20`;
- wcześniejszy Android preflight wykazał brak AVD/booted emulatora;
- istnieją wcześniejsze exact-pair CI oraz targeted 1.1 evidence;
- nowe domeny są skonfigurowane jako production-off.

Powyższe informacje pomagają ustawić kolejkę pracy, ale nie zamykają gate'ów dla
nowego kandydata.

## Status gate'ów

| Gate | Status | Release impact | Najbliższa akcja |
| --- | --- | --- | --- |
| Dokumentacja i scope freeze | in_progress | blocking do reconciliation | zastosować v2 i uruchomić grep/link review |
| Exact FE/BE SHA baseline | in_progress | blocking | potwierdzić lokalnie clean/sync i wybrać candidate id |
| Exact-pair remote CI | not_started | blocking | uruchomić oba workflowy dla wybranej pary |
| Production flags 1.1 off | in_progress | blocking przy drift | sprawdzić EAS, backend env i disabled runtime |
| Mobile static/unit/contract | not_started | blocking | uruchomić pełny current-candidate gate |
| Backend static/unit/emulator | not_started | blocking | uruchomić pełny current-candidate gate |
| iOS core runtime | not_started | blocking | `e2e:core-release-gate` dla aktualnego RC |
| Android core runtime | blocked | blocking | utworzyć AVD, preflight i core suite |
| Maestro artifact library | in_progress | blocking dla visual acceptance | rozszerzyć identity manifest i wygenerować bibliotekę |
| UI/UX screen audit | not_started | blocking dla P0/P1 | ocenić screenshoty i wykonać repair loop |
| Security/privacy/compliance | not_started | blocking | checklista, testy negatywne, delete/export |
| Billing/premium | not_started | blocking | realny purchase + restore na obu platformach |
| Backend smoke/deployed SHA | not_started | blocking | health/version/contracts + bounded provider smoke |
| Backup/restore | not_started | blocking | wykonać drill i zapisać evidence |
| Store readiness | not_started | blocking | build/install/metadata/privacy/track sanity |
| Rollback rehearsal | not_started | blocking | backend + flag/config rollback |
| Final release evidence | blocked | blocking | wypełnić dopiero po gate'ach |

## Otwarte P0

1. Zastosowanie reconciliation v2 i usunięcie martwych referencji.
2. Aktualny exact SHA i clean/sync baseline.
3. Current-pair remote CI.
4. Pełne aktualne iOS runtime evidence.
5. Android runtime.
6. Biblioteka screenshotów oraz audyt launchowych ekranów.
7. Security/privacy, delete i export.
8. Realny billing sandbox i restore na obu platformach.
9. Smoke backend z deployed SHA i bounded OpenAI wiring.
10. Backup/restore oraz rollback.
11. Store candidate i instalacja z kanałów dystrybucji.

## Zasada aktualizacji

Po każdym packetcie aktualizuj status tylko na podstawie artefaktu przypisanego
do tej samej pary FE/BE SHA. Zmiana SHA, profilu runtime albo krytycznej
konfiguracji unieważnia zależne evidence.
