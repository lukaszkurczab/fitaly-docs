# 11 — Launch Work Queue

Status: active
Owner: release owner

Zasada: wykonuj najmniejszy packet, który zamyka jeden P0 lub dostarcza brakujące
evidence. Nie rozwijaj 1.1.

## P0 — kolejność rekomendowana

### L0 — Dokumentacja i scope freeze

- zastosować migration package;
- usunąć stare plany;
- potwierdzić production-off policy;
- acceptance: brak aktywnych linków do starych dokumentów.

### L1 — Aktualny baseline

- fetch/prune obu repo;
- branch, SHA, status, diff-to-origin;
- dependency/runtime versions;
- zapisać candidate id;
- acceptance: clean exact pair.

### L2 — Exact-pair CI

- uruchomić mobile CI z exact BE ref;
- uruchomić backend CI z exact FE ref;
- zamknąć drift kontraktów;
- acceptance: oba green dla tej samej pary.

### L3 — Artifact harness i screen inventory

- ustalić wymagane screenshot checkpoints;
- wygenerować run manifest automatycznie lub powtarzalnie;
- uruchomić visual-audit/targeted suites;
- acceptance: kompletna biblioteka i lista braków.

### L4 — iOS current-candidate core runtime

- pełny core release gate;
- accepted screenshots/JUnit/logs;
- acceptance: single green suite dla aktualnej pary.

### L5 — Android runner i runtime

- skonfigurować AVD;
- przejść fail-closed preflight;
- uruchomić core oraz platform layout/billing/permissions;
- acceptance: current-candidate Android evidence.

### L6 — UI/UX audit i repair loop

- audyt całej biblioteki;
- naprawa P0/P1;
- targeted re-runs;
- acceptance: visual gate passed.

### L7 — Security/privacy/export/delete

- auth/rules/cross-user negative tests;
- PII audit telemetry/Sentry/logs;
- runtime export/delete;
- legal/store disclosures;
- acceptance: security gate passed.

### L8 — Billing/premium

- config/offerings/products;
- iOS sandbox purchase/restore;
- Android sandbox purchase/restore;
- entitlement/free/premium/degraded;
- acceptance: billing gate passed.

### L9 — Smoke/deployed backend

- deployed SHA;
- health/version/contracts;
- bounded provider smoke;
- disabled 1.1 behavior;
- acceptance: backend smoke gate passed.

### L10 — Backup/restore i rollback

- backup;
- restore drill;
- backend rollback;
- feature/config kill switches;
- acceptance: operational recovery evidence.

### L11 — Store candidate

- production builds;
- TestFlight/internal Play install/update sanity;
- metadata/privacy/subscription review;
- acceptance: store gate passed.

### L12 — Final RC decision

- odświeżyć current status;
- zebrać final evidence;
- independent review;
- podpisać decyzję.

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
