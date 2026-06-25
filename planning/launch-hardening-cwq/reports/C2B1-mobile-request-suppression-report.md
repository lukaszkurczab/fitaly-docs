# C2B1 Mobile Request And Background Suppression Report

Status: `pass_with_gaps`
Packet: C2 Granular feature flags and predictable disabled behavior
Slice: C2B1 mobile request/background suppression
Closed at: 2026-06-20T14:11:31Z
Controller: Codex

## Confirmed Pair Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state after C2B1: expected C1/C2A edits plus C2B1 mobile feature-guard/API/sync/Home tests.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state after C2B1: expected C1/C2A backend edits; C2B1 made no backend code changes.

## Scope

C2B1 implemented the request-suppression part of C2B:

- add a shared mobile runtime feature guard that returns stable non-retryable feature-disabled service errors;
- block new-domain API client requests before transport when the corresponding runtime flag is disabled;
- suppress Food Library and Smart Memory offline pull work when disabled;
- dead-letter disabled Food Library and Smart Memory push work as non-retryable before remote calls;
- suppress Home Next Action source fetches when the aggregate flag or source domain flag is disabled;
- suppress Known Patterns candidate fetches in the Meal Add Method flow when the domain is disabled.

C2B1 intentionally did not implement UI entrypoint hiding, direct screen unavailable states, navigator route closure, or any broader deep-link behavior. Those remain C2B2.

## Files Changed

Mobile:

- `src/services/core/featureFlagGuard.ts`
- `src/services/foodLibrary/ingredientProductSearchApi.ts`
- `src/services/foodLibrary/ingredientProductSearchApi.test.ts`
- `src/services/smartMemory/smartMemoryApi.ts`
- `src/services/smartMemory/smartMemoryApi.test.ts`
- `src/services/knownPatterns/knownPatternCandidatesApi.ts`
- `src/services/knownPatterns/knownPatternCandidatesApi.test.ts`
- `src/services/recipes/recipeCatalogApi.ts`
- `src/services/recipes/recipeCatalogApi.test.ts`
- `src/services/plannedMeals/plannedMealsApi.ts`
- `src/services/plannedMeals/plannedMealsApi.test.ts`
- `src/services/offline/strategies/foodLibrary.strategy.ts`
- `src/services/offline/strategies/foodLibrary.strategy.test.ts`
- `src/services/offline/strategies/smartMemory.strategy.ts`
- `src/services/offline/strategies/smartMemory.strategy.test.ts`
- `src/feature/Home/services/homeNextActionSelector.ts`
- `src/feature/Home/services/homeNextActionSelector.test.ts`
- `src/feature/Meals/hooks/useMealAddMethodState.ts`
- `src/feature/Meals/hooks/useMealAddMethodState.test.ts`

Backend:

- No C2B1 backend files changed.

## Behavior After

- Disabled Food Library, Smart Memory, Known Patterns, Recipe Catalog and Planning API clients reject before calling the shared API transport.
- Disabled API-client errors are stable, non-retryable `ServiceError`s with feature-disabled codes:
  - `feature/food-library-disabled`
  - `feature/smart-memory-disabled`
  - `feature/known-patterns-disabled`
  - `feature/recipe-catalog-disabled`
  - `feature/planning-disabled`
  - `feature/home-next-action-disabled`
- Disabled Food Library and Smart Memory offline pulls return `0` before remote calls.
- Disabled Food Library and Smart Memory offline pushes throw non-retryable feature-disabled errors before remote calls.
- Existing push-orchestration behavior dead-letters non-retryable errors immediately; disabled pushes do not retry indefinitely.
- Home Next Action does not fetch Planned Meals or Known Patterns when either Home Next Action or the source domain flag is disabled.
- Meal Add Method does not fetch Known Patterns candidates when Known Patterns is disabled.

## Controller Verification

Before verification, the controller re-checked the mobile branch/SHA/dirty state.

Mobile commands:

- `npm test -- --runInBand --coverage=false src/services/foodLibrary/ingredientProductSearchApi.test.ts src/services/smartMemory/smartMemoryApi.test.ts src/services/knownPatterns/knownPatternCandidatesApi.test.ts src/services/recipes/recipeCatalogApi.test.ts src/services/plannedMeals/plannedMealsApi.test.ts src/services/offline/strategies/foodLibrary.strategy.test.ts src/services/offline/strategies/smartMemory.strategy.test.ts src/feature/Home/services/homeNextActionSelector.test.ts src/feature/Meals/hooks/useMealAddMethodState.test.ts`
  - Result: passed, 9 suites / 106 tests.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `git diff --check`
  - Result: passed.

Controller also inspected `src/services/offline/sync.push.ts` and confirmed existing push handling treats non-retryable errors as terminal dead-letter entries.

## Independent QA

QA verdict: `PASS_WITH_GAPS`.

No blocking C2B1 findings.

QA evidence:

- Independent QA reran the targeted mobile suites plus `src/services/offline/sync.push.test.ts`.
- Result reported by QA: passed, 10 suites / 116 tests.
- QA confirmed no alternate unguarded C2B1 backend request path bypassing the guarded API modules.

Confirmed residual gaps:

- UI entrypoints can still be visible for disabled new domains.
- Direct navigator routes/screens still need explicit unavailable states.
- Deep-link or route-bypass behavior still needs closure or repo-evidence-backed dismissal.
- Review Memory explanation and Memory Center entrypoints still need explicit flag-aware behavior.

## Remaining Risks And Unverified Areas

- C2 as a full packet is not closed until C2B2 proves disabled mobile UI/routes cannot bypass production-off flags.
- C2B1 did not run device/E2E flows or provider/prod smoke.
- No credentials, production data, provider calls or live production checks were used.
- New-domain feature waves remain production-off until their own gates pass.
- Overall readiness remains `NO_GO`.

## Packet Decision

C2B1 is accepted as a bounded `pass_with_gaps` slice.

C2 remains `in_progress`.

Next smallest P0 slice: C2B2 mobile disabled UI, direct screen and route/deep-link closure.
