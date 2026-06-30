# Launch Runbook

Status: aktywny
Last updated: 2026-06-25

Runbook dla release candidate i public rollout `fitaly` + `fitaly-backend`.
Szczegółowe gate'y są w [Launch 1.0](../launch/README.md).

## Ownership

Projekt jest operowany solo. Release owner pełni role release managera,
incident commandera i final approvera. Nie wymagaj osobnego GitHub environment
reviewera jako kryterium launchu. Independent review może wykonać osobny agent,
ale finalną decyzję podpisuje owner.

## Warunki wejścia do RC

- scope 1.0 jest zamrożony i ma jawną macierz IN/OUT;
- wszystkie domeny 1.1 są production-off;
- oba repo są clean i zsynchronizowane z origin;
- zapisano exact FE SHA i BE SHA;
- remote CI i cross-repo contract checks dotyczą tej samej pary;
- dokumentacja nie zawiera martwych aktywnych linków;
- `launch/01-current-release-status.md` jest odświeżony.

Brak otwartego P0 nie jest warunkiem rozpoczęcia RC hardeningu; jest warunkiem
podpisania `CORE_RC_READY`.

## Kanoniczne runtime commands

### iOS / aktywny simulator

```bash
cd fitaly
npm run e2e:core-release-gate
```

### Android preflight

```bash
cd fitaly
npm run e2e:android-simulator:preflight
```

Po gotowym AVD uruchom tę samą kanoniczną suite core na Androidzie.

Nie używaj `npm run e2e`, broad `release-gate` ani `full-review` do zamknięcia
Launch 1.0. Zawierają zawieszone domeny 1.1.

## Obowiązkowe gate'y

1. Dokumentacja/scope integrity.
2. Source/branch integrity i exact-SHA CI.
3. Runtime config oraz disabled behavior.
4. Mobile static/unit/contract.
5. Backend static/unit/emulator.
6. iOS core runtime.
7. Android core runtime.
8. Biblioteka artefaktów Maestro i audyt ekranów.
9. Security, privacy, export i delete.
10. Billing/premium z realnym sandbox purchase/restore.
11. Backend smoke, deployed SHA i bounded OpenAI wiring.
12. Backup/restore.
13. Build i store readiness.
14. Rollback rehearsal.
15. Final release evidence i decyzja ownera.

Nie zamykaj gate'u samą deklaracją, unit testem lub historycznym raportem.

## Kroki release

1. Zastosuj aktualny pakiet dokumentacyjny i potwierdź scope.
2. Pobierz aktualne branche i zapisz exact SHA.
3. Potwierdź clean worktrees oraz brak diffu do origin.
4. Nadaj kandydatowi `candidateId`.
5. Uruchom mobile/backend static, unit, emulator i contract gates.
6. Uruchom exact-pair remote CI.
7. Potwierdź production/smoke config oraz 1.1 disabled behavior.
8. Zbuduj RC w profilu `smoke` lub `internal`.
9. Uruchom `core-release-gate` na iOS.
10. Skonfiguruj AVD, przejdź preflight i uruchom `core-release-gate` na Androidzie.
11. Uruchom visual audit, uzupełnij identity manifest i zindeksuj artefakty.
12. Wykonaj audyt UI/UX i napraw P0/P1 blokujące release.
13. Wykonaj security/privacy, delete/export i negative tests.
14. Wykonaj realny RevenueCat sandbox purchase/restore na obu platformach.
15. Wykonaj backend smoke z deployed SHA, flow contracts i bounded OpenAI calls.
16. Wykonaj backup/restore oraz rollback rehearsal.
17. Zbuduj produkcyjne artefakty:

```bash
cd fitaly
npm run publish:android
npm run publish:ios
```

18. Zweryfikuj instalację i sanity na internal Play track/TestFlight.
19. Wypełnij `launch/templates/release-evidence.md`.
20. Wykonaj independent review.
21. Podejmij dokładnie jedną decyzję: `CORE_RC_READY`, `NO_GO` albo
    `BLOCKED_EXTERNAL_DEPENDENCY`.
22. Przy `CORE_RC_READY` rozpocznij phased rollout i monitoring Day0-Day7.

## Stop conditions

Natychmiast zatrzymaj release przy:

- niespójnej parze SHA;
- zmianie krytycznego configu bez ponowienia evidence;
- braku Android lub iOS runtime evidence;
- niezweryfikowanym realnym purchase/restore na którejkolwiek platformie;
- niespójnym entitlement;
- błędnym delete/export;
- PII w telemetry, logs, artifacts lub Sentry;
- nieznanym deployed backend SHA;
- niewykonanym bounded OpenAI smoke dla aktywnych AI surfaces;
- placeholder legal URL;
- krytycznym crashu, data loss, cross-user access lub silent sync corruption;
- niegotowym backup/restore lub rollbacku;
- braku store-install sanity.

## Rollback matrix

- Mobile config/routing regression: zatrzymaj rollout i przebuduj artefakt.
- Backend regression: przywróć poprzedni deployment i potwierdź health/version.
- AI/provider incident: użyj odpowiedniego kill switcha bez legacy fallbacku.
- Smart Reminders incident: `SMART_REMINDERS_ENABLED=false` i jawny disabled state.
- Weekly Reports incident: `WEEKLY_REPORTS_ENABLED=false` i jawny disabled state.
- Telemetry incident: `TELEMETRY_ENABLED=false`.
- Billing incident: zatrzymaj paywall/purchase exposure zgodnie z aktualnym
  mechanizmem, nie odbierając istniejącego entitlementu bez decyzji ownera.
- 1.1 exposure: natychmiast przywróć wszystkie production flags do `false`.
- Severe user impact: pause rollout/unpublish do zweryfikowanego hotfixu.

## Day0-Day7

Monitoruj co najmniej:

- crash-free sessions i startup failures;
- auth/onboarding completion;
- Add Meal success/failure;
- save/sync failure i dead-letter;
- AI provider errors, latency, credits i koszt;
- billing purchase/restore/entitlement errors;
- notification i Weekly Reports failures;
- Sentry issue/export report for frontend and backend error clusters;
- delete/export failures;
- backend 5xx, latency i saturation;
- telemetry ingestion health;
- błędną ekspozycję domen 1.1.

Nie wznawiaj aktywnego rozwoju 1.1, dopóki release-critical problemy nie są
opanowane zgodnie z notą zawieszenia.
