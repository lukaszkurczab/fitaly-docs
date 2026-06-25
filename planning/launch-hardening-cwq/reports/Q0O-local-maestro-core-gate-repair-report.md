# Q0O Local Maestro Core Gate Repair Report

Generated: `2026-06-22T09:41:02Z`

## Objective

Repair Maestro before continuing hardening, without using production, provider
smoke, or credential-backed runtime evidence.

## Confirmed Facts

- Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD during repair: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Maestro version: `2.6.1`
- Booted simulator: `Fitaly-MJ050 (D046BCAF-0BDE-4025-BBB5-965E5E954D58)`, iOS `18.6`
- Local-only runtime was pinned with `E2E_API_BASE_URL=http://127.0.0.1:9`
  and `E2E_SKIP_API_HEALTH=1`.

## Root Cause

The local `core-release-gate` suite still exercised
`e2e/maestro/release-gate/offline-save-sync.yaml`. That flow expects reconnect
to clear `history-meal-sync-pending-0`, which requires a reachable backend sync
surface. In a no-provider local core run, pending state is the correct
observable result, so the suite mixed local core evidence with provider-backed
sync evidence.

The failing evidence command was:

```sh
env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:9 E2E_ARTIFACT_DIR=/tmp/fitaly-core-release-gate-artifacts E2E_RESULTS_DIR=/tmp/fitaly-core-release-gate-reports E2E_DEBUG_OUTPUT_DIR=/tmp/fitaly-core-release-gate-debug E2E_TEST_OUTPUT_DIR=/tmp/fitaly-core-release-gate-shots npm run e2e:core-release-gate -- --continue-on-failure
```

Result: `19/20` passed; only
`e2e/maestro/release-gate/offline-save-sync.yaml` failed with
`Assertion is false: id: history-meal-sync-pending-0 is not visible` while the
debug hierarchy showed the pending sync indicator still present after reconnect.

## Changes

- Added `e2e/maestro/release-gate/offline-save-pending-local.yaml` to prove the
  no-provider core behavior: offline save remains visible and explicitly
  pending after connectivity is restored without backend sync.
- Updated `scripts/e2e/suites.json` so local `core-release-gate` uses
  `offline-save-pending-local.yaml`. The full `release-gate` keeps
  `offline-save-sync.yaml` for provider-backed reconnect clearance evidence.
- Updated `home-history-statistics` to use the same local pending flow.
- Updated `scripts/e2e/release-coverage.ch-08-003.json` to distinguish core
  local pending evidence from full release-gate reconnect-clearance evidence.
- Updated the RC workflow Maestro job to run the core gate with local-only E2E
  API settings and no smoke credential env.
- Added workflow test assertions for the local-only core Maestro job settings.

## Verification

```sh
npm run e2e:coverage:check
```

Result: pass, `18 covered`, `2 gap(s)`, `38 flow reference(s)`.

```sh
npm run e2e:dynamic-text:check
```

Result: pass, `12 release-relevant suite(s)`, `70 unique Maestro flow(s)`.

```sh
npm run e2e:core-release-gate -- --validate
```

Result: pass, `20 flow(s) validated`.

```sh
npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts
```

Result: pass, `36/36`.

```sh
env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:9 E2E_RESULTS_PATH=/tmp/fitaly-offline-save-pending-local.xml E2E_DEBUG_OUTPUT_DIR=/tmp/fitaly-offline-save-pending-local-debug E2E_TEST_OUTPUT_DIR=/tmp/fitaly-offline-save-pending-local-shots bash scripts/run-e2e-local.sh e2e/maestro/release-gate/offline-save-pending-local.yaml
```

Result: pass, `1/1` flow passed in `1m 12s`.

```sh
env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:9 E2E_ARTIFACT_DIR=/tmp/fitaly-core-release-gate-fixed2-artifacts E2E_RESULTS_DIR=/tmp/fitaly-core-release-gate-fixed2-reports E2E_DEBUG_OUTPUT_DIR=/tmp/fitaly-core-release-gate-fixed2-debug E2E_TEST_OUTPUT_DIR=/tmp/fitaly-core-release-gate-fixed2-shots npm run e2e:core-release-gate
```

Result: pass, `20/20` local no-provider core flows passed.

```sh
npm run lint
npm run typecheck
git diff --check
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/release-candidate.yml"); YAML.load_file("e2e/maestro/release-gate/offline-save-pending-local.yaml"); puts "yaml parsed"'
```

Results: all passed.

## Unverified Areas

- Full provider-backed `release-gate` was not run; `offline-save-sync.yaml`
  remains the full release-gate reconnect-clearance path.
- Android Maestro runtime was not run in this repair.
- No live GitHub self-hosted RC workflow run was executed.
- No production, smoke-provider, billing, backup/restore, or credential-backed
  checks were used.

## Controller Decision

`pass_with_gaps` for the local Maestro core-gate repair. This fixes local
no-provider Maestro core evidence, but it does not change the release decision
from `BLOCKED_EXTERNAL_DEPENDENCY`.
