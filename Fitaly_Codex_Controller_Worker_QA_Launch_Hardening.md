# FITALY — CODEX EXECUTION BRIEF
## Controller–Worker–QA Loop: Launch Hardening obu repozytoriów

**Status:** executable work order + reconciled status snapshot  
**Tryb:** controller → worker → independent QA → repair loop → gate close  
**Repozytoria:** `fitaly`, `fitaly-backend`  
**Branche wejściowe:**

- mobile: `codex/smart-memory-core-loop-fe`
- backend: `codex/smart-memory-core-loop-be`

**Cel nadrzędny:** doprowadzić kod do stanu, w którym można uczciwie wydać decyzję `CORE_RC_READY` albo `FULL_1_1_RC_READY`. Nie wolno uznać całej aplikacji za launch-ready tylko dlatego, że kompiluje się lub ma dużo testów.

---

# 0. Zweryfikowany status bieżący

**Reconciliation timestamp:** `2026-06-24`

Ten brief pozostaje źródłem mandatu i kolejności prac, ale status wykonania
poniżej jest rekoncyliowany z raportami w
`docs/planning/launch-hardening-cwq/reports/`,
`docs/planning/launch-hardening-cwq/01-packet-status.md` oraz
`docs/planning/launch-hardening-cwq/RELEASE_HARDENING_STATUS.md`.

**Checkout i evidence sprawdzone podczas tej korekty dokumentu:**

- mobile `codex/smart-memory-core-loop-fe`:
  `59feb230b74914ef5a7963b05d2a19dd695edef4`;
- backend evidence ref dla F1B/F1C:
  `f681d983941fe2d20cc857811493ee5bbd9def4f`;
- końcowo zaobserwowany backend HEAD po F1D:
  `fe01fbaf92921271968e9d7bde329530b42513eb`
  (`test(food-library): add local autocomplete evidence verifier`);
- mobile worktree był clean;
- backend worktree był clean na końcowym odczycie; F1D ma raport w
  `docs/planning/launch-hardening-cwq/reports/F1D-food-library-autocomplete-local-api-evidence-report.md`;
- F1E current-pair local iOS simulator runtime dla mobile
  `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend
  `fe01fbaf92921271968e9d7bde329530b42513eb` passed
  `ingredient-autocomplete-runtime` `7/7` i ma raport w
  `docs/planning/launch-hardening-cwq/reports/F1E-food-library-current-pair-simulator-runtime-report.md`;
- F1F exact-SHA remote CI pairing dla tej samej pary passed w GitHub Actions:
  mobile run `28062888358`, backend run `28062888045`; raport:
  `docs/planning/launch-hardening-cwq/reports/F1F-food-library-current-pair-remote-ci-report.md`.
- Q0V Android simulator preflight dodał powtarzalny fail-closed check i
  potwierdził lokalny stan `not_ready`: `adb`, `emulator` i Maestro są
  wykryte, ale nie ma booted Android emulatora ani skonfigurowanego AVD;
  mobile commit `80790f6a0fb4c70bf949a39ee7737085195ca3f3` jest pushed, a
  normal exact-SHA CI passed: mobile run `28063907416`, backend run
  `28063907468`;
  raport:
  `docs/planning/launch-hardening-cwq/reports/Q0V-android-simulator-preflight-report.md`.
- Q0W odświeżył current blocked release evidence dla pushed pair mobile
  `80790f6a0fb4c70bf949a39ee7737085195ca3f3` plus backend
  `fe01fbaf92921271968e9d7bde329530b42513eb`, po `git fetch --prune` i
  clean/empty diff-to-origin check w obu repo; raporty:
  `docs/planning/launch-hardening-cwq/reports/Q0W-current-blocked-release-evidence.md`
  oraz
  `docs/planning/launch-hardening-cwq/reports/Q0W-current-blocked-release-evidence-refresh-report.md`.
- Q0X naprawil lokalny iOS no-provider core-gate harness i zostal pushed jako
  mobile `59feb230b74914ef5a7963b05d2a19dd695edef4`; raport:
  `docs/planning/launch-hardening-cwq/reports/Q0X-local-ios-core-gate-harness-repair-report.md`.
  Post-push full-suite attempt nie jest single green `20/20` artifact: 15 flow
  passed, potem Maestro/XCTest splash hierarchy fail w nested login; izolowany
  `chat-basic-history` passed `1/1`, a cztery niedoszle remaining core flows
  passed `4/4`; dla `59feb230...` nie ma exact remote CI runu.
- Q0Y odswiezyl current-pair local iOS simulator `core-release-gate` evidence
  dla mobile `59feb230b74914ef5a7963b05d2a19dd695edef4` plus backend
  `fe01fbaf92921271968e9d7bde329530b42513eb`; single-suite run passed `20/20`
  przeciw lokalnemu backendowi i Auth/Firestore emulatorom, z provider env
  blanked i billing disabled; raport:
  `docs/planning/launch-hardening-cwq/reports/Q0Y-current-pair-local-ios-core-gate-report.md`.

**Aktualna decyzja:** `BLOCKED_EXTERNAL_DEPENDENCY`.

Nie ma repo-evidence dla `CORE_RC_READY` ani `FULL_1_1_RC_READY`.
Q0U potwierdza exact-SHA remote CI pairing dla pary
mobile `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43` +
backend `706e2fff7788636d804339fd0845b98e523ce1ac`, F1C potwierdza local iOS
simulator runtime dla aktualnego mobile `5de157eb...` z exact backend ref
`f681d983...`, F1D potwierdza lokalne API-route PL/EN query-hit i latency
evidence dla backendu `fe01fbaf...`, F1E odświeża local iOS simulator runtime
na aktualnej parze `5de157...` + `fe01fba...` z wynikiem `7/7`, a F1F
potwierdza exact-SHA remote CI pairing dla tej samej pary. Te dowody nie
zastępują provider smoke, Android runtime, live RC workflow, deployed backend
SHA, billing, backup/restore, privacy/Sentry, compliance, rollback ani
production smoke. Q0V klasyfikuje obecny Android blocker jako brak lokalnego
simulatora/AVD, a nie aplikacyjny runtime fail; normal CI dla pary
`80790f6a...` + `fe01fba...` przeszło, ale nie zastępuje Android runtime.
Q0W zapisuje tamta parę jako clean/synced blocked-evidence pair, nie jako
release-ready pair. Q0X przesuwa mobile do `59feb230...` i dodaje lokalna
naprawe harnessu. Q0Y dostarcza single green post-push local iOS simulator
`core-release-gate` `20/20` artifact dla tej pary, ale nadal nie ma exact
remote CI dla `59feb230...` ani provider/manual/live RC/deployed evidence.
Physical-device validation jest pominięte zgodnie z decyzją owner i nie jest
claimowane.

| Packet | Working-docs status | Execution status | Evidence summary | Remaining blocker |
|---|---|---|---|---|
| C0 | done | qa_passed | `reports/C0-baseline-report.md` | none for baseline |
| C1 | done | qa_passed | `reports/C1-release-pairing-report.md` | live RC/provider evidence remains Q0 |
| C2 | done | qa_passed | `reports/C2A-feature-flags-backend-config-report.md`, `reports/C2B1-mobile-request-suppression-report.md`, `reports/C2B2-mobile-disabled-ui-routes-report.md` | none for local disabled-behavior gate |
| C3 | done | qa_passed | `reports/C3-durable-meal-side-effects-report.md` | none for local durable-side-effect gate |
| C4 | done | qa_passed | `reports/C4-export-delete-reconciliation-report.md` | none for local export/delete gate |
| C5 | partial | qa_passed local slices | C5A-C5D reports and JUnit snapshots | complete authorized runtime/prod telemetry evidence for activated domains and rollout authorization |
| F1 | partial | qa_passed local slices | F1A/F1B/F1C/F1D/F1E/F1F reports; F1E current-pair local iOS autocomplete runtime `7/7`; F1F current-pair exact-SHA remote CI pairing; F1D local API-route PL/EN query-hit and latency evidence | approved corpus, owner quality review/source-confidence sign-off, authorized provider/prod evidence, deployed/network latency evidence, rollout approval; physical-device validation skipped by owner instruction and not claimed |
| M1 | done | qa_passed | M1A-M1G reports | production activation still blocked by Q0 and rollout authorization |
| M2 | done | qa_passed | M2A-M2G reports | production activation still blocked by Q0 and rollout authorization |
| K1 | done | qa_passed | K1A/K1B/K1C reports | production activation still blocked by Q0 and rollout authorization |
| R1 | partial | qa_passed local boundary slices | R1A/R1B/R1C reports | approved content pack, source/storage decision, owner review, nutrition/provenance sign-off, deploy config, real-pack runtime/E2E |
| P1 | done | qa_passed | `reports/P1-planning-truthful-lifecycle-report.md` | Planning remains production-off until telemetry/Q0/rollout gates |
| H1 | planned | pending | no implementation evidence found | must run last after source-domain gates |
| Q0 | blocking | blocked_external | Q0A-Q0Y reports plus later F1E local simulator refresh and F1F remote CI pairing; Q0X pushed mobile `59feb230...` with local iOS harness repair and Q0Y added a single current-pair local iOS simulator `core-release-gate` `20/20` artifact; Q0V Android simulator preflight is `not_ready` because no booted emulator or configured AVD exists | exact remote CI for `59feb230...`, provider/manual evidence, Android simulator runtime target, live RC workflow, deployed SHA, billing, backup/restore, production smoke, privacy/Sentry/compliance/rollback; physical-device validation skipped by owner instruction and not claimed |

---

# 1. Mandat wykonawczy

Masz wykonać realne prace w obu repozytoriach. Nie kończ na analizie, propozycji architektury ani liście TODO.

Pierwszym celem jest **bezpieczny release core aplikacji z nowymi domenami wyłączonymi produkcyjnie**. Kolejne domeny mogą być uruchamiane dopiero po przejściu własnych gate’ów.

Docelowe wyniki są dwa:

```text
CORE_RC_READY
```

Core loop, billing, privacy, telemetry, release evidence i rollback są gotowe. Niedojrzałe funkcje 1.1 pozostają za flagami.

```text
FULL_1_1_RC_READY
```

Oprócz core wszystkie aktywowane domeny 1.1 przeszły własne gate’y jakości, danych, privacy, telemetry i E2E.

Jeżeli brakuje zewnętrznego contentu, credentials, store evidence albo produkcyjnych danych, oznacz wynik jako:

```text
BLOCKED_EXTERNAL_DEPENDENCY
```

Nie fabrykuj dowodu i nie zastępuj go mockiem.

---

# 2. Stan wejściowy i werdykt audytu

Stan wejściowy z audytu był traktowany jako **integration alpha / NO-GO**.
Po wykonanych packetach aktualna decyzja robocza pozostaje
`BLOCKED_EXTERNAL_DEPENDENCY`, nie `CORE_RC_READY`.

Referencyjne heady z audytu, tylko do identyfikacji punktu wyjścia:

- mobile: `5827c0a8c7618ce1523734e83f752e15e25258be`
- backend: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

Controller ma na starcie pobrać aktualne SHA. Nie zakładaj, że branche nadal wskazują powyższe commity.

Potwierdzone ryzyka wejściowe:

1. Mutacja posiłku może zostać trwale zapisana, a późniejszy efekt uboczny może spowodować błąd odpowiedzi lub niespójność.
2. Retry tej samej mutacji może nie naprawić pominiętego efektu ubocznego.
3. Smart Memory export ma bounded read i może po cichu uciąć dane.
4. Nowe domeny nie mają wystarczająco granularnych kill switchy.
5. Planning tworzy zmyślone makro dla planu z samej nazwy.
6. Planned meal nie ma domkniętego, idempotentnego lifecycle `plan → review → logged meal`.
7. Recipe Catalog zawiera foundation fixtures przedstawiane jak gotowy katalog.
8. Known Patterns grupuje dane zbyt słabą tożsamością i może tworzyć fałszywe wzorce.
9. Home Next Action agreguje niedojrzałe źródła i zwiększa blast radius.
10. Release Candidate workflow nie certyfikuje w sposób twardy dokładnej pary FE SHA + BE SHA.
11. Brakuje kompletnej telemetry dla nowych domen.
12. Brak widocznego, zielonego evidence package dla tej konkretnej pary branchy.

Powyższe punkty należy najpierw potwierdzić testem lub inspekcją, następnie naprawić. Nie wolno ich zamknąć samą opinią.

---

# 3. Źródła prawdy i reguła rozstrzygania konfliktów

Kierunek produktu:

1. `Fitaly_Product_SoT_PRD_v2.md`
2. `Fitaly_1_1_Smart_Memory_Release_Slicing_Plan_v0_1-3.md`
3. `Fitaly_Technical_Architecture_SoT_v2.md`
4. `Fitaly_Analytics_KPI_Spec_v2.md`
5. `Fitaly_Launch_Readiness_Playbook_v1.md`
6. faktyczne kontrakty i zachowanie kodu

Reguła wykonawcza:

> W konflikcie między szerokością scope’u a launch safety wygrywa launch safety. Funkcję można ukończyć technicznie, ale pozostawić wyłączoną do czasu przejścia jej gate’u.

Nie wolno:

- budować silent fallbacków do legacy;
- zapisywać posiłku bez Review/confirmation;
- generować lub zgadywać trwałych wartości odżywczych;
- przedstawiać fixture’ów jako produkcyjnego contentu;
- ukrywać błędu przez pusty catch bez durable recovery;
- uznawać `tests exist` za dowód `tests passed`;
- uznawać smoke na `main` backendu za dowód zgodności badanego backend branch;
- wysyłać do telemetry raw names, notes, prompts, responses, images ani pełnych payloadów użytkownika.

---

# 4. Model pracy Controller–Worker–QA

## 4.1 Controller

Controller jest właścicielem kolejności, zależności, statusu i końcowej decyzji.

Obowiązki:

1. Wykryj ścieżki obu repozytoriów.
2. Zweryfikuj branche i zapisz aktualne SHA.
3. Sprawdź clean working tree. Nie kasuj obcych zmian.
4. Utwórz lub aktualizuj plik:

```text
RELEASE_HARDENING_STATUS.md
```

5. Rozpisz work packets z tego dokumentu na konkretne pliki po inspekcji repo.
6. Przydzielaj workerowi tylko jeden logiczny packet naraz.
7. Nie pozwalaj dwóm workerom równolegle edytować tych samych plików.
8. Po pracy workera uruchom niezależnego QA.
9. QA nie może zaakceptować packetu bez dowodu testowego.
10. Zamykaj packet dopiero po statusie `QA_PASS`.
11. Po dwóch odrzuconych repair loopach wykonaj RCA i zmniejsz zakres zmiany zamiast dokładać kolejne obejścia.
12. Po każdym wave zaktualizuj evidence i risk register.

Controller nie implementuje dużej zmiany sam, chyba że naprawa jest trywialna i nie wymaga niezależnego workera. Nadal wymaga niezależnego QA.

## 4.2 Worker

Worker implementuje dokładnie jeden packet.

Każdy raport workera musi zawierać:

```md
## Worker report
Packet:
Repositories changed:
Files changed:
Behavior before:
Behavior after:
Tests added/changed:
Commands run:
Results:
Known limitations:
Risks introduced:
```

Zasady:

- minimalny diff zgodny z architekturą;
- bez pobocznych refactorów;
- bez wyłączania istniejących testów;
- bez `skip`, `xfail`, `passWithNoTests` jako sposobu zaliczenia packetu;
- każdy fix regresji dostaje test odtwarzający błąd;
- kontrakt zmieniany cross-repo musi zostać zmieniony w obu repo w tym samym packetcie;
- worker nie wydaje finalnej decyzji jakościowej o własnej pracy.

## 4.3 Independent QA

QA ma być adversarial. Najpierw czyta wymagania i diff, potem próbuje obalić rozwiązanie.

Raport:

```md
## QA report
Packet:
Verdict: QA_PASS / QA_FAIL
Severity of findings: P0 / P1 / P2 / none
Acceptance criteria checked:
Commands rerun:
Negative tests:
Cross-repo contract result:
Regression risks:
Required repairs:
```

QA ma odrzucić zmianę, jeśli:

- naprawia happy path, ale nie retry/offline/concurrency;
- catchuje błąd bez durable retry;
- flaga ukrywa UI, lecz backend nadal wykonuje side effect;
- backend jest wyłączony, lecz mobile nadal wykonuje requesty;
- dane są ucinane bez błędu;
- test opiera się wyłącznie na mocku, mimo że istnieje emulator/integration path;
- zmiana kontraktu nie ma fixture/contract testu;
- release evidence nie wskazuje dokładnych SHA;
- worker „naprawił” Recipe Catalog przez wygenerowanie placeholderów.

## 4.4 Pętla

```text
CONTROLLER_PLAN
  → WORKER_IMPLEMENT
  → WORKER_SELF_TEST
  → QA_REVIEW
      → QA_PASS → CONTROLLER_CLOSE
      → QA_FAIL → WORKER_REPAIR → QA_REVIEW
```

Maksymalnie dwa repair loopy bez RCA. Po trzecim problem ma wrócić do controllera jako źle pocięty packet albo błędna decyzja architektoniczna.

---

# 5. Branching i bezpieczeństwo repozytoriów

Na początku:

```bash
git fetch --all --prune
git status --short
git rev-parse HEAD
git branch --show-current
```

Zasady:

- nie pracuj bezpośrednio na `main`;
- nie force-pushuj;
- nie squashuj cudzych commitów;
- nie usuwaj istniejących branchy;
- nie modyfikuj secrets ani realnych credentials;
- nie commituj `.env`, tokenów, Firebase credentials, RevenueCat keys ani Sentry tokens;
- nie zmieniaj package/bundle identifiers poza istniejącą, zatwierdzoną konwencją;
- iOS production bundle ID pozostaje `com.lkurczab.foodscannerai`;
- Android package pozostaje `com.lkurczab.fitaly`.

Rekomendowane branche robocze, jeżeli controller ma uprawnienia do ich utworzenia:

```text
codex/launch-hardening-fe
codex/launch-hardening-be
```

Powinny bazować na wskazanych branchach wejściowych, nie na `main`.

---

# 6. Severity i stop conditions

## P0 — zawsze blokuje

- podstawowa mutacja może zapisać dane i zwrócić błędny stan bez recovery;
- core app crashuje przy starcie/auth/save;
- export/delete jest niekompletny lub nieweryfikowalny;
- billing purchase nie daje entitlement;
- contract drift FE–BE;
- produkcyjny build używa błędnego backendu lub placeholder legal URLs;
- brak telemetry dla core failure/purchase health;
- secret/raw payload trafia do logów lub evidence;
- Recipe/Planning może zapisać wymyślone dane jako prawdziwe;
- aktywna funkcja nie ma kill switcha i predictable disabled behavior.

## P1 — blokuje dany feature wave

- niekrytyczny core UI defect;
- flaky E2E bez manualnego dowodu;
- brak jakościowego corpus/content gate;
- duży false-positive risk dla sugestii;
- brak pełnej telemetry danego feature’u;
- source deep link otwiera ogólny ekran zamiast właściwego obiektu.

## Stop immediately

Zatrzymaj implementację i zgłoś controllerowi, jeśli:

- wymagana jest zmiana produkcyjnych danych bez migracji/backup path;
- wymagane są realne credentials;
- brakuje zatwierdzonego content packu;
- istnieją niecommitowane, obce zmiany kolidujące z packetem;
- rozwiązanie wymaga rozszerzenia scope’u poza ten dokument;
- test wykryje utratę danych lub cross-user access.

---

# 7. Docelowa macierz rolloutowa

Nowe domeny mają mieć niezależne flagi. Użyj poniższych nazw, chyba że repo posiada już równoważne, kanoniczne nazwy. Nie twórz duplikatu istniejącej flagi.

## Backend

```text
FOOD_LIBRARY_ENABLED
SMART_MEMORY_ENABLED
SMART_MEMORY_CAPTURE_ENABLED
SMART_MEMORY_APPLY_ENABLED
KNOWN_PATTERNS_ENABLED
RECIPE_CATALOG_ENABLED
PLANNED_MEALS_ENABLED
```

## Mobile

```text
EXPO_PUBLIC_ENABLE_FOOD_LIBRARY
EXPO_PUBLIC_ENABLE_SMART_MEMORY
EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS
EXPO_PUBLIC_ENABLE_RECIPE_CATALOG
EXPO_PUBLIC_ENABLE_PLANNING
EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION
EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION
```

## Wymagane zachowanie

| Warstwa | Gdy disabled |
|---|---|
| Backend route | stabilny `503` lub domenowy disabled response z bounded `detail.code`; zero side effects |
| Mobile entry point | niewidoczny albo bezpieczny unavailable state |
| Mobile runtime | brak requestów do wyłączonej domeny |
| Deep link | kontrolowany unavailable state, bez crasha |
| Telemetry | opcjonalny bounded disabled reason, bez raw payloadu |
| Legacy | brak silent fallbacku |

## Rekomendowana konfiguracja początkowa

| Domena | Smoke | Production po core hardening |
|---|---:|---:|
| Food Library | on | off do F1 gate |
| Smart Memory API/controls | on | off do M2 gate |
| Smart Memory capture | shadow on | off lub shadow do M1 gate |
| Smart Memory apply | off | off do M2 gate |
| Known Patterns | on w test fixtures | off do K1 gate |
| Recipe Catalog | on tylko z test dataset | off do content gate |
| Planning | on w smoke | off do P1 gate |
| Home Next Action | on w focused E2E | off do H1 gate |

Production flags mogą zostać przełączone dopiero po zapisaniu decyzji w evidence package.

---

# 8. Kolejność wave’ów

```text
W0 Baseline and scope lock
  ↓
W1 Release pairing + feature isolation
  ↓
W2 Core mutation integrity + privacy completeness
  ↓
W3 Core regression and RC evidence
  ↓
W4 Food Library
  ↓
W5 Smart Memory shadow capture
  ↓
W6 Smart Memory controls and apply
  ↓
W7 Known Patterns
  ↓
W8 Recipe Catalog content boundary
  ↓
W9 Planning truthful lifecycle
  ↓
W10 Home Next Action integration
  ↓
W11 Full paired release gate
```

Nie wolno implementować Home Next Action jako aktywnej produkcyjnie powierzchni przed zaliczeniem źródeł, które agreguje.

---

# 9. Work packets

## C0 — Baseline, scope lock i reproducibility

**Repo:** oba  
**Dependencies:** none  
**Priority:** P0

### Cel

Utworzyć odtwarzalny punkt startowy oraz listę dokładnych zmian względem `main`.

### Wymagane działania

1. Zapisz repo paths, branch names i SHA.
2. Zapisz status working trees.
3. Zapisz wersję Node/npm, Python, Java, Expo/EAS, Firebase CLI.
4. Wygeneruj listę zmienionych plików względem `main`.
5. Uruchom istniejące szybkie testy baseline bez naprawiania.
6. Utwórz `RELEASE_HARDENING_STATUS.md` z tabelą packetów.
7. Oznacz każdy istniejący failure jako `pre-existing` albo `introduced`.

### Acceptance criteria

- dokładne SHA obu repo są zapisane;
- żaden branch nie jest omyłkowo oparty na innym refie;
- istnieje baseline command log;
- controller może odtworzyć parę repo na innym checkoutcie.

### QA attacks

- zmiana branch między odczytem SHA a testem;
- dirty working tree;
- brakujące submodule/sibling repo;
- kontrakt FE sprawdzany przeciw backend `main`, a nie badany branch.

---

## C1 — Exact-SHA cross-repo CI i release evidence

**Repo:** oba, głównie mobile workflows  
**Dependencies:** C0  
**Priority:** P0

### Cel

Release workflow ma certyfikować dokładnie jedną parę mobile SHA + backend SHA.

### Wymagane zmiany

1. Usuń hardcoded backend `@main` z Release Candidate path.
2. Wymagaj exact backend SHA przez workflow input albo wersjonowany manifest release pair.
3. Przekaż ten ref do:
   - backend reusable CI,
   - backend checkout w contract tests,
   - release evidence,
   - smoke/deploy verification.
4. Evidence ma zawierać:
   - mobile SHA,
   - backend SHA,
   - target environment,
   - feature flag snapshot,
   - CI/E2E results.
5. Production readiness nie może akceptować placeholder legal URLs.
6. `example.com`, `localhost` i puste wartości mają failować dla production profile.
7. Sentry production absence ma być blocking albo jawnie potwierdzona przez sprawdzalny secret/evidence path; samo warning nie wystarcza.
8. Dodaj testy workflow helperów/readiness scriptu.

### Acceptance criteria

- w RC workflow nie ma zależności od ruchomego backend `main`;
- evidence wskazuje dokładny backend commit;
- contract test używa tego samego refu;
- production readiness odrzuca placeholder URL;
- brak możliwości wygenerowania zielonego evidence dla innej pary repo.

### Required tests

Mobile:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
BACKEND_REPO=<paired-backend-path> ./scripts/verify-backend-contract.sh
```

Workflow syntax validation zgodnie z dostępnym toolingiem.

### QA attacks

- podaj branch name zamiast SHA;
- podaj nieistniejący SHA;
- zmień backend po rozpoczęciu workflow;
- użyj `https://example.com/terms`;
- brak Sentry DSN w production path.

---

## C2 — Granular feature flags i predictable disabled behavior

**Repo:** oba  
**Dependencies:** C0  
**Priority:** P0

### Cel

Każdą nową domenę można wyłączyć osobno bez deploymentu całej aplikacji i bez silent fallbacku.

### Wymagane zmiany

1. Dodaj/ujednolić flagi z sekcji 7.
2. Backend ma sprawdzać flagę przed Firestore/provider work.
3. Mobile ma sprawdzać flagę przed:
   - renderowaniem entry pointu,
   - wykonywaniem requestu,
   - uruchomieniem background/sync work,
   - obsługą deep linku.
4. Dodaj stabilne error codes dla disabled routes.
5. Zaktualizuj `.env.example`, runtime docs, `eas.json`, readiness validation i testy.
6. Smoke może jawnie włączać domeny. Production startuje bez nowych domen, dopóki wave nie przejdzie.

### Acceptance criteria

- każda domena ma unit/route test dla disabled mode;
- disabled capture nie wykonuje żadnego zapisu;
- disabled mobile nie wysyła requestu;
- brak legacy fallbacku;
- config drift między smoke/prod jest testowany.

### QA attacks

- route disabled, ale service wywołany bezpośrednio przez meal side effect;
- UI hidden, lecz Home nadal fetchuje endpoint;
- deep link omija flagę;
- E2E fixture wymusza aktywację w production build.

---

## C3 — Durable meal side effects / transactional outbox

**Repo:** backend, kontrakty/testy w mobile jeśli wymagane  
**Dependencies:** C0, C2  
**Priority:** P0

### Problem do usunięcia

Meal upsert/delete nie może trwale zatwierdzić podstawowej mutacji i następnie zwrócić niejednoznacznego błędu z powodu streak/Smart Memory projection. Retry musi naprawiać pending effects.

### Inwarianty

1. Primary meal mutation jest atomowa i idempotentna.
2. Po commicie primary mutation odpowiedź nie failuje z powodu niekrytycznego downstream effect.
3. Każdy downstream effect ma durable event/job.
4. Event ID jest deterministyczny względem mutation ID i effect kind.
5. Processing jest idempotentny.
6. Retry tej samej meal mutation próbuje domknąć pending effects.
7. Awaria przechodzi przez retry/backoff, potem dead-letter z widoczną diagnostyką.
8. Istnieje reconciliation command/job.

### Rekomendowany wzorzec

Firestore transactional outbox, zapisany w tej samej transakcji co meal mutation i mutation dedupe.

Minimalne eventy:

```text
meal_saved.streak_sync
meal_saved.smart_memory_capture
meal_deleted.streak_sync
meal_deleted.smart_memory_source_delete
```

Minimalne pola:

```text
eventId
ownerUserId
sourceMutationId
sourceEntityId
kind
status
attemptCount
nextAttemptAt
createdAt
updatedAt
lastErrorCode
```

Po commicie request może wykonać best-effort processing, ale błąd processingu nie może zmienić sukcesu primary mutation. Durable pending event musi pozostać do retry.

Dodaj operator/reconciliation path. Może to być skrypt uruchamiany cyklicznie lub istniejący worker mechanism. Sam `catch + warning` nie spełnia wymagań.

### Acceptance criteria

- wstrzyknięta awaria streaka nie powoduje utraty meal response;
- outbox pozostaje pending;
- retry domyka streak bez duplikacji;
- wstrzyknięta awaria memory capture nie duplikuje candidate/item;
- delete meal z awarią memory source cleanup nadal zwraca poprawny stan meal delete;
- reconciliation usuwa ghost memory;
- duplicate client mutation nie tworzy dodatkowego meal ani outbox eventu;
- outbox jest objęty account delete i export policy.

### Required tests

Backend unit + Firestore emulator/integration:

- commit succeeds / effect fails;
- duplicate retry;
- concurrent retry;
- dead-letter threshold;
- reconciliation;
- delete source propagation;
- account delete with outbox rows.

### QA attacks

- crash procesu po primary commit, przed best-effort processing;
- dwa workery przetwarzają ten sam event;
- effect kończy się sukcesem, ale update statusu outbox failuje;
- mutation dedupe replay po częściowym processingu;
- feature flag zostaje wyłączona między enqueue a processingiem.

---

## C4 — Complete export, delete i data reconciliation

**Repo:** backend  
**Dependencies:** C0; po C3 uwzględnij outbox  
**Priority:** P0

### Cel

Account export i delete obejmują wszystkie rekordy użytkownika i nigdy nie kończą się cichym truncation.

### Wymagane zmiany

1. Usuń bounded silent truncation dla Smart Memory export.
2. Zaimplementuj pełną paginację do wyczerpania kolekcji.
3. Obejmij:
   - memory items,
   - candidates,
   - settings,
   - tombstones,
   - mutation dedupe,
   - food library user records,
   - known pattern controls/dedupe,
   - planned meals/dedupe,
   - nowy outbox/dead letters,
   - wszystkie nowe user-scoped collections dodane w packetach.
4. Jeśli eksport nie może potwierdzić kompletności, ma failować, nie zwracać partial success.
5. Dodaj count/manifest verification do smoke evidence.
6. Delete ma być idempotentny i bezpieczny przy częściowym poprzednim wykonaniu.
7. Usuń dane z storage i top-level collections powiązane user hash/user ID.

### Acceptance criteria

- testy z `0`, `1`, `249`, `250`, `251`, `501+` dokumentami;
- brak limitu powodującego silent partial export;
- manifest count odpowiada zapisanym rekordom;
- account delete usuwa wszystko po ponownym uruchomieniu;
- brak cross-user leakage;
- export nie zawiera forbidden raw provider payloads.

### QA attacks

- dokładnie 250 rekordów;
- rekord dodany podczas paginacji;
- duplikowany cursor timestamp;
- interrupted delete;
- Firestore transient error na kolejnej stronie;
- user z outbox dead letters.

---

## C5 — Telemetry contracts dla nowych domen

**Repo:** oba  
**Dependencies:** C1, C2  
**Priority:** P1 dla core, gate dla każdego feature wave

### Cel

Nowe funkcje są mierzalne bez PII i bez semantic drift.

### Minimalne eventy

Smart Memory:

```text
memory_candidate_created
memory_candidate_confirmed
memory_candidate_dismissed
memory_used
memory_muted
memory_deleted
```

Planning:

```text
planned_meal_created
planned_meal_confirmed
planned_meal_changed
planned_meal_skipped
```

Home używa istniejących:

```text
home_next_action_shown
home_next_action_started
home_next_action_dismissed
```

Recipe/Food Library mogą używać istniejących autocomplete events i minimalnych nowych domain facts, jeśli są niezbędne do decyzji rolloutowej.

### Reguły props

Tylko bounded categories, np.:

```text
memoryType
surface
confidenceBucket
actionResult
sourceType
estimateState
featureState
```

Zakazane:

- meal name;
- ingredient name;
- notes;
- candidate raw ID, jeśli nie jest niezbędny;
- raw reason text;
- prompt/response;
- image URL;
- pełny payload.

### Acceptance criteria

- mobile i backend allowlist są zgodne;
- contract fixture jest wspólna albo weryfikowana cross-repo;
- disabled telemetry zachowuje przewidywalny no-op;
- E2E potwierdza co najmniej jeden krytyczny event per aktywowana domena;
- data quality test odrzuca forbidden props.

---

## F1 — Food Library / autocomplete hardening

**Repo:** oba  
**Dependencies:** C2, C5, C4  
**Priority:** pierwszy feature wave

### Cel

Food Library jest pierwszym kandydatem do kontrolowanego rollout’u, ale tylko z wiarygodnym corpus i przewidywalnym offline behavior.

### Wymagane działania

1. Potwierdź jeden kanoniczny model produktu/składnika.
2. Zachowaj user-scoped i global record boundaries.
3. Sprawdź cursor pagination i update/delete conflict handling.
4. Potwierdź offline queue, dead-letter retry/discard i projection recovery.
5. Search degraded response nie może udawać realnego `no results` bez warning state.
6. Nie pokazuj candidate-only records jako verified result.
7. Dodaj dataset validator i import evidence.
8. Nie pobieraj i nie zapisuj zewnętrznych danych bez source attribution i walidacji.
9. Nie generuj makro przez AI.

### Launch gate

Techniczny gate:

- contract tests green;
- emulator tests green;
- autocomplete E2E green;
- create/update/delete offline recovery green;
- no-result i degraded są rozróżnialne;
- latency evidence istnieje.

Data gate:

- zatwierdzony seed/corpus;
- źródło i confidence;
- brak placeholder records;
- pokrycie podstawowych zapytań PL/EN;
- quality review ma ownera.

Jeśli data gate nie przechodzi, pozostaw flagę production `off`.

### QA attacks

- dwuznakowe zapytanie;
- diakrytyki PL;
- ten sam alias w rekordzie globalnym i user-scoped;
- delete offline, potem remote edit;
- malformed record w pull page;
- backend degraded vs zero results;
- stale cursor i rekordy o tym samym `updatedAt`.

### Current execution status

F1 is `partial`, not pending. F1A is locally accepted in
`docs/planning/launch-hardening-cwq/reports/F1A-food-library-seed-validation-report.md`:
the backend seed/corpus validator and local E2E seed import evidence path passed
controller gates after QA-driven repairs.

F1B is accepted in
`docs/planning/launch-hardening-cwq/reports/F1B-food-library-autocomplete-local-harness-report.md`:
the focused `ingredient-autocomplete-runtime` local harness is wired, local-only
Food Library activation is guarded to loopback backend plus Auth/Firestore
emulators, backend autocomplete seeding rejects non-loopback emulator hosts
before writes, and exact-SHA remote mobile/backend CI passed for the F1B pair.

F1C is accepted in
`docs/planning/launch-hardening-cwq/reports/F1C-food-library-autocomplete-runtime-report.md`:
local iOS simulator `ingredient-autocomplete-runtime` passed `7/7` against a
local backend and Firebase emulators after repairing the real ingredient-add CTA
touch target/tap handling and preserving caller-blanked provider/secrets env
overrides in the local runner. F1C mobile CI run `28041016021` passed with exact
backend ref `f681d983941fe2d20cc857811493ee5bbd9def4f`.

F1D is accepted in
`docs/planning/launch-hardening-cwq/reports/F1D-food-library-autocomplete-local-api-evidence-report.md`:
backend local API-route verifier proves PL `Owies`, PL diacritic `Ostrzeżenie`,
and EN `Oats` query hits through
`/api/v2/users/me/ingredient-products/search` against in-memory local seed
records, with local route latency p95 `1.17ms` under the `50ms` local threshold.
Backend commit `fe01fbaf92921271968e9d7bde329530b42513eb` is pushed and
independent re-QA returned `pass`.

F1E is accepted as local simulator evidence only in
`docs/planning/launch-hardening-cwq/reports/F1E-food-library-current-pair-simulator-runtime-report.md`:
current-pair local iOS simulator `ingredient-autocomplete-runtime` passed `7/7`
for mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend
`fe01fbaf92921271968e9d7bde329530b42513eb`. The first attempt failed before app
flow execution because `maestro` was not on `PATH`; the accepted rerun used the
local Maestro bin path explicitly and produced seven JUnit XML reports under
`/private/tmp/fitaly-f1-current-pair-ingredient-autocomplete-runtime-20260624-rerun1/reports/`,
each declaring `tests="1"` and `failures="0"`.

F1F is accepted as remote CI pairing evidence only in
`docs/planning/launch-hardening-cwq/reports/F1F-food-library-current-pair-remote-ci-report.md`:
mobile GitHub Actions run
`https://github.com/lukaszkurczab/fitaly/actions/runs/28062888358` passed on
mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` with backend contract ref
`fe01fbaf92921271968e9d7bde329530b42513eb`, and backend run
`https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28062888045`
passed on backend `fe01fbaf92921271968e9d7bde329530b42513eb` with mobile
contract ref `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`.

F1 remains `partial`. Food Library stays production-off until approved
production corpus, owner quality review/source-confidence sign-off, authorized
provider/production evidence, deployed/network latency evidence and rollout
approval exist. Physical-device validation is skipped by owner instruction and
is not claimed.

---

## M1 — Smart Memory shadow capture i time-window semantics

**Repo:** backend + kontrakty mobile  
**Dependencies:** C2, C3, C4, C5, F1 jeśli memory używa Food Library  
**Priority:** drugi feature wave

### Cel

Capture działa deterministycznie, nie wpływa na core save, a przed aktywacją sugestii może działać w shadow mode.

### Wymagane zmiany

1. Rozdziel:
   - capture candidate,
   - promotion/activation,
   - apply/use in Review.
2. `SMART_MEMORY_CAPTURE_ENABLED=true` nie może automatycznie oznaczać `SMART_MEMORY_APPLY_ENABLED=true`.
3. W shadow mode candidate pozostaje candidate i nie wpływa na sugestie.
4. Zastąp „ostatnie 20 posiłków” jawnym oknem czasowym:
   - typical meals/portions: 21 dni,
   - corrections: 30 dni,
   - suppression/preferences: 30 dni.
5. Próg minimalny pozostaje co najmniej 3 kwalifikujące obserwacje na 3 różnych dniach/kontekstach.
6. Usunięte źródła i tombstones muszą blokować ponowną aktywację.
7. Capture processing przechodzi przez durable effect z C3.
8. Brak danych nie tworzy pozornej personalizacji.
9. Telemetry używa wyłącznie kategorii.

### Acceptance criteria

- 3 obserwacje jednego dnia nie aktywują candidate;
- 3 dni w oknie tworzą candidate;
- obserwacje poza oknem nie liczą się;
- mixed units/conflicting clusters blokują candidate;
- capture disabled = zero writes;
- shadow = candidate, zero active memory;
- apply disabled = zero wpływu na Review;
- source delete usuwa wpływ i zapobiega odtworzeniu;
- replay outbox jest idempotentny.

### QA attacks

- timezone/dayKey boundary;
- DST;
- 2 obserwacje dziś + 1 sprzed 31 dni;
- edit tego samego meal zamiast nowego dnia;
- usunięcie jednego z trzech źródeł;
- user wyłącza memory w trakcie pending outbox;
- równoległe candidate promotion.

### Current execution status

M1A is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/M1A-smart-memory-shadow-capture-report.md`.
Backend capture no longer auto-promotes candidates for typical-portion or
review-correction capture. This closes only the capture/promotion separation
slice. M1B1 is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/M1B1-smart-memory-typical-portion-window-report.md`.
Backend typical-portion capture now uses a saved-day anchored inclusive 21-day
`dayKey` window with paginated history reads instead of the old last-20-meals
semantics. M1B2 is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/M1B2-smart-memory-review-correction-window-report.md`.
Backend review-correction evaluation/capture now uses a deterministic inclusive
30-day `dayKey` window. M1C is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/M1C-smart-memory-source-delete-reactivation-report.md`.
Backend typical-portion capture/replay now preserves exact tombstone checks and
also blocks listed source-deleted/suppressed subjects before candidate upsert.
M1D is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/M1D-smart-memory-review-apply-disabled-report.md`.
Mobile Review now proves Smart Memory globally on with Review apply disabled
performs no memory read and exposes no Review memory UI, detail modal, or
Memory Center navigation.
M1E is locally accepted as `pass_with_gaps` in
`docs/planning/launch-hardening-cwq/reports/M1E-smart-memory-suppressed-subject-unbounded-report.md`.
Backend capture suppression scans no longer default to the old 100-document cap
for source-deleted/suppressed subjects.

M1F is locally accepted as `pass_with_gaps` in
`docs/planning/launch-hardening-cwq/reports/M1F-smart-memory-source-delete-emulator-report.md`.
Local Firestore emulator evidence proves Smart Memory source-delete marks the
real candidate `source_deleted`, does not create an active shadow-mode
`smartMemory` item, and writes a source-delete tombstone with credential env
vars cleared.

M1G is locally accepted as `pass_with_gaps` in
`docs/planning/launch-hardening-cwq/reports/M1G-smart-memory-runtime-telemetry-report.md`.
Memory Center mute/delete controls now emit bounded category-only Smart Memory
telemetry with no raw IDs or display labels.

M1 is locally accepted for the shadow-capture gate. Smart Memory production
flags must remain off until Q0 release evidence and feature rollout
authorization.

M2A is locally accepted as `pass_with_gaps` in
`docs/planning/launch-hardening-cwq/reports/M2A-smart-memory-api-fail-closed-report.md`.
Mobile Smart Memory item/candidate page parsing now rejects malformed page
shapes and unknown top-level `memoryType`/`state` instead of silently dropping
invalid rows. Full M2 remains open for nested malformed payload drift, Memory
Center states, offline retry/discard, Review apply, Dietary Profile precedence,
and runtime UI evidence.

M2B is locally accepted as `pass_with_gaps` in
`docs/planning/launch-hardening-cwq/reports/M2B-smart-memory-nested-payload-fail-closed-report.md`.
Mobile Smart Memory API parsing now fails closed on nested response drift for
`stateReason`, `sourceRefs`, `confidenceReasonCodes`, `schemaVersion`, and
`serverRevision`. Full M2 remains open for sourceRef type narrowing, Memory
Center states, offline retry/discard, Review apply, Dietary Profile precedence,
and runtime UI evidence.

M2C is locally accepted as `controller_pass` in
`docs/planning/launch-hardening-cwq/reports/M2C-smart-memory-source-ref-type-surface-report.md`.
Mobile Smart Memory item/candidate `sourceRefs` response types now use
`SmartMemoryHashedSourceRef[]`.

M2D is locally accepted as `controller_pass` in
`docs/planning/launch-hardening-cwq/reports/M2D-memory-center-control-states-report.md`.
Memory Center component evidence now covers loading, load error, empty
enabled/disabled, ready, pending, failed recovery, retry/discard projection
reload, and offline failed-row recovery controls.

M2E is locally accepted as `controller_pass` in
`docs/planning/launch-hardening-cwq/reports/M2E-review-memory-no-silent-save-report.md`.
Review component evidence now proves the screen can show active memory detail
(`180 g`) while saving the current reviewed draft value (`90 g`) instead of
silently substituting the memory value. Full M2 remains open for Dietary Profile
precedence and runtime UI evidence.

M2F is locally accepted as `controller_pass` in
`docs/planning/launch-hardening-cwq/reports/M2F-review-memory-profile-constraints-report.md`.
Review memory reads now require a nutrition profile, and active Review memory
suggestions fail closed for allergy/restriction profiles when explicit
compatibility evidence is absent. Full M2 remains open for runtime UI evidence.

M2G is locally accepted as `QA_PASS_WITH_GAPS` in
`docs/planning/launch-hardening-cwq/reports/M2G-smart-memory-runtime-ui-blocked-report.md`.
Release-gate metadata validation passed, the local no-provider runtime path with
Auth/Firestore/backend emulators was repaired, and all seven targeted Smart
Memory runtime UI flows passed locally across the repaired combined run plus the
isolated backend-pull rerun. The repair stabilized shared Maestro login through
an E2E-only deep link and allows Firebase Admin to initialize against local
Firestore/Storage data emulators without service-account credentials while
preserving credential fail-fast for auth-emulator-only, no-emulator, and
production paths. Backend-pull requires local backend
`SMART_MEMORY_ENABLED=true`. M2 controls/apply is locally accepted; Smart Memory
production flags stay off until Q0 and feature rollout authorization.

---

## M2 — Smart Memory controls, projection i Review apply

**Repo:** oba  
**Dependencies:** M1  
**Priority:** feature gate

### Cel

Użytkownik widzi i kontroluje aktywną pamięć. Apply jest bezpieczne, jawne i natychmiast respektuje disable/mute/delete.

### Wymagane zmiany

1. Gated Memory Center.
2. Stabilne stany: loading, empty enabled, empty disabled, active, pending, failed.
3. Offline edit/mute/delete/restore ma retry/discard.
4. Wyłączenie Smart Memory natychmiast blokuje sugestie lokalnie i backendowo.
5. Delete memory nie może po cichu usunąć meal history.
6. Usunięcie source data jest osobnym, jawnym flow, jeśli produkt je wspiera.
7. Review explanation pokazuje tylko aktywną, zsynchronizowaną pamięć.
8. Pending candidate nie może być użyty jako pewna sugestia.
9. Apply wymaga jawnej prezentacji i możliwości korekty przed save.
10. No silent save.

### Acceptance criteria

- disabled precedence jest nadrzędne;
- mute/restore/delete działają online i offline;
- sync failure ma visible retry/discard;
- deleted memory nie wraca po pull/restart;
- active memory może zostać zastosowana i edytowana;
- final meal save zachowuje user correction;
- pamięć nie nadpisuje Dietary Profile hard constraints.

### QA attacks

- settings disable pending offline;
- remote active item + local queued delete;
- conflict remote-won;
- account switch;
- logout/reset runtime;
- corrupted local projection;
- backend returns unknown enum/state.

---

## K1 — Known Patterns identity redesign

**Repo:** oba  
**Dependencies:** C2, C5, core meal history stable  
**Priority:** feature gate

K1 is locally accepted after K1A, K1B and K1C. K1A is recorded in
`docs/planning/launch-hardening-cwq/reports/K1A-known-pattern-content-identity-report.md`:
backend Known Patterns candidate identity no longer uses
`meal_type|normalized_name`; it uses a deterministic content signature from
normalized ingredient names, compatible units, bucketed amounts, and bucketed
macro totals. Same generic name with different content no longer groups, while
matching quantified content can group across different names and ingredient
order; missing or partially missing compatible unit/quantity content fails
closed. K1B is recorded in
`docs/planning/launch-hardening-cwq/reports/K1B-known-pattern-alias-overlap-report.md`:
PL/EN alias canonicalization, explicit `2 / 3` partial-overlap matching,
malformed-row fail-closed parsing, and legacy alias-form decline suppression
passed independent QA. K1C is recorded in
`docs/planning/launch-hardening-cwq/reports/K1C-known-pattern-runtime-maestro-report.md`:
local iOS Known Patterns runtime/Maestro evidence passed against local
backend/emulators with `known-pattern-review-draft` `1/1`, zero failures.
Known Patterns production flag stays off until Q0 release evidence and explicit
feature rollout authorization.

### Problem

`meal type + normalized meal name` nie jest wystarczającą tożsamością wzorca. Trzy różne posiłki nazwane „obiad” nie mogą tworzyć high-confidence pattern.

### Wymagane zmiany

1. Tożsamość wzorca ma być deterministyczna i oparta przede wszystkim na zawartości:
   - stabilnych product/ingredient refs, jeśli dostępne;
   - znormalizowanej sygnaturze składników;
   - kompatybilnych jednostkach i ilościach;
   - bounded macro similarity;
   - meal type jako sygnał pomocniczy.
2. Generic names nie mogą samodzielnie tworzyć identity.
3. Zdefiniuj jawny similarity threshold i versioned rule.
4. Zmiana rule version nie może reaktywować wcześniej odrzuconego wzorca bez polityki migracji/suppression.
5. Review draft musi pochodzić z konkretnego evidence snapshotu i nigdy nie zapisuje automatycznie.
6. Home action musi przekazać dokładny candidate context, nie tylko otworzyć ogólny ekran.

### Acceptance criteria

- ta sama nazwa + różne składniki nie grupuje się;
- różna nazwa + stabilna, zgodna zawartość może się grupować zgodnie z rule;
- niewystarczający ingredient overlap nie tworzy candidate;
- generic meal names są bezpieczne;
- decline/dismiss suppression działa po rule version;
- expiry działa;
- candidate review draft jest idempotentny.

### QA attacks

- `Obiad` trzy razy z zupełnie inną zawartością;
- reorder składników;
- aliasy PL/EN;
- niewielka korekta ilości;
- jeden składnik zmieniony;
- ten sam recipe po zmianie tytułu;
- deleted evidence meal;
- candidate odrzucony przed upgrade rule version.

---

## R1 — Recipe Catalog production boundary

**Repo:** backend + mobile entry point  
**Dependencies:** C2, C4, C5, F1  
**Priority:** feature gate / możliwa external dependency

### Cel

Foundation fixtures nie są produkcyjnym katalogiem. Kod ma obsługiwać zweryfikowany content pack, ale nie wolno go wymyślać.

### Wymagane zmiany

1. Przenieś hardcoded foundation records do test fixtures.
2. Production service czyta z kanonicznego, wersjonowanego źródła danych.
3. Dodaj importer/validator bez generowania contentu.
4. Walidator ma odrzucać:
   - placeholder description;
   - placeholder step;
   - pojedynczy sztuczny ingredient snapshot udający recepturę;
   - brak source attribution;
   - brak review metadata;
   - niespójne nutrition/allergen flags;
   - niezgodny locale/content language.
5. Empty catalog zwraca prawdziwy empty state.
6. Feature pozostaje off, dopóki content gate nie przechodzi.

### Content gate

Wymaga zewnętrznie dostarczonego i zatwierdzonego katalogu. Rekomendowany próg z planu 1.1:

- około 48 kuratorowanych przepisów;
- popularny pojedynczy filtr zostawia co najmniej 6 propozycji;
- typowa kombinacja dwóch filtrów zostawia co najmniej 3;
- low-results state dla mniejszego pokrycia;
- pełne provenance, locale, nutrition i allergen review.

Codex nie może stworzyć brakujących przepisów ani nutrition danych „dla zaliczenia testu”. Jeśli content pack nie istnieje, zakończ packet jako `BLOCKED_EXTERNAL_DEPENDENCY`, pozostawiając techniczny boundary i flagę `off`.

### QA attacks

- brak content collection;
- rekord z angielskim tytułem i `pl-PL`;
- partial allergens;
- unknown profile flags;
- source revoked;
- duplicate recipe IDs/versions;
- hidden hard exclusion i reveal unknown.

### Current execution status

R1 is `partial`, not pending. R1A is locally accepted in
`docs/planning/launch-hardening-cwq/reports/R1A-recipe-catalog-content-boundary-report.md`:
`RECIPE_CATALOG_CONTENT_APPROVED=false` now blocks Recipe Catalog profile/catalog
work even if `RECIPE_CATALOG_ENABLED=true`.

R1B is locally accepted in
`docs/planning/launch-hardening-cwq/reports/R1B-recipe-catalog-fixture-relocation-report.md`:
foundation records were removed from the backend runtime default success path
and moved to test fixtures; an approved/enabled path without configured content
returns an explicit empty catalog.

R1C is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/R1C-recipe-catalog-content-pack-validator-report.md`:
the backend can only load an explicitly configured absolute-path content pack,
validates it fail-closed before profile lookup/evaluation, rejects foundation or
placeholder content, rejects unready/retired records and relative paths, and
maps invalid configured content to bounded `503` evidence.

Full R1 remains `partial`. Recipe Catalog production activation is still blocked
by the missing approved content pack, canonical source/storage decision, owner
content review, nutrition/provenance sign-off, deployment configuration for
`RECIPE_CATALOG_CONTENT_PATH`, and runtime/E2E evidence with the real approved
pack.

---

## P1 — Planning: truthful nutrition i idempotentny plan-to-meal lifecycle

**Repo:** oba  
**Dependencies:** C2, C3, C4, C5; Recipe source tylko jeśli R1 pass  
**Priority:** P0 dla truthful data, feature gate dla rollout

### Problem

Plan utworzony z samej nazwy nie może otrzymywać wymyślonych wartości 400/25/14/45 ani statusu `known`.

### Wymagane zmiany

1. Manual plan z samej nazwy:
   - `nutritionEstimate.state = unknown`;
   - `totals = null`;
   - właściwe `missingFields`;
   - brak confidence udającego wiedzę;
   - brak sztucznego ingredient z domyślnym makro.
2. Review blokuje final save albo wymaga jawnego uzupełnienia/potwierdzenia danych zgodnie z core contract.
3. Draft przenosi typed source metadata:
   - `plannedMealId`;
   - `plannedMealVersion`;
   - source type/ref;
   - bez kodowania tego wyłącznie w notes.
4. Final meal save ma idempotentnie konsumować plan:
   - weryfikacja expected version;
   - zapis meal;
   - update planned meal status/link;
   - jedna transakcja lub durable, gwarantowana saga;
   - duplicate save nie tworzy drugiego meal.
5. Home/Planning nie sugeruje skonsumowanego planu.
6. Abandoned local draft nie może po cichu oznaczać meal jako logged.
7. Plan nie wpływa na History/Stats/Coach, dopóki user nie zapisze Review.

### Acceptance criteria

- nowy manual plan nie ma zmyślonego makro;
- unknown estimate jest czytelny;
- source metadata przechodzi FE → draft → meal request → backend;
- dwa równoległe save’y tego samego planu nie tworzą dwóch meals;
- plan wskazuje linked meal po sukcesie;
- failed meal save nie konsumuje planu;
- retry z tym samym clientMutationId jest idempotentny;
- delete linked meal ma jawnie zdefiniowane zachowanie planu.

### QA attacks

- offline draft utworzony dwa razy;
- stale plannedMealVersion;
- dwa urządzenia;
- plan deleted między Review a save;
- unknown estimate bez składników;
- partial estimate;
- recipe source unavailable;
- save meal succeeds, plan update transiently fails.

Ostatni przypadek musi zostać rozwiązany atomowo albo przez durable saga/outbox. Nie wolno pozostawić split-brain.

### Current execution status

P1 is locally accepted as `qa_passed` in
`docs/planning/launch-hardening-cwq/reports/P1-planning-truthful-lifecycle-report.md`.

P1A removed name-only manual Planning macro fabrication: manual name-only plans
now use empty ingredients, null totals, explicit `unknown` estimate state, all
missing macro fields and null confidence instead of `400/25/14/45` defaults or a
synthetic ingredient.

P1B added typed `planningSource` metadata through Review, mobile persistence,
offline push, backend schemas and paired contract fixtures. Review/backend save
paths reject planned-source meals without positive nutrition evidence.

P1C consumes and links planned meals in the same backend transaction as the
logged meal write and mutation dedupe record, handles same-mutation replay
idempotently, preserves linked-delete evidence, and blocks stale planned-source
saves when Planning is disabled across backend and mobile paths.

P1 local truth/lifecycle gate is done. Planning remains production-off until
telemetry, Q0 and feature-wave rollout gates authorize activation.

---

## H1 — Home Next Action jako ostatnia integracja

**Repo:** mobile + backend sources  
**Dependencies:** odpowiednio M2/K1/P1; C2, C5  
**Priority:** final feature wave

### Cel

Home pokazuje jedną sensowną akcję, ale nie fetchuje ani nie promuje wyłączonych/niedojrzałych źródeł.

### Wymagane zmiany

1. Global `HOME_NEXT_ACTION` flag.
2. Per-source gating:
   - review draft local;
   - planned meal tylko przy Planning enabled;
   - known pattern tylko przy Known Patterns enabled;
   - memory tylko przy Smart Memory apply enabled.
3. Jeśli source disabled, nie wykonuj requestu.
4. Awaria jednego source nie może zniszczyć innych candidates.
5. Action deep link przekazuje dokładny source object ID/version.
6. CTA musi otworzyć konkretny intended flow/item, nie tylko ogólny ekran.
7. Review draft zachowuje najwyższy priorytet, jeśli realnie istnieje.
8. Dismiss/cooldown jest source-version aware.
9. Stały Planning entry point jest ukryty, gdy Planning disabled.
10. Home pozostaje lekki: jedna akcja, brak feedu nowych kart.

### Acceptance criteria

- wszystkie source flags off = zero requestów i zero promptu;
- tylko jeden source on = tylko jeden request path;
- source failure jest izolowany;
- planned CTA otwiera konkretny plan;
- known pattern CTA otwiera konkretny candidate/review draft;
- dismissed source version nie blokuje nowej wersji;
- telemetry shown/started/dismissed działa;
- nie ma podwójnego CTA konkurującego z core hero.

### QA attacks

- Review local exists + backend offline;
- Planning disabled, stale deep link;
- candidate expires między renderem a tapem;
- source version zmienia się po dismiss;
- rapid focus refresh / race;
- account switch;
- all requests fail;
- one source returns malformed contract.

---

## Q0 — Paired full regression i release evidence

**Repo:** oba  
**Dependencies:** wszystkie packety planowane do aktywacji  
**Priority:** final gate

### Mobile full gate

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm audit --omit=dev --audit-level=high
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
BACKEND_REPO=<paired-backend-path> ./scripts/verify-backend-contract.sh
npm run e2e:smoke
npm run e2e:release-gate
npm run e2e:coverage:check
npm run e2e:dynamic-text:check
```

Focused suites dla aktywnych domen:

```bash
npm run e2e:add-meal
npm run e2e:home-history-statistics
npm run e2e:premium-billing
npm run e2e:notifications-retention
npm run e2e:share
npm run e2e:platform-layout
```

Dodatkowo nowe focused suites dla Food Library, Smart Memory, Planning, Known Patterns i Home Next Action, jeśli są aktywowane.

### Backend full gate

```bash
python -m pip install -r requirements.txt
ruff check .
pyright
python -m pip install pip-audit
pip-audit -r requirements.txt
pytest -q --cov=app --cov-report=term-missing --cov-fail-under=80
```

Dodatkowo:

- Firestore emulator tests;
- rules tests;
- index-dependent query tests;
- outbox/reconciliation integration;
- export/delete >250 records;
- exact feature disabled-mode tests.

### Runtime evidence

Wymagane:

1. exact mobile SHA;
2. exact backend SHA;
3. smoke backend health;
4. authenticated core meal save/history/edit/delete;
5. retry/offline recovery;
6. telemetry batch i daily summary;
7. account export;
8. disposable account delete;
9. backup/restore evidence;
10. billing purchase + restore evidence;
11. flag snapshot;
12. production readiness config;
13. aktywne feature waves i ich osobne gate results.

### Final QA decision

QA wydaje jedną z decyzji:

```text
NO_GO
CORE_RC_READY
FULL_1_1_RC_READY
BLOCKED_EXTERNAL_DEPENDENCY
```

`FULL_1_1_RC_READY` jest niedozwolone, jeśli Recipe Catalog nadal używa fixture contentu albo Planning nadal może zapisać wymyślone nutrition.

### Current execution status

Q0 is `blocking` / `blocked_external`, not pending. Q0A-Q0Y evidence exists in
`docs/planning/launch-hardening-cwq/reports/`.

Locally accepted evidence includes core-off static/readiness checks,
dependency-audit repair, full local backend/mobile regression, release-evidence
artifact hardening, local runtime preflight, local no-provider Maestro smoke
`7/7`, local core release-gate `20/20`, JUnit-backed release-gate evidence,
readiness-decision guards, proof-backed evidence guards, local auth/profile seed
repair, and exact-SHA remote CI pairing.

Q0T removed the temporary fake-auth `fitaly://e2e/login` session/token path from
active mobile source and restored real local UI login with loopback-only
Auth/Profile emulator seeding. Q0U recorded successful exact-SHA remote CI runs
for mobile `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43` and backend
`706e2fff7788636d804339fd0845b98e523ce1ac`.

After Q0U, F1B/F1C/F1D/F1E/F1F added newer Food Library
harness/runtime/local API-route/remote-CI evidence. The F1C-verified pair is mobile
`5de157eb42ca79c15b1fd4e943a6157d64b99e7c` with exact backend ref
`f681d983941fe2d20cc857811493ee5bbd9def4f`; F1C mobile CI run `28041016021`
passed with that exact backend ref. F1D then pushed backend
`fe01fbaf92921271968e9d7bde329530b42513eb` and added local API-route PL/EN
query-hit plus local latency evidence. F1E refreshes the local iOS simulator
runtime suite on mobile `5de157...` plus backend `fe01fba...` and passes `7/7`.
F1F remote CI then passed on both repos for mobile `5de157...` plus backend
`fe01fba...`. This still does not close Q0.

Q0V adds a fail-closed Android simulator preflight and records the current local
state as `not_ready`: Android SDK `adb` and `emulator` plus Maestro are present,
but there is no booted Android emulator and no configured AVD. Mobile commit
`80790f6a0fb4c70bf949a39ee7737085195ca3f3` is pushed, and normal exact-SHA CI
passed for mobile run `28063907416` plus backend run `28063907468`. No Android
app runtime flow was run.

Q0W refreshes the current blocked release evidence for mobile
`80790f6a0fb4c70bf949a39ee7737085195ca3f3` plus backend
`fe01fbaf92921271968e9d7bde329530b42513eb` after `git fetch --prune`, clean
worktree checks, empty diff-to-origin checks, renderer syntax checks, and a
negative search for the removed fake-auth/e2e login symbols. The generated
artifact is
`docs/planning/launch-hardening-cwq/reports/Q0W-current-blocked-release-evidence.md`
and it preserves `Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY`.

Q0X records a local iOS no-provider core-gate harness repair pushed as mobile
`59feb230b74914ef5a7963b05d2a19dd695edef4`. Explicit no-provider
billing/RevenueCat overrides now survive `.env` sourcing, and
`offline-save-pending-local` is scoped to local pending-state evidence instead
of reconnect sync. Pre-commit local iOS core-release-gate passed `20/20`, but
the post-push full-suite attempt is not a clean `20/20` suite artifact: 15
flows passed and `chat-basic-history` failed during nested login with a
Maestro/XCTest splash hierarchy error before chat assertions. Post-push
isolated `chat-basic-history` passed `1/1`, and the four not-reached remaining
core flows passed `4/4`. Q0X remains local simulator/no-provider evidence only.

Q0Y then reran the current pushed pair as a single local iOS simulator
`core-release-gate` suite and passed `20/20` against local backend and
Auth/Firestore emulators with `DISABLE_BILLING=true` and blank
RevenueCat/OpenAI/Sentry env. Q0Y closes only the Q0X local single-green-suite
evidence gap and remains local simulator/no-provider evidence only.

Q0 still cannot produce `CORE_RC_READY`: authenticated smoke-backend/provider,
billing, backup/restore, production smoke, deployed backend SHA, live RC
workflow, Android simulator runtime, privacy/Sentry, compliance, rollback and
manual owner-authorized evidence remain missing or unverified. Physical-device
validation is skipped by owner instruction and is not claimed.

---

# 10. Packet closure checklist

Każdy packet można zamknąć wyłącznie, jeśli:

- [ ] problem wejściowy został odtworzony albo jednoznacznie potwierdzony;
- [ ] implementacja jest minimalna i zgodna z boundaries;
- [ ] dodano regression test;
- [ ] targeted tests są zielone;
- [ ] QA niezależnie uruchomił testy;
- [ ] cross-repo contract jest zielony, jeśli dotyczy;
- [ ] docs/env examples zostały zaktualizowane;
- [ ] flag disabled behavior jest przetestowany;
- [ ] telemetry/privacy zostały ocenione;
- [ ] nie wprowadzono placeholder contentu;
- [ ] status i evidence zostały zaktualizowane;
- [ ] commit jest mały, opisowy i nie miesza domen.

---

# 11. Commit policy

Preferowane commity:

```text
fix(core): make meal side effects durable and retryable
fix(privacy): paginate complete smart memory export
feat(flags): isolate 1.1 domains behind kill switches
fix(planning): remove fabricated nutrition defaults
fix(patterns): derive identity from stable meal content
refactor(recipes): move foundation catalog to test fixtures
ci(release): pin paired backend sha in release evidence
```

Nie łącz wszystkich zmian w jeden commit.

Każdy cross-repo packet powinien mieć wspólny identyfikator w obu commit messages, np.:

```text
[PAIR-C3]
```

---

# 12. Status file template

Controller ma utrzymywać:

```md
# Release Hardening Status

## Pair
Mobile branch:
Mobile SHA:
Backend branch:
Backend SHA:
Started at:
Controller:

## Outcome target
- [ ] CORE_RC_READY
- [ ] FULL_1_1_RC_READY

## Packets
| Packet | Status | Worker | QA | Commits | Evidence | Blocker |
|---|---|---|---|---|---|---|
| C0 | qa_passed | Baseline, scope lock and reproducibility evidence accepted | Codex local worker + scope worker | independent QA pass after docs repair | reports/C0-baseline-report.md | none for baseline |
| C1 | qa_passed | Exact-SHA release pairing and readiness guard evidence accepted locally | C1 worker + repair worker | independent QA pass after Sentry bypass repair | reports/C1-release-pairing-report.md | live RC run and secrets remain Q0 evidence |
| C2 | qa_passed | Backend/mobile feature flags, disabled-route behavior, request suppression and disabled UI/direct-route/deep-link behavior accepted | C2A, C2B1, C2B2 workers + repair | independent QA pass after Home Next Action / Review memory repair | reports/C2A-feature-flags-backend-config-report.md, reports/C2B1-mobile-request-suppression-report.md, reports/C2B2-mobile-disabled-ui-routes-report.md | none for local C2 disabled-behavior gate |
| C3 | qa_passed | Transactional outbox, retry/backoff/dead-letter, export/delete and emulator race evidence accepted | Codex local worker + C3D/C3E repairs | independent QA pass after emulator and coverage repair | reports/C3-durable-meal-side-effects-report.md | none for local C3 durable-side-effect gate |
| C4 | qa_passed | Export/delete reconciliation, no silent truncation, manifest/count contract and idempotent delete cleanup accepted | Codex local worker for C4A/C4B/C4C repairs | independent QA pass after rate-limit and username-reservation repairs | reports/C4-export-delete-reconciliation-report.md | none for local C4 gate |
| C5 | partial | C5A-C5D accepted for local bounded telemetry contracts/runtime evidence | C5A worker; C5B/C5C/C5D local runtime workers + repairs | QA returned pass/pass_with_gaps with only accepted non-blocking local/runtime gaps | reports/C5A-new-domain-telemetry-contracts-report.md, reports/C5B-known-pattern-telemetry-runtime-report.md, reports/C5C-planning-telemetry-runtime-report.md, reports/C5D-smart-memory-telemetry-runtime-report.md | remains partial until every activated domain has sufficient runtime/E2E/prod-authorized telemetry evidence and rollout authorization |
| F1 | partial | F1A validator, F1B local harness, F1C local iOS simulator autocomplete runtime `7/7`, F1D local API-route PL/EN/latency evidence, F1E current-pair local iOS simulator runtime `7/7`, and F1F current-pair remote CI pairing accepted | F1A worker + controller repairs; F1B local worker; F1C runtime repair/evidence; F1D backend local API evidence worker; F1E controller evidence refresh; F1F controller remote CI evidence refresh | F1A `QA_PASS_WITH_GAPS`; F1B/F1C `pass_with_gaps` with no blockers; F1D re-QA `pass`; F1C mobile CI run `28041016021` passed; F1E local simulator refresh passed `7/7`; F1F mobile run `28062888358` and backend run `28062888045` passed | reports/F1A-food-library-seed-validation-report.md, reports/F1B-food-library-autocomplete-local-harness-report.md, reports/F1C-food-library-autocomplete-runtime-report.md, reports/F1D-food-library-autocomplete-local-api-evidence-report.md, reports/F1E-food-library-current-pair-simulator-runtime-report.md, reports/F1F-food-library-current-pair-remote-ci-report.md | approved corpus, owner review/source-confidence sign-off, authorized provider/prod evidence, deployed/network latency evidence, rollout approval; physical-device validation skipped by owner instruction and not claimed |
| M1 | qa_passed | M1A-M1G Smart Memory shadow capture/time-window/source-delete/apply-disabled/telemetry evidence accepted | M1A-M1G workers + repairs | independent QA pass/pass_with_gaps with accepted non-blocking gaps | reports/M1A-smart-memory-shadow-capture-report.md, reports/M1B1-smart-memory-typical-portion-window-report.md, reports/M1B2-smart-memory-review-correction-window-report.md, reports/M1C-smart-memory-source-delete-reactivation-report.md, reports/M1D-smart-memory-review-apply-disabled-report.md, reports/M1E-smart-memory-suppressed-subject-unbounded-report.md, reports/M1F-smart-memory-source-delete-emulator-report.md, reports/M1G-smart-memory-runtime-telemetry-report.md | Q0 release evidence and feature rollout authorization before production activation |
| M2 | qa_passed | M2A-M2G Smart Memory controls/apply fail-closed parsing, UI states, no-silent-save, profile constraints and local runtime UI evidence accepted | M2A-M2G workers + repairs | independent QA/controller QA passed with accepted non-blocking local gaps | reports/M2A-smart-memory-api-fail-closed-report.md, reports/M2B-smart-memory-nested-payload-fail-closed-report.md, reports/M2C-smart-memory-source-ref-type-surface-report.md, reports/M2D-memory-center-control-states-report.md, reports/M2E-review-memory-no-silent-save-report.md, reports/M2F-review-memory-profile-constraints-report.md, reports/M2G-smart-memory-runtime-ui-blocked-report.md | Q0 evidence and feature rollout authorization before Smart Memory production activation |
| K1 | qa_passed | K1A content-signature identity, K1B alias/overlap and K1C local runtime evidence accepted | K1A/K1B/K1C workers + repairs | K1A/K1B `QA_PASS`; K1C `QA_PASS_WITH_GAPS` with repaired documentation/artifact gaps | reports/K1A-known-pattern-content-identity-report.md, reports/K1B-known-pattern-alias-overlap-report.md, reports/K1C-known-pattern-runtime-maestro-report.md | production flag stays off until Q0 release evidence and explicit feature rollout authorization |
| R1 | partial | R1A safe-off approval gate, R1B fixture relocation/empty runtime default and R1C fail-closed content-pack validator accepted | R1A/R1B/R1C workers + repair | R1A/R1B `QA_PASS_WITH_GAPS`; R1C re-QA `QA_PASS` | reports/R1A-recipe-catalog-content-boundary-report.md, reports/R1B-recipe-catalog-fixture-relocation-report.md, reports/R1C-recipe-catalog-content-pack-validator-report.md | approved content pack, canonical source/storage decision, owner review, nutrition/provenance sign-off, deploy config and real-pack runtime/E2E |
| P1 | qa_passed | P1A/P1B/P1C Planning truthfulness, typed source metadata, save safety and idempotent consume/link accepted | P1A/P1B/P1C workers + repairs | P1A `pass_with_gaps`; P1B/P1C re-QA `QA_PASS` | reports/P1-planning-truthful-lifecycle-report.md | Planning remains production-off until telemetry/Q0/feature rollout gates |
| H1 | pending | Home Next Action remains unimplemented as final integration | | | | must run last after source domains are gated |
| Q0 | blocked_external | Q0A-Q0Y local/remote evidence exists; current decision remains `BLOCKED_EXTERNAL_DEPENDENCY` | Q0A-Q0Y local/controller/QA slices plus later F1E simulator refresh and F1F remote CI pairing | multiple QA pass/pass_with_gaps; Q0U exact-SHA remote CI pairing passed; Q0V Android simulator preflight returned `not_ready` because no booted emulator or configured AVD exists, and normal CI passed for Q0V pair mobile run `28063907416` plus backend run `28063907468`; Q0X pushed mobile `59feb230...` with local harness repair and targeted simulator evidence; Q0Y current-pair local iOS simulator `core-release-gate` passed as a single `20/20` suite; F1E local simulator refresh passed `7/7`; F1F exact-SHA remote CI pairing passed | reports/Q0A-core-off-release-evidence-preflight-report.md through reports/Q0Y-current-pair-local-ios-core-gate-report.md; reports/F1E-food-library-current-pair-simulator-runtime-report.md; reports/F1F-food-library-current-pair-remote-ci-report.md | exact remote CI for `59feb230...`, provider/manual evidence, Android simulator runtime target, live RC workflow, deployed SHA, billing, backup/restore, production smoke, privacy/Sentry/compliance/rollback; physical-device validation skipped by owner instruction and not claimed |

## Open P0

## Open P1

## External dependencies

## Feature flag snapshot

## Latest paired test run

## Decision log
```

Status values:

```text
pending
in_progress
worker_done
qa_failed
repairing
qa_passed
blocked_external
waived_p1
closed
```

P0 nie może mieć statusu `waived` bez jawnej decyzji Release DRI.

---

# 13. Final evidence template

```md
# Fitaly Release Hardening Evidence

Decision: NO_GO / CORE_RC_READY / FULL_1_1_RC_READY / BLOCKED_EXTERNAL_DEPENDENCY
Timestamp:

## Exact pair
Mobile SHA:
Backend SHA:

## Active production flags

## Core gates
- Build readiness:
- Backend health:
- Mobile CI:
- Backend CI:
- Cross-repo contracts:
- Core E2E:
- Billing purchase/restore:
- Telemetry:
- Export:
- Delete:
- Backup/restore:

## Feature wave gates
- Food Library:
- Smart Memory capture:
- Smart Memory controls/apply:
- Known Patterns:
- Recipe Catalog:
- Planning:
- Home Next Action:

## P0

## P1 and accepted risks

## External blockers

## Rollback matrix

## QA sign-off
```

---

# 14. Final operating rule

> Najpierw integralność danych i możliwość rollbacku. Potem pojedyncze domeny. Home na końcu.

Nie optymalizuj wyniku pod „wszystko włączone”. Optymalizuj pod prawdziwą gotowość produkcyjną.

Najbezpieczniejszy poprawny wynik tego zlecenia może brzmieć:

```text
CORE_RC_READY; Food Library ready for staged rollout; Smart Memory shadow-ready;
Recipes, Planning, Known Patterns and Home Next Action remain production-off.
```

To jest lepsze niż fałszywe `FULL_1_1_RC_READY` bez contentu, recovery, telemetry i dowodów.
