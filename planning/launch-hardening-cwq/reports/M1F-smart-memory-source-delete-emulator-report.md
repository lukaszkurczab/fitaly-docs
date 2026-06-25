# M1F Smart Memory Source-Delete Emulator Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T13:46:02Z`

## Scope

M1F records local Firestore emulator evidence for the Smart Memory
source-delete runtime path: creating a real typical-portion candidate from
saved meals, deleting one of the source meals, marking the candidate
`source_deleted`, keeping active `smartMemory` empty in shadow mode, and
writing a source-delete tombstone.

Non-goals:

- no full M1 readiness claim;
- no Smart Memory production activation;
- no provider smoke, production data, credentials, Firebase, RevenueCat,
  Sentry, bundle ID, or package ID changes;
- no mobile runtime/Maestro claim;
- no Review apply or M2 control-surface change;
- no telemetry runtime claim.

## Repo Snapshot

Backend before M1F verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state. M1F made no backend
  code edits.

Mobile snapshot during M1F:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state. M1F made no mobile
  code edits.

## Confirmed Facts

- `tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted`
  is an existing emulator-backed test for the M1 source-delete risk.
- The test enables backend Smart Memory capture/apply settings locally, writes
  three meals through the real meal service into Firestore emulator state,
  observes one typical-portion candidate, deletes one source meal, and verifies:
  - candidate state becomes `source_deleted`;
  - candidate `suppressionChecks.sourceDeleted` is `True`;
  - no active `smartMemory` item exists in shadow mode;
  - at least one tombstone has `reasonCode == "source_deleted"`.
- The repo wrapper `scripts/run-emulator-evidence.sh` currently auto-sets
  `GOOGLE_APPLICATION_CREDENTIALS=service-account.json` when that file exists.
  Because the launch-hardening rules forbid credential use without owner
  authorization, the controller did not use that wrapper for M1F evidence.
- A local Java process was already listening on `127.0.0.1:8080`, and
  `curl -sS http://127.0.0.1:8080` returned `Ok`, consistent with an already
  running local Firestore emulator.

## Changes

No code changes.

Documentation only:

- Added this report.
- Updated the packet register and release-hardening status docs to record M1F
  evidence and remaining blockers.

## Verification

Credential-safety blocked wrapper attempt:

- `env EVIDENCE_EMULATORS_PYTEST_CMD=./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q npm run evidence:emulators`
  - Result: sandbox reviewer rejected the command because the repo wrapper
    auto-loads local `service-account.json` if present.
  - Classification: safety blocker for that wrapper path, not a pytest
    failure.

Firestore-only emulator start attempt:

- `env FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= FIREBASE_CLI_DISABLE_UPDATE_NOTIFIER=true firebase emulators:exec --only firestore --project demo-fitaly-local './.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q'`
  - Result: command exited `1` because Firestore emulator port `8080` was
    already taken.
  - Classification: environment state, not a pytest failure.

Local emulator identity checks:

- `lsof -nP -iTCP:8080 -sTCP:LISTEN`
  - Result: `java` process `78201` listening on `127.0.0.1:8080`.
- `curl -sS http://127.0.0.1:8080`
  - Result: `Ok`.

Focused M1F emulator evidence:

- `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q`
  - Result: `1 passed in 2.49s`.

Skip behavior without emulator env:

- `env FIRESTORE_EMULATOR_HOST= FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q`
  - Result: `1 skipped in 1.31s`.

## QA

Independent QA agent `Confucius` returned `pass_with_gaps`.

QA reran:

- `./.venv/bin/pytest tests/test_smart_memory_service.py -k "suppressed_subject_keys or tombstone_subject_keys" -q`
  - Result: `4 passed, 44 deselected in 3.11s`.
- `./.venv/bin/python -c "import socket; s=socket.create_connection(('127.0.0.1', 8080), 1.0); s.close(); print('reachable')"`
  - Result: `reachable`.
- `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q`
  - Result: `1 passed in 2.47s`.

QA findings:

- M1E implementation is correct for the scoped claim:
  `list_suppressed_subject_keys()` defaults to unbounded control scans and
  explicit `limit_count` remains bounded.
- Direct `list_tombstone_subject_keys()` keeps its bounded default.
- No tombstone expiry / TTL / 30-day retention logic was found in the relevant
  Smart Memory service/tests.
- M1F source-delete runtime evidence passed against the already-running local
  Firestore emulator with credential env vars explicitly empty.

## Classification

M1F local source-delete emulator evidence: `qa_passed_with_gaps`.

M1 full launch gate: `partial`.

Reason: the source-delete candidate suppression/tombstone path now has real
Firestore emulator evidence for the existing backend runtime path. Full M1
still requires runtime telemetry evidence and later M2 controls/apply gates.
Smart Memory production flags must stay off.

## Remaining M1 Gate Blockers

- Prove Smart Memory runtime telemetry remains category-only.
- Keep Smart Memory production flags off until M1 and M2 gates pass.
- The repo-owned broad emulator wrapper still needs a future safety repair
  before it can be used without explicit owner authorization, because it
  auto-loads local `service-account.json`.

## Next Slice Recommendation

Recommended next smallest slice: M1G Smart Memory runtime telemetry evidence.

Acceptance criteria:

- Identify active Smart Memory runtime telemetry callsites, or prove no active
  callsite exists while the feature remains production-off.
- If adding or wiring telemetry, only emit C5-approved category/enumeration
  props; no raw meal names, ingredient names, notes, IDs, prompts, responses,
  images, source refs, nutrition values, or full payloads.
- Run targeted mobile/backend telemetry contract tests and any focused runtime
  test for the active callsite.
- Do not activate Smart Memory production flags, Review apply, Home Next
  Action, provider smoke, production data, or hidden fallback paths.

## Controller Decision

M1F: `qa_passed_with_gaps`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
