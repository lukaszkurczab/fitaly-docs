# Q0Y Current-Pair Local iOS Core Gate Report

Status: controller accepted with gaps, blocked external
Date: 2026-06-24

## Scope

Q0Y refreshes local iOS simulator `core-release-gate` evidence for the current
pushed pair after Q0X left no single green post-push full-suite artifact.

This slice did not change application or backend code. It did not use
production, smoke/provider credentials, physical-device validation,
RevenueCat provider smoke, OpenAI provider smoke, Sentry production evidence,
backup/restore, deploy verification, billing provider evidence, or a live RC
workflow.

## Confirmed Facts

- Mobile branch: `codex/smart-memory-core-loop-fe`.
- Mobile HEAD and upstream after `git fetch --prune`:
  `59feb230b74914ef5a7963b05d2a19dd695edef4`.
- Backend branch: `codex/smart-memory-core-loop-be`.
- Backend HEAD and upstream after `git fetch --prune`:
  `fe01fbaf92921271968e9d7bde329530b42513eb`.
- Both repo worktrees were clean and empty against upstream before and after
  the Q0Y runtime run.
- Active mobile source had no matches for `authSession`, `authToken`,
  `fitaly://e2e/login`, `getE2EAuthSession`,
  `establishE2EAuthSession`, or `buildE2EProfileSeed`.
- The run used booted iOS simulator
  `D046BCAF-0BDE-4025-BBB5-965E5E954D58` (`Fitaly-MJ050`, iOS 18.6).
- Firestore emulator was already listening on `127.0.0.1:8080`.
- Auth emulator was started locally on `127.0.0.1:9099`.
- Backend was started locally on `127.0.0.1:8010` with
  `ENVIRONMENT=local`, `FIREBASE_PROJECT_ID=demo-fitaly-local`,
  `FIRESTORE_DATABASE_ID=(default)`, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`,
  and `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`.
- Backend health returned OK at
  `http://127.0.0.1:8010/api/v1/health`.
- The local E2E runner seeded the real Firebase Auth emulator user and
  Firestore `users/{uid}` profile before UI login.

## Verification

Preflight:

- `git fetch --prune` in both repos.
- `git status --short --branch`, `git rev-parse HEAD`,
  `git rev-parse @{u}`, `git diff --name-status`, and
  `git diff --name-status @{u} --` in both repos.
  - Result: both repos clean, `HEAD == @{u}`.
- `rg "authSession|authToken|fitaly://e2e/login|getE2EAuthSession|establishE2EAuthSession|buildE2EProfileSeed" .`
  in mobile.
  - Result: no active matches.
- `node scripts/e2e/run-suite.mjs core-release-gate --validate`
  - Result: `20 flow(s) validated`.

Runtime command shape:

```bash
env PATH="$HOME/.maestro/bin:$PATH" \
  E2E_EXPO_CLEAR_CACHE=1 \
  E2E_EXPO_PORT=8099 \
  E2E_PLATFORM=ios \
  E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 \
  E2E_API_BASE_URL=http://127.0.0.1:8010 \
  FIREBASE_PROJECT_ID=demo-fitaly-local \
  FIRESTORE_DATABASE_ID='(default)' \
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 \
  EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS=false \
  EXPO_PUBLIC_ENABLE_FOOD_LIBRARY=false \
  EXPO_PUBLIC_ENABLE_PLANNING=false \
  EXPO_PUBLIC_ENABLE_SMART_MEMORY=false \
  EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION=false \
  EXPO_PUBLIC_ENABLE_TELEMETRY=false \
  E2E_ENABLE_TELEMETRY=false \
  DISABLE_BILLING=true \
  RC_ANDROID_API_KEY= \
  RC_IOS_API_KEY= \
  OPENAI_API_KEY= \
  SENTRY_DSN= \
  E2E_ARTIFACT_DIR=/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624 \
  npm run e2e:core-release-gate
```

Runtime result:

- Suite: `core-release-gate`.
- Platform: local iOS simulator.
- Artifact dir:
  `/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624`.
- JUnit reports:
  `/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624/reports`.
- JUnit summary:
  - files: `20`;
  - tests: `20`;
  - failure attributes: `0`;
  - `<failure>` tags: `0`;
  - `<error>` tags: `0`;
  - `<skipped>` tags: `0`.
- Flow summary:
  - `core-off-local-auth-shell`: pass;
  - `smoke/login`: pass;
  - `smoke/auth-bootstrap`: pass;
  - `smoke/account-launch`: pass;
  - `account-delete-cancel`: pass;
  - `privacy-ai-consent`: pass;
  - `home-history-statistics-after-save`: pass;
  - `history-edit-delete`: pass;
  - `offline-save-pending-local`: pass;
  - `add-meal-manual-edit-save-propagates`: pass;
  - `add-meal-text-save-propagates`: pass;
  - `add-meal-photo-save-propagates`: pass;
  - `add-meal-barcode-save-propagates`: pass;
  - `add-meal-saved-template`: pass;
  - `review-edit-layout`: pass;
  - `chat-basic-history`: pass;
  - `premium-paywall-restore`: pass;
  - `notifications-preferences`: pass;
  - `weekly-report-entry-unavailable`: pass;
  - `share-save-and-share`: pass.

Provider guard evidence:

- Runtime env set `DISABLE_BILLING=true`.
- Runtime env blanked `RC_ANDROID_API_KEY`, `RC_IOS_API_KEY`,
  `OPENAI_API_KEY`, and `SENTRY_DSN`.
- Expo log showed RevenueCat init with `androidKeyLen: 0`, `iosKeyLen: 0`,
  `billingDisabled: true`, and `hasSelectedKey: false`.
- Missing RevenueCat key warnings are expected for this no-provider local
  evidence and do not prove billing/provider readiness.

## Diff Hygiene

Mobile:

- No repo diff after runtime.

Backend:

- No repo diff after runtime.

Docs:

- Q0Y only updates launch-hardening evidence documentation.

Generated/local artifacts:

- Runtime artifacts are under `/private/tmp/...`.
- No files were added back to `fitaly/e2e/artifacts`.

## QA Classification

Q0Y closes the Q0X local evidence gap for a single green post-push local iOS
simulator `core-release-gate` artifact on the current pushed pair.

Accepted gaps:

- No exact remote CI run is claimed for mobile
  `59feb230b74914ef5a7963b05d2a19dd695edef4`.
- No Android runtime, physical-device runtime, provider smoke, production
  smoke, live RC workflow, deployed backend SHA, billing provider,
  backup/restore, privacy/Sentry, compliance, rollback, rollout
  authorization, or production readiness evidence was produced.
- The run is local simulator evidence only.

## Controller Decision

Q0Y is accepted as local iOS simulator no-provider core-gate evidence for the
current pushed pair.

Q0Y does not close Q0 and does not justify `CORE_RC_READY` or
`FULL_1_1_RC_READY`.

Current Q0 decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
