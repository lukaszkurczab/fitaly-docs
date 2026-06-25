# M1B1 Smart Memory Typical-Portion Window Report

Status: `qa_passed`
Created: `2026-06-20T23:42:57Z`

## Scope

M1B1 is the next smallest Smart Memory hardening slice after M1A. It replaces
the active backend typical-portion capture read from "latest N meals" semantics
with a deterministic 21-day `dayKey` window anchored to the saved meal.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no mobile UI/runtime behavior change;
- no review-correction or suppression/preference 30-day window implementation;
- no M2 Review apply/control work;
- no Firebase, RevenueCat, Sentry, bundle/package ID, production data, provider
  smoke, or credential changes.

## Repo Snapshot

Backend before M1B1 controller verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus M1B1 changes in
  `app/services/meal_service.py` and `tests/test_meal_service.py`.

Mobile snapshot before M1B1 selection:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; M1B1 made no mobile
  edits.

## Confirmed Facts

- M1A already removed capture-time auto-promotion; M1B1 did not change
  `smart_memory_capture_service.py`.
- The active backend typical-portion capture path lives in
  `app/services/meal_service.py`.
- Before M1B1, the capture helper used `list_history(..., limit_count=20)`.
- No active non-test callsite was found for review-correction capture, so the
  30-day review-correction window remains a later slice.

## Changes

Backend:

- Updated `app/services/meal_service.py`.
  - Replaced `SMART_MEMORY_CAPTURE_RECENT_MEAL_LIMIT = 20` with explicit
    `SMART_MEMORY_TYPICAL_PORTION_CAPTURE_WINDOW_DAYS = 21`.
  - Added an inclusive capture window helper anchored to saved meal `dayKey`.
    The window is reference day plus previous 20 days.
  - Replaced the single recent-count read with paginated
    `list_history(day_key_start=..., day_key_end=...)` reads.
  - Capture now requires the persisted result meal's canonical `dayKey`; it does
    not use wall-clock time.
- Updated `tests/test_meal_service.py`.
  - Added coverage that the helper calls `list_history` with the expected
    21-day `dayKey` window and follows pagination cursors.
  - Added coverage that a 22nd-day-old and a 31-day-old record are excluded by
    the query/window while day 0 and day 20 remain included.
  - Tightened duplicate retry coverage to prove pending Smart Memory capture
    replay uses the same saved-meal reference `dayKey`.

## QA History

- Worker `McClintock`: implemented the typical-portion window slice and ran
  focused plus full backend gates; verdict `pass`.
- Independent QA `Halley`: `pass_with_gaps`.
  - No blocking correctness finding.
  - P2 gap: tests mock `list_history`, so they prove parameters and pagination
    through the helper but do not execute the real Firestore day-key range query.
  - QA confirmed no old recent-20 helper/constant reference remains.

Controller accepted M1B1 as a partial M1 hardening step. Emulator/runtime query
evidence remains required before full M1 readiness.

## Verification

Controller focused M1B1:

- `pytest tests/test_meal_service.py -k "smart_memory_capture or smart_memory_capture_read or smart_memory_capture_window or typical_portion_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  - Result: `10 passed, 56 deselected`.
- `./.venv/bin/ruff check app/services/meal_service.py tests/test_meal_service.py`
  - Result: `All checks passed!`.
- `git diff --check`
  - Result: passed.

Controller backend gates:

- `pytest tests/test_meal_service.py`
  - Result: `66 passed`.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `python3 -m compileall app`
  - Result: passed.
- `./.venv/bin/ruff check .`
  - Result: `All checks passed!`.
- `pytest`
  - Result: `1312 passed, 36 skipped, 3 warnings`.

Independent QA verification:

- `env PYTHONDONTWRITEBYTECODE=1 ./.venv/bin/pytest -p no:cacheprovider tests/test_meal_service.py`
  - Result: `66 passed`.
- `env PYTHONDONTWRITEBYTECODE=1 ./.venv/bin/ruff check app/services/meal_service.py tests/test_meal_service.py`
  - Result: passed.
- `./.venv/bin/pyright app/services/meal_service.py tests/test_meal_service.py`
  - Result: `0 errors`.
- `git diff --check -- app/services/meal_service.py tests/test_meal_service.py`
  - Result: passed.

## Classification

M1B1 local typical-portion capture-window slice: `qa_passed`.

M1 full launch gate: `partial`.

Reason: typical-portion capture no longer uses the old last-20 semantic cap, but
full M1 still requires review-correction/suppression 30-day windows, emulator
runtime evidence for the Firestore day-key query, durable replay evidence,
source-delete/tombstone reactivation blocking, apply-disabled Review behavior,
and runtime telemetry evidence.

## Remaining M1 Gate Blockers

- Implement or explicitly block review-correction 30-day window once an active
  source/callsite exists.
- Implement suppression/preference 30-day semantics where those controls are
  activated.
- Run Firestore emulator evidence for the 21-day day-key window and cursor
  pagination path.
- Prove durable outbox replay remains idempotent across windowed capture with
  real persistence.
- Prove deleted sources and tombstones block reactivation across replay and new
  observations.
- Prove apply disabled produces zero Review influence.
- Prove Smart Memory runtime telemetry remains category-only.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest M1 slice: M1C source-delete/tombstone reactivation
blocking or emulator-backed window evidence, depending on local emulator
availability.

Acceptance criteria for the emulator-backed window option:

- Firestore emulator run creates meals inside and outside the 21-day window.
- The capture query only reads/counts day 0 through day 20.
- Candidate remains `candidate`, with zero active memory.
- Cursor pagination is exercised when the page size boundary is crossed.
- No production flags, provider credentials, or production data are used.

## Controller Decision

M1B1: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
