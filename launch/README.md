# Fitaly Launch 1.0

Status: aktywny pakiet wykonawczy
Data startu: 2026-06-25
Owner: release owner

## Cel

Doprowadzić aktualną parę `fitaly` + `fitaly-backend` do uczciwej decyzji o
wydaniu core produktu. Pakiet nie służy do dalszego rozwoju 1.1.

## Dozwolone decyzje

```text
CORE_RC_READY
NO_GO
BLOCKED_EXTERNAL_DEPENDENCY
```

`FULL_1_1_RC_READY` nie jest aktywnym celem. Globalny status może mieć tylko
jedną wartość. Gate może być `blocked_external`, ale całe wydanie pozostaje
`NO_GO`, jeśli istnieją również niewykonane lub nieudane P0 zależne od projektu.

## Kanoniczny runtime gate

Launch 1.0 używa:

```bash
cd fitaly
npm run e2e:core-release-gate
```

Nie używaj jako dowodu core readiness:

```text
npm run e2e
npm run e2e:release-gate
npm run e2e:full-review
```

Obecny broad `release-gate` i `full-review` obejmują zawieszone powierzchnie 1.1,
m.in. Smart Memory, Recipe Catalog, Known Patterns, Planning, Home Next Action i
Food Library autocomplete. Mogą służyć do diagnostyki, ale nie definiują zakresu
Launch 1.0.

## Dokumenty

1. [Release scope](./00-release-scope.md)
2. [Aktualny status](./01-current-release-status.md)
3. [Readiness gates](./02-release-readiness-gates.md)
4. [Runtime config i feature flags](./03-runtime-config-and-feature-flags.md)
5. [Biblioteka artefaktów Maestro](./04-maestro-artifact-library.md)
6. [Audyt UI/UX ekranów](./05-ui-ux-screen-audit.md)
7. [Security, privacy i compliance](./06-security-privacy-compliance.md)
8. [Billing i premium](./07-billing-and-premium.md)
9. [Backend production/smoke](./08-backend-production-smoke.md)
10. [Mobile build i store readiness](./09-mobile-build-and-store-readiness.md)
11. [Szablon decyzji](./10-release-decision-template.md)
12. [Kolejka pracy](./11-work-queue.md)

## Reguły wykonania

- Każdy packet zaczyna się od aktualnego repo evidence.
- Packet musi mieć zakres, acceptance criteria, wynik i artefakty.
- Najpierw napraw przyczynę, potem aktualizuj test/harness.
- Nie osłabiaj asercji tylko po to, żeby uzyskać green.
- Nie używaj E2E-only bypassu w production path.
- Nie zapisuj sekretów ani danych użytkownika w evidence.
- P0 zamyka release. P1 można waive'ować tylko jawnie. P2 trafia po release.
- Nowe domeny pozostają production-off przez cały launch pass.
- Realny sandbox/provider smoke waliduje integrację; nie zastępuje testów
  deterministycznych ani emulatorowych.

## Źródła prawdy

- mobile: aktualny branch i `fitaly/package.json`, `scripts/e2e/suites.json`,
  `eas.json`, workflowy, testy i runtime;
- backend: aktualny branch, `.env.example`, config, CI, testy, runbooki i deployed
  `/health` + `/version`;
- dokumentacja: ten pakiet oraz aktywne runbooki;
- finalny evidence: wypełniony template dla dokładnej pary SHA.
