# 11 — Launch Work Queue

Status: active
Owner: release owner

Zasada: wykonuj najmniejszy packet, który zamyka jeden P0 lub dostarcza brakujące
evidence. Nie rozwijaj 1.1.

## P0 — kolejność rekomendowana

### L0 — Documentation reconciliation v2

- zastosować pełne pliki zastępcze z paczki;
- usunąć martwe aktywne linki wykryte w audycie migracji;
- ustawić `e2e:core-release-gate` jako jedyny kanoniczny core runtime gate;
- potwierdzić jawną macierz scope i globalny status `NO_GO`;
- uruchomić grep/link review oraz `git diff --check`;
- acceptance: brak aktywnych referencji do wycofanych dokumentów.

### L1 — Aktualny baseline

- `git fetch --prune` obu repo;
- branch, SHA, status, diff-to-origin;
- dependency/runtime versions;
- wybrać i zapisać `candidateId`;
- odświeżyć `01-current-release-status.md`;
- acceptance: clean exact pair.

### L2 — Exact-pair CI

- uruchomić mobile CI z exact BE ref;
- uruchomić backend CI z exact FE ref;
- zamknąć drift kontraktów;
- acceptance: oba green dla tej samej pary.

### L3 — Artifact harness identity

- rozszerzyć `manifest.json` albo dodać companion `review-manifest.md`;
- zapisać FE SHA, BE SHA, platformę, profile, backend target, locale i flags;
- zweryfikować expected screenshots oraz report collection;
- acceptance: raw bundle jest jednoznacznie przypisany do RC.

### L4 — Screen inventory i visual audit generation

- uruchomić `npm run e2e:visual-audit` dla iOS;
- uruchomić visual audit dla Androida po gotowym AVD;
- uruchomić targeted suites dla brakujących stanów;
- acceptance: kompletna lista ekranów i braków względem frozen scope.

### L5 — iOS current-candidate core runtime

```bash
cd fitaly
npm run e2e:core-release-gate
```

- accepted screenshots/reports/logs;
- acceptance: jedna green suite dla aktualnej pary i launch-like config.

### L6 — Android runner i runtime

```bash
cd fitaly
npm run e2e:android-simulator:preflight
```

- skonfigurować i uruchomić AVD;
- przejść fail-closed preflight;
- uruchomić `core-release-gate` oraz platform layout/billing/permissions;
- acceptance: current-candidate Android evidence.

### L7 — UI/UX audit i repair loop

- audyt całej biblioteki PL/EN i obu platform;
- naprawa P0/P1;
- targeted re-runs i nowe screenshoty;
- acceptance: visual gate passed.

### L8 — Security/privacy/export/delete

- auth/rules/cross-user negative tests;
- PII audit telemetry/Sentry/logs;
- runtime export/delete;
- legal/store disclosures;
- acceptance: security gate passed.

### L9 — Billing/premium

- config/offerings/products/entitlement;
- deterministic tests;
- realny iOS sandbox purchase/restore;
- realny Android sandbox purchase/restore;
- restart/login/offline/degraded consistency;
- acceptance: billing gate passed na obu platformach.

### L10 — Smoke/deployed backend

- deployed SHA;
- health/version/contracts;
- bounded OpenAI smoke: 1 Chat + 1 Add Meal call max;
- backend RevenueCat boundary;
- disabled 1.1 behavior;
- acceptance: backend smoke gate passed.

### L11 — Backup/restore i rollback

- backup;
- restore drill;
- backend rollback;
- feature/config kill switches;
- acceptance: operational recovery evidence.

### L12 — Store candidate

- production builds;
- TestFlight/internal Play install/update sanity;
- metadata/privacy/subscription review;
- acceptance: store gate passed.

### L13 — Final RC decision

- odświeżyć current status;
- zebrać final evidence dla jednej pary SHA;
- independent review;
- podpisać dokładnie jedną decyzję.

## P1 przed release, jeśli czas pozwala

- performance startup i głównych list;
- accessibility polish;
- flaky-test reduction;
- observability dashboards/alerts;
- copy consistency PL/EN;
- device/layout expansion.

P1 staje się P0, jeśli wpływa na correctness, trust, purchase, delete/export,
privacy lub znaczącą część urządzeń.

## P2 po release

- dodatkowy visual polish bez ryzyka;
- rozszerzenie device matrix;
- dodatkowe automatyzacje artifacts;
- wznowienie roadmapy 1.1 dopiero po decyzji ownera.
