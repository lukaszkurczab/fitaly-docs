# M2A Smart Memory API Fail-Closed Parser Report

Status: `qa_passed_with_gaps`
Controller decision: `pass_with_gaps` for M2A only. Full M2 remains open.
Date: 2026-06-21

## Objective

Close the smallest repo-evidenced M2 risk: mobile Smart Memory list responses
must not silently drop backend rows with unknown top-level enum/state values.

## Scope

- Mobile Smart Memory API list parsing.
- Focused parser regression tests.

## Non-goals

- No backend API/schema changes.
- No Smart Memory production flag change.
- No Review apply, candidate promotion, Memory Center UI redesign, Maestro
  flow, provider, credential, or production smoke work.
- No attempt to close full M2.

## Pre-change Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD: `d4b1c8d2cde114d8507df9432ae623f054072006`
- Origin HEAD at controller verification time:
  `d4b1c8d2cde114d8507df9432ae623f054072006`
- Local M2A commit after QA:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- Origin verification after owner manual push:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- Dirty state after owner manual push verification: clean mobile working tree,
  branch synced with origin.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean
- Backend was inspected for response-contract evidence only; no backend files
  were changed.

## Repo Evidence

- M2 explicitly lists the QA attack `backend returns unknown enum/state`.
- Before M2A, `toItemsPage` and `toCandidatesPage` in mobile mapped each row
  through the normalizer and filtered `null`, which could return a partial
  list when the backend sent an unsupported top-level `memoryType` or `state`.
- Mutation and settings responses already failed closed on invalid payloads.
- Backend Smart Memory page schemas are typed as `{ items: [...] }`, so
  requiring an `items` array enforces the existing contract rather than adding
  a mobile-only shape.
- `smartMemoryStrategy.pull` waits for items, candidates, and settings before
  writing local projections. A parser failure prevents partial projection
  replacement.

## Changes

Mobile:

- `src/services/smartMemory/smartMemoryApi.ts`
  - `toItemsPage` now throws `Invalid Smart Memory items page response` when
    the page shape is invalid or any item row fails normalization.
  - `toCandidatesPage` now throws
    `Invalid Smart Memory candidates page response` when the page shape is
    invalid or any candidate row fails normalization.
- `src/services/smartMemory/smartMemoryApi.test.ts`
  - Added valid empty-page parsing coverage.
  - Added item-page rejection coverage for missing `items`, non-record row,
    unsupported `memoryType`, and unknown `state`.
  - Added candidate-page rejection coverage for missing `items`,
    non-record row, unsupported `memoryType`, and unknown `state`.

## Verification

Worker verification:

- `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts`
  - Passed: 1 suite, 4 tests.
- `npm run typecheck`
  - Passed.

Controller verification:

- `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/offline/strategies/smartMemory.strategy.test.ts`
  - Passed: 2 suites, 10 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

Independent QA:

- Verdict: `pass_with_gaps`.
- QA reran the focused Smart Memory API/strategy tests, typecheck, lint,
  contract-alignment test, and scoped diff check successfully.
- No blocking finding for M2A.

## QA Gaps Accepted For This Slice

- The row normalizers still permissively coerce or drop some nested fields:
  invalid `stateReason` becomes `null`, invalid `sourceRefs` entries are
  filtered, unknown `confidenceReasonCodes` are filtered, `schemaVersion` is
  stamped locally, and invalid `serverRevision` becomes `0`.
- This means M2A covers the top-level unknown enum/state attack but does not
  complete all malformed-payload hardening.

## Unverified Areas

- Full M2 Memory Center states and offline retry/discard behavior.
- Review apply explicit presentation/correction and final save behavior.
- Dietary Profile hard-constraint precedence.
- Nested Smart Memory response payload drift.
- Device/Emulator runtime UI evidence.
- Backend tests were not rerun because no backend files or contract fixtures
  changed.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until Memory Center controls, projection
  failure states, Review apply, offline controls, and nested malformed payload
  behavior pass their own gates.
- Mobile M2A is present on origin after owner manual push verification.

## Next P0 Slice Recommendation

M2B should close the QA-identified nested-payload drift in the same fail-closed
contract boundary:

- Reject unknown `stateReason` and `confidenceReasonCodes` in item responses.
- Reject malformed `sourceRefs` entries instead of filtering them.
- Reject malformed `serverRevision` instead of defaulting to `0` for backend
  responses.
- Preserve valid contract fixture parsing.
- Prove Smart Memory pull does not partially write projections when nested
  payload parsing fails.
