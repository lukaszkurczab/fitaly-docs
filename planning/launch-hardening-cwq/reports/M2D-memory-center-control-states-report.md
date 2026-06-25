# M2D Memory Center Control States Report

Status: `controller_pass`
Controller decision: `pass` for M2D only. Full M2 remains open.
Date: 2026-06-21

## Objective

Prove the mobile Memory Center exposes stable, explicit Smart Memory control
states before any Smart Memory production activation.

## Scope

- Mobile Memory Center component tests only.
- Existing runtime behavior was inspected and found to already route through
  `readSmartMemoryProjection`, `selectMemoryCenterState`, status blocks, and
  retry/discard recovery controls.

## Non-goals

- No backend API/schema changes.
- No production flag, provider, credential, bundle ID, package ID, or smoke
  change.
- No Review apply, Dietary Profile precedence, telemetry, or native runtime UI
  work.
- No hidden fallback or legacy compatibility path.

## Pre-change Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD before M2D:
  `4f23fb82d8fbd2e58ba296661ac49881b94af891`
- Origin HEAD at verification time:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- M2D local commit:
  `432584ae3ff6968f2c7dabdcffc7bf8c0c2a5c0e`
- Dirty state after commit: clean mobile working tree, branch `ahead 3`
  because M2B, M2C, and M2D are local ahead of origin.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean.
- No backend files were changed.

## Repo Evidence

- `MemoryCenterScreen.tsx` already renders explicit states for no-user,
  loading, load error, offline, sync-failed, pending, empty disabled, empty
  enabled, and ready projections.
- `MemoryCenterScreen.tsx` already renders retry/discard recovery actions when
  `selectMemoryCenterState` reports failed rows.
- `runAction` already reloads the projection after successful queued controls,
  including retry and discard.
- Existing tests covered some happy/control paths but did not prove loading,
  load-error, ready-with-row, retry/discard reload, or offline-with-failed-row
  recovery visibility.

## Acceptance Criteria

- Memory Center test coverage proves loading and load-error states.
- Memory Center test coverage proves empty-enabled, empty-disabled, ready,
  pending, and failed recovery states.
- Retry and discard failed-control actions must be wired and must reload the
  projection after success.
- Failed-row recovery controls must remain visible when failed rows are viewed
  while offline.
- The slice must not change production flags, providers, API contracts, or
  runtime feature activation.

## Changes

Mobile:

- `src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`
  - Added loading-state coverage while projection read is pending.
  - Added load-error coverage when projection read rejects.
  - Added ready-state coverage with active backend-confirmed rows.
  - Strengthened retry/discard tests to assert projection reload after success.
  - Added offline failed-row coverage proving recovery controls remain visible.

## Verification

Controller verification:

- `npm run test:targeted -- --runTestsByPath src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`
  - Passed: 1 suite, 16 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

Independent QA:

- Verdict: `pass`.
- QA confirmed the uncommitted diff before commit was limited to
  `MemoryCenterScreen.test.tsx`, test-only, meaningful for Memory Center
  launch-hardening, aligned with the canonical state path, and did not change
  production files, contracts, flags, fallbacks, or legacy paths.
- QA command:
  `./node_modules/.bin/jest --runInBand --watchman=false --no-coverage --no-cache --runTestsByPath src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`
  - Passed: 1 suite, 16 tests.

## Unverified Areas

- Native/emulator runtime UI evidence for Memory Center.
- Review apply explicit presentation/correction and final save behavior.
- Dietary Profile hard-constraint precedence.
- Full Smart Memory production activation gate.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until Review apply, Dietary Profile
  precedence, and runtime UI evidence pass their own gates.
- Do not claim CORE_RC_READY or FULL_1_1_RC_READY from M2D; release readiness
  still depends on Q0 external evidence and owner-authorized artifacts.
- Mobile M2B, M2C, and M2D are local ahead of origin as of this report.

## Next P0 Slice Recommendation

M2E should inspect and harden Review apply behavior:

- Prove Smart Memory apply is visible only when the apply flag is enabled.
- Prove mute/delete/disable decisions are respected before suggestion
  presentation and before final save.
- Prove Review save does not persist hidden or disabled Smart Memory influence.
