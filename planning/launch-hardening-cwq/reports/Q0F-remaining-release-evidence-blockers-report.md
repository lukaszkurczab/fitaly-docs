# Q0F Remaining Release Evidence Blockers Report

Status: `blocked_external`
Created: `2026-06-20T22:18:00Z`
Controller decision: `BLOCKED_EXTERNAL_DEPENDENCY`.

## Scope

Q0F classifies the remaining Q0 release-evidence gaps after Q0A-Q0E local
evidence. It does not run production, smoke-backend, provider, billing, backup,
restore, Sentry, store, or legal evidence without owner authorization.

## Pair Snapshot

Mobile:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`

Backend:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

## Confirmed Local Evidence Already Collected

- C0-C4 and P1 have local worker/QA evidence reports.
- Q0A static/readiness preflight passed, except the high npm audit blocker that
  Q0B later repaired.
- Q0B high dependency audit gate passes; residual low/moderate audit findings
  remain force-only/breaking-change candidates.
- Q0C full local backend and mobile regression passed after a locale repair.
- Q0D local release-evidence artifact records the exact FE/BE SHA pair and
  proves production-off new-domain flags are `false`.
- Q0E local iOS unauthenticated runtime preflight passed twice without external
  API/provider use.

## Remaining External / Owner-Authorized Blockers

These cannot be honestly produced in this loop without explicit owner
authorization, credentials, or external evidence:

- Authenticated smoke/runtime E2E against the smoke backend and Firebase test
  account path.
- Production smoke.
- Provider/billing purchase and restore evidence.
- Deployed backend SHA evidence from the actual target environment.
- Firestore backup run evidence.
- Restore drill evidence.
- Delete smoke evidence.
- Paywall truthfulness screenshots or store/provider purchase notes.
- Privacy-safe logging runtime evidence.
- Sentry scrubbing, retention, and alert-routing evidence.
- Compliance packet evidence.
- Rollback rehearsal evidence.
- Store/legal metadata evidence.

Per controller rules, these are not replaced with mocks and are not marked as
passed.

## Remaining Local Runtime / Environment Gaps

These are local or engineering-environment gaps, not proof of release readiness:

- Android runtime preflight was not run.
  - `adb devices` returned no attached devices.
  - `emulator -list-avds` returned no configured AVD names.
- Mobile app supports `EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST`, and backend
  `firebase.json` defines local Auth/Firestore/Storage emulator ports.
- Backend tests contain Auth emulator helpers and `scripts/run-emulator-evidence.sh`
  can run emulator-backed pytest.
- There is no current repo-evidenced, small, turnkey mobile E2E path that seeds
  Firebase Auth emulator, starts backend with emulator config, seeds the backend
  profile/bootstrap state required by mobile `authLogin`, runs authenticated
  mobile core-loop flows, and tears the full stack down.
- Building that local full-auth E2E harness would be a new engineering packet,
  not a Q0 evidence claim.

## Commands Run

- `adb devices`
  - Result: Android SDK `adb` exists, but no devices were listed.
- `emulator -list-avds`
  - Result: Android emulator binary exists, but no AVD names were listed.
- `firebase --version`
  - Controller result: exit `0`, `15.19.0`.
  - Independent QA rerun: printed `15.19.0` but exited `2` because the
    Firebase CLI update-check config store was not writable. This confirms the
    CLI binary/version is present, but the local config-store permission issue
    would need cleanup before using Firebase CLI as part of an automated mobile
    full-auth harness.
- `uvicorn --version`
  - Result: `uvicorn 0.44.0` with CPython `3.13.1`.
- Repo inspection:
  - `fitaly/src/FirebaseConfig.ts` configures Auth emulator only when
    `getRuntimeConfig().firebaseAuthEmulatorHost` is set.
  - `fitaly/app.config.js` exposes
    `EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` through Expo config.
  - `fitaly-backend/firebase.json` defines Auth `9099`, Firestore `8080`,
    Storage `9199`.
  - `fitaly-backend/scripts/run-emulator-evidence.sh` runs emulator-backed
    pytest, not mobile E2E orchestration.

## Controller Decision

`CORE_RC_READY` is not justified.

`FULL_1_1_RC_READY` is not justified.

The honest current outcome is `BLOCKED_EXTERNAL_DEPENDENCY` for release
readiness because required runtime/provider/manual production-adjacent evidence
is unavailable without explicit owner authorization or external artifacts.

New domains remain production-off.

## Required Owner Inputs To Resume Q0

The owner must choose one or more authorized evidence paths:

- Authorize smoke-backend/Firebase test account runtime E2E and provide the
  intended bounded scope.
- Provide or authorize production smoke scope.
- Provide billing/provider purchase/restore evidence path.
- Provide backup/restore evidence or authorize running it.
- Provide deployed backend SHA evidence source.
- Provide Sentry/compliance/store/legal/rollback evidence artifacts.
- Provide Android emulator/device setup or authorize a local Android runtime
  environment setup pass.

Without those inputs, further Q0 readiness claims would be fabricated.

## QA Status

Independent QA:

- Agent: `Hooke`.
- Verdict: `QA_PASS_WITH_GAPS`.
- Severity: no release-blocking finding against the blocker classification.
- Evidence checked:
  - Q0F report, packet status, and release hardening status.
  - Mobile app config, Firebase config, and runtime config consumption for
    `EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST`.
  - Backend `firebase.json`.
  - Backend `scripts/run-emulator-evidence.sh`.
  - Mobile `scripts/run-e2e-local.sh`.
- Commands rerun:
  - `adb devices` -> exit `0`, no devices listed.
  - `emulator -list-avds` -> exit `0`, empty output.
  - `firebase --version` -> printed `15.19.0`, exited `2` due local
    config-store permission.
  - `uvicorn --version` -> exit `0`, `uvicorn 0.44.0`.
  - `node scripts/e2e/run-suite.mjs release-gate --validate` -> `40 flow(s)
    validated`.
  - `node scripts/e2e/run-suite.mjs local-runtime-preflight --validate` -> `1
    flow(s) validated`.
- QA conclusion:
  - `BLOCKED_EXTERNAL_DEPENDENCY` is justified.
  - Repo evidence supports the absence of a one-command full-auth local stack
    harness for mobile E2E.
  - Remaining release-readiness evidence still requires owner authorization,
    external artifacts, provider/production/smoke access, or Android/local
    runtime setup.
