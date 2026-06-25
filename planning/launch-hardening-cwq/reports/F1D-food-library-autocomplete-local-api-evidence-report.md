# F1D Food Library Autocomplete Local API Evidence Report

Generated: `2026-06-23`

## Objective

Produce local technical evidence for Food Library autocomplete PL/EN query
coverage and local API-route latency without enabling Food Library in
production and without using production/provider credentials.

## Scope

In scope:

- Extend the local Ingredient autocomplete E2E seed with an English seed record.
- Add a backend-owned verifier for local PL/EN query coverage.
- Exercise the canonical `/api/v2/users/me/ingredient-products/search` route
  through a local in-process FastAPI app mounted with `api_v2_router`.
- Report local route latency p50/p95/max and explicit evidence limitations.
- Keep evidence local-only and in-memory for seed search data.

Out of scope:

- Production corpus approval.
- Owner nutrition/source quality sign-off.
- Provider-backed auth, Firebase production, deployed backend, network, Android,
  or physical-device latency evidence.
- Mobile UI/runtime changes.
- Feature rollout approval or production Food Library activation.
- Home Next Action.

## Repo Snapshot

Mobile repo:

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD during this slice: `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- State after this slice: clean and synchronized with origin.
- Mobile files changed: none.

Backend repo:

- Branch: `codex/smart-memory-core-loop-be`
- Base HEAD during this slice: `f681d983941fe2d20cc857811493ee5bbd9def4f`
- F1D commit: `fe01fbaf92921271968e9d7bde329530b42513eb`
- State after push: clean and synchronized with origin.

## Changes

Backend:

- `scripts/seed_ingredient_autocomplete_e2e.py`
  - Added `e2e-local-oats-en`, a local global seed record with searchable
    English terms `Local oats` / `Oats`.
  - The local seed validation summary now reports three local global seed
    records.
- `scripts/verify_ingredient_autocomplete_local_evidence.py`
  - Added a deterministic local verifier that validates seed records, mounts a
    local FastAPI app with `api_v2_router`, calls
    `/api/v2/users/me/ingredient-products/search`, patches only local Firebase
    token decoding, temporarily enables the Food Library route flag, and
    restores patches in `finally`.
  - Reports matched IDs and normalized queries for PL `Owies`, PL diacritic
    `Ostrzeżenie`, and EN `Oats`.
  - Reports local route latency p50/p95/max with a default `50ms` p95 threshold.
  - Explicitly records that the verifier does not run production app startup or
    middleware and does not prove provider auth, production Firebase, deployed
    backend, network, Android, or physical-device latency.
- `tests/test_seed_ingredient_autocomplete_e2e.py`
  - Updated local seed count expectations and added PL/EN search-prefix
    coverage assertions.
- `tests/test_verify_ingredient_autocomplete_local_evidence.py`
  - Added verifier coverage, negative missing-EN-record, argument validation,
    data source, and limitation assertions.

## Evidence

Verifier command:

```sh
./.venv/bin/python scripts/verify_ingredient_autocomplete_local_evidence.py
```

Result: passed.

Key output facts:

- `evidenceKind`: `ingredient_autocomplete_local_api_route_evidence_v1`
- `dataSource`: `local_in_process_api_v2_router_with_in_memory_seed_records`
- `productionCorpusApproved`: `false`
- PL `Owies` normalized to `owies` and matched `e2e-local-oats`.
- PL `Ostrzeżenie` normalized to `ostrzezenie` and matched `e2e-warning-oats`.
- EN `Oats` normalized to `oats` and matched `e2e-local-oats-en`.
- Coverage `passed`: `true`.
- Latency iterations: `30`.
- Latency p50: `0.947ms`.
- Latency p95: `1.17ms`.
- Latency max: `1.174ms`.
- Latency threshold: `50ms`.
- Latency `passed`: `true`.

Verifier limitations recorded by the tool:

- local in-process API v2 router evidence only;
- no production corpus approval;
- production app startup and middleware are not run;
- Firebase auth token decoding is locally patched;
- no provider-backed auth claim;
- no provider, production Firebase, deployed backend, network, or physical-device
  latency evidence;
- PL/EN technical query hits do not replace owner nutrition-quality review or
  rollout approval.

## Verification

Focused backend:

```sh
./.venv/bin/python -m pytest tests/test_seed_ingredient_autocomplete_e2e.py tests/test_verify_ingredient_autocomplete_local_evidence.py tests/test_api_food_library.py tests/test_food_library_service.py -q
```

Result: passed, `64 passed`.

```sh
./.venv/bin/python scripts/verify_ingredient_autocomplete_local_evidence.py --iterations 5 --threshold-ms 1000
```

Result: passed; route coverage passed and local route p95 was `1.362ms`.

```sh
./.venv/bin/ruff check scripts/seed_ingredient_autocomplete_e2e.py scripts/verify_ingredient_autocomplete_local_evidence.py tests/test_seed_ingredient_autocomplete_e2e.py tests/test_verify_ingredient_autocomplete_local_evidence.py
```

Result: passed.

Full backend gates after QA repair:

```sh
./.venv/bin/python -m pytest
```

Result: passed, `1385 passed / 36 skipped / 3 warnings`.

```sh
./.venv/bin/python -m compileall app
./.venv/bin/ruff check .
./.venv/bin/pyright
git diff --check
```

Result: all passed; Pyright reported `0 errors, 0 warnings, 0 informations`.

Backend mypy: not run because no mypy configuration file was present in the
backend repo.

## QA

Explorer confirmed the canonical route/service path and recommended backend-only
F1D. It noted that service-only evidence would be weaker than route evidence.

Independent QA initially returned `pass_with_gaps` with two findings:

- the first verifier version imported the global `app` before local patching,
  which could run eager Firebase startup before in-memory evidence setup;
- the route-upgraded verifier still had a stale direct-service helper.

Controller repair:

- removed the global `app.main` import and built a local `FastAPI` app mounted
  with `api_v2_router`;
- removed the stale direct-service helper;
- updated tests and limitations to state production app startup/middleware are
  not run.

Independent re-QA confirmed both findings closed and returned final verdict:
`pass`.

## Diff Hygiene

Intentional:

- local seed addition for English autocomplete evidence;
- local verifier and tests for API-route PL/EN coverage and latency;
- seed tests updated for three local seed records.

Accidental:

- none found.

Mobile:

- no mobile files changed.
- Active fake-auth marker search returned no matches for
  `fitaly://e2e/login`, `authSession`, `authToken`,
  `getE2EAuthSession`, `establishE2EAuthSession`, or
  `buildE2EProfileSeed`.

## Remaining F1 Blockers

- No approved production corpus.
- No owner quality review or source/confidence sign-off.
- PL/EN technical coverage exists only for local seed/API-route evidence, not
  owner sign-off.
- No authorized production/provider evidence.
- No deployed backend, Android, network, physical-device, or provider-backed
  latency evidence.
- No feature-wave rollout approval.

## Controller Decision

F1D is accepted as local technical PL/EN autocomplete coverage and local
API-route latency evidence only.

F1 remains `partial`. Food Library remains production-off.
