# C0 Baseline Report

Status: qa_passed
Timestamp: 2026-06-20T11:54:01Z / 2026-06-20 13:54:01 CEST
Controller: Codex
Scope: evidence only; no code fixes

## Objective

Create a reproducible baseline for the exact mobile/backend branch pair before
any launch-hardening implementation.

## Confirmed Facts

| Area | Mobile |
| --- | --- |
| Repo path | `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly` |
| Branch | `codex/smart-memory-core-loop-fe` |
| HEAD | `5827c0a8c7618ce1523734e83f752e15e25258be` |
| Initial dirty state before C0 commands | clean; `git status --short` printed no files |
| Dirty state immediately before validation | clean; `git status --short` printed no files |
| Dirty state after validation | clean; `git status --short` printed no files |
| Local `main` SHA used for diff | `ad4384144c383df20a3521c8a1a04107dd23fee6` |
| Merge base with `main` | `ad4384144c383df20a3521c8a1a04107dd23fee6` |
| Diff shortstat vs local `main` | `152 files changed, 36906 insertions(+), 94 deletions(-)` |

| Area | Backend |
| --- | --- |
| Repo path | `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend` |
| Branch | `codex/smart-memory-core-loop-be` |
| HEAD | `0988f53a9b76d25f3c38893cf54f5de44a9e9df7` |
| Initial dirty state before C0 commands | clean; `git status --short` printed no files |
| Dirty state immediately before validation | clean; `git status --short` printed no files |
| Dirty state after validation | clean; `git status --short` printed no files |
| Local `main` SHA used for diff | `9e00df379d26ca9b057f191eca7144469933bf75` |
| Merge base with `main` | `9e00df379d26ca9b057f191eca7144469933bf75` |
| Diff shortstat vs local `main` | `58 files changed, 21096 insertions(+), 62 deletions(-)` |

## Assumptions

- C0 uses local `main` refs because the user requested changed files relative
  to local main. No `git fetch --all --prune` was run in C0.
- External downloaded SoT documents were treated as context inputs only. Current
  repo docs, manifests, tests, and commands were treated as stronger evidence.
- Existing evidence under repo evidence/artifact folders is historical unless a
  command was rerun in this C0 pass.

## Files And Docs Inspected

- `AGENTS.md`
- `docs/README.md`
- `docs/architecture/decisions.md`
- `docs/runbooks/launch.md`
- `fitaly/AGENTS.md`
- `fitaly-backend/AGENTS.md`
- `docs/planning/launch-hardening-cwq/README.md`
- `docs/planning/launch-hardening-cwq/00-source-and-evidence-inventory.md`
- `docs/planning/launch-hardening-cwq/01-packet-status.md`
- `docs/planning/launch-hardening-cwq/02-controller-loop-runbook.md`
- `docs/planning/launch-hardening-cwq/03-first-packet-c0-baseline.md`
- `docs/planning/launch-hardening-cwq/Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md`
- `docs/planning/launch-hardening-cwq/reports/README.md`
- `docs/planning/launch-hardening-cwq/evidence/README.md`
- `fitaly/package.json`
- `fitaly-backend/package.json`
- Existing evidence/artifact folders:
  - `fitaly/e2e/artifacts/pr2-account-delete-20260603T233756Z`
  - `fitaly/e2e/artifacts/share`
  - `fitaly-backend/evidence/runs/local-public-20260612T154541Z`
  - older backend evidence runs under `fitaly-backend/evidence/runs`

## Relevant Release-Hardening Scripts Found

Mobile `package.json` exposes these relevant scripts:

```text
prod:test: npx expo start --no-dev --minify
lint: eslint src --ext .ts,.tsx,.js,.jsx
typecheck: tsc --noEmit
check:launch-readiness:android: node scripts/check-launch-readiness.mjs production android
check:launch-readiness:ios: node scripts/check-launch-readiness.mjs production ios
build:android:smoke: node scripts/build.js android smoke
build:ios:smoke: node scripts/build.js ios smoke
eas:android:smoke: npx eas-cli@18.6.0 build -p android --profile smoke
eas:ios:smoke: npx eas-cli@18.6.0 build -p ios --profile smoke
test: jest --runInBand --coverage --watchman=false
test:targeted: jest --config jest.targeted.config.js --runInBand --watchman=false --passWithNoTests
test:profile-contract: bash scripts/verify-backend-contract.sh && jest --runInBand --watchman=false --no-coverage --runTestsByPath src/__contract_fixtures__/profileOnboardingContractAlignment.test.ts
test:reminders: jest --runInBand --watchman=false --no-coverage --testPathPatterns='src/services/reminders/|src/__contract_fixtures__/contractAlignment'
test:coverage:slice: jest --runInBand --coverage --watchman=false --passWithNoTests
e2e: npm run e2e:release-gate
e2e:release-gate: node scripts/e2e/run-suite.mjs release-gate
e2e:smoke: node scripts/e2e/run-suite.mjs smoke
e2e:add-meal: node scripts/e2e/run-suite.mjs add-meal
e2e:home-history-statistics: node scripts/e2e/run-suite.mjs home-history-statistics
e2e:premium-billing: node scripts/e2e/run-suite.mjs premium-billing
e2e:notifications-retention: node scripts/e2e/run-suite.mjs notifications-retention
e2e:share: node scripts/e2e/run-suite.mjs share
e2e:platform-layout: node scripts/e2e/run-suite.mjs platform-layout
e2e:coverage:check: node scripts/e2e/validate-release-coverage.mjs
e2e:dynamic-text:check: node scripts/e2e/validate-dynamic-text-assertions.mjs
e2e:visual-audit: node scripts/e2e/run-visual-suite.mjs
e2e:full-review: node scripts/e2e/run-suite.mjs full-review --continue-on-failure
```

Backend `package.json` exposes these relevant scripts:

```text
firebase:emulators: firebase emulators:start --project demo-fitaly-local
firebase:emulators:export: firebase emulators:export ./firebase-emulator-export --project demo-fitaly-local
evidence:local: python scripts/run-backend-evidence.py --base-url http://127.0.0.1:8000
evidence:emulators: bash scripts/run-emulator-evidence.sh
```

## Local Tooling Evidence

| Command | Repo | Result |
| --- | --- | --- |
| `node --version` | mobile | exit 0; `v22.22.3` |
| `npm --version` | mobile | exit 0; `10.9.8` |
| `npx --no-install expo --version` | mobile | exit 0; `55.0.29` |
| `npx --no-install eas --version` | mobile | exit 1; npm cache permission error: `EPERM mkdir /Users/lukaszkurczab/.npm/_cacache`; local `node_modules/.bin/eas` and `node_modules/.bin/eas-cli` are absent |
| `npx --no-install firebase --version` | mobile | exit 2; printed `15.19.0`, then Firebase update-check failed because `/Users/lukaszkurczab/.config` is not writable for the update config store |
| `java -version` | mobile | exit 0; OpenJDK `23.0.1` Temurin |
| `python --version` | backend | exit 127; `zsh:1: command not found: python` |
| `./.venv/bin/python --version` | backend | exit 0; `Python 3.13.1` |
| `ruff --version` | backend | exit 0; `ruff 0.15.10` |
| `./.venv/bin/ruff --version` | backend | exit 0; `ruff 0.15.10` |
| `./.venv/bin/pyright --version` | backend | exit 0; `pyright 1.1.397` |
| `pytest --version` | backend | exit 0; `pytest 9.0.3` |
| `node --version` | backend | exit 0; `v22.22.3` |
| `npm --version` | backend | exit 0; `10.9.8` |
| `firebase --version` | backend | exit 2; printed `15.19.0`, then Firebase update-check failed because `/Users/lukaszkurczab/.config` is not writable for the update config store |
| `java -version` | backend | exit 0; OpenJDK `23.0.1` Temurin |

## Baseline Commands Run

| Command | Repo | Exact result |
| --- | --- | --- |
| `git branch --show-current` | mobile | exit 0; `codex/smart-memory-core-loop-fe` |
| `git rev-parse HEAD` | mobile | exit 0; `5827c0a8c7618ce1523734e83f752e15e25258be` |
| `git status --short` | mobile | exit 0; no output |
| `git rev-parse main` | mobile | exit 0; `ad4384144c383df20a3521c8a1a04107dd23fee6` |
| `git merge-base main HEAD` | mobile | exit 0; `ad4384144c383df20a3521c8a1a04107dd23fee6` |
| `git diff --name-status main...HEAD` | mobile | exit 0; changed-file list recorded below |
| `git diff --shortstat main...HEAD` | mobile | exit 0; `152 files changed, 36906 insertions(+), 94 deletions(-)` |
| `npm run lint` | mobile | exit 0; `eslint src --ext .ts,.tsx,.js,.jsx` completed with no lint errors |
| `npm run typecheck` | mobile | exit 0; `tsc --noEmit` completed with no type errors |
| `npm test -- --runInBand` | mobile | exit 0; `Test Suites: 313 passed, 313 total`; `Tests: 2047 passed, 2047 total`; `Snapshots: 0 total`; `Time: 41.137 s`; run printed existing noisy console warnings/errors from tests |
| `env BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh` | mobile | exit 0; `smart_reminders_v1.contract.json`, `profile_onboarding_v1.contract.json`, `food_library_domains_v1.json`, and `barcode_lookup_v1.json` matched backend canonical snapshots |
| `git branch --show-current` | backend | exit 0; `codex/smart-memory-core-loop-be` |
| `git rev-parse HEAD` | backend | exit 0; `0988f53a9b76d25f3c38893cf54f5de44a9e9df7` |
| `git status --short` | backend | exit 0; no output |
| `git rev-parse main` | backend | exit 0; `9e00df379d26ca9b057f191eca7144469933bf75` |
| `git merge-base main HEAD` | backend | exit 0; `9e00df379d26ca9b057f191eca7144469933bf75` |
| `git diff --name-status main...HEAD` | backend | exit 0; changed-file list recorded below |
| `git diff --shortstat main...HEAD` | backend | exit 0; `58 files changed, 21096 insertions(+), 62 deletions(-)` |
| `python -m compileall app` | backend | exit 127; `zsh:1: command not found: python` |
| `./.venv/bin/python -m compileall app` | backend | exit 0; listed and compiled `app` package tree |
| `ruff check .` | backend | exit 0; `All checks passed!` |
| `./.venv/bin/pyright` | backend | exit 0; `0 errors, 0 warnings, 0 informations` |
| `pytest` | backend | exit 0; `1205 passed, 33 skipped, 1 warning in 8.37s` |

## Generated Or Ignored Local Artifacts

Tracked working trees stayed clean, but `git status --ignored --short` shows
ignored local state. C0 did not create or modify tracked source files in either
repo.

Mobile ignored state after C0:

```text
!! .env
!! .expo/
!! GoogleService-Info.plist
!! coverage/
!! e2e/artifacts/
!! google-services.json
!! ios/.xcode.env.local
!! ios/Fitaly.xcodeproj/project.xcworkspace/
!! ios/Fitaly/GoogleService-Info.plist
!! ios/Pods/
!! ios/build/
!! node_modules/
```

Backend ignored state after C0:

```text
!! .coverage
!! .env
!! .env.prod
!! .pytest_cache/
!! .ruff_cache/
!! .venv/
!! app/__pycache__/
!! app/api/__pycache__/
!! app/api/deps/__pycache__/
!! app/api/middleware/__pycache__/
!! app/api/routes/__pycache__/
!! app/api/v1/__pycache__/
!! app/api/v2/__pycache__/
!! app/api/v2/deps/__pycache__/
!! app/api/v2/endpoints/__pycache__/
!! app/core/__pycache__/
!! app/db/__pycache__/
!! app/domain/__pycache__/
!! app/domain/ai_runs/__pycache__/
!! app/domain/ai_runs/models/__pycache__/
!! app/domain/ai_runs/services/__pycache__/
!! app/domain/chat/__pycache__/
!! app/domain/chat_memory/__pycache__/
!! app/domain/chat_memory/models/__pycache__/
!! app/domain/chat_memory/services/__pycache__/
!! app/domain/meals/__pycache__/
!! app/domain/meals/models/__pycache__/
!! app/domain/meals/services/__pycache__/
!! app/domain/tools/__pycache__/
!! app/domain/users/__pycache__/
!! app/domain/users/models/__pycache__/
!! app/domain/users/services/__pycache__/
!! app/infra/__pycache__/
!! app/infra/firestore/__pycache__/
!! app/infra/firestore/mappers/__pycache__/
!! app/infra/firestore/repositories/__pycache__/
!! app/models/__pycache__/
!! app/schemas/__pycache__/
!! app/schemas/ai_chat/__pycache__/
!! app/services/__pycache__/
!! app/services/reminder_engine/__pycache__/
!! app/tests/__pycache__/
!! app/tests/integration/__pycache__/
!! app/tests/unit/__pycache__/
!! app/tests/unit/domain/__pycache__/
!! app/tests/unit/domain/chat/__pycache__/
!! app/tests/unit/domain/meals/__pycache__/
!! app/tests/unit/domain/tools/__pycache__/
!! app/tests/unit/schemas/__pycache__/
!! compliance/
!! evidence/runs/
!! firestore-debug.log
!! node_modules/
!! scripts/__pycache__/
!! service-account.json
!! tests/__pycache__/
!! tests/contract_fixtures/__pycache__/
!! tests/reminder_engine/__pycache__/
```

Attribution:

- Likely C0-generated or refreshed ignored artifacts:
  - `fitaly/coverage/` from `npm test -- --runInBand`, because the `test`
    script runs Jest with `--coverage`.
  - backend `__pycache__/` folders from `./.venv/bin/python -m compileall app`
    and `pytest`.
  - backend `.coverage`, `.pytest_cache/`, and `.ruff_cache/` may have been
    generated or refreshed by `pytest` and `ruff check .`.
- Pre-existing ignored local state, not attributable to C0:
  - dependency/build folders such as `node_modules/`, `ios/Pods/`, `ios/build/`,
    `.venv/`, `.expo/`, and Xcode workspace files.
  - historical evidence/artifact folders such as `fitaly/e2e/artifacts/` and
    `fitaly-backend/evidence/runs/`.
  - local config/secret-like files such as `.env`, `.env.prod`,
    `GoogleService-Info.plist`, `google-services.json`,
    `ios/.xcode.env.local`, `ios/Fitaly/GoogleService-Info.plist`, and
    `service-account.json`. These were not opened, printed, or modified in C0.

## Baseline Failure Classification

| Failure or nonzero command | Classification | Evidence | Handling |
| --- | --- | --- | --- |
| `python --version` and `python -m compileall app` fail because `python` is not on PATH | pre-existing environment/tooling issue | `python --version` exit 127 before backend validation; `.venv/bin/python --version` succeeds with Python 3.13.1 | Use `.venv/bin/python` for backend local verification or normalize PATH in a later tooling slice if owner wants canonical `python` commands |
| `npx --no-install eas --version` fails with npm cache `EPERM` and no local EAS binary exists | pre-existing environment/tooling issue | npm error: `EPERM mkdir /Users/lukaszkurczab/.npm/_cacache`; `node_modules/.bin/eas` and `node_modules/.bin/eas-cli` absent | Do not install during C0; C1/Q0 should not rely on this local EAS check unless environment is repaired or CI evidence is used |
| `npx --no-install firebase --version` / `firebase --version` exit 2 after printing `15.19.0` | pre-existing environment/tooling issue | Firebase update check cannot write `/Users/lukaszkurczab/.config`; command exits nonzero | Treat Firebase CLI as present but local update-check permission is broken; emulator/evidence commands may need env repair before use |
| Mobile Jest console warnings/errors from intentionally tested degraded paths | unknown / needs evidence for cleanup priority, not a failing C0 gate | `npm test -- --runInBand` exits 0 with all suites/tests passed; console output includes React `act(...)`, sync failure, entitlement mismatch, notification, and offline/dead-letter logs | Do not fix in C0; only consider if later slices target test hygiene, logging privacy, or release evidence noise |

Introduced during C0: none found. Tracked working trees stayed clean after all
baseline commands.

## Changed Files Relative To Local Main

Mobile:

```text
M	CONTRIBUTING.md
M	README.md
M	app.config.js
A	e2e/maestro/release-gate/home-next-action-known-pattern.yaml
A	e2e/maestro/release-gate/home-next-action-planned-item.yaml
A	e2e/maestro/release-gate/home-next-action-review-draft.yaml
A	e2e/maestro/release-gate/home-next-action-telemetry-runtime.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-no-results-manual.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-offline-create-queued.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-offline-no-cache.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-private-conflict-discard.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-private-delete.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-private-update.yaml
A	e2e/maestro/release-gate/ingredient-autocomplete-selected-warning.yaml
A	e2e/maestro/release-gate/known-pattern-review-draft.yaml
A	e2e/maestro/release-gate/memory-center-controls.yaml
A	e2e/maestro/release-gate/memory-center-offline-active.yaml
A	e2e/maestro/release-gate/memory-center-sync-failed.yaml
A	e2e/maestro/release-gate/planning-home-to-review.yaml
A	e2e/maestro/release-gate/recipe-catalog-review-draft.yaml
A	e2e/maestro/release-gate/review-draft-no-silent-save-abort.yaml
A	e2e/maestro/release-gate/review-memory-disabled-precedence.yaml
A	e2e/maestro/release-gate/review-memory-explanation.yaml
A	e2e/maestro/release-gate/review-memory-new-candidate-row.yaml
A	e2e/maestro/release-gate/smart-memory-backend-pull.yaml
A	e2e/maestro/repair-loop/ingredient-autocomplete-local.yaml
A	e2e/maestro/repair-loop/ingredient-autocomplete-no-results-local.yaml
A	e2e/maestro/repair-loop/ingredient-autocomplete-offline-no-cache-local.yaml
A	e2e/maestro/repair-loop/ingredient-autocomplete-warning-keyboard-local.yaml
M	scripts/e2e/suites.json
M	scripts/run-e2e-local.sh
M	src/FirebaseConfig.ts
A	src/__contract_fixtures__/autocomplete_telemetry.json
M	src/__contract_fixtures__/contractAlignment.test.ts
M	src/__contract_fixtures__/food_library_domains_v1.json
A	src/__contract_fixtures__/home_next_action_telemetry.json
A	src/__contract_fixtures__/smart_memory_core_v1.json
M	src/components/IngredientEditor.test.tsx
M	src/components/IngredientEditor.tsx
M	src/components/TextInput.test.tsx
M	src/components/TextInput.tsx
M	src/feature/Home/screens/HomeScreen.test.tsx
M	src/feature/Home/screens/HomeScreen.tsx
A	src/feature/Home/services/homeNextActionSelector.test.ts
A	src/feature/Home/services/homeNextActionSelector.ts
M	src/feature/Meals/hooks/useMealAddMethodState.test.ts
M	src/feature/Meals/hooks/useMealAddMethodState.ts
M	src/feature/Meals/screens/MealAdd/MealDetailsFormScreen.tsx
M	src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx
M	src/feature/Meals/screens/MealAdd/ReviewMealScreen.tsx
M	src/feature/Meals/screens/MealAdd/components/IngredientEditorModal.tsx
M	src/feature/Meals/screens/MealAddMethodScreen.test.tsx
M	src/feature/Meals/screens/MealAddMethodScreen.tsx
A	src/feature/Planning/screens/PlanningScreen.test.tsx
A	src/feature/Planning/screens/PlanningScreen.tsx
A	src/feature/Planning/services/planningDraft.ts
A	src/feature/Recipes/screens/RecipeCatalogScreen.test.tsx
A	src/feature/Recipes/screens/RecipeCatalogScreen.tsx
A	src/feature/Recipes/services/recipeReviewDraft.test.ts
A	src/feature/Recipes/services/recipeReviewDraft.ts
M	src/feature/UserProfile/screens/AppSettingsScreen.test.tsx
M	src/feature/UserProfile/screens/AppSettingsScreen.tsx
A	src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx
A	src/feature/UserProfile/screens/MemoryCenterScreen.tsx
M	src/feature/UserProfile/screens/UserProfileScreen.test.tsx
M	src/feature/UserProfile/screens/UserProfileScreen.tsx
M	src/hooks/useUser.test.ts
M	src/locales/en/home.json
M	src/locales/en/meals.json
M	src/locales/en/profile.json
M	src/locales/i18n.audit.test.ts
M	src/locales/pl/home.json
M	src/locales/pl/meals.json
M	src/locales/pl/profile.json
M	src/navigation/AppNavigator.test.ts
M	src/navigation/AppNavigator.tsx
M	src/navigation/navigate.tsx
A	src/services/access/smartMemoryPackagingBoundary.test.ts
M	src/services/core/apiClient.test.ts
M	src/services/core/apiClient.ts
M	src/services/core/apiVersioning.test.ts
M	src/services/core/connectivityMonitor.test.ts
M	src/services/core/connectivityMonitor.ts
M	src/services/core/envValidation.test.ts
M	src/services/core/errorLogger.test.ts
M	src/services/core/runtimeConfig.test.ts
M	src/services/core/runtimeConfig.ts
M	src/services/e2e/connectivity.ts
A	src/services/e2e/connectivityOverride.ts
M	src/services/e2e/deepLink.test.ts
M	src/services/e2e/deepLink.ts
M	src/services/e2e/fixtures.test.ts
M	src/services/e2e/fixtures.ts
M	src/services/e2e/status.tsx
A	src/services/foodLibrary/ingredientProductConflictService.test.ts
A	src/services/foodLibrary/ingredientProductConflictService.ts
A	src/services/foodLibrary/ingredientProductCreateQueue.test.ts
A	src/services/foodLibrary/ingredientProductCreateQueue.ts
A	src/services/foodLibrary/ingredientProductCreateService.test.ts
A	src/services/foodLibrary/ingredientProductCreateService.ts
A	src/services/foodLibrary/ingredientProductDeleteService.test.ts
A	src/services/foodLibrary/ingredientProductDeleteService.ts
A	src/services/foodLibrary/ingredientProductSearchApi.test.ts
A	src/services/foodLibrary/ingredientProductSearchApi.ts
A	src/services/foodLibrary/ingredientProductSearchProjectionRepository.test.ts
A	src/services/foodLibrary/ingredientProductSearchProjectionRepository.ts
A	src/services/foodLibrary/ingredientProductSearchService.test.ts
A	src/services/foodLibrary/ingredientProductSearchService.ts
A	src/services/foodLibrary/ingredientProductUpdateService.test.ts
A	src/services/foodLibrary/ingredientProductUpdateService.ts
A	src/services/foodLibrary/ingredientProductUserRecordProjectionRepository.test.ts
A	src/services/foodLibrary/ingredientProductUserRecordProjectionRepository.ts
A	src/services/knownPatterns/knownPatternCandidatesApi.test.ts
A	src/services/knownPatterns/knownPatternCandidatesApi.ts
M	src/services/offline/db.test.ts
M	src/services/offline/db.ts
M	src/services/offline/migrationRunner.test.ts
M	src/services/offline/migrations/index.ts
M	src/services/offline/queue.repo.test.ts
M	src/services/offline/queue.repo.ts
M	src/services/offline/schema.sql
A	src/services/offline/strategies/foodLibrary.strategy.test.ts
A	src/services/offline/strategies/foodLibrary.strategy.ts
A	src/services/offline/strategies/smartMemory.strategy.test.ts
A	src/services/offline/strategies/smartMemory.strategy.ts
M	src/services/offline/sync.engine.test.ts
M	src/services/offline/sync.engine.ts
M	src/services/offline/sync.push.test.ts
M	src/services/offline/sync.push.ts
M	src/services/offline/sync.storage.ts
M	src/services/offline/types.ts
A	src/services/plannedMeals/plannedMealsApi.test.ts
A	src/services/plannedMeals/plannedMealsApi.ts
A	src/services/recipes/recipeCatalogApi.test.ts
A	src/services/recipes/recipeCatalogApi.ts
M	src/services/reminders/reminderService.test.ts
M	src/services/session/resetUserRuntime.test.ts
A	src/services/smartMemory/smartMemoryApi.test.ts
A	src/services/smartMemory/smartMemoryApi.ts
A	src/services/smartMemory/smartMemoryProjectionRepository.test.ts
A	src/services/smartMemory/smartMemoryProjectionRepository.ts
A	src/services/smartMemory/smartMemoryService.test.ts
A	src/services/smartMemory/smartMemoryService.ts
M	src/services/telemetry/telemetryClient.test.ts
M	src/services/telemetry/telemetryInstrumentation.test.ts
M	src/services/telemetry/telemetryInstrumentation.ts
M	src/services/telemetry/telemetryTypes.ts
M	src/types/foodLibrary.ts
A	src/types/knownPatterns.ts
A	src/types/plannedMeals.ts
A	src/types/recipes.ts
A	src/types/smartMemory.ts
```

Backend:

```text
M	.env.example
M	.gitignore
M	README.md
A	app/api/routes/food_library.py
A	app/api/routes/smart_memory.py
M	app/api/routes/users.py
A	app/api/v2/endpoints/known_patterns.py
A	app/api/v2/endpoints/planned_meals.py
A	app/api/v2/endpoints/recipe_catalog.py
M	app/api/v2/router.py
M	app/core/firestore_constants.py
M	app/schemas/food_library.py
A	app/schemas/known_patterns.py
A	app/schemas/planned_meals.py
A	app/schemas/recipes.py
A	app/schemas/smart_memory.py
M	app/schemas/telemetry.py
M	app/schemas/user_account.py
A	app/services/food_library_service.py
A	app/services/known_pattern_service.py
M	app/services/meal_service.py
A	app/services/planned_meal_service.py
A	app/services/recipe_catalog_service.py
A	app/services/smart_memory_capture_service.py
A	app/services/smart_memory_service.py
M	app/services/telemetry_service.py
M	app/services/user_account_service.py
M	docs/runtime-config.md
M	firebase.json
M	firestore.indexes.json
M	firestore.indexes.md
M	firestore.rules
A	scripts/seed_ingredient_autocomplete_e2e.py
A	scripts/seed_smart_memory_backend_e2e.py
A	tests/contract_fixtures/autocomplete_telemetry.json
M	tests/contract_fixtures/food_library_domains_v1.json
A	tests/contract_fixtures/home_next_action_telemetry.json
A	tests/contract_fixtures/smart_memory_core_v1.json
A	tests/test_api_food_library.py
A	tests/test_api_known_patterns.py
A	tests/test_api_planned_meals.py
A	tests/test_api_recipe_catalog.py
A	tests/test_api_smart_memory.py
M	tests/test_api_telemetry.py
M	tests/test_api_users.py
M	tests/test_contract_alignment.py
M	tests/test_feedback_firestore_rules_emulator.py
A	tests/test_food_library_service.py
A	tests/test_food_library_service_firestore_emulator.py
A	tests/test_known_pattern_service.py
M	tests/test_meal_service.py
M	tests/test_meal_service_firestore_emulator.py
A	tests/test_planned_meal_service.py
A	tests/test_recipe_catalog_service.py
A	tests/test_smart_memory_capture_service.py
A	tests/test_smart_memory_service.py
M	tests/test_user_account_service.py
M	tests/test_user_account_service_firestore_emulator.py
```

## Status Snapshot

- C0 baseline evidence exists in this report.
- C0 did not prove launch readiness and did not execute RC smoke, provider
  smoke, store checks, production deploy, billing purchase/restore, backup
  restore drill, or full release evidence.
- The current honest launch-hardening decision after C0 is `NO_GO`, because
  green local static/unit/contract baselines are not the same as release
  acceptance evidence.

## First Next P0 Slice Recommendation

Recommended next slice: **C1 Exact-SHA cross-repo CI and release evidence**.

Evidence-based rationale:

- C0 baseline static/unit/contract checks are green for the current local pair,
  so the next risk is not a failing local test but whether future RC evidence
  certifies this exact FE SHA + BE SHA pair.
- The execution brief lists "Release Candidate workflow does not hard-certify
  exact FE SHA + BE SHA pair" as a P0 audit risk.
- C1 is smaller and more foundational than C2: it protects all later evidence
  from accidentally testing backend `main` or an unpinned backend ref.
- C2 feature isolation is still P0, but it spans many domains and should follow
  once C1 makes the evidence path reproducible.

Suggested C1 acceptance criteria:

- Inspect mobile workflows/scripts/readiness evidence paths before editing.
- Confirm whether any RC, contract, smoke, or evidence path checks out or
  references a moving backend branch such as `main`.
- Require exact backend SHA input or a versioned release-pair manifest wherever
  paired evidence is generated.
- Record mobile SHA, backend SHA, target environment, feature flag snapshot, and
  command results in generated evidence.
- Reject production readiness for placeholder legal URLs such as `example.com`,
  `localhost`, empty values, or unapproved production Sentry absence.
- Keep the slice limited to release-pairing/readiness evidence; do not start
  feature flag rewiring or feature implementation inside C1.
- Verification should include mobile lint, typecheck, targeted tests for the
  touched readiness/workflow helpers, and the paired backend contract script
  against `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`.

## Unverified Areas

- Remote refs and freshness of local `main`; no fetch was run.
- GitHub Actions/remote CI; only local commands were run.
- E2E smoke/release-gate suites; not run in C0.
- Production/provider/store smoke; intentionally not run.
- EAS build availability; local no-install EAS check failed due npm cache
  permission and absent local EAS binary.
- Firebase emulator/evidence flows; Firebase CLI prints version but exits
  nonzero due update-check config permissions.
- Legal URL, Sentry production secret, RevenueCat provider, backup/restore, and
  store metadata evidence.
- External Recipe Catalog content pack and other content/credential dependencies.
- Whether local test console noise is acceptable for final release evidence.

## Stop Conditions For Next Work

- Dirty state appears in either repo before a slice and cannot be attributed.
- C1 evidence requires provider/prod credentials or store access without owner
  authorization.
- Workflow or contract evidence points at a backend ref different from the
  paired backend SHA.
- A required tool is missing and installing it would mutate the environment
  without explicit controller approval.
- Any test or inspection reveals data loss, cross-user access, secret leakage,
  or raw user payloads in telemetry/evidence.

## QA

Initial QA verdict: pass with gaps.

Repair applied:

- Added complete ignored/local artifact inventory from
  `git status --ignored --short` in each repo.
- Distinguished likely C0-generated/refreshed ignored artifacts from
  pre-existing local dependency/build/evidence/config/secret-like files.
- Added relevant release-hardening script summaries from both `package.json`
  files.

Re-QA verdict: pass.

Controller C0 decision: `qa_passed`. Launch-hardening readiness remains
`NO_GO` until later P0 packets and release evidence close.
