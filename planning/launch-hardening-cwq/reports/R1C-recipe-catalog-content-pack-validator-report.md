# R1C Recipe Catalog Content-Pack Validator Report

Status: `qa_passed`
Created: `2026-06-21T21:40:00Z`

## Scope

R1C adds the first backend runtime boundary for a configured, versioned Recipe
Catalog content pack. It does not add production content. It makes the
enabled/approved backend path load only an explicitly configured content pack,
validate it before profile lookup, and fail closed on invalid content.

Non-goals:

- no approved production Recipe Catalog content pack;
- no recipe generation, nutrition authoring, or replacement content;
- no owner content review or nutrition/legal sign-off;
- no mobile UI change;
- no production, smoke provider, credential, or store access.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state: pre-existing Maestro E2E auth/session repair files.
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state before R1C already included M2G/K1A/R1A/R1B files.

## Confirmed Facts

- R1A added `RECIPE_CATALOG_CONTENT_APPROVED=false` and a route guard before
  profile/catalog work.
- R1B removed the foundation records from the runtime default path; without
  configured content, `evaluate_recipe_catalog(request)` now returns a true
  empty catalog.
- Before R1C, there was no configured content-pack path, loader, validator, or
  fail-closed route mapping for invalid configured content.
- Foundation catalog strings now remain in tests only, through
  `tests/recipe_catalog_fixtures.py`.

## Changes

- Added backend setting `RECIPE_CATALOG_CONTENT_PATH=""` and documented it in
  `.env.example` as an optional absolute path to an approved JSON content pack.
- Added `app/services/recipe_catalog_content_validator.py` with:
  - strict schema validation for pack metadata and `RecipeCatalogRecord` rows;
  - deterministic validation reports with bounded issue codes;
  - no fallback when the path is empty;
  - fail-closed configured file loading;
  - path rejection for relative paths and test/fixture directories;
  - placeholder/foundation content rejection;
  - metadata, source attribution, locale, duplicate id/version, nutrition,
    profile-flag consistency, active lifecycle, and curated review checks.
- Wired the Recipe Catalog route to load configured content after feature and
  content-approval guards but before profile lookup.
- Invalid configured content now returns:
  - HTTP `503`
  - `detail.code="recipe_catalog_content_invalid"`
  - bounded `issueCodes`
  - no raw file content or metadata values.
- Updated API tests for:
  - safe-off content path default;
  - explicit empty catalog when no content path is configured;
  - configured valid content path;
  - invalid configured content returning `503` before profile lookup.
- Added validator tests for the content-pack schema, loader, path handling,
  fixture/foundation rejection, unsafe nutrition, duplicate records, inactive
  lifecycle, unready review state, and profile-flag consistency.

## QA Failure And Repair

Initial independent QA verdict: `QA_FAIL`.

Blocking findings:

- `reviewState="needs_review"` records passed validation.
- `lifecycleState="retired"` records passed validation, which could allow a
  retired-only configured pack to produce misleading non-empty service counts if
  a caller ignored validation errors.
- `RECIPE_CATALOG_CONTENT_PATH` was documented as absolute but accepted relative
  paths.

Repair:

- Added `unready_review_state` validation for any record whose review state is
  not `curated`.
- Added `inactive_content_record` validation for any record whose lifecycle
  state is not `active`.
- Added `relative_content_path` validation before file reads.
- Added regression tests for all three QA findings.

Re-QA verdict: `QA_PASS`.

Re-QA confirmed no blocking findings, no app-side fixture leakage, and no hidden
fallback. It also confirmed route-level fail-closed behavior still maps content
validation failure to `503` before profile lookup/evaluation.

## Verification

Controller verification before repair:

- `./.venv/bin/pytest -q tests/test_recipe_catalog_content_validator.py tests/test_api_recipe_catalog.py tests/test_recipe_catalog_service.py tests/test_food_library_seed_validator.py tests/test_config_env_parity.py`
  passed: `94 passed`.
- `./.venv/bin/ruff check .` passed.
- `./.venv/bin/python -m compileall app` passed.
- `git diff --check` passed.
- `./.venv/bin/pyright` passed: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/pytest -q` passed:
  `1361 passed, 36 skipped, 3 warnings`.

Controller verification after repair:

- `./.venv/bin/pytest -q tests/test_recipe_catalog_content_validator.py tests/test_api_recipe_catalog.py tests/test_recipe_catalog_service.py tests/test_food_library_seed_validator.py tests/test_config_env_parity.py`
  passed: `97 passed`.
- Direct probe for `reviewState="needs_review"` returned:
  `True ['unready_review_state']`.
- Direct probe for `lifecycleState="retired"` returned:
  `validation True ['inactive_content_record']`.
- Direct probe for relative content path returned:
  `True ['relative_content_path']`.
- `./.venv/bin/ruff check .` passed.
- `./.venv/bin/python -m compileall app` passed.
- `git diff --check` passed.
- `./.venv/bin/pyright` passed: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/pytest -q` passed:
  `1364 passed, 36 skipped, 3 warnings`.

Independent re-QA verification:

- `env PYTHONDONTWRITEBYTECODE=1 ./.venv/bin/pytest -q -p no:cacheprovider tests/test_recipe_catalog_content_validator.py tests/test_api_recipe_catalog.py tests/test_recipe_catalog_service.py`
  passed: `61 passed`.
- Direct probes confirmed:
  - `needs_review True ['unready_review_state']`
  - `retired True ['inactive_content_record']`
  - `relative True ['relative_content_path']`
- Scoped `ruff`, `pyright`, and `git diff --check` passed.
- Controller focused pack rerun with cache disabled passed: `97 passed`.

The three warnings in full backend pytest are the pre-existing
`HTTP_422_UNPROCESSABLE_ENTITY` deprecation warnings in `app/api/routes/meals.py`.

## Controller Decision

R1C: `qa_passed`.

Recipe Catalog is now technically safer because a forced
`RECIPE_CATALOG_ENABLED=true` and `RECIPE_CATALOG_CONTENT_APPROVED=true` path no
longer has a hidden foundation catalog and can only use an explicit configured
content pack that passes fail-closed validation.

Full R1 remains `partial`. Production activation remains blocked by the missing
approved content pack, canonical content source/storage decision, owner content
review, nutrition/provenance sign-off, deployment configuration for
`RECIPE_CATALOG_CONTENT_PATH`, and runtime/E2E evidence with the real approved
pack.
