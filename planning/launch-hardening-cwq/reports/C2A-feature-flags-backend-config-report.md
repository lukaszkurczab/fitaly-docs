# C2A Feature Flags Backend And Config Report

Status: `pass_with_gaps`
Packet: C2 Granular feature flags and predictable disabled behavior
Slice: C2A backend disabled behavior + mobile production-off config/readiness
Started from C1 pair: 2026-06-20
Closed at: 2026-06-20T13:54:04Z
Controller: Codex

## Confirmed Pair Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state after C2A: expected C1 edits plus C2A config/readiness/test edits.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state after C2A: expected C1 edits plus C2A feature-flag/route/test edits.

## Scope

C2A implemented the first safe part of C2:

- declare canonical new-domain backend flags with launch-safe defaults;
- hard-disable backend new-domain HTTP routes before domain service work;
- guard Smart Memory meal side-effect reads/writes behind capture/apply flags;
- declare mobile new-domain flags in runtime config, EAS profiles and examples;
- require production profiles/evidence to keep new domains explicitly off;
- allow smoke profiles to explicitly declare true or false for focused future gates.

C2A intentionally did not implement mobile entrypoint hiding, mobile request
suppression, background/sync suppression, or deep-link unavailable behavior.
Those are C2B.

## Files Changed

Mobile:

- `.env.example`
- `app.config.js`
- `eas.json`
- `scripts/check-launch-readiness.lib.js`
- `scripts/render-release-evidence.mjs`
- `src/services/core/runtimeConfig.ts`
- `src/services/core/runtimeConfig.test.ts`
- `src/services/release/checkLaunchReadinessConfig.test.ts`
- `src/services/release/launchReadiness.ts`
- `src/services/release/launchReadiness.test.ts`
- shared runtime-config test helpers in affected test files

Backend:

- `.env.example`
- `app/core/config.py`
- `app/api/feature_flags.py` (new)
- `app/api/routes/food_library.py`
- `app/api/routes/smart_memory.py`
- `app/api/v2/endpoints/known_patterns.py`
- `app/api/v2/endpoints/recipe_catalog.py`
- `app/api/v2/endpoints/planned_meals.py`
- `app/services/meal_service.py`
- `tests/test_api_food_library.py`
- `tests/test_api_smart_memory.py`
- `tests/test_api_known_patterns.py`
- `tests/test_api_recipe_catalog.py`
- `tests/test_api_planned_meals.py`
- `tests/test_meal_service.py`

## Behavior After

- Backend settings now include:
  - `FOOD_LIBRARY_ENABLED=false`
  - `SMART_MEMORY_ENABLED=false`
  - `SMART_MEMORY_CAPTURE_ENABLED=false`
  - `SMART_MEMORY_APPLY_ENABLED=false`
  - `KNOWN_PATTERNS_ENABLED=false`
  - `RECIPE_CATALOG_ENABLED=false`
  - `PLANNED_MEALS_ENABLED=false`
- Disabled new-domain routes return stable `503` details with `detail.code` and do not call their domain services.
- Food Library search no longer silently degrades when the domain is disabled; disabled mode is a hard feature-disabled response.
- Smart Memory meal capture returns before settings reads, tombstone reads, recent-meal reads, or candidate writes when `SMART_MEMORY_CAPTURE_ENABLED=false`.
- Smart Memory source-deleted apply side effect returns before Smart Memory writes when `SMART_MEMORY_APPLY_ENABLED=false`.
- Mobile runtime config now exposes C2 flags for Food Library, Smart Memory, Known Patterns, Recipe Catalog, Planning, Home Next Action, and Review Memory Explanation.
- `eas.json` declares the new flags explicitly in smoke and production; production values are `false`.
- Mobile launch readiness blocks production when any new-domain flag resolves enabled.
- Mobile release evidence blocks production evidence when a new-domain flag is missing or enabled.
- Smoke readiness requires explicit boolean values, but may enable a domain for a future focused gate.

## Controller Verification

Mobile commands:

- `npm test -- --runInBand --coverage=false src/services/release/checkLaunchReadinessConfig.test.ts src/services/core/runtimeConfig.test.ts src/services/release/launchReadiness.test.ts src/services/release/releaseEvidenceScripts.test.ts`
  - Result: passed, 4 suites / 54 tests. The printed `ERROR` stack traces were expected negative subprocess assertions inside passing tests.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `git diff --check`
  - Result: passed.

Backend commands:

- `./.venv/bin/python -m pytest -q tests/test_api_food_library.py tests/test_api_smart_memory.py tests/test_api_known_patterns.py tests/test_api_recipe_catalog.py tests/test_api_planned_meals.py tests/test_meal_service.py`
  - Result: passed, 102 tests.
- `ruff check .`
  - Result: passed.
- `./.venv/bin/pyright`
  - Result: passed, 0 errors / 0 warnings / 0 informations.
- `git diff --check`
  - Result: passed.

Worker-reported broader verification:

- Backend full `./.venv/bin/python -m pytest -q`
  - Result: passed, 1214 passed / 33 skipped / 1 warning.
- Backend `./.venv/bin/python -m compileall app`
  - Result: passed.

## Independent QA

QA verdict: `PASS_WITH_GAPS`.

No blocking C2A findings.

Non-blocking risk:

- Disabled route guards run after authentication dependency resolution. QA did not block C2A because guards still run before domain Firestore/service work. If future scope interprets provider work to include auth verification, the route guard model should be revisited.

Confirmed residual gaps:

- Mobile entrypoint hiding is not implemented.
- Mobile request suppression is not implemented.
- Mobile background/sync suppression is not implemented.
- Deep-link unavailable behavior is not implemented.

## Remaining Risks And Unverified Areas

- C2 as a full packet is not closed until C2B proves disabled mobile sends no requests and deep links cannot bypass flags.
- No live smoke/prod/provider checks were run; no credentials were used.
- New-domain feature waves remain production-off until their own gates pass.
- Overall readiness remains `NO_GO`.

## Packet Decision

C2A is accepted as a bounded `pass_with_gaps` slice.

C2 remains `in_progress`.

Next smallest P0 slice: C2B mobile disabled behavior for entrypoints, request suppression, background/sync work, and deep links.
