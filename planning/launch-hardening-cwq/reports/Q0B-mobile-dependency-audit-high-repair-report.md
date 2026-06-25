# Q0B Mobile Dependency Audit High Repair Report

Status: `pass_with_gaps`
Created: `2026-06-20T21:43:23Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

Q0B repairs the Q0A blocker from `npm audit --omit=dev --audit-level=high` in
the mobile repo without using `npm audit fix --force` or changing direct
Expo/React Native framework versions.

Non-goals:

- No broad Expo SDK upgrade.
- No React Native major/minor upgrade.
- No production/provider smoke.
- No attempt to clear force-only low/moderate findings in this slice.

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

- `package.json`
  - Existing override `protobufjs` changed from `8.3.0` to `8.6.4`, because
    audit reported `protobufjs` versions `8.0.0 - 8.5.0` as vulnerable.
- `package-lock.json`
  - Regenerated and deduped after the override update.
  - `node_modules/protobufjs` now resolves to `8.6.4`.
  - `node_modules/ws` now resolves to `6.2.4`, clearing the high `ws` audit
    finding after non-force audit repair/dedupe.
  - Direct root `react-native` remains `0.83.6` and `expo` remains `~55.0.23`.
  - Checked that `node_modules/react-native/node_modules/react-native` is not
    present in the final lockfile.

## Commands Run

Discovery and repair:

- `npm audit --omit=dev --audit-level=high`
  - Initial Q0A result: failed with high `protobufjs` and high `ws` findings.
- `npm audit fix --omit=dev`
  - Initial result: failed with `ENOSPC`.
- `npm audit fix --omit=dev --package-lock-only`
  - Initial result before cache cleanup: failed with `ENOSPC`.
- `du -sh /Users/lukaszkurczab/.npm/*`
  - Result: disposable `/Users/lukaszkurczab/.npm/_npx` was about `1.5G`.
- `rm -rf /Users/lukaszkurczab/.npm/_npx`
  - Result: freed local disk space; `df -h` later reported `2.2Gi` available.
- `npm audit fix --omit=dev --package-lock-only`
  - Result: completed, clearing `ws` high but leaving high `protobufjs`.
- `npm view protobufjs version dist-tags --json`
  - Result: latest `protobufjs` was `8.6.4`.
- `npm install --package-lock-only --omit=dev`
  - Result: completed after override bump, but produced a suspicious nested
    React Native peer artifact in the lockfile.
- `npm install --package-lock-only`
  - Result: completed but still retained the nested peer artifact.
- `npm dedupe --package-lock-only`
  - Result: completed and removed the nested
    `node_modules/react-native/node_modules/react-native` lock artifact.

Verification:

- `node -e` package metadata checks:
  - `package.json` direct `react-native`: `0.83.6`.
  - `package.json` direct `expo`: `~55.0.23`.
  - `package.json` `protobufjs` override: `8.6.4`.
  - `package-lock.json` `node_modules/react-native`: `0.83.6`.
  - `package-lock.json` nested
    `node_modules/react-native/node_modules/react-native`: `none`.
  - `package-lock.json` `node_modules/protobufjs`: `8.6.4`.
  - `package-lock.json` root `node_modules/ws`: `6.2.4`.
- `npm audit --omit=dev --audit-level=high`
  - Result: passed with exit code `0`.
  - Remaining audit output contains `22 vulnerabilities (1 low, 21 moderate)`;
    remaining fixes require `npm audit fix --force` and propose breaking
    dependency changes such as React Native/Expo changes. They are not fixed in
    Q0B.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `npm run test:targeted -- --runTestsByPath src/services/release/checkLaunchReadinessConfig.test.ts src/services/release/launchReadiness.test.ts src/services/release/releaseEvidenceScripts.test.ts src/services/core/runtimeConfig.test.ts src/services/core/envValidation.test.ts`
  - Result: `5 suites passed / 60 tests passed`.
  - Note: console error output is expected from negative tests validating
    release-script failure modes.
- `env GIT_OPTIONAL_LOCKS=0 git diff --check`
  - Result: passed.
- `npm run check:runtime-config`
  - Result: passed.
- `npm run check:launch-readiness:android`
  - Result: passed locally.
- `npm run check:launch-readiness:ios`
  - Result: passed locally.
- `npm run e2e:coverage:check`
  - Result: passed static validation: `18 covered`, `2 gap(s)`, `37 flow
    reference(s)`.
- `npm run e2e:dynamic-text:check`
  - Result: passed static validation for `11` release-relevant suites and `68`
    unique Maestro flows.
- `BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh`
  - Result: passed.

## QA Status

Independent QA:

- Agent: `Galileo`.
- Verdict: `QA_PASS_WITH_GAPS`.
- Severity: `P2`.
- Commands rerun:
  - `npm audit --omit=dev --audit-level=high` -> exit `0`; high gate passes,
    with `22 vulnerabilities (1 low, 21 moderate)` remaining.
  - `npm run typecheck` -> passed.
  - `npm run lint` -> passed.
  - Targeted release/runtime Jest suite -> `5 suites / 60 tests` passed.
  - `env GIT_OPTIONAL_LOCKS=0 git diff --check` -> passed.
  - `npm run check:runtime-config` -> passed.
  - `npm run check:launch-readiness:ios` -> passed.
- QA diff review:
  - Direct `package.json` diff is only `overrides.protobufjs: 8.3.0 ->
    8.6.4`.
  - No direct `expo` or `react-native` manifest version change.
  - No nested `node_modules/react-native/node_modules/react-native` lock
    artifact remains.
  - Lockfile resolves `expo` from `55.0.23` to `55.0.26` within the existing
    `~55.0.23` manifest range.
- QA gaps:
  - Residual low/moderate npm audit findings remain outside the high gate.
  - Lockfile churn is large and increases review surface, but QA found no
    blocking direct dependency drift.

## Remaining Q0 Blockers

- Q0 full runtime evidence is still open: Maestro smoke/release-gate runtime,
  provider/billing evidence, backup/restore, production smoke, deployed backend
  SHA evidence, store/legal metadata, and owner-approved external evidence
  paths.
- Remaining low/moderate npm audit findings are force-only or breaking-change
  candidates and need a separate risk/upgrade plan; they no longer fail the
  Q0 high audit gate.

## Next Smallest Slice

Q0C: run or prepare full paired local regression evidence that does not require
production/provider credentials, then separate external blockers from local
failures.
