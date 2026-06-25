# 01 — Aktualny status release

Status dokumentu: active snapshot
Snapshot date: 2026-06-25
Decision: `BLOCKED_EXTERNAL_DEPENDENCY` / `NO_GO` do zamknięcia P0

## Ważne

To nie jest trwały raport historyczny. Aktualizuj go po każdym zamkniętym
packecie. Nie kopiuj wyniku z wcześniejszego SHA na nowy kandydat.

## Znany punkt wyjścia

- historyczny lokalny iOS `core-release-gate` miał wynik `20/20` dla wcześniejszej
  pary branchy;
- Android simulator preflight wykazał brak skonfigurowanego AVD/booted emulatora;
- nowe domeny 1.1 są skonfigurowane jako production-off;
- istnieją static/unit/contract i część remote CI evidence;
- nie ma kompletnego evidence dla aktualnej jednej pary FE/BE obejmującego obie
  platformy, live RC, deployed SHA, billing, backup/restore, security/privacy i
  store readiness.

Wszystkie powyższe punkty wymagają ponownego potwierdzenia dla aktualnego RC.

## Status gate'ów

| Gate | Status | Release impact | Najbliższa akcja |
| --- | --- | --- | --- |
| Scope freeze 1.0 | done | chroni przed scope creep | utrzymać 1.1 off |
| Exact FE/BE SHA baseline | unknown | blocking | zapisać aktualne branche, SHA, clean/sync |
| Exact-pair remote CI | unknown | blocking | uruchomić oba workflowy dla tej samej pary |
| Production flags 1.1 off | partial | blocking przy drift | sprawdzić EAS, backend env i runtime disabled behavior |
| iOS core runtime | partial | blocking | rerun aktualnego RC i zebrać artefakty |
| Android core runtime | blocking | blocking | utworzyć AVD, boot, preflight i core suite |
| Maestro artifact library | partial | blocking dla visual acceptance | wygenerować pełny katalog ekranów/states |
| UI/UX screen audit | unknown | blocking dla P0/P1 | ocenić screenshoty i wykonać repair loop |
| Security/privacy/compliance | unknown | blocking | wykonać checklistę i testy negatywne |
| Billing/premium | unknown | blocking | purchase + restore + entitlement na obu platformach |
| Backend smoke/deployed SHA | unknown | blocking | potwierdzić health/version/flows na smoke |
| Backup/restore | unknown | blocking | wykonać drill i zapisać evidence |
| Store readiness | unknown | blocking | build/install/metadata/privacy/track sanity |
| Rollback rehearsal | unknown | blocking | backend + flag/config rollback |
| Final release evidence | blocking | blocking | wypełnić dopiero po gate'ach |

## Otwarte P0

1. Odświeżenie exact SHA i clean/sync baseline.
2. Current-pair remote CI.
3. Android runtime.
4. Pełne aktualne iOS runtime evidence.
5. Biblioteka screenshotów i audyt wszystkich launchowych ekranów.
6. Security/privacy oraz delete/export.
7. Realny billing sandbox i restore.
8. Smoke backend z deployed SHA.
9. Backup/restore.
10. Production build i store/internal-track sanity.
11. Rollback rehearsal.

## Jak aktualizować

Po każdym packecie:

- zmień tylko odpowiedni wiersz;
- wpisz exact SHA i link/ścieżkę do evidence w opisie packetu lub finalnym
  release artifact;
- nie używaj `done`, jeżeli dowód dotyczy wcześniejszego kandydata;
- przy zewnętrznym blockerze użyj `blocked_external`, nie `done_with_gap`.
