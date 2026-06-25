# Q0G Local Maestro Smoke Auth Repair Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T21:50:00Z`
Updated: `2026-06-21T22:12:55Z`

## Scope

Q0G records the local Maestro smoke repair requested before continuing the
hardening loop. The repair makes the shared local smoke login bootstrap stable
without using smoke/prod backend credentials, provider credentials, Firebase
credentials, RevenueCat, Sentry, or production data.

Non-goals:

- no production auth readiness claim;
- no smoke-backend/Firebase test-account credential run;
- no provider/billing run;
- no production smoke;
- no Android runtime evidence;
- no feature-domain production activation.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`

The mobile worktree already contained prior hardening changes before Q0G. Q0G
attributes only the Maestro/E2E auth-session repair and its tests.

## Confirmed Facts

- The shared local Maestro smoke login path was unstable when it depended on
  text-entry provider login.
- `scripts/run-e2e-local.sh` supports local Expo/Maestro runs with
  `E2E_SKIP_API_HEALTH=1`.
- E2E-only deep-link handling is gated by `isE2EModeEnabled()`.
- Production EAS config does not set `E2E=true`.

## Changes

- `e2e/maestro/smoke/login.yaml` now uses
  `fitaly://e2e/login?email=${E2E_EMAIL}` after asserting the login shell,
  instead of typing a provider password.
- `e2e/maestro/smoke/auth-bootstrap.yaml` uses the same E2E-only login
  bootstrap and waits for `e2e-ready-home` before asserting the Home tab.
- Added E2E auth-session bridge under `src/services/e2e/authSession.ts`:
  - inert outside E2E mode;
  - stores only `e2e:auth:session`;
  - derives deterministic local E2E uid/email;
  - writes local E2E profile cache seed for smoke runtime;
  - publishes session updates through the existing local event bus.
- `src/services/e2e/deepLink.ts` handles `fitaly://e2e/login` only when E2E
  mode is enabled, restores preserved E2E sessions on reset without logout,
  clears E2E session on reset with logout, and uses the E2E uid for seed and
  reconnect commands when Firebase has no current user.
- `AuthContext` can hydrate and subscribe to an E2E auth session only in E2E
  mode, while normal Firebase auth remains the production path.
- `authLogout` clears the local E2E auth session and still runs
  `resetUserRuntime` for the active uid.
- `AppNavigator` avoids logging out the synthetic local E2E session solely
  because a backend profile is absent.
- E2E fixture/profile/access helpers provide local smoke data only in E2E mode.

## Verification

Controller local runtime:

- `env E2E_EXPO_PORT=8100 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`
  passed: `7/7` flows.
  - `login`
  - `foundation`
  - `auth-bootstrap`
  - `add-meal`
  - `chat-ai`
  - `offline-error`
  - `account-launch`
- Fresh controller rerun after the "fix Maestro before continuing" stop:
  `env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`
  passed: `7/7` flows, and the runner stopped Expo/Metro and confirmed port
  `8099` was free after cleanup.
  - `login`
  - `foundation`
  - `auth-bootstrap`
  - `add-meal`
  - `chat-ai`
  - `offline-error`
  - `account-launch`

Controller local static/unit gates:

- Mobile lint passed.
- Mobile typecheck passed.
- Targeted Maestro/E2E auth-session tests passed: `165` tests.
- Release-gate suite validation passed: `40` flows validated.
- `git diff --check` passed.

Independent QA:

- Verdict: `QA_PASS_WITH_GAPS`.
- QA targeted Jest command:
  `npm run test:targeted -- --runTestsByPath src/services/e2e/authSession.test.ts src/services/e2e/deepLink.test.ts src/context/AuthContext.test.tsx src/feature/Auth/services/authService.test.ts src/navigation/AppNavigator.test.ts src/services/e2e/fixtures.test.ts src/services/user/userProfileRepository.test.ts`
  passed: `7` suites, `120` tests.
- QA static E2E validation:
  - `node scripts/e2e/run-suite.mjs smoke --validate` passed:
    `7` flows validated.
  - `node scripts/e2e/run-suite.mjs auth --validate` passed:
    `9` flows validated.
  - `npm run e2e:coverage:check` passed:
    `18 covered, 2 gaps, 37 flow refs`.

QA confirmed:

- `fitaly://e2e/login` is not subscribed/handled unless E2E mode is enabled.
- E2E mode is driven by `extra.e2e === true`, sourced from `E2E=true`.
- Production EAS config does not set `E2E=true`.
- Smoke login no longer requires provider credentials.
- E2E auth session is inert outside E2E mode.
- Fixture profile/access overrides are E2E-gated.

## Remaining Gaps

- Independent QA did not rerun Maestro/device runtime after the fresh
  controller smoke rerun; the controller rerun passed locally.
- App-level link subscription is confirmed by code, not separately covered by
  the focused Jest slice.
- Local E2E fixture smoke is not production auth readiness.
- Provider-backed auth, billing, smoke/prod backend, backup/restore, Android
  runtime and production smoke evidence remain Q0 blockers.

## Controller Decision

Q0G: `qa_passed_with_gaps`.

The local Maestro smoke blocker is repaired and local smoke can run without
provider/prod credentials. This improves local release evidence but does not
change the overall decision: `CORE_RC_READY` and `FULL_1_1_RC_READY` are still
not justified. Q0 remains `blocked_external` until the owner-authorized
runtime/provider/manual evidence listed in Q0F exists.
