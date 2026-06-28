# Fitaly PR #40 — Pre-merge Fix Plan for Codex

**Repo:** `lukaszkurczab/fitaly`  
**Branch:** `codex/smart-memory-core-loop-fe`  
**PR:** `#40` — `Codex/smart memory core loop fe`  
**Target:** `main`  
**Status:** pre-merge repair plan  
**Generated:** 2026-06-28

---

## 0. Objective

Fix the unresolved PR review findings and perform a strict pre-merge hardening pass before merging PR #40.

This PR is large and cross-cutting. Treat it as a release-risk integration PR, not a normal feature PR. The goal is not to add more product scope. The goal is to make the current branch safe to merge by ensuring:

1. release-gate E2E actually exercises the intended gated features,
2. release-candidate workflow points to a reachable backend or a correctly provisioned local backend,
3. Android local E2E supports emulator networking correctly,
4. existing meal drafts are not overwritten by Recipe Catalog review flow,
5. planned meal drafts with valid aggregate nutrition are not incorrectly blocked from saving,
6. all fixes are covered by focused tests or deterministic script validation.

---

## 1. Non-negotiable merge rule

Do not merge this PR until all P1 items are fixed and verified.

P2 items should also be fixed before merge unless they are explicitly documented as deferred with a clear reason. In this PR they are cheap enough and test-infrastructure-related enough that they should be fixed now.

---

## 2. Known unresolved review findings

### P1-A — Release-gate harness does not enable Home Next Action / Recipe Catalog flags

**File:** `scripts/run-e2e-local.sh`  
**Review finding:** release-gate flows such as `home-next-action-*.yaml` and `recipe-catalog-review-draft.yaml` are included, but the local E2E harness does not export:

- `EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION=true`
- `EXPO_PUBLIC_ENABLE_RECIPE_CATALOG=true`

Both default to false in app config. As a result, tests can time out or avoid exercising the intended surfaces.

#### Required fix

Update `scripts/run-e2e-local.sh` so it detects relevant flows and exports the correct runtime flags.

At minimum:

- For every `home-next-action-*.yaml` release-gate flow:
  - set `EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION=true`.
- For `home-next-action-planned-item.yaml`:
  - also set `EXPO_PUBLIC_ENABLE_PLANNING=true` if the flow depends on planning data.
- For `home-next-action-known-pattern.yaml`:
  - also set `EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS=true` and `EXPO_PUBLIC_ENABLE_SMART_MEMORY=true` if the UI/data path requires Smart Memory-backed known patterns.
- For `home-next-action-review-draft.yaml`:
  - ensure the draft fixture path and any needed review/memory flags are enabled deliberately, not accidentally.
- For `recipe-catalog-review-draft.yaml`:
  - set `EXPO_PUBLIC_ENABLE_RECIPE_CATALOG=true`.

#### Guardrails

- Do not globally enable all C2 flags for every release-gate run.
- Keep feature enablement flow-specific.
- Do not change production defaults in `app.config.js` to make tests pass.

#### Validation

Add or update tests around E2E config/flag resolution if such test coverage already exists. If there is no test harness for `run-e2e-local.sh`, add a lightweight deterministic script/unit validation or shellcheck-style assertion that verifies expected env exports per flow name.

Manual validation commands:

```bash
npm run test -- --runInBand
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/home-next-action-known-pattern.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/recipe-catalog-review-draft.yaml
```

If the exact command syntax differs, use the repository’s canonical E2E invocation and document the actual command in the final worker summary.

---

### P1-B — Smart Memory review flows do not enable core Smart Memory flag

**File:** `scripts/run-e2e-local.sh`  
**Review finding:** flows such as:

- `review-memory-explanation.yaml`
- `review-memory-new-candidate-row.yaml`
- `smart-memory-backend-pull.yaml`

only enable secondary flags or flow markers, while `EXPO_PUBLIC_ENABLE_SMART_MEMORY` remains false. `ReviewMealScreen` and `UserProfileScreen` gate Smart Memory surfaces on the core flag, so the release-gate flows do not validate the intended behavior.

#### Required fix

Update `scripts/run-e2e-local.sh` so Smart Memory-specific flows always export:

```bash
EXPO_PUBLIC_ENABLE_SMART_MEMORY=true
```

For `review-memory-explanation.yaml`, also ensure:

```bash
EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION=true
```

For known-pattern or backend-pull flows, enable only the dependent flags required by that flow.

#### Guardrails

- Do not enable Smart Memory for unrelated launch/core flows.
- Do not rely on hidden default state or stale `.env` values.
- The script should be deterministic from the selected flow/suite.

#### Validation

Run focused Smart Memory release-gate flows and confirm they render the expected testIDs/surfaces:

- `review-memory-explanation`
- `review-memory-new-candidate-row`
- `smart-memory-backend-pull`
- `memory-center-controls` if the flow depends on account row visibility

---

### P1-C — Release Candidate E2E points at unreachable backend

**File:** `.github/workflows/release-candidate.yml`  
**Review finding:** RC workflow forces:

```yaml
E2E_API_BASE_URL: http://127.0.0.1:9
E2E_SKIP_API_HEALTH: "1"
```

This makes `scripts/run-e2e-local.sh` treat the run as local-backend E2E, but the workflow does not start/configure a reachable backend and does not export Firebase emulator env vars. On a clean self-hosted runner, the job can fail before the core gate or exercise the app against no backend.

#### Required fix

Choose one of the following approaches. Prefer **Option A** for release-candidate certification unless there is an explicit requirement to run RC against local backend.

#### Option A — Use real reachable smoke / staging backend for RC

- Replace `http://127.0.0.1:9` with a real reachable API URL.
- Remove `E2E_SKIP_API_HEALTH: "1"` unless there is a documented reason.
- Keep API health check enabled for RC.
- Ensure the backend URL corresponds to the exact backend SHA passed into `backend_commit_sha`, or document why the release pair is contract-only rather than deployment-bound.

Expected env shape:

```yaml
E2E_API_BASE_URL: ${{ secrets.RELEASE_E2E_API_BASE_URL }}
E2E_SKIP_API_HEALTH: "0"
```

Use repository secret naming consistent with existing smoke workflow conventions.

#### Option B — Provision local backend/emulators inside the RC job

If RC must run against local backend:

- checkout `fitaly-backend` at `backend_commit_sha`,
- install backend dependencies,
- start the backend in background,
- start/configure Firebase emulators or export required emulator env vars,
- wait for backend readiness,
- use a reachable host URL,
- keep health check enabled after the backend starts.

Do not use `127.0.0.1:9` as a fake sink endpoint.

#### Guardrails

- Do not silently skip API health in release-candidate certification.
- Do not point mobile E2E at an unreachable backend.
- Do not make the RC workflow pass by avoiding backend-dependent assertions.

#### Validation

Run or dry-run the RC workflow path enough to prove:

- backend URL is reachable from the runner,
- health check runs and passes,
- core release gate E2E starts with correct API env,
- release evidence artifact includes the backend SHA and actual environment.

---

### P2-A — Android local E2E must treat `10.0.2.2` as local backend

**File:** `scripts/run-e2e-local.sh`  
**Review finding:** Android emulator cannot reach host backend through `127.0.0.1` / `localhost`; it needs `10.0.2.2`. The harness currently rejects `http://10.0.2.2:<port>` as local, even though that is the correct emulator host bridge.

#### Required fix

Update local backend URL detection so these are treated as local-host-backed E2E:

- `http://127.0.0.1:<port>`
- `http://localhost:<port>`
- `http://10.0.2.2:<port>` for Android emulator

Expected behavior:

- For Android app runtime, export `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:<port>`.
- For host-side seeding/preflight scripts, still recognize this as local and use host/emulator env correctly.
- Do not convert `10.0.2.2` to `127.0.0.1` inside the app runtime env.

#### Validation

Add focused tests or script assertions for URL classification:

- iOS/local: `http://127.0.0.1:8000` accepted as local.
- Android/local: `http://10.0.2.2:8000` accepted as local.
- Remote: `https://example.com` not treated as local.

Run at least one Android local-backend flow if available.

---

### P2-B — Planned meal aggregate totals must count before blocking save

**File:** `src/feature/Meals/screens/MealAdd/ReviewMealScreen.tsx`  
**Review finding:** planned meal drafts can contain ingredient rows with zero per-ingredient macros while the valid positive nutrition estimate is stored in `meal.totals`. Current save validation uses `calculateTotalNutrients`; that only falls back to totals when the ingredient array is empty. Valid planned meals can therefore be blocked incorrectly.

#### Required fix

Change the save-blocking nutrition check so planning drafts with valid aggregate totals are accepted.

Implementation direction:

- Identify the save validation branch in `ReviewMealScreen.tsx` around nutrition-free blocking.
- If the meal/review draft originates from planning, check `meal.totals` directly before blocking.
- More generally, if summed ingredient nutrients are all zero but `meal.totals` contains positive kcal or macro values, treat the draft as nutritionally valid.
- Keep existing blocking behavior for genuinely empty / zero-nutrition meals.

Suggested utility shape:

```ts
function hasPositiveNutrition(value: NutritionTotals | undefined | null): boolean {
  return Boolean(
    value &&
      ((value.kcal ?? 0) > 0 ||
        (value.protein ?? 0) > 0 ||
        (value.carbs ?? 0) > 0 ||
        (value.fat ?? 0) > 0)
  );
}
```

Then use a resolved validation total:

```ts
const summedTotals = calculateTotalNutrients(meal.ingredients);
const aggregateTotals = meal.totals;
const hasValidNutrition =
  hasPositiveNutrition(summedTotals) || hasPositiveNutrition(aggregateTotals);
```

Adapt names to actual code.

#### Guardrails

- Do not allow saving completely empty meals.
- Do not remove user-facing validation entirely.
- Do not special-case only one fixture; handle the domain shape.

#### Tests

Add/update `ReviewMealScreen.test.tsx` or a lower-level utility test:

1. planned draft with ingredient rows + zero ingredient macros + positive `meal.totals` can save,
2. planned draft with ingredient rows + zero ingredient macros + zero/missing totals remains blocked,
3. normal manual/AI meal behavior remains unchanged.

---

### P1-D — Recipe review overwrites active meal draft

**File:** `src/feature/Recipes/screens/RecipeCatalogScreen.tsx`  
**Review finding:** starting Recipe Catalog → Review writes `current_meal_draft_${uid}` unconditionally. If the user already has an unsaved meal draft, it is overwritten. If navigation or `setLastScreen` fails, the catch can remove the newly written draft as well. This can cause data loss.

#### Required fix

Before calling `saveDraft` from Recipe Catalog review:

1. check whether `current_meal_draft_${uid}` exists,
2. determine whether it is meaningful/non-empty,
3. if meaningful, show the same resume/discard decision pattern used elsewhere in meal draft flow,
4. only overwrite after explicit discard confirmation,
5. if the recipe review setup fails after writing, restore the previous draft or avoid deleting unrelated previous state.

Preferred implementation:

- Reuse existing draft conflict/resume/discard logic if already present in Meal Add flow.
- Extract shared draft conflict handling if needed, but keep the change focused.
- Ensure Recipe Catalog does not introduce a separate inconsistent modal/copy pattern unless necessary.

#### Guardrails

- Do not silently overwrite `current_meal_draft_${uid}`.
- Do not delete a previous draft in a catch block unless the code can prove it created that exact draft in the same transaction.
- Do not navigate to Review screen until draft persistence and last-screen state are consistent.

#### Tests

Add/update tests in `RecipeCatalogScreen.test.tsx` and/or `recipeReviewDraft.test.ts`:

1. no existing draft → recipe review creates draft and navigates,
2. existing meaningful draft → recipe review does not overwrite before user decision,
3. user chooses discard → previous draft is replaced by recipe review draft,
4. user chooses resume/cancel → previous draft remains intact,
5. failure after attempted recipe draft setup does not remove unrelated previous draft.

---

## 3. Additional pre-merge hardening checks

After addressing the review comments, run a narrow safety pass over the touched integration surfaces.

### 3.1 Runtime feature flags

Verify all C2 launch-gated domains remain false by default in launch/production-like config unless explicitly enabled by the E2E harness or controlled runtime config.

Check:

- `EXPO_PUBLIC_ENABLE_FOOD_LIBRARY`
- `EXPO_PUBLIC_ENABLE_SMART_MEMORY`
- `EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS`
- `EXPO_PUBLIC_ENABLE_RECIPE_CATALOG`
- `EXPO_PUBLIC_ENABLE_PLANNING`
- `EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION`
- `EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION`

Acceptance:

- production defaults stay conservative,
- E2E enables only what each scenario needs,
- no test depends on stale developer `.env` state.

### 3.2 Draft ownership and transactional behavior

Audit every path writing `current_meal_draft_${uid}`:

- Meal Add method flow,
- Review Meal flow,
- Planning → Review,
- Recipe Catalog → Review,
- any Smart Memory candidate/review draft path.

Acceptance:

- no path silently overwrites a meaningful draft,
- conflict/resume/discard behavior is consistent,
- catch/failure paths only clean up state created by the same attempted action.

### 3.3 Release evidence correctness

Verify `release-candidate.yml` evidence generation still reflects:

- exact mobile SHA,
- exact backend SHA,
- target environment,
- E2E artifact paths,
- smoke/export/flow evidence,
- backup/restore/delete evidence.

Acceptance:

- evidence artifact is not produced from skipped or fake backend validation,
- workflow fails loudly when required evidence is missing.

### 3.4 E2E suite list consistency

Check `scripts/e2e/suites.json` and release-gate Maestro files.

Acceptance:

- every release-gate flow has the feature flags it needs,
- no flow is included in release gate if its required feature is deliberately launch-disabled and not enabled by harness,
- flow names and script detection patterns cannot drift silently.

---

## 4. Recommended implementation order

### Step 1 — Fix `scripts/run-e2e-local.sh`

Address together:

- P1-A Home Next Action / Recipe Catalog flags,
- P1-B Smart Memory flags,
- P2-A `10.0.2.2` Android local backend recognition.

This is the highest leverage file because three review findings point there.

### Step 2 — Fix `.github/workflows/release-candidate.yml`

Replace fake/unreachable backend configuration with either:

- reachable release/staging/smoke API URL + health check, or
- real local backend/emulator provisioning.

Prefer reachable backend for RC certification unless repository conventions clearly require local backend.

### Step 3 — Fix planned draft save validation

Update `ReviewMealScreen.tsx` so aggregate planned totals are accepted when ingredient rows are zero-macro placeholders.

### Step 4 — Fix Recipe Catalog draft overwrite

Update `RecipeCatalogScreen.tsx` and any draft helper to prevent silent overwrite and restore previous draft on failure.

### Step 5 — Add/repair tests

Do not rely only on Maestro tests. Add focused unit/component/script tests for the corrected logic.

### Step 6 — Run verification suite

Run the smallest reliable suite first, then the larger release-gate checks.

---

## 5. Required verification commands

Use the repository’s canonical commands. At minimum attempt:

```bash
npm ci
npm run lint
npm test -- --runInBand
npm run check:launch-readiness:android
npm run check:launch-readiness:ios
```

Then run focused E2E/script checks for changed harness behavior:

```bash
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/review-memory-explanation.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/review-memory-new-candidate-row.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/smart-memory-backend-pull.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/home-next-action-known-pattern.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/home-next-action-planned-item.yaml
npm run e2e:release-gate -- --flow e2e/maestro/release-gate/recipe-catalog-review-draft.yaml
```

If these commands are not accepted by the repo’s scripts, do not invent a passing result. Use the actual command form and document it in the summary.

---

## 6. Definition of Done

The branch is merge-ready only when:

- all six review findings are fixed or explicitly resolved with evidence,
- no P1 remains open,
- E2E harness enables feature flags per scenario, not globally,
- RC workflow uses reachable backend or provisions a real local backend,
- Android local backend URL handling supports `10.0.2.2`,
- planned meal drafts with valid aggregate totals can be saved,
- Recipe Catalog review cannot silently overwrite active meal draft,
- tests cover the behavioral fixes,
- launch/production defaults remain conservative,
- final Codex worker summary lists exact files changed, tests run, and any remaining risk.

---

## 7. Final Codex worker summary template

Use this format after implementing fixes:

```md
## PR #40 pre-merge repairs — worker summary

### Fixed
- [ ] scripts/run-e2e-local.sh: Home Next Action / Recipe Catalog flags
- [ ] scripts/run-e2e-local.sh: Smart Memory core flag for Smart Memory flows
- [ ] scripts/run-e2e-local.sh: Android 10.0.2.2 local backend detection
- [ ] .github/workflows/release-candidate.yml: reachable/provisioned RC backend
- [ ] ReviewMealScreen.tsx: planned aggregate totals accepted before save block
- [ ] RecipeCatalogScreen.tsx: active draft overwrite guard

### Tests / checks run
- `...`

### Evidence
- focused tests added/updated: `...`
- E2E flows run or not run with reason: `...`
- RC workflow validation: `...`

### Remaining risk
- `None` or explicit residual risk with owner decision required.
```
