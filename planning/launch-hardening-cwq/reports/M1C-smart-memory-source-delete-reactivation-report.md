# M1C Smart Memory Source-Delete Reactivation Report

Status: `qa_passed`
Created: `2026-06-21T00:20:55Z`

## Scope

M1C is the next smallest Smart Memory hardening slice after M1B2. It closes a
backend capture/replay gap where typical-portion capture consulted exact
tombstones but did not also consult source-deleted or suppressed Smart Memory
items/candidates before evaluation.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no mobile UI/runtime behavior change;
- no M2 controls or Review apply work;
- no broad Smart Memory control pagination redesign;
- no Firebase, RevenueCat, Sentry, bundle/package ID, production data, provider
  smoke, or credential changes.

## Repo Snapshot

Backend before M1C controller verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state plus M1C changes in
  `app/services/meal_service.py`, `tests/test_meal_service.py`, and
  `tests/test_smart_memory_capture_service.py`.

Mobile snapshot before M1C selection:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state; M1C made no mobile
  edits.

## Confirmed Facts

- The active typical-portion capture path is backend-owned in
  `app/services/meal_service.py`.
- Before M1C, this path filtered exact tombstones for candidate subject keys but
  did not include source-deleted item/candidate suppression keys before
  candidate evaluation.
- `smart_memory_service.list_suppressed_subject_keys()` already returns
  tombstones, `deleted_suppressed`, and `source_deleted` item/candidate subject
  keys.
- Candidate upsert and promotion still have service-layer tombstone guards.

## Changes

Backend:

- Updated `app/services/meal_service.py`.
  - Typical-portion capture now preserves exact tombstone checks through
    `filter_existing_tombstone_subject_keys(...)`.
  - It also reads source-deleted/suppressed subjects through
    `list_suppressed_subject_keys(..., memory_type="typical_portion")`.
  - The exact tombstone and listed suppression keys are de-duped in order and
    passed to capture evaluation before any candidate upsert can run.
- Updated `tests/test_meal_service.py`.
  - Capture plumbing now asserts exact tombstone keys and listed source-deleted
    keys are both passed into capture evaluation.
  - Added replay coverage proving a source-deleted typical-portion subject
    blocks reactivation and `upsert_candidate` is not called.
- Updated `tests/test_smart_memory_capture_service.py`.
  - Added review-correction coverage proving a source-deleted ref cannot supply
    the third observation needed to satisfy the threshold.

## QA History

- Worker `Rawls`: found the production gap, implemented the backend capture
  repair and regression tests, and ran focused plus full backend gates.
- Independent QA `Pascal`: `pass_with_gaps`.
  - No blocking M1C correctness finding.
  - Raised a residual bounded-list risk in `list_suppressed_subject_keys()`.
- Controller repair:
  - Reintroduced/preserved exact tombstone lookup for current candidate subject
    keys and merged it with listed source-deleted/suppressed keys.
  - Re-ran focused and full backend gates.
- Re-QA `Bernoulli`: `pass_with_gaps`.
  - Confirmed exact tombstone protection is preserved and source-deleted
    suppression is covered before candidate upsert.
  - Remaining gap: legacy source-deleted-only records without tombstones beyond
    the bounded suppression list are not exhaustively proven.

Controller accepted M1C as a partial M1 hardening step. Full M1 readiness is not
claimed.

## Verification

Controller focused M1C after final repair:

- `pytest tests/test_meal_service.py -k "smart_memory_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  - Result: `8 passed, 59 deselected`.
- `pytest tests/test_smart_memory_capture_service.py`
  - Result: `37 passed`.
- `pytest tests/test_smart_memory_service.py -k "tombstone or source_deleted or source_delete or deleted_source_refs or suppressed_subject_keys or candidate_upsert_rejects_tombstoned or promote_candidate_rejects_tombstoned"`
  - Result: `13 passed, 33 deselected`.
- `pytest tests/test_meal_service.py`
  - Result: `67 passed`.
- `./.venv/bin/ruff check app/services/meal_service.py tests/test_meal_service.py tests/test_smart_memory_capture_service.py`
  - Result: `All checks passed!`.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `python3 -m compileall app`
  - Result: passed.
- `git diff --check`
  - Result: passed.

Controller backend gates:

- `pytest`
  - Result: `1319 passed, 36 skipped, 3 warnings`.
- `./.venv/bin/ruff check .`
  - Result: `All checks passed!`.

Independent QA verification:

- First QA reran a focused M1C subset:
  - Result: `14 passed`.
- Re-QA reran a focused M1C subset and an existing source-deleted candidate
  guard:
  - Result: `8 passed` plus `1 passed`.

## Classification

M1C local source-delete/tombstone reactivation slice: `qa_passed`.

M1 full launch gate: `partial`.

Reason: typical-portion capture/replay now consults exact tombstones plus
source-deleted/suppressed subjects before candidate evaluation/upsert, and
review-correction source-deleted refs cannot satisfy the threshold. Full M1
still requires suppression/preference 30-day semantics where applicable,
Firestore emulator/runtime evidence, apply-disabled Review behavior, and
runtime telemetry evidence.

## Remaining M1 Gate Blockers

- Implement or explicitly block suppression/preference 30-day semantics where
  those controls are activated.
- Run Firestore emulator evidence for Smart Memory window and persistence paths
  where real query/cursor paths exist.
- Prove apply disabled produces zero Review influence.
- Prove Smart Memory runtime telemetry remains category-only.
- Resolve or explicitly accept the residual legacy gap for source-deleted-only
  records without tombstones beyond the bounded suppression list.
- Keep Smart Memory production flags off until M1 and M2 gates pass.

## Next Slice Recommendation

Recommended next smallest M1 slice: apply-disabled Review behavior evidence.

Acceptance criteria:

- With Smart Memory apply disabled, Review does not consume active memory,
  candidates, or local projections for meal suggestions/explanations.
- Existing Smart Memory candidates/items remain visible only in gated management
  surfaces if those surfaces are explicitly enabled.
- Mobile/backend tests prove disabled apply produces zero Review influence.
- No Home Next Action integration is implemented before source domains pass
  their gates.
- No production flags, provider credentials, production data, or hidden fallback
  paths are introduced.

## Controller Decision

M1C: `pass`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
