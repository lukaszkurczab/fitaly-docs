# M2B Smart Memory Nested Payload Fail-Closed Report

Status: `qa_passed_with_gaps`
Controller decision: `pass_with_gaps` for M2B only. Full M2 remains open.
Date: 2026-06-21

## Objective

Close the M2A QA gap where mobile Smart Memory response parsing still
permissively coerced or filtered nested backend payload drift.

## Scope

- Mobile Smart Memory API response parsing.
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
- Base HEAD: `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- Origin verified at:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- Local M2B commit after QA:
  `2bc2ffb35113c720a1fc42cd8789c04bff014ee6`
- Origin remained at `49695a265e1baa9206908dab8a0dc2e50ddc1ec0` after the
  push attempt was rejected by execution policy.
- Dirty state after local commit: clean mobile working tree, branch `ahead 1`.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean.
- Backend was inspected for contract evidence and QA reran backend contract/API
  tests; no backend files were changed.

## Repo Evidence

- M2 requires safe behavior for backend unknown enum/state and corrupted
  projection/payload scenarios.
- M2A QA found that item/candidate normalizers still accepted nested drift:
  unsupported `stateReason` became `null`, invalid `sourceRefs` were filtered,
  unknown `confidenceReasonCodes` were filtered, `schemaVersion` was stamped
  locally, and invalid `serverRevision` became `0`.
- Backend schemas define explicit state/confidence enums and positive
  `serverRevision`.
- Backend item source refs are validated as hash-only `{ kind, sourceHash }`.
- Mobile/backend Smart Memory contract fixtures use `schemaVersion: 1`,
  hash-only `sourceRefs`, and positive integer `serverRevision`.

## Changes

Mobile:

- `src/services/smartMemory/smartMemoryApi.ts`
  - Added strict positive integer parsing for `serverRevision`.
  - Added exact enum-array parsing for `confidenceReasonCodes`.
  - Added strict optional enum parsing for item `stateReason`.
  - Added exact hash-only parsing for `sourceRefs`.
  - Item/candidate normalizers now reject wrong/missing `schemaVersion`.
  - Settings normalizer now rejects invalid `serverRevision`.
- `src/services/smartMemory/smartMemoryApi.test.ts`
  - Added item nested-drift rejection coverage for unsupported `stateReason`,
    malformed/non-hash `sourceRefs`, unknown `confidenceReasonCodes`, wrong or
    missing `schemaVersion`, and invalid `serverRevision`.
  - Added candidate nested-drift rejection coverage for malformed/non-hash
    `sourceRefs`, unknown `confidenceReasonCodes`, wrong or missing
    `schemaVersion`, and invalid `serverRevision`.
  - Added settings rejection coverage for missing, non-positive, non-number,
    and non-integer `serverRevision`.

## Verification

Worker verification:

- `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts`
  - Passed: 7 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.

Controller verification:

- Initial focused Jest command failed before running tests with
  `ENOSPC: no space left on device` while writing Jest cache under
  `/private/tmp/jest_dx`.
- Controller removed only `/private/tmp/jest_dx` and reran:
  `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/offline/strategies/smartMemory.strategy.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  - Passed: 3 suites, 116 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

Independent QA:

- Verdict: `pass_with_gaps`.
- QA reran:
  - `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts --no-cache`
    - Passed: 7 tests.
  - Backend `tests/test_contract_alignment.py`
    - Passed: 131 tests.
  - Backend `tests/test_api_smart_memory.py`
    - Passed: 11 tests.
  - Scoped mobile diff check
    - Passed.
- QA found no blocking finding for M2B.

## QA Gaps Accepted For This Slice

- Mobile runtime parser now enforces hash-only `sourceRefs`, but exported
  response types still declare item/candidate `sourceRefs` as
  `Array<Record<string, unknown>>`. A later slice should narrow these to
  `SmartMemoryHashedSourceRef[]` so future mobile code gets TypeScript
  protection as well as runtime protection.
- QA also observed that rerunning the broader mobile command independently hit
  `ENOSPC` under `/private/tmp/jest_dx`; controller had already produced the
  broader successful rerun after clearing that cache.

## Unverified Areas

- Full M2 Memory Center states and offline retry/discard behavior.
- Review apply explicit presentation/correction and final save behavior.
- Dietary Profile hard-constraint precedence.
- Device/Emulator runtime UI evidence.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until Memory Center controls, projection
  failure states, Review apply, offline controls, type-surface follow-up, and
  runtime UI behavior pass their own gates.
- Mobile M2B was committed locally but not pushed. The push attempt to origin
  was blocked by execution policy because origin was treated as an untrusted
  external destination for non-public workspace code. Do not retry or work
  around this without explicit owner approval after that risk is acknowledged,
  or use owner manual push.

## Next P0 Slice Recommendation

M2C should close the non-blocking type-surface gap:

- Narrow mobile `SmartMemoryItem.sourceRefs` and
  `SmartMemoryCandidate.sourceRefs` to `SmartMemoryHashedSourceRef[]`.
- Preserve parser strictness and contract fixture parsing.
- Run focused Smart Memory parser/projection/service tests plus typecheck.
