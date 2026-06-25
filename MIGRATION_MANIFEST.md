# Migracja dokumentacji do Launch 1.0

Status: gotowe do zastosowania
Data: 2026-06-25

## Decyzja

Aktywna dokumentacja opisuje wyłącznie przygotowanie i wydanie Fitaly 1.0.
Rozwój Smart Memory i pozostałych domen 1.1 jest zawieszony do czasu launchu
albo osobnej decyzji release ownera.

## Usuń z aktywnej dokumentacji

Usuń całkowicie:

```text
Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md
Fitaly_Post_Release_Intelligence.md
planning/smart-memory-core-release-acceptance-packet.md
planning/launch-hardening-cwq/
```

Powód:

- dokumenty mieszają implementację 1.1, lokalne QA i release readiness;
- zawierają dated statusy oraz historyczne SHA;
- utrudniają agentom odróżnienie `implemented` od `release-approved`;
- tworzą równoległy backlog wobec realnych launch blockers.

Nie przenoś całego starego pakietu do `archive/`. Zachowaj jedynie skondensowaną
notę `archive/2026-06-1-1-suspended.md`. Historia kodu i Git pozostaje dostępna.

## Dodaj

```text
launch/README.md
launch/00-release-scope.md
launch/01-current-release-status.md
launch/02-release-readiness-gates.md
launch/03-runtime-config-and-feature-flags.md
launch/04-maestro-artifact-library.md
launch/05-ui-ux-screen-audit.md
launch/06-security-privacy-compliance.md
launch/07-billing-and-premium.md
launch/08-backend-production-smoke.md
launch/09-mobile-build-and-store-readiness.md
launch/10-release-decision-template.md
launch/11-work-queue.md
launch/templates/maestro-run-manifest.md
launch/templates/screen-audit-record.md
launch/templates/security-check-record.md
launch/templates/release-evidence.md
archive/2026-06-1-1-suspended.md
```

## Zastąp

Paczka zawiera pełne wersje zastępcze:

```text
README.md
planning/README.md
architecture/decisions.md
runbooks/launch.md
```

Pozostałe dokumenty architektury i runbooki zachowaj, o ile nie zawierają
aktywnych linków do usuwanych plików.

## Kolejność zastosowania

1. Utwórz osobny branch dokumentacyjny.
2. Usuń stare dokumenty i katalog CWQ.
3. Skopiuj nowe pliki.
4. Wyszukaj stare referencje:

```bash
git grep -n "smart-memory-core-release-acceptance-packet" || true
git grep -n "launch-hardening-cwq" || true
git grep -n "Fitaly_Post_Release_Intelligence" || true
git grep -n "Fitaly_Codex_Controller_Worker_QA_Launch_Hardening" || true
```

5. Usuń lub popraw każdą aktywną referencję. W archiwalnej nocie można użyć
   nazw historycznych wyłącznie jako informacji o wycofanych dokumentach.
6. Sprawdź linki względne i nagłówki.
7. Potwierdź, że root `README.md` wskazuje `launch/README.md` jako aktywny punkt
   wejścia.
8. Zacommituj zmianę dokumentacyjną przed rozpoczęciem kolejnego packetu kodu.

## Kryteria akceptacji migracji

- żaden aktywny dokument nie sugeruje `FULL_1_1_RC_READY`;
- żaden aktywny dokument nie traktuje planów `00-09` jako backlogu;
- `launch/01-current-release-status.md` jest jedynym aktywnym snapshotem statusu;
- `launch/02-release-readiness-gates.md` jest jedynym katalogiem gate'ów;
- wszystkie nowe domeny 1.1 są jawnie production-off;
- finalna decyzja release ma jedno źródło: wypełniony
  `launch/templates/release-evidence.md`.
