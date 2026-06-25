# M1E Smart Memory Suppressed-Subject Scan Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T13:33:32Z`

## Scope

M1E is the next smallest Smart Memory hardening slice after M1D. It addresses
the residual backend gap where capture-time suppression could miss legacy
`source_deleted` / `deleted_suppressed` Smart Memory items or candidates beyond
the old default `MAX_CAPTURE_CONTROL_DOCS=100` scan.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no mobile behavior change;
- no M2 controls or Review apply redesign;
- no expiration of user-delete or source-delete tombstones;
- no provider smoke, production data, credentials, Firebase, RevenueCat,
  Sentry, bundle ID, or package ID changes.

## Repo Snapshot

Backend before final M1E verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus M1E-relevant
  changes in `app/services/smart_memory_service.py` and
  `tests/test_smart_memory_service.py`.

Mobile snapshot during M1E:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; M1E made no mobile
  edits.

## Confirmed Facts

- The active backend capture path calls
  `smart_memory_service.list_suppressed_subject_keys(...)` before candidate
  evaluation/upsert.
- Before M1E, `list_suppressed_subject_keys()` defaulted to the bounded
  `MAX_CAPTURE_CONTROL_DOCS=100` stream for tombstones, items, and candidates.
  M1C preserved exact tombstone checks for current candidate subjects, but a
  legacy source-deleted-only item/candidate without a tombstone beyond the
  bounded list could still be missed.
- Repo evidence does not show a separate active transient Smart Memory
  preference/dismissal surface whose suppression should expire after 30 days.
  The active controls are permanent user mute/restore/delete, source-delete,
  global settings, tombstones, and capture-time subject suppression. Expiring
  delete/source-delete tombstones would conflict with source-delete/user-delete
  reactivation safety.

## Changes

Backend:

- Updated `app/services/smart_memory_service.py`.
  - Added `_stream_control_collection(...)` with an explicit `limit_count=None`
    unbounded mode.
  - `list_tombstone_subject_keys()` now accepts `limit_count: int | None` but
    keeps the previous bounded default for direct tombstone listing.
  - `list_suppressed_subject_keys()` now defaults to `limit_count=None`, so the
    capture suppression scan covers tombstones, suppressed/source-deleted items,
    and suppressed/source-deleted candidates without the old default cap.
  - Explicit `limit_count` calls remain bounded.
- Updated `tests/test_smart_memory_service.py`.
  - Existing suppressed-subject coverage now asserts the default scan does not
    call `limit()`.
  - Added regression coverage proving a legacy source-deleted item at index
    `MAX_CAPTURE_CONTROL_DOCS` is included by default.
  - Added coverage proving explicit `limit_count=2` still applies a bounded
    scan.

## QA

- Controller local worker pass implemented the backend suppression scan repair
  and regression tests.
- Independent QA attempt `Turing` did not complete. The subagent returned a
  usage-limit error before producing a report.
- Independent QA agent `Confucius` later returned `pass_with_gaps` for M1E/M1F.

QA reran:

- `./.venv/bin/pytest tests/test_smart_memory_service.py -k "suppressed_subject_keys or tombstone_subject_keys" -q`
  - Result: `4 passed, 44 deselected in 3.11s`.

QA findings:

- `list_suppressed_subject_keys()` defaults to unbounded control scans through
  `limit_count=None`.
- Explicit `limit_count` still bounds tombstones, items, and candidates.
- Direct `list_tombstone_subject_keys()` keeps its bounded default.
- No tombstone expiry / TTL / 30-day retention logic was found in the relevant
  Smart Memory service/tests.

## Verification

Controller focused M1E verification:

- `pytest tests/test_smart_memory_service.py -k "suppressed_subject_keys or tombstone_subject_keys or source_deleted_subject or read_export"`
  - Result: `12 passed, 36 deselected`.
- `pytest tests/test_meal_service.py -k "smart_memory_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  - Result: `8 passed, 59 deselected`.
- `pytest tests/test_smart_memory_capture_service.py`
  - Result: `37 passed`.
- `./.venv/bin/ruff check app/services/smart_memory_service.py tests/test_smart_memory_service.py`
  - Result: `All checks passed!`.
- `git diff --check`
  - Result: passed.

Controller backend gates:

- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `python3 -m compileall app`
  - Result: passed.
- `./.venv/bin/ruff check .`
  - Result: `All checks passed!`.
- `pytest`
  - Result: `1321 passed, 36 skipped, 3 warnings`.

## Classification

M1E local suppressed-subject bounded-list repair: `qa_passed_with_gaps`.

M1 full launch gate: `partial`.

Reason: capture-time suppressed-subject listing no longer silently misses
legacy source-deleted/suppressed records beyond the old default cap, and direct
tombstone checks remain intact. Full M1 still requires runtime telemetry
evidence and later M2 controls/apply gates. Smart Memory production flags must
stay off.

## Remaining M1 Gate Blockers

- Prove Smart Memory runtime telemetry remains category-only.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest slice: M1 runtime/emulator evidence for Smart Memory
window + suppression persistence paths.

Acceptance criteria:

- Firestore emulator or equivalent local runtime evidence exercises real
  Smart Memory capture history reads, tombstone/source-deleted suppression, and
  replay behavior without provider/prod access.
- Skipped emulator cases must be classified as environment gaps rather than
  pass evidence.
- No Review apply, Home Next Action, production flags, provider credentials,
  production data, or hidden fallback paths are introduced.

## Controller Decision

M1E: `qa_passed_with_gaps`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
