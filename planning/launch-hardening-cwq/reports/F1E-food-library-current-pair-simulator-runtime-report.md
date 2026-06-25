# F1E Food Library Current-Pair Simulator Runtime Report

Date: 2026-06-24

Status: controller evidence refresh, local simulator evidence only

## Objective

Refresh the focused Food Library autocomplete runtime evidence against the current
mobile/backend branch pair after F1D changed the backend head.

## Scope

- Mobile repo: `fitaly/`
- Backend repo: `fitaly-backend/`
- Suite: `ingredient-autocomplete-runtime`
- Runtime target: local iOS simulator with local backend and Firebase emulators

## Confirmed Facts

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `fe01fbaf92921271968e9d7bde329530b42513eb`
- Both repo worktrees were clean and synchronized with their origin tracking
  branches during the controller check.
- Local backend ran on `http://127.0.0.1:8010`.
- Firebase Auth emulator ran on `127.0.0.1:9099`.
- Firestore emulator was already listening on `127.0.0.1:8080`.
- Provider/secrets env used by this local run was blanked.
- The run used simulator `Fitaly-MJ050 - iOS 18.6 -
  D046BCAF-0BDE-4025-BBB5-965E5E954D58`.

## Runtime Command

The accepted rerun used an explicit Maestro path because the first attempt
failed before executing app flows with `maestro: command not found`.

```bash
env PATH=/Users/lukaszkurczab/.maestro/bin:$PATH \
  E2E_EXPO_CLEAR_CACHE=1 E2E_EXPO_PORT=8099 E2E_PLATFORM=ios \
  E2E_UDID=D046BCAF-0BDE-4025-BBB5-965E5E954D58 \
  E2E_API_BASE_URL=http://127.0.0.1:8010 \
  FIREBASE_PROJECT_ID=demo-fitaly-local 'FIRESTORE_DATABASE_ID=(default)' \
  FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=http://127.0.0.1:9099 \
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=demo-fitaly-local \
  EXPO_PUBLIC_ENABLE_TELEMETRY=false \
  OPENAI_API_KEY= SENTRY_DSN= GOOGLE_APPLICATION_CREDENTIALS= \
  FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= \
  E2E_ARTIFACT_DIR=/private/tmp/fitaly-f1-current-pair-ingredient-autocomplete-runtime-20260624-rerun1 \
  npm run e2e:ingredient-autocomplete-runtime
```

## Result

`ingredient-autocomplete-runtime` passed `7/7` on the local iOS simulator:

- `ingredient-autocomplete-no-results-manual` passed
- `ingredient-autocomplete-offline-no-cache` passed
- `ingredient-autocomplete-offline-create-queued` passed
- `ingredient-autocomplete-selected-warning` passed
- `ingredient-autocomplete-private-delete` passed
- `ingredient-autocomplete-private-update` passed
- `ingredient-autocomplete-private-conflict-discard` passed

JUnit reports are under:

```text
/private/tmp/fitaly-f1-current-pair-ingredient-autocomplete-runtime-20260624-rerun1/reports
```

Controller check found seven XML reports. Each report declares
`tests="1"` and `failures="0"` for suite `ingredient-autocomplete-runtime`.

## Operational Cleanup

- Backend port `8010` was no longer listening after cleanup.
- Auth emulator port `9099` was no longer listening after cleanup.
- Firestore emulator port `8080` was still listening as a pre-existing local
  process and was left running.

## Limitations

- This is local simulator/emulator evidence only.
- Physical-device validation was explicitly skipped by owner instruction and is
  not claimed.
- No Android runtime evidence was collected in this slice.
- No production, provider, smoke-backend, billing, backup/restore, deployed
  backend, Sentry, privacy, compliance, rollback, or live RC evidence was
  collected.
- This does not approve the Food Library production corpus and does not close
  owner quality/source-confidence review.
- F1F later added fresh exact-SHA remote CI evidence for mobile
  `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend
  `fe01fbaf92921271968e9d7bde329530b42513eb`; this F1E report remains local
  simulator evidence only.

## Controller Decision

F1E is accepted as current-pair local iOS simulator runtime evidence for the
focused Food Library autocomplete suite. Full F1 remains partial and Food
Library production activation must stay off until the remaining corpus,
quality/source-confidence, authorized production/provider or deployed evidence,
and rollout approval gates pass.
