# K1A Known Patterns Content Identity Report

Status: `qa_passed`
Created: `2026-06-21T17:13:43Z`
Updated: `2026-06-21T19:50:23Z`

## Scope

K1A is the first Known Patterns identity hardening slice. It replaces the
confirmed weak `meal_type|normalized_name` candidate grouping with a
deterministic content signature for backend candidate evaluation.

Non-goals:

- no Known Patterns production activation;
- no Home Next Action integration;
- no Recipe Catalog or Food Library content work;
- no migration of historical pre-launch local controls;
- no mobile UI change.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state: existing M2G repair files only.
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state includes prior M2G Firebase emulator repair plus K1A:
  - `app/services/known_pattern_service.py`
  - `tests/test_known_pattern_service.py`

## Confirmed Facts

- Before K1A, Known Patterns grouped source meals by
  `f"{evidence.meal_type}|{evidence.normalized_name}"`.
- The active execution brief requires generic names not to form identity alone.
- Known Patterns production flags remain off by default.

## Changes

- Bumped backend rule version to
  `known-pattern-v2-content-signature`.
- Candidate subject identity now uses a content signature made from:
  - normalized ingredient names;
  - compatible units (`g`/`ml`);
  - bucketed ingredient amounts;
  - bucketed macro totals.
- Meals without compatible quantified ingredient content fail closed and do not
  create candidates.
- Ingredient order no longer affects identity.
- Meal name is no longer part of candidate identity.

## Verification

- `./.venv/bin/ruff check app/services/known_pattern_service.py tests/test_known_pattern_service.py`
  passed.
- `./.venv/bin/pytest tests/test_known_pattern_service.py -q` passed
  (`21` tests after the partial-unquantified-content repair).
- `./.venv/bin/pytest tests/test_known_pattern_service.py tests/test_api_known_patterns.py -q`
  passed (`29` tests).
- `./.venv/bin/pyright` passed (`0` errors).
- `./.venv/bin/ruff check .` passed.
- `./.venv/bin/python -m compileall app` passed.
- `./.venv/bin/pytest -q` passed
  (`1328` passed, `36` skipped, `3` warnings).

## Independent QA

Independent QA initially returned `QA_PASS_WITH_GAPS` with one blocking-for-claim
gap: partial unquantified ingredient content could be silently ignored if at
least one other ingredient had a valid identity token.

Controller repair changed content identity to fail closed when any normalized
ingredient lacks a valid identity token and added a regression test for partial
unquantified content.

Independent re-QA returned `QA_PASS`.

## Acceptance Evidence

- Same generic name with different ingredients does not create a candidate.
- Different names with matching quantified content create one candidate.
- Reordered ingredients still create one candidate.
- Missing compatible quantity/unit content fails closed.

## Unverified Areas

- PL/EN ingredient alias equivalence is not implemented in K1A.
- Partial ingredient-overlap similarity beyond exact bucketed signatures is not
  implemented in K1A.
- No Maestro runtime Known Patterns flow was run in this slice.
- No production, smoke, provider, or credential-backed runtime was used.

## Controller Decision

K1A: `qa_passed` for the local content-signature identity slice.

Known Patterns production flags must stay off.
