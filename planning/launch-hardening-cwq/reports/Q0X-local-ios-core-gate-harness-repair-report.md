# Q0X Local iOS Core Gate Harness Repair Report

Status: controller accepted with gaps, blocked external
Date: 2026-06-24

## Scope

Q0X repaired the local iOS no-provider core-release-gate harness after the
Q0T fake-auth removal exposed two local-only issues:

- explicit no-provider billing/RevenueCat overrides could be overwritten by
  `.env` sourcing in `scripts/run-e2e-local.sh`;
- `offline-save-pending-local.yaml` mixed local pending-state evidence with a
  reconnect-sync assertion that belongs to the separate
  `offline-save-sync.yaml` flow.

This slice did not use production, smoke/provider credentials, physical-device
validation, RevenueCat provider smoke, OpenAI provider smoke, Sentry production
evidence, backup/restore, deploy verification, billing provider evidence, or a
live RC workflow.

## Confirmed Facts

- Mobile branch: `codex/smart-memory-core-loop-fe`.
- Mobile pushed HEAD after Q0X:
  `59feb230b74914ef5a7963b05d2a19dd695edef4`.
- Backend branch: `codex/smart-memory-core-loop-be`.
- Backend HEAD:
  `fe01fbaf92921271968e9d7bde329530b42513eb`.
- Backend worktree had no Q0X changes.
- Q0X mobile commit:
  `59feb230b74914ef5a7963b05d2a19dd695edef4`
  (`test(e2e): repair local core gate harness`).
- After push, both mobile and backend repos were clean and empty against
  origin.
- Active mobile source had no matches for `authSession`, `authToken`,
  `fitaly://e2e/login`, `getE2EAuthSession`,
  `establishE2EAuthSession`, or `buildE2EProfileSeed`.
- Real UI login requires the local backend because mobile `authLogin` fetches
  `/users/me/profile` after Firebase Auth emulator sign-in.
- Local Auth/Profile seeding was used only with loopback
  `E2E_API_BASE_URL=http://127.0.0.1:8010`,
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`, and
  `FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099`.

## Changes

Mobile:

- `scripts/run-e2e-local.sh`
  - Preserves caller-set `DISABLE_BILLING`, `RC_ANDROID_API_KEY`, and
    `RC_IOS_API_KEY` after `.env` sourcing.
  - This keeps explicit no-provider local E2E runs from accidentally loading
    local RevenueCat values.
- `e2e/maestro/release-gate/offline-save-pending-local.yaml`
  - Removes the final reconnect segment.
  - The flow now proves the local pending badge only. Reconnect clearance stays
    owned by `offline-save-sync.yaml`.

Removed or ignored:

- No artifacts from `fitaly/e2e/artifacts` were restored or committed.
- No backend files changed in Q0X.
- No secrets, bundle IDs, package IDs, Firebase, RevenueCat, or Sentry
  credentials changed.

## Verification

Backend:

- `./.venv/bin/python -m pytest tests/test_seed_local_e2e_user.py`
  - passed: `5 passed`.
- Local backend health:
  - `GET http://127.0.0.1:8010/api/v1/health` returned OK.

Mobile static/contract checks:

- `node scripts/e2e/run-suite.mjs core-release-gate --validate`
  - passed: `20 flow(s) validated`.
- `bash -n scripts/run-e2e-local.sh`
  - passed.
- `git diff --check`
  - passed before commit.
- `npm run lint`
  - passed.
- `npm run typecheck`
  - passed.

Local iOS simulator runtime, no provider credentials:

- Targeted `smoke/login.yaml` against local backend/emulators:
  - passed `1/1`.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-login-local-backend-20260624`.
- Targeted repaired `offline-save-pending-local.yaml`:
  - passed `1/1`.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-offline-pending-local-backend-20260624`.
- Pre-commit full local iOS `core-release-gate` against local
  backend/emulators:
  - JUnit summary: `files=20 tests=20 failures=0 errors=0 skipped=0`.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-core-release-gate-local-backend-rerun2-20260624`.
  - This run was on the dirty worktree containing exactly the two Q0X mobile
    harness changes that were later committed as `59feb230...`.
- Post-push full local iOS `core-release-gate` attempt on mobile
  `59feb230...` plus backend `fe01fba...`:
  - JUnit summary: `files=16 tests=16 failures=1 errors=0 skipped=0`.
  - 15 flows passed before failure.
  - Failure: `chat-basic-history` failed during nested `smoke/login.yaml`
    startup with Maestro/XCTest `kAXErrorInvalidUIElement` while the app was
    on the splash/logo screen.
  - The failure happened before chat assertions; it is classified as local
    simulator driver/startup flake evidence, not a proven chat-domain failure.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-core-release-gate-pushed-20260624`.
- Post-push isolated `chat-basic-history.yaml` rerun on the same pair:
  - passed `1/1`.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-chat-basic-history-pushed-isolated-20260624`.
- Post-push remaining-flow batch for the four flows not reached by the failed
  full attempt:
  - passed `4/4`.
  - Flows: `premium-paywall-restore`, `notifications-preferences`,
    `weekly-report-entry-unavailable`, `share-save-and-share`.
  - Artifact dir:
    `/private/tmp/fitaly-q0x-remaining-core-flows-pushed-20260624`.
- GitHub Actions:
  - `gh run list --commit 59feb230b74914ef5a7963b05d2a19dd695edef4 --limit 10`
    returned no runs.
  - No remote CI is claimed for the Q0X commit.
  - Smoke/release-candidate workflows were not triggered because they use
    smoke/provider/prod secrets and require explicit owner authorization.

Provider guard evidence:

- Local E2E runs set `DISABLE_BILLING=true` and blank
  `RC_ANDROID_API_KEY`, `RC_IOS_API_KEY`, `OPENAI_API_KEY`, and `SENTRY_DSN`.
- Expo logs showed RevenueCat init with `androidKeyLen: 0`, `iosKeyLen: 0`,
  `billingDisabled: true`, and `hasSelectedKey: false`.
- Missing RevenueCat key warnings are expected for this no-provider local
  evidence.

## Diff Hygiene

Intentional Q0X diff:

- `scripts/run-e2e-local.sh`
- `e2e/maestro/release-gate/offline-save-pending-local.yaml`

Backend:

- No diff.

Accidental:

- None found in repo worktrees after commit and push.

## QA Classification

Q0X passes as a narrow local harness repair:

- no fake-auth path was reintroduced;
- no provider credentials were used;
- no secrets or app identifiers changed;
- real UI login works against the local backend/Auth/Profile emulator path;
- the offline pending flow now matches its stated local pending-state scope.

Accepted gaps:

- The pushed SHA does not have a single clean post-push `core-release-gate`
  `20/20` suite artifact. The post-push full attempt hit a Maestro/XCTest
  hierarchy failure on splash after 15 passing flows.
- The isolated reruns prove the failed chat flow and four not-reached flows
  individually, but they do not replace a single green full-suite run.
- No Android runtime, provider smoke, production smoke, live RC workflow,
  deployed backend SHA, billing provider, backup/restore, privacy/Sentry,
  compliance, rollback, rollout authorization, or exact remote CI evidence for
  `59feb230...` was produced.

## Controller Decision

Q0X is accepted only as a local iOS no-provider harness repair and evidence
refresh. It does not close Q0 and does not justify `CORE_RC_READY` or
`FULL_1_1_RC_READY`.

Current Q0 decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
