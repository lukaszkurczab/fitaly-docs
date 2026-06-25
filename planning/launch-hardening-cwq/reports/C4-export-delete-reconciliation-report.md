# C4 Export, Delete and Data Reconciliation Report

Status: `qa_passed`
Completed slices: `C4A-no-silent-export-truncation`, `C4B-export-manifest-counts`, `C4C-delete-idempotency-and-top-level-cleanup`
C4A QA: `qa_passed`
C4B QA: `pass_with_gaps`; P3 smoke manifest extra-key repair completed locally
C4C QA: initial `fail`; rate limit and username top-level cleanup repairs completed; final re-QA `pass`
Created: `2026-06-20T16:16:18Z`
Last updated: `2026-06-20T16:50:41Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

C4 verifies that account export/delete covers user-owned records completely and
does not return silent partial success.

C4A addressed the confirmed bounded export truncation risk in Smart Memory and
Known Patterns. It did not close all of C4.

C4B added an export manifest/count contract and smoke evidence validation. It
did not close delete/idempotency/storage cleanup.

C4C closed local account delete idempotency, partial-state cleanup, and known
top-level user-owned cleanup for the current repo state.

Non-goals for C4:

- No production/provider smoke.
- No production credentials or production data.
- No production activation of new domains.
- No Home Next Action or feature-wave enablement.

## Pair Snapshot

Re-checked before C4 edits and verification:

- Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`

Dirty state:

- Backend dirty state includes intentional C1/C2/C3 changes plus C4 backend
  files listed below.
- Mobile dirty state includes intentional C1/C2/C3 changes plus C4B export
  contract and smoke-evidence files listed below.
- No unrelated dirty state was used as C4 evidence.

## Confirmed Repo Facts

- `app/services/smart_memory_service.py` previously used
  `MAX_EXPORT_COLLECTION_DOCS = 250` and `_read_limited_subcollection()` for
  Smart Memory export collections.
- That helper logged a warning when the bounded limit was reached but still
  returned a partial collection.
- `app/services/known_pattern_service.py` previously used
  `.limit(KNOWN_PATTERN_MAX_CONTROL_DOCS)` in `read_export()` for controls and
  mutation dedupe.
- Planned Meals export and the direct account subcollection export helpers
  already streamed their collections without an explicit export cap.
- Account export wraps Firestore/Google stream failures in
  `FirestoreServiceError`, so those failures remain fail-closed rather than
  partial success.
- Backend export response shape previously had no machine-checkable count
  manifest, and mobile smoke export counted only a subset of legacy/core
  sections.
- Account delete already deleted user-scoped subcollections, storage prefixes,
  telemetry by `userHash`, and AI runs by `userId`, but QA found two missing
  top-level user-owned surfaces during C4C:
  - `rate_limits/{uid}`;
  - `usernames/{normalizedUsername}` orphaned after partial prior delete when
    `users/{uid}` is already gone.

## C4A Implemented Changes

Backend:

- Replaced Smart Memory export reads with `_read_export_subcollection()` that
  streams all documents for:
  - `smartMemory`;
  - `smartMemoryCandidates`;
  - `smartMemorySettings`;
  - `smartMemoryTombstones`;
  - `smartMemoryMutationDedupe`.
- Removed the Smart Memory export-only 250 document cap and warning-only partial
  export behavior.
- Removed Known Patterns export caps for:
  - `knownPatternControls`;
  - `knownPatternMutationDedupe`.
- Kept non-export Known Patterns candidate-listing control cap unchanged.
- Preserved existing Smart Memory export filtering for deleted items and
  suppressed/non-candidate candidates.

Tests:

- Updated Smart Memory export filtering test to assert no export `.limit()` is
  used.
- Added Smart Memory boundary coverage for `0`, `1`, `249`, `250`, `251`, and
  `501` records across the formerly bounded export collections.
- Added Known Patterns boundary coverage for `0`, `1`, `249`, `250`, `251`, and
  `501` records across controls and mutation dedupe.

## C4A Verification Run

Controller verification:

- `./.venv/bin/pytest tests/test_smart_memory_service.py tests/test_known_pattern_service.py -q`
  - Result: `63 passed in 0.83s`.
- `./.venv/bin/pytest tests/test_smart_memory_service.py tests/test_known_pattern_service.py tests/test_user_account_service.py tests/test_api_users.py -q`
  - Result: `152 passed in 1.47s`.
- `ruff check .`
  - Result: `All checks passed!`
- `python3 -m compileall app`
  - Result: passed.
- `git diff --check`
  - Result: passed.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/pytest -q`
  - Result: `1239 passed, 35 skipped, 1 warning in 7.22s`.

Independent QA:

- Verdict: `pass`.
- QA verification:
  - `git diff --check`
    - Result: passed.
  - `env PYTHONDONTWRITEBYTECODE=1 ./.venv/bin/pytest -p no:cacheprovider tests/test_smart_memory_service.py::test_read_export_filters_deleted_items_and_suppressed_candidates tests/test_smart_memory_service.py::test_read_export_streams_all_export_collections_without_limit tests/test_known_pattern_service.py::test_read_export_streams_all_controls_and_dedupe_without_limit -q`
    - Result: `13 passed in 0.65s`.

## C4A Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Smart Memory export has no bounded silent truncation | passed locally | Service diff plus boundary tests for 0/1/249/250/251/501 records |
| Known Patterns export has no bounded silent truncation | passed locally | Service diff plus boundary tests for 0/1/249/250/251/501 records |
| Existing Smart Memory export filters remain intact | passed locally | Existing filter test updated and passed |
| Non-export Known Patterns list cap unchanged | passed locally | QA confirmed cap remains only in candidate listing |
| Firestore stream failures do not return partial account export | unchanged / passed by evidence | `user_account_service` still maps Firestore/Google stream failures to `FirestoreServiceError`; targeted account tests passed |

## C4B Implemented Changes

Backend:

- Added `UserExportManifest` to `UserExportResponse`.
- `exportManifest.schemaVersion` is `user-export-manifest-v1`.
- `exportManifest.recordCounts` is computed from the final `UserExportResponse`
  payload fields after route assembly.
- Count semantics:
  - list: `len(list)`;
  - `None`: `0`;
  - non-empty dict: `1`;
  - empty dict: `0`.
- Added API tests proving normal payload counts and empty / large section counts
  for `smartMemoryItems=251` and `knownPatternControls=501`.

Mobile:

- Updated `ExportedUserData` to include all backend export sections that were
  already returned by the API plus `exportManifest`.
- Corrected `ExportedUserData.profile` to `UserData | null` to match backend
  `profile: dict | None`.
- Updated profile export test fixture to include all export sections and
  manifest counts.
- Strengthened `scripts/verify-smoke-export.mjs` so smoke export:
  - requires all current top-level export sections;
  - requires `exportManifest`;
  - verifies every manifest count against the actual returned payload;
  - rejects unsupported extra `recordCounts` keys after QA found this P3 gap;
  - writes smoke summary counts from backend manifest.
- Updated `scripts/render-release-evidence.mjs` to print export manifest schema
  and selected new-domain counts.
- Added local release evidence script tests for manifest summary success, count
  mismatch failure, and unsupported count key failure.

## C4B Verification Run

Controller verification:

- `./.venv/bin/pytest tests/test_api_users.py::test_get_user_export_returns_backend_payload tests/test_api_users.py::test_get_user_export_manifest_counts_empty_and_large_sections -q`
  - Result: `2 passed`.
- `./.venv/bin/pytest tests/test_api_users.py tests/test_user_account_service.py tests/test_smart_memory_service.py tests/test_known_pattern_service.py -q`
  - Result: `153 passed in 4.12s`.
- `ruff check .`
  - Result: `All checks passed!`
- `python3 -m compileall app`
  - Result: passed.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/pytest -q`
  - Result: `1240 passed, 35 skipped, 1 warning in 8.53s`.
- Backend `git diff --check`
  - Result: passed.
- `npm test -- --runInBand --coverage=false src/services/user/profile.test.ts src/services/release/releaseEvidenceScripts.test.ts`
  - Result: `2 suites passed / 30 tests passed`.
  - Note: stderr includes expected negative-test script failures.
- `npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts`
  - Result after QA P3 repair: `1 suite passed / 13 tests passed`.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- Mobile `git diff --check`
  - Result: passed.

Independent QA:

- Verdict: `pass_with_gaps`.
- No blocking C4B correctness findings.
- QA reran backend export tests (`2 passed`) and mobile export/release tests
  (`2 suites passed / 30 tests passed`).
- QA P3 finding: mobile smoke accepted extra `recordCounts` keys not backed by
  returned payload sections.
- Repair: `verify-smoke-export.mjs` now rejects unsupported `recordCounts` keys;
  release evidence script test added and passed.

## C4B Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Export response includes manifest/count map | passed locally | `UserExportResponse.exportManifest`; API tests passed |
| Manifest counts are computed from returned payload | passed locally | Pydantic model validator computes counts after route assembly |
| Empty exports and >250 sections are counted | passed locally | API test covers `profile=None`, empty dict/list, `smartMemoryItems=251`, `knownPatternControls=501` |
| Mobile export contract includes manifest and current sections | passed locally | `ExportedUserData` and profile export test updated; typecheck passed |
| Smoke evidence verifies manifest counts against payload | passed locally | `verify-smoke-export.mjs` tests for success, mismatch failure, and extra-key failure |
| Forbidden raw provider payloads remain excluded | unchanged / covered by existing evidence | Existing export/emulator tests still passed; no provider payload fields added |

## C4C Implemented Changes

Backend:

- Added `_delete_rate_limit_state()` to delete `rate_limits/{user_id}` during
  self-service account delete.
- Added `_delete_username_reservations()` to delete all `usernames` documents
  where `uid == user_id`, and to keep the direct normalized username delete for
  the normal path when the username is still available from `users/{uid}`.
- Left global provider/operational collections out of account delete/export
  scope unless they are explicitly user-owned by current repo policy.

Tests:

- Expanded account delete unit coverage to assert:
  - top-level `rate_limits/{uid}` is deleted;
  - top-level `usernames` query uses `uid == user_id`;
  - partial prior delete with missing `users/{uid}` still removes residual
    user subcollections, telemetry, AI runs, rate limits, username reservation,
    and storage prefixes.
- Expanded Firestore emulator delete coverage to seed current/other
  `rate_limits` and `usernames` docs, call delete twice, and prove current-user
  data stays gone while other-user and anonymous records remain.

## C4C Verification Run

Controller verification:

- `./.venv/bin/pytest tests/test_user_account_service.py::test_delete_account_data_deletes_subcollections_username_and_user_doc tests/test_user_account_service.py::test_delete_account_data_cleans_partial_state_when_user_doc_is_missing -q`
  - Result: `2 passed`.
- `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' ./.venv/bin/pytest tests/test_user_account_service_firestore_emulator.py::test_delete_account_data_scopes_user_hash_telemetry_events -q`
  - Result after final username/rate-limit repair: `1 passed`.
- `./.venv/bin/pytest tests/test_user_account_service.py tests/test_api_users.py -q`
  - Result: `91 passed`.
- Same emulator env, `./.venv/bin/pytest tests/test_user_account_service_firestore_emulator.py -q`
  - Result: `2 passed`.
- `ruff check .`
  - Result: `All checks passed!`
- `python3 -m compileall app`
  - Result: passed.
- `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- `./.venv/bin/pytest -q`
  - Result: `1241 passed, 35 skipped, 1 warning in 5.56s`.
- Backend `git diff --check`
  - Result: passed.

Independent QA:

- First C4 final QA: `fail`; found missing `rate_limits/{uid}` top-level
  cleanup.
- First re-QA after rate-limit repair: `fail`; found possible orphan
  `usernames/{normalizedUsername}` reservation after partial prior delete.
- Final re-QA after username reservation repair: `pass`; no blocking findings.

## C4C Acceptance Criteria Status

| Criterion | Status | Evidence |
| --- | --- | --- |
| Delete rerun is idempotent | passed locally | Firestore emulator delete test calls `delete_account_data()` twice |
| Partial prior delete with missing user doc cleans remaining data | passed locally | Unit test covers residual subcollections, telemetry, AI runs, rate limit, username reservation, and storage prefixes |
| Current-user storage prefixes are deleted | passed locally | Unit/emulator tests assert `avatars/{uid}/`, `meals/{uid}/`, `mealTemplates/{uid}/` prefixes |
| Other-user / anonymous records are preserved | passed locally | Firestore emulator assertions for other user docs and anonymous telemetry |
| Top-level `userHash` / `userId` / `uid` records are cleaned | passed locally | Telemetry by `userHash`, AI runs by `userId`, rate limits by document ID, username reservations by `uid` |

## Remaining C4 Gaps

- Export manifest/count verification is implemented locally and passed targeted
  backend/mobile tests; live release evidence remains Q0.
- QA attack cases remain for record added during export, duplicate cursor
  timestamp, interrupted delete, and transient Firestore error on a later page.
- Live production/provider deletion evidence is not run in C4 and remains Q0 /
  owner-authorized evidence.
- C4 local gate is closed, but release readiness remains `NO_GO`.

## Stop Conditions

- Do not use production Firebase credentials or production data to close C4.
- Do not run provider/prod smoke without explicit owner authorization.
- Do not claim production account delete compliance from local emulator/unit
  evidence alone.
- Do not enable Smart Memory/Food Library/Recipe/Planning/Known Patterns/Home
  feature waves because of C4.

## Next Smallest P0 Slice

P1: Planning truthful nutrition and plan-to-meal lifecycle, unless the
controller chooses Q0 prep after additional repo evidence.

Acceptance criteria:

- Inspect Planning repo evidence before editing.
- Prove whether planned meals fabricate nutrition or lifecycle state.
- Keep new domains production-off unless their own gates pass.
