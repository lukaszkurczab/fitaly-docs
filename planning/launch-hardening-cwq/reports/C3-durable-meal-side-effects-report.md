# C3 Durable Meal Side Effects / Transactional Outbox Report

Status: `qa_passed`
Created: `2026-06-20T15:48:39Z`
Last updated: `2026-06-20T16:01:54Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

C3 addressed the P0 risk that meal upsert/delete could commit the primary meal
mutation and then fail or drift because downstream streak / Smart Memory side
effects ran synchronously after commit.

Non-goals:

- No production/provider smoke.
- No production credentials or production data.
- No activation of new domains in production.
- No Home Next Action work.
- No Recipe / Planning / Known Pattern / Smart Memory feature-wave enablement.

## Pair Snapshot

Re-checked before C3 edits and verification:

- Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

Dirty state:

- Backend dirty state includes intentional C1/C2 changes plus C3 backend files
  listed below.
- Mobile dirty state includes intentional C1/C2 changes plus the C3 export
  contract pairing files listed below.
- No unrelated dirty state was used as evidence for C3.

## Confirmed Repo Facts

- `app/services/meal_service.py` previously wrote meal mutation and mutation
  dedupe transactionally, then ran streak / Smart Memory side effects after the
  primary commit.
- A side-effect exception after commit could therefore make the caller observe a
  failure despite the primary meal mutation being committed.
- Duplicate mutation replay previously returned the dedupe result and did not
  durably repair skipped side effects.
- Account export/delete needed to include the new outbox collection once C3
  introduced it.
- Mobile export type/tests needed to accept the backend export field.

## Implemented Changes

Backend:

- Added `MEAL_EFFECT_OUTBOX_SUBCOLLECTION = "mealEffectOutbox"` in
  `app/core/firestore_constants.py`.
- Added `app/services/meal_effect_outbox_service.py` for deterministic durable
  outbox rows:
  - event kinds: `meal_saved.streak_sync`,
    `meal_saved.smart_memory_capture`, `meal_deleted.streak_sync`,
    `meal_deleted.smart_memory_source_delete`;
  - deterministic event IDs from `sourceMutationId + kind`;
  - `pending`, `succeeded`, and `dead_letter` states;
  - retry backoff and dead-letter threshold;
  - claim/lease fields and token-checked terminal updates.
- Updated `app/services/meal_service.py` so meal upsert/delete writes outbox
  events in the same Firestore transaction as the primary mutation and dedupe
  record.
- Added best-effort post-commit outbox processing; failures are recorded on the
  event and do not fail the primary meal response.
- Duplicate mutation replay now loads deterministic outbox events and attempts
  due pending repair without creating another meal or outbox row.
- Runtime-disabled Smart Memory effects now record explicit retryable failures
  instead of silently skipping pending events.
- Added `reconcile_pending_meal_effects()` and
  `scripts/reconcile_meal_effect_outbox.py` for operator reconciliation.
- Added account export/delete coverage for `mealEffectOutbox` in
  `app/services/user_account_service.py`, `app/schemas/user_account.py`, and
  `app/api/routes/users.py`.
- Added Firestore index config for the reconciliation query:
  `mealEffectOutbox(status ASC, nextAttemptAt ASC)`.

Mobile:

- Updated `src/types/user.ts` and `src/services/user/profile.test.ts` so mobile
  export contract accepts `mealEffectOutbox`.

Tests:

- Added `tests/test_meal_effect_outbox_service.py`.
- Expanded `tests/test_meal_service.py` for:
  - commit succeeds / effect fails;
  - duplicate retry repairs due pending streak and Smart Memory effects;
  - dead-letter/backoff behavior;
  - disabled feature flags become observable retryable failures;
  - claim/lease prevents a stale second processor from re-running the effect in
    mocked sequential coverage.
- Expanded account export/delete tests and API export tests for
  `mealEffectOutbox`.
- Updated skip-gated emulator export coverage to match the current export tuple
  shape and include `mealEffectOutbox`.
- Added a skip-gated Firestore emulator test for transactional outbox claim,
  active-lease exclusion, success finalization, and stale failure finalization
  refusal.
- Added a Firestore emulator concurrent-claim test with two worker clients and
  a thread barrier.
- Added direct unit coverage for effect success followed by outbox status-update
  failure returning `status_update_failed`.
- Added emulator delete coverage for `mealEffectOutbox` current-user deletion
  and other-user preservation.

## Verification Run

Backend verification after final C3 repair:

- `pytest tests/test_meal_effect_outbox_service.py tests/test_meal_service.py tests/test_user_account_service.py tests/test_api_users.py -q`
  - Result: `148 passed in 3.09s`.
- `python3 -c "import json; json.load(open('firestore.indexes.json')); print('ok')"`
  - Result: `ok`.
- `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py tests/test_user_account_service_firestore_emulator.py -q`
  - Result: `6 passed in 6.28s`.
  - Note: Firestore emulator was already running locally on `127.0.0.1:8080`;
    storage is mocked by the account export/delete emulator file, but its skip
    gate requires `FIREBASE_STORAGE_EMULATOR_HOST`.
- `ruff check .`
  - Result: `All checks passed!`
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `pytest`
  - Result: `1227 passed, 35 skipped, 1 warning in 6.40s`.
- `python3 -m compileall app`
  - Result: passed.
- `python3 -m py_compile scripts/reconcile_meal_effect_outbox.py`
  - Result: passed.
- `git diff --check`
  - Result: passed.

Mobile verification for the paired export contract:

- `npm test -- --runInBand --coverage=false src/services/user/profile.test.ts`
  - Result: `18 passed`.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `git diff --check`
  - Result: passed.

## QA Summary

Independent QA progression:

- First C3 QA: `pass_with_gaps`; sequential core was coherent, but dead-letter,
  claim/lease, and emulator coverage were missing.
- Second C3 QA: `pass_with_gaps`; disabled-flag processing and due-query
  robustness still had issues.
- Third C3 QA: `fail` for strict C3 acceptance; claim/lease monotonicity and
  emulator export contract were blocking.
- Final C3D QA: `pass_with_gaps`; previous P1 issues were closed logically,
  but emulator execution and true concurrent Firestore contention evidence
  remain missing locally.
- C3E QA: `pass_with_gaps`; index repair was accepted and the emulator tests
  were available, but local emulator execution still had to be run.
- Final C3 QA repair: `pass`; direct status-update-failure coverage and
  emulator delete coverage for `mealEffectOutbox` were verified.

## Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Injected streak failure does not lose meal response | passed locally | `tests/test_meal_service.py`; targeted and full pytest passed |
| Outbox remains pending after effect failure | passed locally | `tests/test_meal_service.py`, `tests/test_meal_effect_outbox_service.py` |
| Retry closes streak without duplicate primary write | passed locally | duplicate replay tests; due retry uses deterministic event IDs |
| Injected memory capture failure does not duplicate primary meal/outbox | passed locally | Smart Memory retry tests and deterministic outbox IDs |
| Delete meal with Smart Memory cleanup failure still returns deleted meal | passed locally | delete source failure test |
| Reconciliation path exists | passed locally | `reconcile_pending_meal_effects()` and `scripts/reconcile_meal_effect_outbox.py` compile |
| Duplicate client mutation does not create another meal/outbox row | passed locally | duplicate replay tests |
| Outbox is covered by account delete/export policy | passed locally | unit/API tests plus emulator export/delete tests |
| Retry/backoff/dead-letter exists | passed locally | outbox service tests |
| Concurrent retry / two workers same event | passed locally | token-checked claim/lease unit tests plus two-client Firestore emulator race test |
| Firestore index for reconciliation query | passed locally | `firestore.indexes.json` parses and includes `mealEffectOutbox(status,nextAttemptAt)` |

## Remaining Gaps

- A process crash after side-effect success but before `mark_succeeded()` still
  means the event may retry after lease expiry. This is explicit and observable,
  and the local C3 gate covers stale finalization and status-update failure.
- Production/deployed Firestore index availability was not verified. Only local
  `firestore.indexes.json` was updated.
- Full all-emulator suite still has broader skipped tests in normal `pytest`
  runs unless emulator env is set; C3-specific emulator target was executed.

## Stop Conditions

- Do not use production Firebase credentials or production data to close C3.
- Do not run provider/prod smoke without explicit owner authorization.
- Do not enable Smart Memory/Food Library/Recipe/Planning/Known Patterns/Home
  feature waves because of this C3 work.

## Next Smallest P0 Slice

C4: Complete export, delete and data reconciliation.

Acceptance criteria:

- Inspect export/delete coverage now that C3 introduced `mealEffectOutbox`.
- Prove export does not silently truncate bounded user data.
- Prove account delete covers current known user-owned subcollections and does
  not delete other-user/provider/anonymous data.
- Include emulator evidence where repo tests already support it.
- Keep new domains production-off unless their own gates pass.
