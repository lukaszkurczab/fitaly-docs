# F1C Food Library Autocomplete Runtime Report

Generated: `2026-06-23T16:25:10Z`

## Objective

Produce local runtime evidence for the focused Food Library
`ingredient-autocomplete-runtime` suite without enabling Food Library in
production and without using production/provider credentials.

## Scope

In scope:

- Diagnose and repair the local runtime blocker for the two autocomplete flows
  that failed after F1B harness wiring.
- Preserve the existing Maestro flow contracts instead of hiding the failure
  with a flow-only workaround.
- Keep runtime evidence local-only against a loopback backend and Firebase Auth
  / Firestore emulators.
- Ensure the local runner can explicitly blank provider/secrets env loaded from
  `.env` for local E2E runs.

Out of scope:

- Production Food Library activation.
- Approved production corpus, owner quality review, PL/EN coverage sign-off,
  latency evidence, or authorized production/provider evidence.
- Backend code changes.
- Home Next Action.
- Bundle IDs, package IDs, Firebase/RevenueCat/Sentry credential changes.

## Repo Snapshot

Mobile repo:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD during this slice:
  `2eb2998b30c352e3f246ec8692eec59c1ab24ba9`
- F1C commit:
  `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- State after push: `0 ahead / 0 behind`

Backend repo:

- Branch: `codex/smart-memory-core-loop-be`
- HEAD during this slice:
  `f681d983941fe2d20cc857811493ee5bbd9def4f`
- State after this slice: clean and `0 ahead / 0 behind`

## Findings

- The first full local F1C runtime attempt passed `5/7` and failed:
  - `ingredient-autocomplete-no-results-manual`
  - `ingredient-autocomplete-private-conflict-discard`
- Both failures occurred at `No visible element found: id:
  ingredient-add-button`.
- The failing hierarchy still contained `ingredient-add-button` with bounds near
  the fixed footer, while the CTA itself had a `24` point minimum height.
- A temporary flow-only workaround was tried and reverted because it could tap
  through to the summary path instead of opening the ingredient editor.

## Changes

Mobile:

- `src/feature/Meals/screens/MealAdd/components/IngredientListSection.tsx`
  - Increased the `ingredient-add-button` touch target to at least `44` points.
  - Added `hitSlop` so the CTA is easier to interact with in UI automation and
    for users.
- `src/feature/Meals/screens/MealAdd/MealDetailsFormScreen.tsx`
  - Changed the form scroll view to `keyboardShouldPersistTaps="handled"` so
    child button taps are handled instead of being swallowed by scroll/keyboard
    behavior.
- `src/feature/Meals/screens/MealAdd/components/IngredientListSection.test.tsx`
  - Added regression coverage for the CTA target size, hit slop, and
    testID-based press path.
- `scripts/run-e2e-local.sh`
  - Added provider/secrets env names to the caller override preservation list:
    `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
    `GOOGLE_APPLICATION_CREDENTIALS`, `OPENAI_API_KEY`, and `SENTRY_DSN`.
  - This lets local E2E invocations explicitly pass blank values that survive
    `.env` sourcing.

Backend:

- No backend files changed.

## Diff Hygiene

Intentional:

- Mobile UI/testability repair for the ingredient add CTA and scroll tap
  handling.
- Mobile unit regression for the CTA press target.
- Mobile local E2E runner env override hardening.

Reverted as ineffective:

- Temporary YAML-only changes to
  `ingredient-autocomplete-no-results-manual.yaml` and
  `ingredient-autocomplete-private-conflict-discard.yaml`.

Pre-existing / external:

- Root workspace `AGENTS.md` was restored separately from this F1C code slice;
  the parent workspace is not a git repository.
- Mobile/backend repo `AGENTS.md` files were not modified by F1C.

Accidental:

- None found at the time of this report.

## Verification

Mobile unit/static gates:

```sh
npm run test -- src/feature/Meals/screens/MealAdd/components/IngredientListSection.test.tsx src/feature/Meals/screens/MealAdd/EditMealDetailsScreen.test.tsx --coverage=false
```

Result: passed, `2` suites / `8` tests.

```sh
npm run lint
npm run typecheck
bash -n scripts/run-e2e-local.sh
node scripts/e2e/run-suite.mjs ingredient-autocomplete-runtime --validate
```

Result: all passed. Suite validation reported `7` flows.

Local runtime preflight:

- Backend health:
  `GET http://127.0.0.1:8011/api/v1/health` returned status `ok`.
- Firebase Auth emulator:
  `GET http://127.0.0.1:9099/` returned `authEmulator.ready=true`.
- Autocomplete seeder ran with provider credentials blanked and
  `FIRESTORE_DATABASE_ID=fitaly-smoke`; it reported `recordCount=2` and
  `warningCount=0`.

Targeted rerun for the two previously failing flows:

```sh
env E2E_CONTINUE_ON_FAILURE=1 \
  E2E_RESULTS_DIR=/private/tmp/fitaly-f1c-ingredient-autocomplete-ui-targeted-1/reports \
  E2E_DEBUG_OUTPUT_DIR=/private/tmp/fitaly-f1c-ingredient-autocomplete-ui-targeted-1/logs \
  E2E_TEST_OUTPUT_DIR=/private/tmp/fitaly-f1c-ingredient-autocomplete-ui-targeted-1/screenshots \
  E2E_EXPO_CLEAR_CACHE=1 \
  E2E_EXPO_PORT=8099 \
  E2E_PLATFORM=ios \
  E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 \
  E2E_API_BASE_URL=http://127.0.0.1:8011 \
  FIREBASE_PROJECT_ID=demo-fitaly-local \
  FIRESTORE_DATABASE_ID=fitaly-smoke \
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 \
  E2E_BACKEND_ROOT=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend \
  E2E_BACKEND_PYTHON=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend/.venv/bin/python \
  GOOGLE_APPLICATION_CREDENTIALS= \
  FIREBASE_CLIENT_EMAIL= \
  FIREBASE_PRIVATE_KEY= \
  OPENAI_API_KEY= \
  SENTRY_DSN= \
  bash scripts/run-e2e-local.sh \
    e2e/maestro/release-gate/ingredient-autocomplete-no-results-manual.yaml \
    e2e/maestro/release-gate/ingredient-autocomplete-private-conflict-discard.yaml
```

Result: passed, `2/2`.

Full local runtime gate:

```sh
env E2E_EXPO_CLEAR_CACHE=1 \
  E2E_EXPO_PORT=8099 \
  E2E_PLATFORM=ios \
  E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 \
  E2E_API_BASE_URL=http://127.0.0.1:8011 \
  FIREBASE_PROJECT_ID=demo-fitaly-local \
  FIRESTORE_DATABASE_ID=fitaly-smoke \
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 \
  E2E_BACKEND_ROOT=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend \
  E2E_BACKEND_PYTHON=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend/.venv/bin/python \
  GOOGLE_APPLICATION_CREDENTIALS= \
  FIREBASE_CLIENT_EMAIL= \
  FIREBASE_PRIVATE_KEY= \
  OPENAI_API_KEY= \
  SENTRY_DSN= \
  E2E_ARTIFACT_DIR=/private/tmp/fitaly-f1c-ingredient-autocomplete-runtime-after-ui-fix \
  npm run e2e:ingredient-autocomplete-runtime -- --continue-on-failure
```

Result: passed, `7/7`:

- `ingredient-autocomplete-no-results-manual`
- `ingredient-autocomplete-offline-no-cache`
- `ingredient-autocomplete-offline-create-queued`
- `ingredient-autocomplete-selected-warning`
- `ingredient-autocomplete-private-delete`
- `ingredient-autocomplete-private-update`
- `ingredient-autocomplete-private-conflict-discard`

Artifacts:

- `/private/tmp/fitaly-f1c-ingredient-autocomplete-ui-targeted-1/`
- `/private/tmp/fitaly-f1c-ingredient-autocomplete-runtime-after-ui-fix/`

The repo-owned `fitaly/e2e/artifacts` folder was not used for these F1C
runtime artifacts.

Remote CI:

```text
https://github.com/lukaszkurczab/fitaly/actions/runs/28041016021
```

Result: success for mobile
`5de157eb42ca79c15b1fd4e943a6157d64b99e7c` with exact backend ref
`f681d983941fe2d20cc857811493ee5bbd9def4f`.

Passed jobs:

- `Cross-repo contract sync`
- `Lint, Typecheck and Tests`

## QA

Independent QA returned `pass_with_gaps` with no blocking findings.

QA-confirmed facts:

- The current mobile diff is limited to the four expected files.
- Backend worktree is clean.
- The runner env change extends the existing caller-env-preserves-over-`.env`
  mechanism to provider/secrets names.
- Ingredient autocomplete flows remain local-API-only and still require Auth
  and Firestore emulators.
- Backend ingredient seeding remains loopback-guarded before writes.
- The UI change keeps the same ingredient add handler and only improves touch
  target/tap handling.
- JUnit artifacts under
  `/private/tmp/fitaly-f1c-ingredient-autocomplete-runtime-after-ui-fix/reports/`
  show all seven runtime flows with `failures="0"` and `status="SUCCESS"`.

Accepted QA gaps:

- QA did not rerun lint, typecheck, unit tests, or Maestro; it corroborated the
  controller evidence from the current diff and local JUnit artifacts.
- Runtime evidence is iOS simulator only; Android and physical-device evidence
  remain unverified.
- The runner can now preserve caller-blanked provider env through `.env`
  sourcing, but it is not a hermetic scrub when callers do not blank those
  variables.

## Remaining F1 Blockers

- No approved production corpus.
- No owner quality review or source/confidence sign-off.
- No PL/EN query coverage evidence beyond current local seed mechanics.
- No latency evidence.
- No authorized production/provider evidence.
- No feature-wave rollout approval.

## Controller Decision

F1C is accepted as local iOS simulator runtime evidence for the focused Food
Library autocomplete suite only.

F1 remains `partial`. Food Library remains production-off.
