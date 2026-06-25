# K1B Known Patterns Alias and Overlap Report

Status: `QA_PASS`
Created: `2026-06-22T10:06:54Z`
Updated: `2026-06-22T10:22:31Z`
Controller: Codex

## Objective

Close the next local Known Patterns identity gap after K1A by adding bounded
PL/EN ingredient alias normalization and an explicit partial ingredient-overlap
threshold, while keeping Known Patterns production activation off.

## Scope

Repositories changed:

- Backend only: `fitaly-backend`

Files changed in this local worker slice:

- `app/services/known_pattern_service.py`
- `tests/test_known_pattern_service.py`

Non-goals:

- no mobile UI or Home Next Action integration;
- no production activation for Known Patterns;
- no runtime/provider/prod smoke;
- no Recipe Catalog, Food Library, Planning, or Smart Memory behavior changes;
- no migration of historical controls.

## Repo Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: pre-existing Q0/M2 release-hardening edits; K1B did not edit
  mobile.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: pre-existing R1/M2/K1 edits plus K1B edits in
  `app/services/known_pattern_service.py` and
  `tests/test_known_pattern_service.py`.

## Confirmed Facts

- K1A replaced weak `meal_type|normalized_name` grouping with a deterministic
  content signature.
- K1A left PL/EN alias equivalence and partial ingredient-overlap similarity
  unimplemented.
- `evaluate_known_pattern_candidates()` is the canonical backend candidate
  generation path; API, controls, and review draft flows derive candidates from
  this path.
- Known Patterns remains behind production-off feature gating.

## Behavior Before

- `Płatki owsiane` and `Oats` did not share an ingredient identity token.
- Meals with the same stable base ingredients but one bounded ingredient
  variation did not form a repeated-meal candidate unless the full signature
  matched exactly.
- There was no explicit overlap threshold in the rule implementation.

## Behavior After

- Ingredient identity now canonicalizes a small deterministic PL/EN alias set
  for common meal-history evidence terms such as oats, natural yogurt, bananas,
  apples, strawberries and berries.
- Content identity now uses a strict evidence-only ingredient parser and fails
  closed when any raw ingredient row is malformed, skipped, lacks a compatible
  `g`/`ml` unit, or lacks a positive amount.
- Exact content-signature groups are evaluated first, preserving the K1A path
  for exact candidates.
- Only exact groups that do not already qualify are eligible for partial
  overlap grouping.
- Existing non-expired controls are checked against the current subject hash
  and legacy exact subject hashes for each evidence item, so an old alias-form
  decline can still suppress the canonicalized K1B candidate.
- Partial overlap requires:
  - identical bucketed macro identity;
  - at least two shared ingredient identity tokens;
  - shared-token ratio of at least `2 / 3`.
- Insufficient overlap and macro drift fail closed.

## Tests Added/Changed

Added focused regressions for:

- PL/EN ingredient aliases grouping one candidate;
- bounded partial ingredient overlap grouping one candidate;
- insufficient overlap returning no candidate;
- macro-drifted partial overlap returning no candidate;
- malformed/skipped raw ingredient rows returning no candidate;
- legacy alias-form decline suppressing the canonicalized candidate;
- partial-overlap decline suppressing the current candidate.

Existing K1A tests remain in place for:

- same generic name with different content does not group;
- different names and reordered matching content can group;
- unquantified or partially unquantified content fails closed;
- controls, idempotent replay and review draft behavior.

## Commands Run

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py -q
```

Result: failed once during local development because threshold `0.67` excluded
exact `2 / 3` overlap; repaired by using `2 / 3`.

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py -q
```

Result before QA repair: passed, `25 passed in 0.64s`.

```bash
./.venv/bin/ruff check app/services/known_pattern_service.py tests/test_known_pattern_service.py
```

Result: passed.

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py tests/test_api_known_patterns.py -q
```

Result before QA repair: passed, `33 passed in 1.46s`.

```bash
./.venv/bin/pyright
```

Result: initially failed on a test-only `dict[str, int]` vs `dict[str, float]`
annotation; repaired. Final result: `0 errors, 0 warnings, 0 informations`.

```bash
./.venv/bin/ruff check .
```

Result: passed.

```bash
./.venv/bin/python -m compileall app
```

Result: passed.

```bash
./.venv/bin/pytest -q
```

Result before QA repair: passed, `1368 passed, 36 skipped, 3 warnings in 8.50s`.

```bash
git diff --check
```

Result: passed.

## Independent QA Attempt 1

Verdict: `QA_FAIL`.

Findings:

- `P1`: malformed raw ingredient rows could be skipped before identity
  validation, allowing a candidate from the remaining valid subset.
- `P2`: K1B changed alias/overlap semantics while retaining the K1A rule
  version, and there was no regression proving old alias-form declines still
  suppress canonicalized candidates.
- `P2`: no direct partial-overlap control/suppression regression.

## Repair

Repair timestamp: `2026-06-22T10:16:59Z`.

Changes:

- Added `_normalize_evidence_ingredients()` as a strict parser for candidate
  evidence. `_normalize_draft_ingredients()` remains isolated to review-draft
  materialization, while candidate identity now fails closed on malformed or
  skipped raw ingredient rows.
- Added legacy exact subject-hash checks to evaluated candidates so controls
  can suppress alias-canonicalized candidates when a pre-K1B exact alias-form
  subject was already declined.
- Kept `KNOWN_PATTERN_RULE_VERSION` at `known-pattern-v2-content-signature` as
  an in-version hardening policy, with suppression continuity encoded by legacy
  control hashes instead of introducing a new unsuppressed rule version.
- Added regressions for malformed/skipped raw ingredients, legacy alias decline
  suppression, and partial-overlap decline suppression.

Repair verification:

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py -q
```

Result: passed, `28 passed in 0.68s`.

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py tests/test_api_known_patterns.py -q
```

Result: passed, `36 passed in 1.41s`.

```bash
./.venv/bin/ruff check app/services/known_pattern_service.py tests/test_known_pattern_service.py
```

Result: passed.

```bash
./.venv/bin/pyright
```

Result: passed, `0 errors, 0 warnings, 0 informations`.

```bash
./.venv/bin/ruff check .
```

Result: passed.

```bash
./.venv/bin/python -m compileall app
```

Result: passed.

```bash
./.venv/bin/pytest -q
```

Result: passed, `1371 passed, 36 skipped, 3 warnings in 7.24s`.

Final P2 repair verification:

```bash
./.venv/bin/pytest tests/test_known_pattern_service.py tests/test_api_known_patterns.py -q
```

Result: passed, `36 passed in 3.29s`.

```bash
./.venv/bin/pyright
```

Result: passed, `0 errors, 0 warnings, 0 informations`.

```bash
./.venv/bin/ruff check app/services/known_pattern_service.py tests/test_known_pattern_service.py
```

Result: passed.

```bash
git diff --check -- app/services/known_pattern_service.py tests/test_known_pattern_service.py
```

Result: passed.

```bash
./.venv/bin/pytest -q
```

Result: passed, `1371 passed, 36 skipped, 3 warnings in 33.77s`.

## Independent QA Final

Final verdict: `QA_PASS`.

Final QA confirmed:

- the malformed/skipped raw ingredient regression now uses a fixed `now`, so it
  proves parser fail-closed behavior directly instead of relying on expiry;
- the previous `P1` and `P2` findings are resolved;
- no service-code delta occurred after the prior `QA_PASS_WITH_GAPS`;
- no mobile contract impact remains;
- no required repairs remain.

## Known Limitations

- The alias table is intentionally small and deterministic; it is not an
  approved production corpus or broad nutrition taxonomy.
- No mobile runtime or Maestro Known Patterns flow was run in K1B.
- No production/provider/credential-backed evidence was used.
- K1 remains feature-gate incomplete until runtime evidence and final rollout
  authorization exist.

## Risks Introduced

- Partial-overlap grouping may produce a candidate for meals that share a stable
  base and macro bucket while varying one ingredient. The risk is bounded by the
  two-token minimum, `2 / 3` overlap threshold, exact macro-bucket requirement,
  distinct-day/source-count requirements, and explicit review-draft confirmation
  flow.

## Controller Decision

K1B result: `QA_PASS`.

Known Patterns production flag must stay off. K1B does not change the current
overall release decision, which remains `BLOCKED_EXTERNAL_DEPENDENCY` until Q0
external evidence is available.
