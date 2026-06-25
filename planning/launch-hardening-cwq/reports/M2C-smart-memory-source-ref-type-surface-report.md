# M2C Smart Memory SourceRef Type Surface Report

Status: `controller_pass`
Controller decision: `pass` for M2C only. Full M2 remains open.
Date: 2026-06-21

## Objective

Close the M2B QA gap where runtime parsing enforced hash-only Smart Memory
`sourceRefs`, but exported mobile item/candidate response types still exposed
generic records.

## Scope

- Mobile Smart Memory TypeScript response types only.

## Non-goals

- No backend API/schema changes.
- No runtime parser changes beyond M2A/M2B.
- No Smart Memory production flag change.
- No Review apply, Memory Center UI, provider, credential, or production smoke
  work.

## Pre-change Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD: `2bc2ffb35113c720a1fc42cd8789c04bff014ee6`
- Origin HEAD at verification time:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- Local M2C commit after verification:
  `4f23fb82d8fbd2e58ba296661ac49881b94af891`
- Origin remained at `49695a265e1baa9206908dab8a0dc2e50ddc1ec0` after the
  push attempt was rejected by execution policy.
- Dirty state after local commit: clean mobile working tree, branch `ahead 2`
  because M2B and M2C pushes were blocked by execution policy.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean.
- No backend files were changed.

## Repo Evidence

- M2B QA found no blocking runtime issue, but identified that
  `SmartMemoryItem.sourceRefs` and `SmartMemoryCandidate.sourceRefs` were still
  typed as `Array<Record<string, unknown>>`.
- `SmartMemoryHashedSourceRef` already existed in mobile types and represents
  the hash-only `{ kind, sourceHash }` shape.
- M2B runtime parser already enforces hash-only `sourceRefs`.

## Changes

Mobile:

- `src/types/smartMemory.ts`
  - `SmartMemoryItem.sourceRefs` now uses `SmartMemoryHashedSourceRef[]`.
  - `SmartMemoryCandidate.sourceRefs` now uses
    `SmartMemoryHashedSourceRef[]`.

## Verification

Controller verification:

- `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/smartMemory/smartMemoryProjectionRepository.test.ts src/services/smartMemory/smartMemoryService.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  - Passed: 4 suites, 128 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

## QA Notes

- No separate subagent QA was run for M2C. Reason: the change is a two-line
  type-surface narrowing directly requested by M2B independent QA, with focused
  parser/projection/service/contract tests plus full typecheck and lint passing.
- The local disk remained near-full during this work, so avoiding another
  subagent prevented avoidable thread-store/cache pressure.

## Unverified Areas

- Full M2 Memory Center states and offline retry/discard behavior.
- Review apply explicit presentation/correction and final save behavior.
- Dietary Profile hard-constraint precedence.
- Device/Emulator runtime UI evidence.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until Memory Center controls, projection
  failure states, Review apply, offline controls, and runtime UI behavior pass
  their own gates.
- Mobile M2C was committed locally but not pushed. The push attempt to origin
  was blocked by execution policy because origin was treated as an untrusted
  external destination for non-public workspace code. Do not retry or work
  around this without explicit owner approval after that risk is acknowledged,
  or use owner manual push.

## Next P0 Slice Recommendation

M2D should move from response-contract safety to visible control-state safety:

- Prove Memory Center and local projection expose stable loading, empty enabled,
  empty disabled, active, pending, and failed states.
- Include offline queued delete/disable and failed sync retry/discard evidence.
