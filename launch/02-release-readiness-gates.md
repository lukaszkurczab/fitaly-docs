# 02 — Release Readiness Gates

Status: active contract

## Status vocabulary

- `not_started`
- `in_progress`
- `blocked`
- `blocked_external`
- `failed`
- `passed`
- `waived_p1`

P0 nie może mieć statusu `waived_p1`.

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
- telemetry, reminders, billing i AI mają jawne ustawienia;
- wszystkie domeny 1.1 są `false` w production;
- backend disabled route zwraca przewidywalny kod;
- mobile nie wykonuje requestów/background work dla disabled feature;
- deep link/navigation nie omija flag;
- kill switch nie uruchamia legacy fallbacku.

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

Acceptance:

- RC build/profile odpowiada launch-like config;
- jedna pełna green suite dla aktualnej pary SHA;
- auth, onboarding, Add Meal, Review/save, Home/History/Stats, AI Chat, offline,
  premium/restore, notifications, share i account operations zgodnie z
  rzeczywistym scope;
- brak E2E-only bypassu w production path;
- artifact manifest, JUnit, logs i screenshoty.

## Gate F — Android core runtime

Acceptance:

- skonfigurowany i booted AVD;
- `npm run e2e:android-simulator:preflight` zwraca ready;
- pełna aktualna core suite lub jawnie równoważny Android release gate;
- zweryfikowane layout, permissions, back navigation, keyboard, camera/media,
  notifications i billing platform behavior;
- artifact manifest, JUnit, logs i screenshoty.

## Gate G — Visual/UI readiness

Acceptance:

- katalog ekranów i stanów jest kompletny;
- screenshot library obejmuje iOS i Android oraz wspierane języki;
- każdy screen ma ocenę functional, visual, copy, accessibility i risk;
- wszystkie P0/P1 release-blocking findings naprawione i ponownie sfotografowane;
- brak mockowego copy, placeholderów, debug bannerów i zablokowanych CTA.

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

Acceptance:

- prawidłowe products/offerings/entitlement;
- sandbox purchase i restore na obu platformach;
- backend/mobile entitlement consistency;
- free/premium limits;
- expired/cancelled/offline/degraded states;
- brak utraty zakupionego dostępu po restart/login/restore.

## Gate J — Backend smoke i deployed evidence

Acceptance:

- health i version;
- deployed BE SHA zgodny z evidence;
- auth flow contracts;
- Add Meal AI i Chat v2 bounded smoke, jeśli zaplanowane;
- credits, telemetry, export/delete i weekly premium boundary;
- 1.1 routes pozostają disabled;
- brak sekretów/raw payloadów w artifacts.

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
- release owner podpisuje `CORE_RC_READY`.
