# Q0T Local Auth/Profile Seed Repair Report

Generated: `2026-06-23T07:34:16Z`
Updated after commit/push: `2026-06-23T07:40:02Z`

## Objective

Repair local E2E auth/profile setup so local Maestro login uses the real Login
UI plus Firebase Auth/Profile emulator state, without preserving the temporary
`fitaly://e2e/login` fake-auth session path.

## Scope

In scope:

- Remove the local fake-auth session/token path from active mobile source.
- Restore Maestro smoke login/bootstrap flows to real UI login.
- Seed the local Firebase Auth emulator and `users/{uid}` profile document only
  for localhost/127.0.0.1 backend runs with explicit Auth and Firestore
  emulator env vars.
- Repair Maestro CLI device argument order and remove the local
  `JAVA_TOOL_OPTIONS -Duser.home=...` override that produced false device
  connectivity failures.
- Record current clean pushed worktree evidence without claiming release
  readiness.

Out of scope:

- Provider-backed smoke, production smoke, billing, backup/restore, Android,
  deployed backend SHA, or remote CI evidence.
- Pushing local commits.
- Home Next Action implementation or activation.
- Any secret, bundle ID, package ID, Firebase, RevenueCat, or Sentry credential
  change.

## Facts

- Mobile branch is `codex/smart-memory-core-loop-fe` at local/origin HEAD
  `21f8c52d` (`fix(e2e): restore real local auth login`), `0 ahead / 0
  behind` origin after push.
- Backend branch is `codex/smart-memory-core-loop-be` at local/origin HEAD
  `d82f938` (`test(e2e): seed local auth profile user`), `0 ahead / 0
  behind` origin after push.
- Origin refs were refreshed with `git fetch --prune origin` in both repos
  before diff classification.
- Current mobile worktree is clean after commit/push.
- Current backend worktree is clean after commit/push.
- `e2e/artifacts/` was intentionally cleaned by the owner during this slice;
  a re-check found no files under `e2e/artifacts` and no active-source matches
  for the removed fake-auth identifiers.
- Active-source search returned no matches for
  `buildE2EProfileSeed`, `fitaly://e2e/login`, `authSession`, `authToken`,
  `getE2EAuthSession`, or `establishE2EAuthSession`.

## Assumptions

- Local emulator seeding is acceptable only for local backend runs using
  loopback emulator hosts.
- Remote CI and provider evidence for the pushed Q0T pair are still missing or
  unverified in this local controller turn.

## Diff Hygiene

Intentional reverse-patch:

- Mobile staged deletions of the temporary fake-auth session/token module and
  its tests.
- Removal of fake-auth session imports/callers from AuthContext, auth service,
  AppNavigator, apiClient, E2E deep-link handling, status overlay, and user
  profile repository tests/source.

Intentional replacement:

- Maestro smoke login/bootstrap now enter email/password in the real Login UI.
- `scripts/run-e2e-local.sh` seeds local Auth/Profile emulator state only for
  loopback API base URLs with explicit Firebase emulator env vars.
- Backend `scripts/seed_local_e2e_user.py` creates/signs in the emulator Auth
  user and writes a ready profile document into the Firestore emulator.
- Backend seeder now rejects non-loopback Auth/Firestore emulator hosts.
- Dead mobile `buildE2EProfileSeed` helper was removed.
- Maestro command order is `maestro --device "$UDID" test ...`.
- Local `JAVA_TOOL_OPTIONS -Duser.home=...` override was removed.

Pre-existing hardening commit:

- Mobile commit `829593cd...` and backend commit `fa4711f...` are prior Q0S
  hardening commits, now pushed as ancestors of the Q0T branch heads.

Q0T commits pushed:

- Mobile: `21f8c52d` (`fix(e2e): restore real local auth login`).
- Backend: `d82f938` (`test(e2e): seed local auth profile user`).

Accidental:

- None found.

## Verification

Mobile:

```sh
rg "buildE2EProfileSeed|fitaly://e2e/login|authSession|authToken|getE2EAuthSession|establishE2EAuthSession" src e2e scripts --glob '!coverage/**'
```

Result: passed, no matches.

```sh
bash -n scripts/run-e2e-local.sh
```

Result: passed.

```sh
node scripts/e2e/run-suite.mjs smoke --validate
```

Result: passed, `7` smoke flows validated.

```sh
npm run test:targeted -- src/context/AuthContext.test.tsx src/feature/Auth/services/authService.test.ts src/navigation/AppNavigator.test.ts src/services/core/apiClient.test.ts src/services/e2e/deepLink.test.ts src/services/user/userProfileRepository.test.ts
```

Result: passed, `6` suites / `84` tests.

```sh
npm run lint
```

Result: passed.

```sh
npm run typecheck
```

Result: passed.

```sh
git diff --check
```

Result: passed.

Backend:

```sh
./.venv/bin/python -m pytest tests/test_seed_local_e2e_user.py
```

Result: passed, `5` tests.

```sh
./.venv/bin/python -m pytest
```

Result: passed, `1377` passed / `36` skipped / `3` warnings.

```sh
./.venv/bin/python -m compileall app
```

Result: passed.

```sh
./.venv/bin/ruff check .
```

Result: passed.

```sh
./.venv/bin/pyright
```

Result: passed, `0 errors, 0 warnings, 0 informations`.

```sh
git diff --check
```

Result: passed.

Runtime/process context:

- Existing Expo/Metro processes were observed at PIDs `47082` and `47158`.
- Existing local backend uvicorn was observed at PID `4105`.
- No production/provider smoke, provider credentials, or production access was
  used.

## QA

Independent QA initially returned `pass_with_gaps`:

- Backend seeder did not reject non-loopback emulator hosts.
- Dead mobile `buildE2EProfileSeed` helper remained exported.
- Tests did not cover non-local emulator host rejection.

Controller repair:

- Added loopback-only emulator host validation to the backend seeder.
- Added rejection/acceptance tests for emulator hosts.
- Removed the dead mobile profile seed helper.

Independent re-QA returned `pass` with no remaining blockers or gaps from the
prior findings.

## Evidence

- Current blocked evidence snapshot:
  `reports/Q0T-current-blocked-release-evidence.md`
- This report:
  `reports/Q0T-local-auth-profile-seed-repair-report.md`

## Unverified Areas

- No provider-backed smoke or production smoke.
- No Android runtime.
- No backup/restore, billing, paywall, deployed backend SHA, privacy/Sentry,
  compliance, rollback, or remote CI evidence.
- No full Maestro runtime rerun after this repair in this controller turn; the
  prior direct local Maestro login check remains historical evidence only.

## Controller Decision

Q0T is accepted as a local auth/profile seed repair.

Current launch decision remains `BLOCKED_EXTERNAL_DEPENDENCY` because remote
CI/provider/manual Q0 evidence is still missing or unverified.
