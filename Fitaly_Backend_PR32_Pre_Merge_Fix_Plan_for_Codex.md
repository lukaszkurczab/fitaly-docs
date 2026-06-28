# Fitaly Backend PR #32 — Pre-Merge Fix Plan for Codex

**Repository:** `lukaszkurczab/fitaly-backend`  
**PR:** `#32` — `Codex/smart memory core loop be`  
**Branch:** `codex/smart-memory-core-loop-be` -> `main`  
**Status at review time:** open, mergeable, not draft  
**Reviewed scope:** Codex PR review comments + changed-file surface for Smart Memory Core Loop backend.

---

## 0. Executive verdict

Do **not** merge PR #32 until the issues below are fixed and verified.

Although Codex marked all review findings as `P2`, several are pre-merge risks because they affect:

- Firestore data integrity,
- race/concurrency safety,
- query correctness and cost,
- known-pattern suppression semantics,
- paired FE/BE contract validation,
- direct client SDK bypass of backend-managed meal side effects.

Treat this plan as a single pre-merge hardening pass. Do not expand scope into new product features.

---

## 1. Constraints for Codex

### 1.1 Scope control

Codex must only touch files needed to fix the issues listed in this document and their tests.

Allowed areas:

- `app/services/smart_memory_service.py`
- `app/services/food_library_service.py`
- `app/services/planned_meal_service.py`
- `app/services/known_pattern_service.py`
- `.github/workflows/ci.yml`
- `firestore.rules`
- `app/api/routes/food_library.py`
- directly related tests and fixtures
- `firestore.indexes.json` / `firestore.indexes.md` only if new Firestore queries require indexes

Do not introduce new API surfaces, new feature flags, or unrelated refactors.

### 1.2 Required verification style

Every fix must include or update tests. A code-only fix without a regression test is not acceptable unless the behavior can only be verified through emulator rules; in that case add/extend the emulator test.

Run, at minimum:

```bash
ruff check .
pyright
pytest -q
```

Then run narrower test groups listed under each task.

---

## 2. Fix BE-01 — Order Smart Memory queries before limiting

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `app/services/smart_memory_service.py`

### Problem

`/smart-memory/items` currently limits the Firestore stream before applying the local `updatedAt` sort. If a user has more Smart Memory items than `limit`, a recently updated item can be omitted simply because it was not in the unordered first batch returned by Firestore.

The same issue applies to Smart Memory candidates.

### Required fix

Change the Firestore query to order before limiting:

- query items with `order_by("updatedAt", direction=DESCENDING).limit(limit)` before streaming,
- apply the same pattern to candidates,
- keep the current API response shape unchanged,
- preserve existing behavior for empty/missing `updatedAt` as explicitly as possible.

If Firestore requires a composite index, update:

- `firestore.indexes.json`,
- `firestore.indexes.md`.

### Tests to add/update

Add a regression test where a user has more documents than `limit` and the newest `updatedAt` document would not be selected by unordered document ID order.

Suggested tests:

```bash
pytest -q tests/test_smart_memory_service.py tests/test_api_smart_memory.py
```

### Acceptance criteria

- `/smart-memory/items?limit=N` returns the top N by `updatedAt desc`.
- Candidate list uses the same ordering-before-limit principle.
- Test fails on old implementation and passes after the fix.

---

## 3. Fix BE-02 — Make ingredient product creation atomic

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `app/services/food_library_service.py`

### Problem

Concurrent create requests for the same `ingredientProductId` but different `clientMutationId`s can both observe the document as missing and both write. The later write wins instead of returning the intended `409 conflict`.

This violates idempotency/conflict semantics and can corrupt user food-library records under retry/concurrency.

### Required fix

Make existence check + insert atomic using one of the following:

- Firestore transaction, preferred if current project helpers already support it,
- create/precondition write that fails if the document already exists.

Required behavior:

- same `clientMutationId` retry remains idempotent,
- different `clientMutationId` for existing `ingredientProductId` returns conflict,
- no partial write if validation fails,
- no silent overwrite.

### Tests to add/update

Add a service-level test for conflict semantics. If practical, add a concurrency/race-shaped test using two create attempts for the same `ingredientProductId` with different mutation IDs.

Suggested tests:

```bash
pytest -q tests/test_food_library_service.py tests/test_food_library_service_firestore_emulator.py tests/test_api_food_library.py
```

### Acceptance criteria

- Existing product cannot be overwritten by a concurrent create.
- Conflicting create returns the same domain conflict used elsewhere.
- Idempotent retry still succeeds/returns the existing canonical record.

---

## 4. Fix BE-03 — Query planned meals by date before streaming

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `app/services/planned_meal_service.py`

### Problem

`GET /planned-meals` for a narrow 1-3 day window currently reads the entire `plannedMeals` subcollection and filters locally. For real users with historical plans, latency and Firestore read cost scale linearly with all historical records.

### Required fix

Push filtering into Firestore:

- use `dateBucket` range query before streaming,
- include only records inside requested window,
- only include deleted records when the endpoint/request explicitly asks for them,
- preserve current response ordering and schema.

If index changes are needed, update:

- `firestore.indexes.json`,
- `firestore.indexes.md`.

### Tests to add/update

Add a regression test with planned meals outside the requested date window and deleted records.

Suggested tests:

```bash
pytest -q tests/test_planned_meal_service.py tests/test_api_planned_meals.py
```

### Acceptance criteria

- Date filtering happens in Firestore query, not only after streaming.
- Deleted records are excluded by default.
- Date-window behavior remains stable for single-day and multi-day ranges.

---

## 5. Fix BE-04 — Preserve declined known-pattern controls

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `app/services/known_pattern_service.py`

### Problem

A stale or late `shown` / review-draft control request can overwrite an existing `state="declined"` known-pattern control because the current write uses unconditional `merge=False`.

Result: a user-dismissed known-pattern suggestion can reappear, breaking trust in the Memory/Known Pattern UX.

### Required fix

Make `declined` terminal until expiry or explicit allowed reset.

Required behavior:

- if existing control state is `declined`, ignore/reject non-decline transitions such as `shown`,
- do not overwrite decline metadata with stale `shown` events,
- keep expiry logic intact,
- preserve the existing public response contract.

Implementation options:

- read existing control before writing and preserve terminal decline,
- transaction if needed to avoid race between decline and stale shown event.

### Tests to add/update

Add regression tests:

1. candidate shown -> declined -> stale shown does not re-enable candidate,
2. declined candidate remains suppressed in `list_known_pattern_candidates`,
3. expiry behavior remains as designed.

Suggested tests:

```bash
pytest -q tests/test_known_pattern_service.py tests/test_api_known_patterns.py
```

### Acceptance criteria

- Declined controls are not overwritten by stale/non-decline transitions.
- Dismissed known-pattern candidates do not reappear before expiry.
- Tests cover the terminal-state behavior.

---

## 6. Fix BE-05 — Allow PR CI to test paired mobile contract refs

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `.github/workflows/ci.yml`

### Problem

The backend CI supports paired mobile contract refs via `workflow_call` / `workflow_dispatch`, but ordinary `pull_request` runs cannot provide those inputs. As a result, backend PRs that update contract fixtures together with a mobile branch still compare against mobile `main` and can fail until the mobile PR is merged.

This is directly relevant for the Smart Memory Core Loop FE/BE pair.

### Required fix

Make PR CI capable of resolving a paired mobile ref.

Acceptable options:

1. Parse PR body for a stable marker, e.g.

```md
mobile_contract_ref: <branch-or-40-char-sha>
```

2. Or parse a structured marker already used by the FE workflow if present.
3. Or add an explicit repository convention documented in `AGENTS.md` / workflow comments.

Required behavior:

- if PR body contains a mobile contract ref, use it,
- if not, fall back to mobile `main`,
- if exact SHA mode is requested in reusable/manual flow, enforce 40-character SHA,
- make logs explicit: print which mobile ref was used and why.

### Tests / validation

If existing shell helper exists, test it directly. If logic is embedded in YAML, factor it into a small script and test the script.

Suggested validation:

```bash
pytest -q tests/test_contract_alignment.py
```

Also validate workflow syntax if tooling exists in repo.

### Acceptance criteria

- Backend PR #32 can validate against paired mobile branch/ref before either PR is merged.
- Missing marker still defaults to mobile `main`.
- Invalid exact SHA fails only in exact-SHA mode.

---

## 7. Fix BE-06 — Block client SDK writes that bypass backend-managed meal side effects

**Priority:** pre-merge / release-blocking  
**Codex comment priority:** P2  
**Files:**

- `firestore.rules`
- possibly `app/schemas/meal.py`
- related Firestore emulator tests

### Problem

The backend now manages meal metadata and side effects, including planning conversion and Smart Memory outbox/cascade behavior. However, Firestore rules still allow owners to create/update/delete `/users/{userId}/meals/{mealId}` directly through the client SDK.

A client could therefore:

- write `planningSource` directly,
- delete a meal without planned-meal conversion side effects,
- bypass feature gates,
- leave planned meals or Smart Memory state stale.

This is more severe than a normal P2 because it breaks the architectural boundary: operations requiring backend side effects must be API-only or tightly restricted.

### Required fix

Update Firestore rules so client SDK writes cannot bypass backend-managed side effects.

Preferred direction:

- allow client reads as currently intended,
- restrict create/update/delete fields and operations that require backend side effects,
- reject direct client writes to fields such as `planningSource`, Smart Memory side-effect fields, outbox-related metadata, or any new backend-owned fields,
- consider making meal writes API-only if the mobile app has already moved to API for these operations.

Do not make rules overly broad in a way that breaks launch-critical reads.

### Tests to add/update

Add/extend Firestore rules emulator tests.

Suggested tests:

```bash
pytest -q tests/test_feedback_firestore_rules_emulator.py tests/test_meal_service_firestore_emulator.py tests/test_api_meals.py
```

Required cases:

- owner cannot directly create/update `planningSource` via SDK,
- owner cannot delete a meal directly if delete requires API side effects,
- allowed read path remains allowed,
- backend/API path remains unaffected in service tests.

### Acceptance criteria

- Backend-owned meal side-effect fields cannot be written through client SDK.
- Direct SDK operations cannot create stale planning/Smart Memory state.
- Emulator tests prove the rule boundary.

---

## 8. Fix BE-07 — Return stable 503 for ingredient product create failures

**Priority:** pre-merge  
**Codex comment priority:** P2  
**File:** `app/api/routes/food_library.py`

### Problem

When Firestore is unavailable, `create_user_ingredient_product` wraps the failure in `FirestoreServiceError`, but the create route catches only conflicts and `ValueError`. The global handler returns generic `500 Database error`, while sibling mutation endpoints map equivalent storage failures to a stable `503`.

### Required fix

Add the same `except FirestoreServiceError` mapping used by pull/update/delete endpoints.

Required behavior:

- create failure caused by Firestore/storage outage returns stable `503`,
- conflict remains `409`,
- validation remains `400` or existing validation status,
- response shape stays consistent with sibling food-library mutations.

### Tests to add/update

Add API route test with service mocked/forced to raise `FirestoreServiceError` on create.

Suggested tests:

```bash
pytest -q tests/test_api_food_library.py
```

### Acceptance criteria

- Create route returns 503 on FirestoreServiceError.
- Existing 409 and validation behavior remain unchanged.

---

## 9. Cross-repo integration checks after fixes

This backend PR is paired with FE PR #40. After implementing fixes, verify the pair intentionally.

### Backend-only checks

```bash
ruff check .
pyright
pytest -q
```

### Focused backend checks

```bash
pytest -q \
  tests/test_api_food_library.py \
  tests/test_food_library_service.py \
  tests/test_food_library_service_firestore_emulator.py \
  tests/test_smart_memory_service.py \
  tests/test_api_smart_memory.py \
  tests/test_planned_meal_service.py \
  tests/test_api_planned_meals.py \
  tests/test_known_pattern_service.py \
  tests/test_api_known_patterns.py \
  tests/test_api_meals.py \
  tests/test_meal_service_firestore_emulator.py \
  tests/test_contract_alignment.py
```

### Contract alignment

Update PR body or workflow input with the paired mobile ref:

```md
mobile_contract_ref: codex/smart-memory-core-loop-fe
```

If using SHA-locked release certification, use the exact FE commit SHA instead.

### Firestore index/rules validation

If queries/rules changed:

```bash
firebase emulators:exec --only firestore "pytest -q tests/*firestore*"
```

Adapt the exact command to the repo’s existing emulator workflow if different.

---

## 10. Merge gate

PR #32 may be considered merge-ready only when:

- all unresolved Codex review threads are fixed or explicitly rebutted with evidence,
- new tests cover every fixed behavior,
- full backend CI passes,
- contract alignment works against the paired FE branch/ref,
- Firestore rules prevent direct client bypass of backend-managed meal side effects,
- no new feature scope was added.

Recommended final PR comment after fixes:

```md
Pre-merge hardening completed.

Fixed:
- Smart Memory order-before-limit query behavior
- atomic ingredient product creation
- planned-meals date-window Firestore query
- terminal declined known-pattern controls
- paired mobile contract ref resolution in PR CI
- Firestore rules boundary for backend-managed meal side effects
- stable 503 mapping for food-library create storage failures

Validation:
- ruff check .
- pyright
- pytest -q
- focused service/API/rules tests listed in the fix plan
```

---

## 11. Non-goals

Do not address in this pass:

- new Smart Memory UX behavior,
- new known-pattern ranking logic,
- new Recipe Catalog capability,
- FE changes except through contract-ref coordination,
- production rollout decisions,
- telemetry taxonomy redesign.

This pass is strictly for backend correctness, data integrity, release-gate reliability, and cross-repo contract alignment before merge.
