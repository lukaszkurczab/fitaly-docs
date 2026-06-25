# R1A Recipe Catalog Content Boundary Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T22:18:00Z`

## Scope

R1A is the first Recipe Catalog production-boundary slice. It prevents the
backend Recipe Catalog endpoint from returning the current in-code foundation
records solely because `RECIPE_CATALOG_ENABLED=true`.

Non-goals:

- no approved production Recipe Catalog content pack;
- no generated recipes, nutrition, provenance, or placeholder replacement;
- no mobile UI changes;
- no Recipe Catalog importer/validator yet;
- no production, smoke provider, credential, or store access.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state: pre-existing Maestro E2E auth/session repair files.
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state before R1A already included M2G/K1A files:
  - `app/db/firebase.py`
  - `app/services/known_pattern_service.py`
  - `tests/test_firebase.py`
  - `tests/test_known_pattern_service.py`

## Confirmed Facts

- `app/services/recipe_catalog_service.py` still contains
  `CURATED_RECIPE_CATALOG` foundation records.
- `evaluate_recipe_catalog()` still defaults to that in-code catalog when no
  explicit catalog is injected.
- Before R1A, the route returned those records whenever
  `RECIPE_CATALOG_ENABLED=true`.
- The execution brief says foundation fixtures are not a production catalog and
  Recipe Catalog must remain off until its content gate passes.

## Changes

- Added backend setting `RECIPE_CATALOG_CONTENT_APPROVED=false`.
- Documented the setting in backend `.env.example` with the other C2
  launch-gated domains.
- Added a Recipe Catalog content approval guard after the existing feature flag
  guard and before profile lookup/catalog evaluation.
- When `RECIPE_CATALOG_ENABLED=false`, disabled behavior remains:
  `503 detail.code=recipe_catalog_disabled`.
- When `RECIPE_CATALOG_ENABLED=true` but
  `RECIPE_CATALOG_CONTENT_APPROVED=false`, the route returns:
  `503 detail.code=recipe_catalog_content_not_approved`.
- The unapproved-content path does not call `UserProfileService.get_profile`
  or `evaluate_recipe_catalog`.

## Verification

- `./.venv/bin/pytest tests/test_api_recipe_catalog.py tests/test_recipe_catalog_service.py -q`
  passed: `27 passed`.
- `./.venv/bin/ruff check .` passed.
- `./.venv/bin/pyright` passed: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/python -m compileall app` passed.
- `./.venv/bin/pytest -q` passed:
  `1330 passed, 36 skipped, 3 warnings`.

## Independent QA

Independent QA verdict: `QA_PASS_WITH_GAPS`.

No blocking findings for R1A.

Accepted gap:

- This is a real safe-off endpoint boundary, but not the full R1 content gate.
  The backend still contains in-code foundation records and the success path
  still uses them when both gates are forced true. Full R1 still needs a
  canonical versioned content source, importer/validator, fixture relocation,
  and approved external content.

QA confirmed no mobile or contract fixture update is required for this slice
because the successful response contract did not change and mobile already
suppresses Recipe Catalog requests when its frontend flag is off.

## Controller Decision

R1A: `qa_passed_with_gaps`.

Full R1 remains `partial` and production activation remains blocked by missing
approved Recipe Catalog content pack plus the remaining importer/validator and
content-source work.
