# P1 Planning Truthful Nutrition and Lifecycle Report

Status: `qa_passed`
Completed slices: `P1A-manual-name-only-truthful-unknown`,
`P1B-review-save-safety-and-typed-source-metadata`,
`P1C-idempotent-plan-to-meal-lifecycle-and-production-off-guard`
P1A QA: `pass_with_gaps`; accepted because findings were assigned to the next
P1B slice, not treated as a P1A regression.
P1B QA: initial `fail`; repair re-QA `QA_PASS`.
P1C QA: initial `fail`; repair re-QA `QA_PASS`.
Created: `2026-06-20T17:08:09Z`
Last updated: `2026-06-20T21:25:58Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

P1 verifies that Planning does not invent nutrition and that plan-to-meal
lifecycle is idempotent before Planning can be considered launch-safe.

P1A addressed only the confirmed name-only manual plan truthfulness issue.
P1B addressed Review save safety and typed planned-meal source metadata.
P1C addressed idempotent planned-meal consume/link, linked-delete behavior,
and the QA-found production-off guard for stale planned-source saves.

Non-goals for P1:

- No production/provider smoke.
- No production credentials or production data.
- No Planning production activation.
- No telemetry gate closure for Planning.
- No claim that Planning may be enabled in production before Q0 and later
  feature-wave evidence pass.

## Pair Snapshot

Re-checked before P1C repair verification:

- Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

Dirty state:

- Mobile dirty state includes intentional C1-C4 changes plus P1A/P1B/P1C
  Planning and meal-save files.
- Backend dirty state includes intentional C1-C4 changes plus P1A/P1B/P1C
  planned-meal, meal-save, API and emulator-test files.
- No unrelated dirty state was used as P1C evidence.

## Confirmed Repo Facts

- `src/feature/Planning/services/planningDraft.ts` previously created manual
  name-only planned meals with hardcoded default totals `400/25/14/45`, one
  synthetic ingredient, and `nutritionEstimate.state = "known"` with
  `confidence = "medium"`.
- Backend planned-meal schemas already allowed `nutritionEstimate.state =
  "unknown"` with `totals = null`, and account export/delete coverage from C4
  already included planned-meal collections.
- Independent QA found two remaining P1 lifecycle gaps after P1A:
  - a name-only planned draft can still reach Review and final save may compute
    empty ingredients as zero totals;
  - `plannedMealId` / `plannedMealVersion` typed source metadata is not carried
    from Planning through Review into the meal save request.
- Initial independent QA for P1B found one repair-blocking gap: `partial`
  planned estimates with empty ingredients and null totals could still be saved
  as zero nutrition because the first Review/backend guard only blocked
  `nutritionEstimateState = "unknown"`.
- Initial P1B QA also found contract-fixture coverage missing for the new
  `planningSource` meal contract.
- Initial independent QA for P1C found one repair-blocking gap: backend
  planned-meal routes respected `PLANNED_MEALS_ENABLED`, but core meal upsert
  and mobile stale Review/offline paths could still mutate `planningSource`
  while Planning was production-off.
- P1C re-QA initially reported one P2 verification gap because the QA agent did
  not configure the Firestore emulator. A narrow re-QA reran the emulator file
  with `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` and returned `5 passed`, then
  upgraded P1C to `QA_PASS`.

## P1A Implemented Changes

Mobile:

- Manual name-only Planning create now emits:
  - `draftSnapshot.ingredients = []`;
  - `draftSnapshot.totals = null`;
  - `nutritionEstimate.state = "unknown"`;
  - `nutritionEstimate.totals = null`;
  - `nutritionEstimate.missingFields = ["kcal", "protein", "fat", "carbs"]`;
  - `nutritionEstimate.confidence = null`.
- Review draft conversion maps existing planned ingredients only and no longer
  synthesizes fallback ingredients or macro totals for empty planned drafts.
- Planning tests now expect unknown UI evidence for a newly-created manual
  name-only planned meal.
- Planned Meals API tests now prove backend-valid unknown name-only records with
  empty ingredients and null totals are accepted by the mobile normalizer.

Backend:

- Added a planned-meal service test proving a manual name-only unknown planned
  meal persists, lists, and stores no synthetic nutrition.
- Backend planned-meal source code did not need changes for P1A.

## P1A Verification Run

Controller verification:

- Mobile targeted Jest:
  `npm run test:targeted -- --runTestsByPath src/feature/Planning/screens/PlanningScreen.test.tsx src/services/plannedMeals/plannedMealsApi.test.ts`
  - Result: `2 suites passed / 19 tests passed`.
- Backend targeted pytest:
  `./.venv/bin/pytest tests/test_planned_meal_service.py tests/test_api_planned_meals.py -q`
  - Result: `20 passed`.
- Mobile `npm run typecheck`
  - Result: passed.
- Mobile `npm run lint`
  - Result: passed.
- Mobile `git diff --check`
  - Result: passed.
- Backend `git diff --check`
  - Result: passed.
- Backend `ruff check .`
  - Result: `All checks passed!`
- Backend `python3 -m compileall app`
  - Result: passed.
- Backend `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- Backend full pytest:
  `./.venv/bin/pytest -q`
  - Result: `1242 passed, 35 skipped, 1 warning in 8.40s`.
- Search check:
  `rg -n "400|25|14|45|DEFAULT_MANUAL_TOTALS|buildKnownManualPlanningEstimate|manualIngredient" src/feature/Planning src/services/plannedMeals`
  - Result: no matches.

Independent QA:

- Verdict: `pass_with_gaps`.
- QA reran mobile targeted Jest (`2 suites / 19 tests passed`), backend targeted
  pytest (`20 passed`), and `git diff --check` in both repos.
- QA accepted P1A truthfulness but left Review save/source metadata gaps that
  were later closed by P1B.

## P1A Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| New manual name-only plan has no `400/25/14/45` macro defaults | passed locally | `planningDraft.ts` diff, Planning test, search check |
| Draft snapshot has no synthetic ingredient and no totals | passed locally | `ingredients=[]`, `totals=null` in create builder and tests |
| Nutrition estimate is explicit unknown | passed locally | builder/test assert unknown state, null totals, all missing fields, null confidence |
| Review conversion does not synthesize fallback ingredient/macros | passed locally | conversion maps existing ingredients only; Review handoff test asserts empty ingredients and no totals |
| Unknown estimate is visible in Planning UI | passed locally | Planning test asserts unknown badge and missing totals state |
| Mobile normalizer accepts backend-valid unknown name-only records | passed locally | plannedMeals API test |
| Backend persists/lists unknown name-only planned meals without invention | passed locally | planned meal service test |

## P1B Implemented Changes

Mobile:

- `buildReviewDraftFromPlannedMeal` now carries typed `planningSource` metadata:
  `plannedMealId`, `plannedMealVersion`, `sourceType`, `sourceRef`,
  `nutritionEstimateState`, and `missingNutritionFields`.
- Review save is blocked for any meal with `planningSource` and no positive
  nutrition evidence. This covers both `unknown` and `partial` planned
  estimates with empty ingredients/null totals.
- Review still allows a planned-source meal when explicit positive totals or
  ingredient nutrition is present.
- Meal document/upsert normalization now sends and reads `planningSource`.
- Local SQLite persistence now stores `planning_source`, migrates existing
  databases to user_version `17`, round-trips metadata through `rowToMeal`, and
  includes `planningSource` in local read-model equality.
- Offline meal push preserves queued `planningSource` in the remote save
  request.
- Paired mobile contract fixtures now include `planningSource` in
  `meal_item.json` and enum parity for `MealPlanningSourceType`,
  `MealPlanningNutritionEstimateState`, and `MealPlanningNutritionField`.

Backend:

- Meal schemas now define `MealPlanningSource` and include `planningSource` on
  `MealDocument` and `MealUpsertRequest`.
- API/schema validation rejects any planned-source meal upsert without positive
  totals or positive ingredient nutrition.
- Service-layer normalization persists and returns `planningSource`.
- Service-layer upsert validation applies the same positive-nutrition-evidence
  rule before Firestore access.
- Paired backend contract fixtures/tests now cover `planningSource` and the new
  enum parity.

## P1B Verification Run

Controller verification after repair:

- Mobile targeted Jest:
  `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx src/services/meals/mealSaveTransaction.test.ts src/services/meals/mealsRepository.test.ts src/services/offline/meals.repo.test.ts src/services/offline/strategies/meals.strategy.test.ts src/feature/Planning/screens/PlanningScreen.test.tsx`
  - Result: `6 suites passed / 72 tests passed`.
- Mobile contract alignment:
  `npx jest contractAlignment --runInBand --watchman=false --no-coverage`
  - Result: `2 suites passed / 107 tests passed`.
- Mobile `npm run typecheck`
  - Result: passed.
- Mobile `npm run lint`
  - Result: passed.
- Mobile `git diff --check`
  - Result: passed.
- Backend targeted pytest:
  `./.venv/bin/pytest tests/test_meal_schema.py tests/test_api_meals.py tests/test_meal_service.py -q`
  - Result: `108 passed / 3 warnings`.
- Backend contract alignment:
  `./.venv/bin/pytest tests/test_contract_alignment.py -q`
  - Result: `125 passed`.
- Backend `ruff check .`
  - Result: `All checks passed!`
- Backend `python3 -m compileall app`
  - Result: passed.
- Backend `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- Backend `git diff --check`
  - Result: passed.
- Backend full pytest:
  `./.venv/bin/pytest -q`
  - Result: `1254 passed / 35 skipped / 3 warnings in 8.29s`.

Independent QA:

- Initial verdict: `QA_FAIL`.
  - Finding: `partial` planned estimates with no positive nutrition evidence
    could still save as fabricated zero nutrition.
  - Finding: contract alignment passed but did not cover `planningSource`.
- Repair re-QA verdict: `QA_PASS`.
  - QA reran mobile targeted Jest (`6 suites / 72 tests`), mobile contract
    alignment (`2 suites / 107 tests`), backend focused pytest (`233 passed /
    3 warnings`), and `git diff --check` in both repos.
  - QA confirmed paired `meal_item.json` and `enums.json` fixtures are
    byte-identical across repos.

## P1B Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Prevent planned drafts with no positive nutrition evidence from final save | passed locally + QA | Review guard blocks any `planningSource` without positive totals/ingredient nutrition; unknown and partial tests |
| Preserve typed planned source metadata through Planning -> Review -> meal request | passed locally + QA | Planning Review draft test, meal repository send/normalize tests |
| Preserve typed planned source metadata through local/offline paths | passed locally + QA | SQLite `planning_source` migration, repo round-trip test, offline push test |
| Backend rejects planned-source meal upserts without positive nutrition evidence | passed locally + QA | schema/API/service tests for unknown and partial cases |
| Cross-repo contract fixtures cover `planningSource` | passed locally + QA | paired `meal_item.json`, enum parity, contract alignment suites |

## P1C Implemented Changes

Backend:

- Meal upsert now consumes a planned meal inside the same Firestore transaction
  as the logged-meal write and mutation dedupe record.
- Planned-meal consume verifies `plannedMealVersion`, rejects missing, stale,
  deleted or source-unavailable plans, and writes `status =
  "converted_to_review"`, incremented `version`, `linkedMealId`, `convertedAt`,
  and `conversionClientMutationId`.
- Same `clientMutationId` retry returns the existing meal mutation result
  without a second planned-meal read/write.
- A different meal save for an already-linked planned meal raises a conflict and
  does not create a duplicate logged meal.
- Deleting a linked logged meal preserves the planned meal's converted/link
  evidence and does not reopen or mutate the plan.
- Core meal API and service now reject non-null `planningSource` while
  `PLANNED_MEALS_ENABLED=false`; route-level raw-body gating happens before
  request validation and service work, and service-level raw/normalized gating
  happens before Firestore access.
- Backend emulator coverage now includes a two-client race against the same
  planned meal and proves only one logged meal is created and linked.

Mobile:

- Added a shared `planningSource` guard for meal save paths.
- Review save, local save transaction, remote meal save, and offline queued
  upsert now reject planned-source saves when Planning is disabled.
- Review shows an explicit disabled state for stale planned-source drafts when
  Planning is production-off and disables the save action without invoking
  `saveMeal`.
- Planned-meal linked fields are accepted by the mobile normalizer and rendered
  as link evidence in Planning.

## P1C Verification Run

Controller verification after repair:

- Backend targeted pytest:
  `./.venv/bin/pytest tests/test_meal_service.py tests/test_api_meals.py tests/test_planned_meal_service.py -q`
  - Result: `101 passed / 3 warnings`.
- Backend Firestore emulator:
  `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py -q`
  - Result: `5 passed`.
- Backend full pytest:
  `./.venv/bin/pytest -q`
  - Result: `1266 passed / 36 skipped / 3 warnings in 7.24s`.
- Backend `ruff check .`
  - Result: `All checks passed!`
- Backend `python3 -m compileall app`
  - Result: passed.
- Backend `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- Backend `git diff --check`
  - Result: passed.
- Mobile targeted Jest:
  `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx src/services/meals/mealSaveTransaction.test.ts src/services/meals/mealsRepository.test.ts src/services/offline/strategies/meals.strategy.test.ts src/services/plannedMeals/plannedMealsApi.test.ts src/feature/Planning/screens/PlanningScreen.test.tsx`
  - Result: `6 suites passed / 83 tests passed`.
- Mobile contract alignment:
  `npm run test:targeted -- --runTestsByPath src/__contract_fixtures__/contractAlignment.test.ts`
  - Result: `1 suite passed / 98 tests passed`.
- Mobile `npm run typecheck`
  - Result: passed.
- Mobile `npm run lint`
  - Result: passed.
- Mobile `git diff --check`
  - Result: passed.

Independent QA:

- Initial verdict: `QA_FAIL`.
  - Finding: disabled backend planned-meal routes and mobile entrypoints did not
    fully prevent stale planned-source saves through the core meal upsert path
    while Planning was production-off.
- Repair re-QA verdict: `QA_PASS`.
  - QA reran backend targeted pytest plus emulator file (`101 passed / 5
    skipped / 3 warnings` when emulator env was absent), backend contract
    alignment (`125 passed`), backend static gates, mobile targeted P1C suites
    (`6 suites / 83 tests`), mobile contract alignment (`1 suite / 98 tests`),
    mobile typecheck, and mobile lint.
  - QA classified the only remaining issue as a P2 verification gap because its
    first emulator run skipped without `FIRESTORE_EMULATOR_HOST`.
  - Narrow re-QA reran the backend emulator file with
    `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` and returned `5 passed`, removing
    the P2 verification gap and upgrading P1C to `QA_PASS`.

## P1C Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Final meal save consumes/links the planned meal only after logged meal save succeeds | passed locally + QA | same transaction writes meal, converted plan and mutation record; missing/unavailable failed-save tests assert no writes |
| Expected planned-meal version prevents stale consume/link | passed locally + QA | stale-version backend test raises conflict with no transaction writes |
| Retry with same `clientMutationId` is idempotent | passed locally + QA | dedupe replay test returns same result and does not read/write planned meal again |
| Duplicate logged meals from two saves are prevented | passed locally + QA | already-linked unit test plus two-client Firestore emulator race test |
| Failed meal save does not consume a planned meal | passed locally + QA | missing/deleted/source-unavailable/stale tests assert no planned write |
| Linked-meal delete behavior is defined and tested | passed locally + QA | delete linked logged meal preserves planned conversion/link evidence and does not reopen plan |
| Production-off Planning guard blocks stale planned-source saves | passed locally + QA | route/service raw guard, mobile Review/local/remote/offline guard tests |

## Remaining P1 Gaps

- No remaining P1 truth/lifecycle blocker is open after P1C re-QA.
- Planning still remains production-off until later feature-wave requirements,
  privacy-safe telemetry evidence, release evidence, and any owner-approved
  rollout gates pass.

## Stop Conditions

- Do not activate Planning in production from P1A.
- Do not represent unknown or missing nutrition as true zero nutrition.
- Do not encode planned-meal source identity only in notes.
- Do not use production Firebase credentials or production data to close P1.
- Do not claim `CORE_RC_READY` or `FULL_1_1_RC_READY` while Q0 remains open.
- Do not activate Planning in production solely because P1 passed; C5/Q0 and
  feature-wave launch evidence remain separate gates.

## Next Smallest P0 Slice

Q0A: paired core-off release evidence preflight.

Acceptance criteria:

- Re-check both repo branch/SHA/dirty state before Q0 work.
- Inspect existing release evidence/readiness scripts before editing.
- Run local paired release/readiness gates that do not require production
  credentials or provider access.
- Confirm production config keeps new domains off unless their feature gates
  have passed.
- Produce an evidence report that distinguishes local pass/fail from external
  blockers such as Sentry, legal/store metadata, provider credentials, backend
  deployed SHA, and owner-authorized production smoke.
- Do not run production/provider smoke without explicit owner authorization.
