# M1D Smart Memory Review Apply-Disabled Report

Status: `qa_passed`
Created: `2026-06-21T00:29:04Z`

## Scope

M1D is the next smallest Smart Memory hardening slice after M1C. It closes the
mobile Review evidence gap for apply-disabled behavior: Smart Memory may be
available globally, but Review must not read, expose, or navigate to memory
influence when the Review memory/apply gate is off.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no backend behavior change;
- no M2 control or projection redesign;
- no Home Next Action integration;
- no provider smoke, production data, credentials, Firebase, RevenueCat,
  Sentry, bundle ID, or package ID changes.

## Repo Snapshot

Mobile before M1D controller documentation update:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state plus M1D-relevant
  changes in `src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  and a test-only lint repair in
  `src/services/telemetry/telemetryInstrumentation.test.ts`.

Backend before M1D controller documentation update:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state; M1D made no backend
  edits.

## Confirmed Facts

- `ReviewMealScreen.tsx` computes `smartMemoryEnabled` through
  `isRuntimeFeatureEnabled("smartMemory")`.
- The Review read/UI gate is the combined condition
  `smartMemoryEnabled && getRuntimeConfig().reviewMemoryExplanationEnabled`.
- When the combined gate is false, the Review effect clears
  `reviewMemoryExplanation`, clears `selectedMemoryDetail`, and returns before
  calling `readReviewSmartMemoryExplanation`.
- Positive Review memory tests explicitly enable both `smartMemoryEnabled` and
  `reviewMemoryExplanationEnabled`, so the disabled tests are not accidentally
  passing only because the default runtime config disables all new domains.
- The M1D test sets Smart Memory globally on, sets
  `reviewMemoryExplanationEnabled` off, supplies an active mocked explanation,
  and proves no read, memory row, memory detail modal, or Memory Center
  navigation is exposed.
- A pre-existing C5 telemetry test used `if (false)` to keep compile-time
  `@ts-expect-error` checks out of runtime execution. Full lint rejected that
  pattern. The repair moved the type-boundary calls into an uninvoked helper and
  asserts the helper exists. `tsc --noEmit` still checks the function body, while
  runtime privacy assertions still inspect only actually emitted telemetry.

## Changes

Mobile:

- Updated `src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`.
  - Added explicit M1D coverage for `smartMemoryEnabled: true` with
    `reviewMemoryExplanationEnabled: false`.
  - The test asserts `readReviewSmartMemoryExplanation` is not called and no
    Review memory UI or Memory Center navigation is available.
- Updated `src/services/telemetry/telemetryInstrumentation.test.ts`.
  - Replaced the lint-invalid `if (false)` type-boundary block with an
    uninvoked helper function so TypeScript still enforces the expected
    rejected C5 payload shapes without violating `no-constant-condition`.

## QA History

- Controller local worker pass added the Review apply-disabled test and repaired
  the telemetry test lint violation discovered by full mobile lint.
- Independent QA `Linnaeus`: `pass_with_gaps`.
  - No blocking M1D correctness finding.
  - Confirmed the Review read/UI path is gated by both Smart Memory and the
    Review memory flag.
  - Confirmed both disabled cases are tested: Smart Memory on with Review apply
    off, and Smart Memory off with Review apply on.
  - Confirmed telemetry type-boundary checks remain compile-time enforced and
    runtime privacy assertions still check emitted telemetry props.
  - Recorded a P2 process gap: the mobile worktree is very dirty, so the QA
    could verify behavior but not cleanly attribute every unrelated production
    diff without a narrower commit boundary.

Controller accepted M1D as a partial M1 hardening step. Full M1 readiness is not
claimed.

## Verification

Controller M1D verification:

- `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx src/services/telemetry/telemetryInstrumentation.test.ts`
  - Result: `2 passed, 2 total`; `41 passed, 41 total`.
- `npm run typecheck`
  - Result: `tsc --noEmit` passed.
- `npm run lint`
  - Result: `eslint src --ext .ts,.tsx,.js,.jsx` passed.
- `git diff --check`
  - Result: passed.

Independent QA verification:

- QA inspected the Review production gate, the Review tests, runtime config,
  feature flag guard, Smart Memory service files, and telemetry tests/types.
- QA did not rerun commands and did not use provider/prod smoke or credentials.

## Classification

M1D local Review apply-disabled evidence slice: `qa_passed`.

M1 full launch gate: `partial`.

Reason: mobile Review now has direct test evidence that Smart Memory globally on
does not influence Review when the Review memory/apply gate is off. Full M1
still requires suppression/preference 30-day semantics where applicable,
Firestore emulator/runtime evidence, runtime telemetry evidence, and the
legacy source-deleted-only bounded-list gap to be resolved or explicitly
accepted. Smart Memory production flags must stay off.

## Remaining M1 Gate Blockers

- Implement or explicitly block suppression/preference 30-day semantics where
  those controls are activated.
- Run Firestore emulator/runtime evidence for Smart Memory window and
  persistence paths where real query/cursor paths exist.
- Prove Smart Memory runtime telemetry remains category-only.
- Resolve or explicitly accept the residual legacy gap for source-deleted-only
  records without tombstones beyond the bounded suppression list.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest M1 slice: suppression/preference 30-day semantics
inspection and repair.

Acceptance criteria:

- Repo evidence identifies the active suppression/preference controls and their
  persistence/query semantics.
- If suppression/preference windows are active, tests prove a deterministic
  30-day `dayKey` or equivalent stored-date window without wall-clock fallback.
- If suppression/preference windows are not active yet, the report explicitly
  blocks the gate rather than fabricating implementation evidence.
- No Review apply, Home Next Action, production flags, provider credentials,
  production data, or hidden fallback paths are introduced.

## Controller Decision

M1D: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
