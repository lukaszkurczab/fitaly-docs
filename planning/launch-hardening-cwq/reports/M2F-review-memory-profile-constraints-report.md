# M2F Review Memory Profile Constraints Report

Status: `controller_pass`
Controller decision: `pass` for M2F only. Full M2 remains open for runtime UI
evidence.
Date: 2026-06-21

## Objective

Ensure Smart Memory Review suggestions cannot override Dietary Profile hard
constraints.

## Scope

- Mobile Smart Memory Review explanation service.
- Mobile Review screen callsite and component tests.

## Non-goals

- No backend API/schema changes.
- No production flag, provider, credential, bundle ID, package ID, or smoke
  change.
- No broad Food Library or Smart Memory producer contract expansion.
- No native runtime UI work.

## Pre-change Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD before M2F:
  `e5355945a8a89276ea2217df57d7bedc9bade1b0`
- Origin HEAD at verification time:
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`
- M2F local commit:
  `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state after commit: clean mobile working tree, branch `ahead 5`
  because M2B, M2C, M2D, M2E, and M2F are local ahead of origin.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: clean.
- No backend files were changed.

## Repo Evidence

- `ReviewMealScreen.tsx` is the only production caller of
  `readReviewSmartMemoryExplanation`.
- `ReviewMealScreen.tsx` has access to `userData.profile.nutritionProfile`.
- Existing Smart Memory Review selection was based on projection state,
  suggestion use, sync state, item state, and ingredient label matching, but did
  not account for profile allergies or restriction-like preferences.
- Current Smart Memory contract data does not broadly carry ingredient/product
  compatibility flags, so hard constraints must fail closed when compatibility
  evidence is absent.
- Existing Food/Recipe domains distinguish hard restrictions from soft
  macro-style preferences; M2F follows that pattern.

## Acceptance Criteria

- Review memory read path must receive a nutrition profile.
- Review screen must not call Smart Memory Review explanation when the profile
  is absent.
- Active Review memory suggestions must be suppressed for allergy profiles when
  explicit allergen compatibility evidence is absent.
- Active Review memory suggestions must be suppressed for hard restriction-like
  preferences when explicit dietary compatibility evidence is absent.
- Macro-style preferences such as `highProtein` must not become hard memory
  exclusions.
- Existing active, pending, failed, and no-silent-save Review memory behavior
  must remain green.

## Changes

Mobile:

- `src/services/smartMemory/smartMemoryService.ts`
  - `readReviewSmartMemoryExplanation` now requires
    `nutritionProfile`.
  - Active Review memory selection now fails closed for allergies and hard
    restriction-like preferences when explicit compatibility flags are absent.
  - Macro-style preferences are not treated as hard exclusions.
  - `dairyFree` recognizes the existing `lactose_free` flag and the
    `dairy_free` recipe-style spelling.
- `src/feature/Meals/screens/MealAdd/ReviewMealScreen.tsx`
  - Passes `userData.profile.nutritionProfile` into the Smart Memory Review
    read path.
  - Skips Review memory reads when the nutrition profile is absent.
- Tests:
  - Added unknown-compatibility allergy suppression.
  - Added unknown-compatibility hard-restriction suppression.
  - Added explicit vegan compatibility allow case.
  - Added macro preference non-exclusion case.
  - Updated Review screen test coverage to assert the nutrition profile is sent.

## Verification

Controller verification:

- `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryService.test.ts src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Passed: 2 suites, 47 tests.
- `npm run typecheck`
  - Passed.
- `npm run lint`
  - Passed.
- `git diff --check`
  - Passed.

Independent QA:

- Initial verdict: `fail`.
- Blocking findings:
  - Missing compatibility flags allowed hard constraints to fall back to old
    behavior.
  - The first implementation depended on non-canonical Smart Memory payload
    fields.
  - `dairyFree` mapping did not align with existing Ingredient/Product
    `lactose_free` flags.
- Repair:
  - Missing compatibility flags now fail closed for allergy/restriction
    profiles.
  - Label-based allergy matching was removed.
  - `readReviewSmartMemoryExplanation` now requires `nutritionProfile`, and the
    Review screen skips the read when profile data is absent.
  - `dairyFree` supports both `lactose_free` and `dairy_free`.
- Final QA verdict: `pass`.

## Accepted Gaps

- `selectReviewSmartMemoryExplanation` still accepts omitted/null profile for
  direct unit-level selector calls; the production read function requires the
  profile and the only production caller passes it.
- Current Smart Memory producers/contracts do not broadly populate
  compatibility flags, so constrained users may see Review memory suggestions
  suppressed until those flags are produced. This is release-safe but
  feature-reducing.
- Explicit allergen allow/suppress branches and the `dairyFree` dual-flag path
  have not yet been separately unit-tested.

## Unverified Areas

- Native/emulator runtime UI evidence for Smart Memory Review behavior.
- Backend producer support for broad compatibility flags.
- Full Smart Memory production activation gate.

## Stop Conditions

- Keep Smart Memory production flags off.
- Do not claim full M2 completion until runtime UI evidence passes its own gate.
- Do not claim CORE_RC_READY or FULL_1_1_RC_READY from M2F; release readiness
  still depends on Q0 external evidence and owner-authorized artifacts.
- Mobile M2B, M2C, M2D, M2E, and M2F are local ahead of origin as of this
  report.

## Next P0 Slice Recommendation

M2G should focus on runtime UI evidence for Smart Memory Review and Memory
Center using local fixtures, without provider/prod smoke or credentials.
