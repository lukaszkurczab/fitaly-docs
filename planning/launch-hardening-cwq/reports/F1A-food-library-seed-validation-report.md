# F1A Food Library Seed Validation Report

Status: `qa_passed`
Created: `2026-06-20T23:16:43Z`

## Scope

F1A is the first smallest Food Library hardening slice. It adds local backend
validation and import evidence for Ingredient/Product seed/corpus data without
activating Food Library in production and without adding external content.

Non-goals:

- no production Food Library activation;
- no external nutrition/product data import;
- no Firebase, RevenueCat, Sentry, bundle/package ID, or production credential changes;
- no mobile UI/runtime behavior changes;
- no claim that F1 full rollout gate is complete.

## Repo Snapshot

Backend before F1A final repair/test:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus F1A files.

Mobile re-check before F1A repair:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; F1A made no mobile edits.

## Confirmed Facts

- Canonical Ingredient/Product contract lives in backend
  `app/schemas/food_library.py`.
- Food Library runtime routes remain feature-gated and production-off by prior C2
  work.
- No approved production Food Library corpus was found in inspected backend repo
  areas.
- Existing local E2E seed script wrote global emulator seed records directly
  before F1A; there was no reusable seed/corpus validator.

## Changes

Backend:

- Added `app/services/food_library_seed_validator.py`.
  - Validates Ingredient/Product seed/corpus records with structured issue codes
    and deterministic report summary.
  - Rejects missing schema fields, user-scoped records, global owner leakage,
    non-reviewed global source types, candidate-only source types, unsafe document
    IDs, candidate/rejected lifecycle, low/unknown required confidence,
    placeholder/TODO/example metadata, malformed or incomplete search prefixes,
    AI-derived durable nutrition truth, kind-specific missing fields,
    basis/unit mismatches, implausible kcal, individual nutrients over 100g, and
    macro sums over 100g per 100.
  - Keeps unapproved production corpus as an explicit validation error.
  - Marks local E2E seed validation as emulator import evidence only, not
    approved production corpus evidence.
- Updated `scripts/seed_ingredient_autocomplete_e2e.py`.
  - Adds backend import path setup for direct script execution.
  - Validates global E2E seed records before any emulator auth/write work.
  - Generates complete normalized search prefixes for local seed records.
  - Emits deterministic `globalSeedValidation` summary in the seed output.
- Added `tests/test_food_library_seed_validator.py`.
- Added `tests/test_seed_ingredient_autocomplete_e2e.py`.

## QA History

- Worker `Mencius`: implemented validator and seed hook; verdict
  `pass_with_gaps` because no approved production corpus exists.
- Independent QA `Kuhn`: `QA_FAIL`.
  - Found incomplete search-prefix acceptance.
  - Found global `user_created` source accepted as corpus truth.
  - Found placeholder scan missed external/barcode metadata.
  - Found unsafe document IDs and implausible nutrition accepted.
- Repair 1: tightened prefix, source, metadata, document ID and nutrition checks;
  added regression tests.
- Independent re-QA `Anscombe`: `QA_FAIL`.
  - Found macro sum over 100g still accepted.
  - Found placeholder scan missed source/barcode optional timestamp/reviewer fields.
- Repair 2: added macro-sum and nested metadata placeholder checks.
- Independent re-QA `Copernicus`: `QA_PASS_WITH_GAPS`.
  - Confirmed prior blockers closed.
  - Remaining gap: `sourceAttribution.observedAt` was covered by code/probe but
    not a named regression test.
- Controller repair: added named `source_observed_at_placeholder` regression.
  - No validator runtime code changed after final QA; final change was test-only.

Controller accepted F1A after final focused and full backend gates passed.

## Verification

Focused F1A final:

- `./.venv/bin/python -m pytest tests/test_food_library_seed_validator.py tests/test_seed_ingredient_autocomplete_e2e.py`
  - Result: `35 passed`.
- `./.venv/bin/ruff check app/services/food_library_seed_validator.py scripts/seed_ingredient_autocomplete_e2e.py tests/test_food_library_seed_validator.py tests/test_seed_ingredient_autocomplete_e2e.py`
  - Result: `All checks passed!`
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/python -m compileall app`
  - Result: passed.
- `git diff --check`
  - Result: passed.
- `./.venv/bin/python scripts/seed_ingredient_autocomplete_e2e.py`
  - Result: expected failure without emulator env,
    `RuntimeError: FIRESTORE_EMULATOR_HOST must be set for local emulator seeding.`
  - No `ModuleNotFoundError`.

Full backend final:

- `./.venv/bin/python -m pytest`
  - Result: `1310 passed, 36 skipped, 3 warnings`.

## Classification

F1A local validator/import-evidence slice: `qa_passed`.

F1 full launch gate: `partial`.

Reason: technical seed/corpus validation path now exists and is tested, but no
approved production corpus, owner quality review, PL/EN query coverage evidence,
autocomplete E2E run evidence, emulator create/update/delete recovery evidence,
or latency evidence was produced in this slice.

## Remaining F1 Gate Blockers

- Approved Food Library production corpus is missing.
- Corpus source/confidence/quality owner evidence is missing.
- Basic PL/EN query coverage evidence is missing.
- Autocomplete E2E evidence was not run in this slice.
- Create/update/delete offline recovery evidence was inspected from existing
  tests but not re-run as a focused mobile/E2E gate here.
- Latency evidence is missing.
- Production `foodLibrary` flag must remain off until F1 full technical and data
  gates pass.

## Controller Decision

F1A: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Food Library is
not ready for production rollout.
