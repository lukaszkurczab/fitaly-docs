# M2E Review Memory No Silent Save Report

Status: `controller_pass`
Controller decision: `pass` for M2E only. Full M2 remains open.
Date: 2026-06-21

## Objective

Prove the mobile Review screen does not silently apply active Smart Memory
values into the meal save payload without the user's reviewed draft values
remaining authoritative.

## Scope

- Mobile Review component tests only.
- Existing Review behavior and tests were inspected before editing.

## Non-goals

- No backend API/schema changes.
- No production flag, provider, credential, bundle ID, package ID, or smoke
  change.
- No Dietary Profile precedence or native runtime UI work.
- No hidden fallback or legacy compatibility path.

## Pre-change Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD before M2E:
  `432584ae3ff6968f2c7dabdcffc7bf8c0c2a5c0e`
- Origin HEAD at verification time:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- M2E local commit:
  `e5355945a8a89276ea2217df57d7bedc9bade1b0`
- Dirty state after commit: clean mobile working tree, branch `ahead 4`
  because M2B, M2C, M2D, and M2E are local ahead of origin.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean.
- No backend files were changed.

## Repo Evidence

- `ReviewMealScreen.tsx` gates Review memory explanation behind both
  `smartMemoryEnabled` and `reviewMemoryExplanationEnabled`.
- Existing tests already prove no Review memory read/UI when Smart Memory or
  Review apply is disabled.
- Existing tests already prove active memory is shown as bounded inline details,
  pending/failed rows are non-blocking, and memory detail navigation does not
  save the meal.
- `handleSave` constructs the saved meal from the current Review draft, not
  from `reviewMemoryExplanation`.
- The missing evidence was an explicit mismatch proving active memory detail
  values do not replace the current Review draft values during save.

## Acceptance Criteria

- With Smart Memory and Review memory explanation enabled, active memory details
  can be visible in Review.
- The same Review instance must save the current draft ingredient values, not
  silently substitute active memory detail values.
- The test must make the draft value and memory detail value different.
- The slice must not change production flags, providers, API contracts, or
  runtime feature activation.

## Changes

Mobile:

- `src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Added a regression test where the Review draft shows and saves `Chicken`
    as `90 g`, while active memory detail exposes `180 g`.
  - The test asserts the `saveMeal` payload preserves the current Review draft
    ingredient values.

## Verification

Controller verification:

- `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Passed: 1 suite, 33 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

Independent QA:

- Initial verdict: `pass_with_gaps`.
- QA gap: test name was broader than the evidence and the test did not directly
  assert that the memory value was `180 g`.
- Repair: narrowed the test name and added explicit assertions for Review
  `90 g` and memory detail `180 g` before saving.
- Re-QA verdict: `pass`.
- QA command:
  `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx --no-coverage`
  - Passed: 1 suite, 33 tests.

## Unverified Areas

- Native/emulator runtime UI evidence for Review memory apply behavior.
- Real Smart Memory projection/upstream apply path outside the mocked component
  boundary.
- Dietary Profile hard-constraint precedence.
- Full Smart Memory production activation gate.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until Dietary Profile precedence and runtime
  UI evidence pass their own gates.
- Do not claim CORE_RC_READY or FULL_1_1_RC_READY from M2E; release readiness
  still depends on Q0 external evidence and owner-authorized artifacts.
- Mobile M2B, M2C, M2D, and M2E are local ahead of origin as of this report.

## Next P0 Slice Recommendation

M2F should inspect and harden Dietary Profile precedence:

- Prove hard constraints are applied before Smart Memory suggestions are shown
  or saved.
- Prove Smart Memory cannot override allergy/dietary hard constraints.
