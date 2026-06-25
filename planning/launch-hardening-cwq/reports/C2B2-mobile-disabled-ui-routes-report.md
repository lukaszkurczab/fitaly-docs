# C2B2 Mobile Disabled UI And Routes Report

Status: `qa_passed`
Packet: C2 Granular feature flags and predictable disabled behavior
Slice: C2B2 mobile disabled UI, direct screens/routes, and deep-link closure
Closed at: 2026-06-20T14:41:48Z
Controller: Codex

## Confirmed Pair Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state after C2B2: expected C1/C2A/C2B1 edits plus C2B2 mobile UI/route/test edits.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state after C2B2: expected C1/C2A backend edits; C2B2 made no backend code changes.

## Scope

C2B2 implemented the final mobile disabled-behavior part of C2:

- hide disabled new-domain UI entrypoints in Profile, App Settings and Home;
- render explicit disabled states for direct Recipe Catalog, Planning and Memory Center route access;
- prevent disabled direct screens from calling backend APIs, local projection reads, control queues or Review handoff actions;
- suppress Home Next Action UI and source work when Home Next Action is disabled, including local review-draft prompts;
- suppress Planning Home Next Action navigation when Planning is disabled;
- require Smart Memory to be enabled before Review Smart Memory explanation reads or UI can appear;
- keep Memory Center modal navigation hidden when Smart Memory is disabled.

C2B2 did not unregister routes from the navigator. Repo evidence showed no
production React Navigation linking config and E2E-only URL handling, so
screen-level guards are the relevant route/deep-link bypass closure.

## Files Changed

Mobile:

- `src/components/RuntimeFeatureDisabledState.tsx`
- `src/feature/UserProfile/screens/UserProfileScreen.tsx`
- `src/feature/UserProfile/screens/UserProfileScreen.test.tsx`
- `src/feature/UserProfile/screens/AppSettingsScreen.tsx`
- `src/feature/UserProfile/screens/AppSettingsScreen.test.tsx`
- `src/feature/Home/screens/HomeScreen.tsx`
- `src/feature/Home/screens/HomeScreen.test.tsx`
- `src/feature/Home/services/homeNextActionSelector.ts`
- `src/feature/Home/services/homeNextActionSelector.test.ts`
- `src/feature/Recipes/screens/RecipeCatalogScreen.tsx`
- `src/feature/Recipes/screens/RecipeCatalogScreen.test.tsx`
- `src/feature/Planning/screens/PlanningScreen.tsx`
- `src/feature/Planning/screens/PlanningScreen.test.tsx`
- `src/feature/UserProfile/screens/MemoryCenterScreen.tsx`
- `src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`
- `src/feature/Meals/screens/MealAdd/ReviewMealScreen.tsx`
- `src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`

Backend:

- No C2B2 backend files changed.

## Behavior After

- Profile hides `account-recipe-catalog-row` when Recipe Catalog is disabled.
- Profile and App Settings hide Memory Center rows when Smart Memory is disabled.
- Home hides `home-planning-entry` and refuses Planning navigation when Planning is disabled.
- Home Next Action disabled mode clears/suppresses prompts and source work, including the local review-draft candidate.
- Recipe Catalog direct route renders `recipe-catalog-feature-disabled-state` and does not fetch catalog data or create Review drafts when disabled.
- Planning direct route renders `planning-feature-disabled-state` and does not fetch, create, update, delete, reschedule or hand off to Review when disabled.
- Memory Center direct route renders `memory-center-feature-disabled-state` and does not read projection data or queue Smart Memory controls when disabled.
- Review Smart Memory explanation requires both Smart Memory and Review Memory Explanation flags; Smart Memory disabled mode does not read explanation data or render memory detail UI.
- Review memory details modal does not expose Memory Center navigation when Smart Memory is disabled.

## Deep-Link Evidence

Controller and QA searched the mobile repo for product deep-link routing.

Findings:

- `NavigationContainer` in `App.tsx` has no production `linking` prop.
- URL handling in `App.tsx` is gated by `isE2EModeEnabled()`.
- `src/services/e2e/deepLink.ts` only handles `fitaly://e2e/reset`, `fitaly://e2e/seed`, and `fitaly://e2e/connectivity`.

Therefore, direct screen guards close the relevant route bypass for C2B2. No
provider/prod smoke or device deep-link run was performed.

## Controller Verification

Mobile commands:

- First targeted C2B2 run:
  - `npm test -- --runInBand --coverage=false src/feature/UserProfile/screens/UserProfileScreen.test.tsx src/feature/UserProfile/screens/AppSettingsScreen.test.tsx src/feature/Home/screens/HomeScreen.test.tsx src/feature/Recipes/screens/RecipeCatalogScreen.test.tsx src/feature/Planning/screens/PlanningScreen.test.tsx src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Initial result: failed due to test-harness leakage and missing mixed-flag coverage; repaired before acceptance.
- Post-repair focused run:
  - `npm test -- --runInBand --coverage=false src/feature/Home/services/homeNextActionSelector.test.ts src/feature/Home/screens/HomeScreen.test.tsx src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Result: passed, 3 suites / 107 tests.
- Post-repair full C2B2 targeted run:
  - `npm test -- --runInBand --coverage=false src/feature/UserProfile/screens/UserProfileScreen.test.tsx src/feature/UserProfile/screens/AppSettingsScreen.test.tsx src/feature/Home/screens/HomeScreen.test.tsx src/feature/Home/services/homeNextActionSelector.test.ts src/feature/Recipes/screens/RecipeCatalogScreen.test.tsx src/feature/Planning/screens/PlanningScreen.test.tsx src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx`
  - Result: passed, 8 suites / 150 tests.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `git diff --check`
  - Result: passed.

## Independent QA

Initial QA verdict: `fail`.

Blocking findings:

- Home Next Action disabled mode still allowed the local review-draft prompt.
- Smart Memory disabled mode still allowed Review Smart Memory explanation reads/UI when `reviewMemoryExplanationEnabled=true`.

Repair:

- `buildHomeReviewDraftNextActionCandidate` now returns no action when Home Next Action is disabled.
- `HomeScreen` now short-circuits Home Next Action refresh, visibility and action handling when Home Next Action is disabled.
- `ReviewMealScreen` now gates Review memory explanation behind both Smart Memory and Review Memory Explanation flags.
- Tests were added for disabled local review-draft Home Next Action and Smart Memory disabled Review memory suppression.

Re-QA verdict: `pass`.

Re-QA found no remaining C2B2 bypass in reviewed mobile UI/routes. Re-QA also
confirmed route/entrypoint guards remained intact and that production deep-link
bypass appears absent from repo evidence.

## Remaining Risks And Unverified Areas

- C2 is closed only for local static/unit/component disabled-behavior evidence.
- Device/Maestro E2E was not run for C2B2.
- No live smoke/prod/provider checks were run; no credentials were used.
- Feature-wave packets F1, M1, M2, K1, R1, P1 and H1 remain pending and production-off.
- Overall readiness remains `NO_GO` until later P0/Q0 evidence closes.

## Packet Decision

C2B2 is accepted as `qa_passed`.

C2 as a full packet is accepted as `qa_passed` for local granular feature flags
and predictable disabled behavior across backend route/service guards, mobile
production-off readiness, mobile request/background suppression, and mobile
UI/direct-route disabled behavior.

Next smallest P0 slice: C3 durable meal side effects / transactional outbox.
