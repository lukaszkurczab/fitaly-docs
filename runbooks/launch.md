# Launch Runbook

Status: aktywny
Last updated: 2026-06-25

Runbook dla release candidate i public rollout `fitaly` + `fitaly-backend`.
Szczegółowe gate'y są w [Launch 1.0](../launch/README.md).

## Ownership

Projekt jest operowany solo. Release owner pełni role release managera,
incident commandera i final approvera. Nie wymagaj osobnego GitHub environment
reviewera jako kryterium launchu.

## Warunki wejścia do RC

- scope 1.0 jest zamrożony;
- wszystkie domeny 1.1 są production-off;
- oba repo są clean i zsynchronizowane z origin;
- zapisano exact FE SHA i BE SHA;
- remote CI i cross-repo contract checks dotyczą tej samej pary;
- nie ma otwartego P0;
- `launch/01-current-release-status.md` jest odświeżony.

## Obowiązkowe gate'y

1. Source/branch integrity i exact-SHA CI.
2. Runtime config oraz disabled behavior.
3. iOS core runtime.
4. Android core runtime.
5. Biblioteka artefaktów Maestro i audyt ekranów.
6. Security, privacy, export i delete.
7. Billing/premium.
8. Backend smoke oraz deployed SHA.
9. Backup/restore.
10. Build i store readiness.
11. Rollback rehearsal.
12. Final release evidence i decyzja ownera.

Nie zamykaj gate'u samą deklaracją, unit testem lub historycznym raportem.

## Kroki release

1. Pobierz aktualne branche i zapisz exact SHA.
2. Potwierdź clean worktrees oraz brak diffu do origin.
3. Uruchom mobile/backend static, unit i contract gates.
4. Uruchom exact-pair remote CI.
5. Zbuduj RC w profilu `smoke` lub `internal`.
6. Uruchom core runtime na iOS i Androidzie.
7. Zbierz i zindeksuj artefakty Maestro.
8. Wykonaj audyt UI/UX i napraw P0/P1 blokujące release.
9. Wykonaj security/privacy, billing, backend smoke i backup/restore.
10. Zbuduj produkcyjne artefakty:

```bash
cd fitaly
npm run publish:android
npm run publish:ios
```

11. Zweryfikuj instalację i sanity na store/internal track.
12. Wypełnij `launch/templates/release-evidence.md`.
13. Podejmij decyzję `CORE_RC_READY`, `NO_GO` albo
    `BLOCKED_EXTERNAL_DEPENDENCY`.
14. Przy `CORE_RC_READY` rozpocznij phased rollout i monitoring Day0-Day7.

## Stop conditions

Natychmiast zatrzymaj release przy:

- niespójnej parze SHA;
- braku Android lub iOS runtime evidence;
- niezweryfikowanym purchase/restore;
- błędnym delete/export;
- PII w telemetry, logs lub Sentry;
- nieznanym deployed backend SHA;
- placeholder legal URL;
- krytycznym crashu, data loss, cross-user access lub silent sync corruption;
- niegotowym rollbacku.

## Rollback matrix

- Mobile config/routing regression: zatrzymaj rollout i przebuduj artefakt.
- Backend regression: przywróć poprzedni deployment i potwierdź health/version.
- AI/provider incident: użyj odpowiedniego kill switcha bez legacy fallbacku.
- Smart Reminders incident: `SMART_REMINDERS_ENABLED=false`.
- Weekly Reports incident: `WEEKLY_REPORTS_ENABLED=false`.
- Telemetry incident: `TELEMETRY_ENABLED=false`.
- Billing incident: zatrzymaj paywall/purchase exposure zgodnie z aktualnym
  mechanizmem, nie odbierając istniejącego entitlementu bez decyzji ownera.
- Severe user impact: pause rollout/unpublish do zweryfikowanego hotfixu.

## Day0-Day7

Monitoruj co najmniej:

- crash-free sessions i startup failures;
- auth/onboarding completion;
- Add Meal success/failure;
- save/sync failure i dead-letter;
- AI provider errors, latency i koszt;
- billing purchase/restore/entitlement errors;
- delete/export failures;
- backend 5xx, latency i saturation;
- telemetry ingestion health.

Nie wznawiaj aktywnego rozwoju 1.1, dopóki release-critical problemy nie są
opanowane.
