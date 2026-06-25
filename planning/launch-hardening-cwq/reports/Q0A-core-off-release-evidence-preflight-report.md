# Q0A Core-Off Release Evidence Preflight Report

Status: `partial`
Created: `2026-06-20T21:37:09Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

Q0A is the first Q0 slice after C0-C4 and P1 passed local worker/QA gates. It
checks local paired release/readiness evidence that does not require production
credentials, provider smoke, store access, or production data.

Non-goals:

- No production/provider smoke.
- No live billing purchase/restore.
- No store submission evidence.
- No production data access.
- No claim of `CORE_RC_READY`.

## Pair Snapshot

Re-checked before Q0A commands:

- Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

Dirty state:

- Mobile dirty state includes intentional C1-C4 and P1 changes.
- Backend dirty state includes intentional C1-C4 and P1 changes.
- Q0A dependency repair attempts did not modify `package.json` or
  `package-lock.json`.

## Commands Run

Mobile release/readiness:

- `npm run check:runtime-config`
  - Result: passed; smoke runtime config checks passed.
- `npm run check:launch-readiness:android`
  - Result: passed locally; production checks passed for Android.
- `npm run check:launch-readiness:ios`
  - Result: passed locally; production checks passed for iOS.
- `BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh`
  - Result: passed for smart reminders, profile onboarding, food library
    domains, and barcode lookup contract snapshots.
- `npm run e2e:coverage:check`
  - Result: passed static validation: `18 covered`, `2 gap(s)`, `37 flow
    reference(s)`.
  - Note: script explicitly states this is static definition only, not Maestro
    runtime release acceptance.
- `npm run e2e:dynamic-text:check`
  - Result: passed static validation for `11` release-relevant suites and `68`
    unique Maestro flows.
  - Note: script explicitly states this does not prove semantic dynamic-response
    correctness.
- `npm run test:targeted -- --runTestsByPath src/services/release/checkLaunchReadinessConfig.test.ts src/services/release/launchReadiness.test.ts src/services/release/releaseEvidenceScripts.test.ts src/services/core/runtimeConfig.test.ts src/services/core/envValidation.test.ts`
  - Result: `5 suites passed / 60 tests passed`.
  - Note: console error output is expected from negative tests that assert
    release scripts fail on non-SHA refs, missing production feature flags,
    enabled production feature flags, and smoke runtime SHA mismatch.
- `python3 -m json.tool eas.json >/dev/null`
  - Result: passed.

Mobile dependency audit:

- `npm audit --omit=dev --audit-level=high`
  - Result: failed.
  - Blocking high findings:
    - `protobufjs` high via unbounded Any expansion during JSON conversion,
      plus related moderate advisories.
    - `ws` high via memory exhaustion DoS from tiny fragments/data chunks, plus
      related moderate advisory.
  - Full audit count from text output: `29 vulnerabilities (1 low, 26 moderate,
    2 high)`.
- `npm audit --omit=dev --audit-level=high --json`
  - Result: failed as expected for the same audit state.
  - JSON metadata reported `30` total vulnerabilities: `1 low`, `27 moderate`,
    `2 high`.

Attempted dependency repair:

- `npm audit fix --omit=dev`
  - Result: failed with `ENOSPC: no space left on device`.
  - No `package.json` or `package-lock.json` changes remained after the failed
    command.
- `npm cache clean --force`
  - Result: completed; used to recover disk margin after the failed npm repair.
- `npm audit fix --omit=dev --package-lock-only`
  - Result: failed with `ENOSPC: no space left on device`.
  - No `package.json` or `package-lock.json` changes remained after the failed
    command.
- Second `npm cache clean --force`
  - Result: completed after the second failed repair attempt.
- Disk evidence after cleanup:
  - `df -h . /Users/lukaszkurczab/.npm /private/tmp` reported only `624Mi`
    available on `/System/Volumes/Data`.
  - `du -sh /Users/lukaszkurczab/.npm` reported `1.5G`.

## Findings

- Production/smoke runtime config and contract-pairing static checks pass
  locally for the current branch pair.
- Production new-domain flags remain off in release evidence/readiness paths
  covered by the local checks.
- Static E2E coverage definitions pass, but two coverage gaps remain by design
  in the static manifest and no Maestro runtime evidence was run in Q0A.
- `npm audit --omit=dev --audit-level=high` is a release blocker.
- Dependency audit repair could not be completed in this local environment
  because the filesystem has insufficient free space. The attempted repair made
  no durable package manifest/lockfile change.

## Classification

- Q0A status: `partial`.
- Current release decision: `NO_GO`.
- Blocker type: code/dependency blocker plus local environment capacity blocker,
  not an external provider credential blocker.
- External evidence still missing for full Q0: provider/billing, live smoke,
  backup/restore, store/legal metadata, production deployed backend SHA, and
  owner-authorized production smoke.

## Required Repairs

- Resolve `npm audit --omit=dev --audit-level=high` high findings without
  `--force` breaking dependency downgrades/upgrades, or produce an owner-approved
  documented waiver with security rationale.
- Free enough local disk space or run the dependency repair in CI/another clean
  workspace with sufficient space, then commit the resulting package lockfile
  changes and rerun audit.
- Run Q0 runtime evidence only after audit and local static gates are green.

## Next Smallest Slice

Q0B: dependency audit repair for high-severity mobile production dependency
findings.

Acceptance criteria:

- Do not use `npm audit fix --force`.
- Avoid Expo/RN major downgrades or broad framework upgrades in the same slice.
- Prefer minimal transitive override/lockfile changes that clear high findings.
- Rerun `npm audit --omit=dev --audit-level=high`.
- Rerun mobile typecheck, lint, targeted release-script tests, and a small
  smoke subset affected by dependency resolution.
- If local disk remains insufficient, mark the slice blocked by local
  environment capacity with exact `df` evidence.
