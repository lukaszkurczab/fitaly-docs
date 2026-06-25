# R1B Recipe Catalog Fixture Relocation Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T22:42:00Z`

## Scope

R1B removes Recipe Catalog foundation records from the backend runtime default
path. It follows R1A's safe-off content approval guard by making the approved
success path return a true empty catalog until a canonical content source exists.

Non-goals:

- no approved production Recipe Catalog content pack;
- no generated recipes, nutrition, provenance, or replacement content;
- no importer/validator yet;
- no mobile changes;
- no production, smoke provider, credential, or store access.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state: pre-existing Maestro E2E auth/session repair files.
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state before R1B already included M2G/K1A/R1A files.

## Confirmed Facts

- Before R1B, `evaluate_recipe_catalog(request)` defaulted to the in-code
  `CURATED_RECIPE_CATALOG` foundation records.
- The backend route calls `evaluate_recipe_catalog(request)` without injecting
  catalog records.
- R1 requires foundation fixtures not to be treated as production content.

## Changes

- Removed the in-code `CURATED_RECIPE_CATALOG` and helper record builders from
  `app/services/recipe_catalog_service.py`.
- `evaluate_recipe_catalog(request)` with no injected catalog now evaluates an
  empty sequence.
- `evaluate_default_recipe_catalog_coverage()` now reports only an explicit
  default empty-catalog case unless callers provide their own coverage cases.
- Moved the prior seven sample records into
  `tests/recipe_catalog_fixtures.py`.
- Updated service coverage tests to inject the test-only fixture catalog
  explicitly.
- Updated the API success-path test so
  `RECIPE_CATALOG_ENABLED=true` and
  `RECIPE_CATALOG_CONTENT_APPROVED=true` returns:
  - `items=[]`
  - `totalCatalogCount=0`
  - `visibleCount=0`
  - `emptyCatalog=true`
  - `lowResults=false`

## Verification

- `./.venv/bin/pytest tests/test_recipe_catalog_service.py tests/test_api_recipe_catalog.py -q`
  passed: `29 passed`.
- `./.venv/bin/ruff check .` passed.
- `./.venv/bin/pyright` passed: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/python -m compileall app` passed.
- `./.venv/bin/pytest -q` passed:
  `1332 passed, 36 skipped, 3 warnings`.
- `git diff --check` passed.
- Repository search confirmed foundation catalog strings are absent from
  `fitaly-backend/app/` and remain only in `tests/recipe_catalog_fixtures.py`.

## Independent QA

Independent QA verdict: `QA_PASS_WITH_GAPS`.

No blocking R1B findings.

Accepted gaps:

- Full R1 is still incomplete. The code still lacks a canonical versioned
  content source, importer/validator, fixture relocation beyond test-only
  sample coverage, and an approved external content pack.
- A test-only coverage helper marks the explicitly expected empty catalog case
  as `passes_coverage_gate=True`. This must not be presented as content
  readiness; it only proves the empty-state boundary behaves predictably.

QA confirmed no mobile update is required for R1B because the successful
response shape/enums did not change and mobile already handles `emptyCatalog`.

## Controller Decision

R1B: `qa_passed_with_gaps`.

Recipe Catalog is safer for core release because the backend runtime no longer
has foundation records in the default success path. Full R1 remains blocked by
missing canonical content source, importer/validator, approved content pack and
owner content review. Recipe Catalog production activation remains blocked.
