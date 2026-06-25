# M1B2 Smart Memory Review-Correction Window Report

Status: `qa_passed`
Created: `2026-06-20T23:55:35Z`

## Scope

M1B2 is the next smallest Smart Memory hardening slice after M1B1. It adds a
deterministic 30-day `dayKey` window to backend review-correction candidate
evaluation and capture.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no mobile UI/runtime behavior change;
- no new Review/apply callsite;
- no suppression/preference 30-day implementation;
- no M2 controls or Review apply work;
- no Firebase, RevenueCat, Sentry, bundle/package ID, production data, provider
  smoke, or credential changes.

## Repo Snapshot

Backend before M1B2 controller verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus M1B2 changes in
  `app/services/smart_memory_capture_service.py` and
  `tests/test_smart_memory_capture_service.py`.

Mobile snapshot before M1B2 controller verification:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; M1B2 made no mobile
  edits.

## Confirmed Facts

- M1 requires explicit Smart Memory time windows: review corrections must use a
  30-day window.
- Before M1B2, `evaluate_review_correction_candidate` counted all valid signals
  it received.
- No active non-test production callsite was found for
  `capture_review_correction_candidate_from_signals`; this slice hardens the
  domain evaluator/capture function before activation.
- M1A auto-promotion removal is pre-existing in the same target file and is not
  attributed to M1B2.

## Changes

Backend:

- Updated `app/services/smart_memory_capture_service.py`.
  - Added `REVIEW_CORRECTION_CAPTURE_WINDOW_DAYS = 30`.
  - Added optional `reference_day_key` to review-correction evaluation and
    capture.
  - Added deterministic windowing for review-correction signals: reference day
    plus previous 29 days, inclusive.
  - Default anchor is the latest valid signal `dayKey`; invalid explicit
    `reference_day_key` fails safe by counting no signals.
  - Strict `YYYY-MM-DD` parsing is used; no wall-clock fallback is introduced.
- Updated `tests/test_smart_memory_capture_service.py`.
  - Added day 0/day 29 inclusion and day 30/day 31 exclusion coverage.
  - Added coverage that old outside-window signals cannot satisfy the threshold.
  - Added default-anchor coverage.
  - Added invalid/missing `dayKey` and invalid reference-day safety coverage.

## QA History

- Worker `Fermat`: implemented the review-correction window slice and ran
  focused plus full backend gates; verdict `pass`.
- Independent QA `Plato`: `pass_with_gaps`.
  - No blocking correctness finding.
  - Confirmed M1B2 changes are intentional and M1A promotion-removal diff is
    pre-existing in the same file.
  - Remaining gap: no active non-test review-correction capture callsite and no
    runtime/outbox/emulator evidence for this path.

Controller accepted M1B2 as a partial M1 hardening step. Full M1 readiness is
not claimed.

## Verification

Controller focused M1B2:

- `pytest tests/test_smart_memory_capture_service.py`
  - Result: `36 passed`.
- `./.venv/bin/ruff check app/services/smart_memory_capture_service.py tests/test_smart_memory_capture_service.py`
  - Result: `All checks passed!`.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `python3 -m compileall app`
  - Result: passed.
- `git diff --check`
  - Result: passed.

Controller backend gates:

- `pytest`
  - Result: `1317 passed, 36 skipped, 3 warnings`.
- `./.venv/bin/ruff check .`
  - Result: `All checks passed!`.

Independent QA verification:

- `pytest -p no:cacheprovider tests/test_smart_memory_capture_service.py`
  - Result: `36 passed`.
- Focused review-correction subset
  - Result: `14 passed`.
- `ruff check app/services/smart_memory_capture_service.py tests/test_smart_memory_capture_service.py`
  - Result: passed.
- `pyright app/services/smart_memory_capture_service.py tests/test_smart_memory_capture_service.py`
  - Result: `0 errors`.
- `git diff --check -- app/services/smart_memory_capture_service.py tests/test_smart_memory_capture_service.py`
  - Result: passed.

## Classification

M1B2 local review-correction 30-day capture-window slice: `qa_passed`.

M1 full launch gate: `partial`.

Reason: review-correction candidate evaluation now has deterministic 30-day
window semantics, but full M1 still requires suppression/preference 30-day
semantics where applicable, emulator/runtime evidence, durable replay evidence,
source-delete/tombstone reactivation blocking, apply-disabled Review behavior,
and runtime telemetry evidence.

## Remaining M1 Gate Blockers

- Implement or explicitly block suppression/preference 30-day semantics where
  those controls are activated.
- Run Firestore emulator evidence for Smart Memory window behavior where real
  query/cursor paths exist.
- Prove durable outbox replay remains idempotent across Smart Memory capture
  with real persistence.
- Prove deleted sources and tombstones block reactivation across replay and new
  observations.
- Prove apply disabled produces zero Review influence.
- Prove Smart Memory runtime telemetry remains category-only.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest M1 slice: source-delete/tombstone reactivation
blocking evidence, because repo evidence already contains backend tombstone and
source-deleted suppression paths while suppression/preference-specific Smart
Memory capture code does not have an active callsite yet.

Acceptance criteria:

- Upserting a candidate with an existing tombstone for the same memory type and
  subject does not create an active or candidate suggestion.
- Promoting a candidate after a matching tombstone exists is rejected.
- Replayed typical-portion capture with matching source-deleted/tombstoned
  subjects remains candidate-free or suppressed.
- Source-deleted refs remain excluded from review-correction evaluation.
- No production flags, provider credentials, production data, or hidden fallback
  paths are introduced.

## Controller Decision

M1B2: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
