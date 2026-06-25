# 02 — Release Readiness Gates

Status: active contract
Last reconciled: 2026-06-25

## Status vocabulary

- `not_started`
- `in_progress`
- `blocked`
- `blocked_external`
- `failed`
- `passed`
- `waived_p1`

P0 nie może mieć statusu `waived_p1`. Globalna decyzja ma jedną wartość:
`CORE_RC_READY`, `NO_GO` albo `BLOCKED_EXTERNAL_DEPENDENCY`.

## Gate 0 — Dokumentacja i scope integrity

Acceptance:

- `launch/00-release-scope.md` ma jawne `IN`/`OUT` bez warunkowych decyzji;
- `launch/01-current-release-status.md` jest jedynym aktywnym snapshotem;
- brak aktywnych linków do usuniętych dokumentów;
- historia 1.1 występuje tylko jako nota zawieszenia, nie backlog;
- `npm run e2e:core-release-gate` jest jedynym kanonicznym runtime gate'em core;
- broad `release-gate` i `full-review` nie są przedstawiane jako dowód Launch 1.0;
- link review i `git diff --check` przechodzą.

## Gate A — Source integrity i exact pair

Acceptance:

- aktualne branch names zapisane;
- FE SHA i BE SHA zapisane w evidence;
- oba worktrees clean;
- brak diffu do origin;
- remote CI uruchomione dla tej samej pary;
- cross-repo fixtures i contract checks green;
- candidate nie zmienia SHA po wykonaniu gate'u bez ponowienia zależnych dowodów.

## Gate B — Runtime config i feature isolation

Acceptance:

- production/smoke API URLs są prawidłowe;
- telemetry, reminders, weekly reports, billing i AI mają jawne ustawienia;
- wszystkie domeny 1.1 są `false` w production;
- backend disabled route zwraca przewidywalny kod;
- mobile nie wykonuje requestów/background work dla disabled feature;
- deep link/navigation nie omija flag;
- kill switch nie uruchamia legacy fallbacku;
- config snapshot lub hash jest zapisany w release evidence.

## Gate C — Mobile static/unit/contract

Mobile minimum:

```bash
cd fitaly
npm ci
npm run lint
npm run typecheck
npm test
npm run e2e:coverage:check
npm run e2e:dynamic-text:check
npm run check:runtime-config
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Dopuszczalne jest rozdzielenie komend w CI, ale finalny artifact musi wskazywać
wynik wszystkich wymaganych checków.

## Gate D — Backend static/unit/emulator

Backend minimum:

```bash
cd fitaly-backend
./.venv/bin/python -m compileall app
./.venv/bin/ruff check .
./.venv/bin/pyright
./.venv/bin/pytest
```

Dodatkowo wymagane są aktualne emulator-backed tests dla rules, export/delete,
meal persistence/outbox oraz każdej launchowej ścieżki używającej Firestore.

## Gate E — iOS core runtime

Kanoniczna suite:

```bash
cd fitaly
npm run e2e:core-release-gate
```

Acceptance:

- RC build/profile odpowiada launch-like config;
- jedna pełna green suite dla aktualnej pary SHA;
- auth, onboarding, Add Meal, Review/save, Home/History/Stats, AI Chat, offline,
  premium/restore, notifications, Weekly Reports boundary, share i account
  operations zgodnie ze scope;
- brak E2E-only bypassu w production path;
- artifact manifest, JUnit/reports, logs i screenshoty;
- manifest lub companion evidence zawiera FE SHA, BE SHA, platformę, profil,
  backend target, locale i feature flags.

## Gate F — Android core runtime

Preflight:

```bash
cd fitaly
npm run e2e:android-simulator:preflight
```

Po gotowym AVD uruchom tę samą kanoniczną suite core z Android runtime.

Acceptance:

- skonfigurowany i booted AVD;
- preflight zwraca ready;
- pełna aktualna `core-release-gate` lub jawnie równoważny Android gate;
- zweryfikowane layout, permissions, back navigation, keyboard, camera/media,
  notifications i billing platform behavior;
- artifact manifest, reports, logs i screenshoty z pełną tożsamością RC.

## Gate G — Visual/UI readiness

Acceptance:

- katalog ekranów i stanów jest kompletny;
- screenshot library obejmuje iOS i Android oraz PL/EN;
- każdy screen ma ocenę functional, visual, copy, accessibility i risk;
- wszystkie P0/P1 release-blocking findings naprawione i ponownie sfotografowane;
- brak mockowego copy, placeholderów, debug bannerów i zablokowanych CTA;
- raw visual bundle oraz review records wskazują ten sam RC.

## Gate H — Security/privacy/compliance

Acceptance:

- auth i cross-user isolation;
- Firestore/Storage rules tests;
- secure local token/secret handling;
- input validation, abuse/rate limit i provider failure;
- privacy-safe telemetry/Sentry/logging;
- delete i export kompletne oraz idempotentne;
- publiczne legal URLs i zgodność store disclosures;
- brak nierozwiązanych P0/P1 security findings.

## Gate I — Billing/premium

Acceptance wymaga dwóch warstw:

1. deterministycznych unit/integration/Maestro tests;
2. realnego sandbox purchase i restore na iOS oraz Androidzie.

Dodatkowo:

- prawidłowe products/offerings/entitlement;
- backend/mobile entitlement consistency;
- free/premium limits;
- expired/cancelled/offline/degraded states;
- brak utraty zakupionego dostępu po restart/login/restore;
- brak receiptów, transaction IDs i danych płatniczych w evidence.

Mock/provider-fake nie zastępuje StoreKit/Play Billing sandbox.

## Gate J — Backend smoke i deployed evidence

Acceptance:

- `GET /api/v1/health` i `GET /api/v1/version`;
- deployed BE SHA zgodny z evidence;
- auth flow contracts;
- AI credits, telemetry, export/delete i Weekly Reports premium boundary;
- ponieważ Add Meal AI i AI Chat są w scope: wymagany bounded smoke realnego
  OpenAI wiring, maksymalnie 1 Chat text oraz 1 Add Meal text/photo call;
- 1.1 routes pozostają disabled;
- brak sekretów, raw promptów, odpowiedzi, obrazów lub auth payloadów w artifacts;
- rollback target i monitoring są gotowe.

## Gate K — Backup/restore

Acceptance:

- aktualny backup;
- kontrolowany restore drill;
- sprawdzenie kompletności i izolacji użytkownika;
- udokumentowane RPO/RTO i operator steps;
- rollback nie niszczy nowych zapisów bez jawnej decyzji.

## Gate L — Build/store readiness

Acceptance:

- Android AAB i iOS store build;
- wersje/build numbers;
- identifiers, signing, permissions i privacy declarations;
- install/update/launch sanity z internal track/TestFlight;
- screenshots/metadata/support/legal URLs;
- phased rollout i stop mechanism.

## Gate M — Rollback i release decision

Acceptance:

- rollback backendu sprawdzony;
- kill switch/config rollback sprawdzony;
- poprzedni stabilny mobile/backend artifact zidentyfikowany;
- alerting i incident channel gotowe;
- final template kompletny;
- niezależny review nie znajduje nierozwiązanych P0;
- release owner podpisuje `CORE_RC_READY`.
