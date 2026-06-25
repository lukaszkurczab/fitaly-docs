# Q0E Local Runtime Preflight Report

Status: `pass_with_gaps`
Created: `2026-06-20T22:11:12Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

Q0E adds and runs the smallest local runtime preflight that does not use
production, smoke-backend credentials, provider credentials, billing, or
external API health. The purpose is to prove the local Expo dev-client,
Maestro, simulator, E2E boot marker, logged-out login shell, and register shell
can run for the exact branch pair.

Non-goals:

- No login submission.
- No registration submission.
- No smoke/prod backend call.
- No provider, billing, Firebase credential, Sentry, or RevenueCat validation.
- No claim of full release-gate runtime readiness.

## Pair Snapshot

Mobile:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`

Backend:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

## Implemented Changes

Mobile:

- `e2e/maestro/release-gate/core-off-local-auth-shell.yaml`
  - New local-only Maestro flow.
  - Boots the dev client from `__E2E_EXPO_URL__`.
  - Asserts `e2e-booted`.
  - Uses `fitaly://e2e/reset?logout=1&theme=light`.
  - Asserts logged-out login screen and email/password inputs.
  - Opens register screen and asserts username/email/password inputs.
  - Does not submit login or registration.
- `scripts/e2e/suites.json`
  - Adds `local-runtime-preflight` suite with exactly the new flow.
- `package.json`
  - Adds `npm run e2e:local-runtime-preflight`.

Diff hygiene note: `package.json` also contains the earlier Q0B
`protobufjs 8.3.0 -> 8.6.4` override change, and `package-lock.json` contains
the earlier Q0B lockfile repair churn. Those are not Q0E changes and are
covered by `reports/Q0B-mobile-dependency-audit-high-repair-report.md`.

## Commands Run

Preflight discovery:

- `maestro --version` inside sandbox
  - Result: failed with `Operation not permitted` while initializing
    `/Users/lukaszkurczab/.maestro/deps/applesimutils`.
  - Classification: sandbox/tool-cache access issue, not a repo failure.
- `maestro --version` with local tool-cache access
  - Result: `2.6.1`.
- `xcrun simctl list devices booted`
  - Result: booted iOS simulator `Fitaly-MJ050`
    (`D046BCAF-0BDE-4025-BBB5-965E5E954D58`) on iOS `18.6`.
- `node scripts/e2e/run-suite.mjs smoke --validate`
  - Result: `smoke: 7 flow(s) validated`.
- `node scripts/e2e/run-suite.mjs release-gate --validate`
  - Result: `release-gate: 40 flow(s) validated`.
- `node scripts/e2e/run-suite.mjs platform-layout --validate`
  - Result: `platform-layout: 5 flow(s) validated`.

Q0E validation:

- `node -e` JSON parse for `package.json` and `scripts/e2e/suites.json`
  - Result: passed.
- `npm run e2e:local-runtime-preflight -- --validate`
  - Result: `local-runtime-preflight: 1 flow(s) validated`.
- `npm run e2e:coverage:check`
  - Result: `18 covered, 2 gap(s), 37 flow reference(s)`.
  - Note: static validation only.
- `npm run e2e:dynamic-text:check`
  - Result: `11 release-relevant suite(s)` and `68 unique Maestro flow(s)`.
  - Note: static validation only.
- `GIT_OPTIONAL_LOCKS=0 git diff --check`
  - Result: passed.

Runtime:

- `env E2E_PLATFORM=ios E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:9 E2E_EXPO_PORT=8099 E2E_ARTIFACT_DIR=/Users/lukaszkurczab/Desktop/Projects/Fitaly/docs/planning/launch-hardening-cwq/reports/q0e-local-runtime-preflight-artifacts npm run e2e:local-runtime-preflight`
  - Result: passed.
  - Output summary: `1/1 Flow Passed in 14s`.
  - Expo/Metro started on port `8099` and was stopped by the script.
  - Cleanup result: `Expo port 8099 is free after cleanup`.
  - JUnit artifact:
    `reports/q0e-local-runtime-preflight-artifacts/reports/release-gate-core-off-local-auth-shell.xml`.
  - JUnit summary: `tests="1"`, `failures="0"`, device
    `Fitaly-MJ050 - iOS 18.6 - D046BCAF-0BDE-4025-BBB5-965E5E954D58`,
    testcase `core-off-local-auth-shell`, status `SUCCESS`, time `14.0`.

## QA Status

Independent QA:

- Agent: `Carson`.
- Verdict: `QA_PASS_WITH_GAPS`.
- Severity: functional `none`; P2 release-hygiene gap for dependency churn if
  misattributed to Q0E.
- QA reran:
  - `npm run e2e:local-runtime-preflight -- --validate` -> exit `0`.
  - `npm run e2e:coverage:check` -> exit `0`.
  - `npm run e2e:dynamic-text:check` -> exit `0`.
  - `git diff --check` -> exit `0`.
  - Runtime rerun with `E2E_SKIP_API_HEALTH=1`,
    `E2E_API_BASE_URL=http://127.0.0.1:9`, `E2E_EXPO_PORT=8100`,
    `E2E_ARTIFACT_DIR=/private/tmp/q0e-qa-runtime-artifacts` -> exit `0`,
    `1/1 Flow Passed in 14s`; port `8100` free after cleanup; JUnit
    `tests="1"`, `failures="0"` on `Fitaly-MJ050 - iOS 18.6`.
- QA findings:
  - Flow scope is correct and isolated.
  - No login/register submission.
  - No credential placeholders in the new flow.
  - QA rerun used dead local API `http://127.0.0.1:9` with API health skipped.
  - Suite wiring maps `local-runtime-preflight` to exactly one flow.
- Required repairs:
  - None for Q0E runtime preflight behavior.

## Remaining Q0 Blockers

Q0E adds useful local runtime evidence, but does not close Q0:

- No authenticated runtime flow passed without external credentials.
- No smoke/prod backend connectivity was verified.
- No Android runtime preflight was run.
- No provider/billing evidence was run.
- No backup/restore, delete smoke, privacy logging, Sentry scrubbing,
  compliance packet, rollback rehearsal, or production alert routing evidence is
  present.
- Full release-gate and smoke Maestro suites remain unverified at runtime for
  this exact pair.

## Next Smallest Slice

Q0F should either run an owner-authorized smoke/backend/provider evidence path
or mark the remaining Q0 runtime/provider/manual evidence as
`BLOCKED_EXTERNAL_DEPENDENCY`. Without explicit authorization, do not run
smoke/prod backend credentials or provider flows.
