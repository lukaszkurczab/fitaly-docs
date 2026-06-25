# M1A Smart Memory Shadow Capture Report

Status: `qa_passed`
Created: `2026-06-20T23:29:47Z`

## Scope

M1A is the first smallest Smart Memory hardening slice. It removes automatic
promotion from backend capture so capture can run in shadow mode: ready capture
upserts a candidate, but does not create an active memory item and does not apply
suggestions.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no mobile UI/runtime behavior change;
- no time-window rewrite;
- no manual promotion/apply redesign;
- no Firebase, RevenueCat, Sentry, bundle/package ID, production data, or
  credential changes.

## Repo Snapshot

Backend before M1A final repair/test:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus M1A files.

Mobile re-check before M1A worker completion:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; M1A made no mobile
  edits.

## Confirmed Facts

- `SMART_MEMORY_CAPTURE_ENABLED` and `SMART_MEMORY_APPLY_ENABLED` are separate
  backend flags and remain default `False` in repo configuration.
- Before M1A, both ready capture paths called
  `smart_memory_service.promote_candidate(...)` when `upsert_candidate` returned
  a candidate document.
- M1 launch requirements require capture candidate, promotion/activation, and
  Review apply/use to be separate concerns.
- Existing local emulator configuration was not present during this slice, so
  Firestore emulator tests were collected but skipped locally.

## Changes

Backend:

- Updated `app/services/smart_memory_capture_service.py`.
  - `capture_typical_portion_candidate_from_meal_snapshots(...)` now returns the
    direct `upsert_candidate` result and never auto-promotes.
  - `capture_review_correction_candidate_from_signals(...)` now returns the
    direct `upsert_candidate` result and never auto-promotes.
  - Removed now-unused synthetic activation helper functions.
- Updated `tests/test_smart_memory_capture_service.py`.
  - Typical-portion ready capture now asserts candidate-only mutation result and
    zero `promote_candidate` calls.
  - Review-correction ready capture now asserts candidate-only mutation result
    and zero `promote_candidate` calls.
  - Review-correction already-activated upsert result now has explicit
    no-promotion coverage.
- Updated only the M1A-relevant expectations in
  `tests/test_meal_service_firestore_emulator.py`.
  - The Smart Memory meal-delete emulator test now expects shadow capture to
    leave the candidate in `candidate` state before delete.
  - It asserts no active `smartMemory` item exists before or after delete.
  - It still asserts meal delete marks the candidate `source_deleted` and writes
    a source-deleted tombstone.
  - Other dirty changes in this file pre-existed M1A and are not attributed to
    this slice.

## QA History

- Worker `Maxwell`: implemented candidate-only capture and updated focused
  unit tests; verdict `pass`.
- Independent QA `Lorentz`: `pass_with_gaps`.
  - Found stale emulator/integration expectation that still asserted capture
    activated a candidate and created an active Smart Memory item.
  - Noted broader M1 time-window work remains incomplete.
- Controller repair: updated the M1A-relevant emulator test expectations to
  candidate-only shadow capture.
- Independent re-QA `Lorentz`: `pass_with_gaps`.
  - Confirmed the stale emulator expectation is resolved.
  - No remaining blocking findings for M1A.
  - Residual gap: emulator test did not execute locally because
    `FIRESTORE_EMULATOR_HOST` is not configured.

Controller accepted M1A as a partial M1 hardening step after focused and full
backend gates passed.

## Verification

Focused M1A final:

- `pytest tests/test_smart_memory_capture_service.py tests/test_meal_service_firestore_emulator.py`
  - Result: `31 passed, 5 skipped`.
  - Skip reason: Firestore emulator is not configured.
- `./.venv/bin/ruff check app/services/smart_memory_capture_service.py tests/test_smart_memory_capture_service.py tests/test_meal_service_firestore_emulator.py`
  - Result: `All checks passed!`
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `git diff --check`
  - Result: passed.

Full backend final:

- `pytest`
  - Result: `1311 passed, 36 skipped, 3 warnings`.
- `python3 -m compileall app`
  - Result: passed.
- `./.venv/bin/ruff check .`
  - Result: `All checks passed!`

Independent QA focused verification:

- `env PYTHONDONTWRITEBYTECODE=1 pytest -p no:cacheprovider tests/test_smart_memory_capture_service.py`
  - Result: `31 passed`.
- `env PYTHONDONTWRITEBYTECODE=1 pytest -p no:cacheprovider tests/test_smart_memory_capture_service.py tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted`
  - Result: `31 passed, 1 skipped`.
- Focused `ruff check` over changed M1A files passed.

## Classification

M1A local shadow-capture separation slice: `qa_passed`.

M1 full launch gate: `partial`.

Reason: backend capture no longer auto-promotes candidates, but full M1 still
requires explicit 21/30-day windows, outbox replay evidence, local emulator
runtime evidence, source-delete/tombstone reactivation coverage, apply disabled
Review behavior, and broader Smart Memory rollout evidence.

## Remaining M1 Gate Blockers

- Replace recent-meal count semantics with explicit time windows:
  - typical portions: 21 days;
  - corrections: 30 days;
  - suppression/preferences: 30 days.
- Run Firestore emulator evidence for candidate-only capture and source-delete
  cascade.
- Prove capture processing through the durable meal-effect outbox replay path is
  idempotent.
- Prove deleted sources and tombstones block reactivation across replay and new
  observations.
- Prove apply disabled produces zero Review influence.
- Prove telemetry remains category-only when this domain is exercised at
  runtime.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest P0 slice: M1B explicit Smart Memory capture windows.

Acceptance criteria:

- typical-portion capture uses a 21-day window instead of the current recent
  meal limit;
- review-correction capture uses a 30-day window;
- observations outside the configured window do not count;
- three observations on one day still do not create a ready candidate;
- three qualifying observations on three distinct days inside the window still
  create a candidate only, not active memory;
- targeted tests cover timezone/day-key boundary and old-observation exclusion;
- no production flags are enabled.

## Controller Decision

M1A: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
