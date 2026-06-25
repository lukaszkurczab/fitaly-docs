# F1B Food Library Autocomplete Local Harness Report

Generated: `2026-06-23T13:34:59Z`

## Objective

Add a focused local runtime harness for Food Library ingredient autocomplete
flows without enabling Food Library in production.

## Scope

In scope:

- Add a focused `ingredient-autocomplete-runtime` E2E suite using existing
  Maestro autocomplete flows.
- Wire a package script for that suite.
- Make `scripts/run-e2e-local.sh` detect any ingredient autocomplete flow,
  enable Food Library only for that local E2E run, require a loopback backend
  plus Firebase Auth/Firestore emulators, and run the existing backend
  autocomplete seeder.
- Add loopback-only guards to the backend autocomplete seeder before Auth or
  Firestore writes.

Out of scope:

- Running the full local Maestro runtime suite in this controller turn.
- Production Food Library activation.
- Approved production corpus, owner quality review, PL/EN coverage sign-off,
  latency evidence, or production/provider evidence.
- Secrets, bundle IDs, package IDs, Firebase/RevenueCat/Sentry credential
  changes.
- Home Next Action.

## Repo Snapshot

Mobile repo:

- Branch: `codex/smart-memory-core-loop-fe`
- Base HEAD during this slice:
  `0ec1c6165143e56c3c66d55779dd141c89600c60`
- F1B commit:
  `2eb2998b30c352e3f246ec8692eec59c1ab24ba9`
- Upstream: `origin/codex/smart-memory-core-loop-fe`
- State after push: `0 ahead / 0 behind`

Backend repo:

- Branch: `codex/smart-memory-core-loop-be`
- Base HEAD during this slice:
  `c6661752b60ad4cccb6f38ae17059d2333522253`
- F1B commit:
  `f681d983941fe2d20cc857811493ee5bbd9def4f`
- Upstream: `origin/codex/smart-memory-core-loop-be`
- State after push: `0 ahead / 0 behind`

## Changes

Mobile:

- `scripts/e2e/suites.json`
  - Added `ingredient-autocomplete-runtime` with the seven existing
    `release-gate/ingredient-autocomplete-*.yaml` flows:
    - no-results manual fallback;
    - offline no-cache fallback;
    - offline create queued;
    - selected warning;
    - private delete;
    - private update;
    - private conflict discard.
- `package.json`
  - Added `npm run e2e:ingredient-autocomplete-runtime`.
- `scripts/run-e2e-local.sh`
  - Detects any `ingredient-autocomplete-*.yaml` flow.
  - Exports `EXPO_PUBLIC_ENABLE_FOOD_LIBRARY=true` for that local E2E run.
  - Refuses non-local API targets for autocomplete runtime flows; implicit
    smoke/prod backends are not allowed for this local harness.
  - Requires `FIRESTORE_EMULATOR_HOST` and `FIREBASE_AUTH_EMULATOR_HOST`.
  - Runs backend `scripts/seed_ingredient_autocomplete_e2e.py` for all
    autocomplete runtime flows, not only private delete/update/conflict flows.

Backend:

- `scripts/seed_ingredient_autocomplete_e2e.py`
  - Added `_require_local_emulator_host`.
  - Auth emulator URL creation now rejects non-loopback hosts.
  - Firestore client creation now rejects non-loopback hosts.
  - `main()` validates both emulator hosts before Auth or Firestore writes.
- `tests/test_seed_ingredient_autocomplete_e2e.py`
  - Added loopback acceptance and non-loopback rejection coverage.
  - Added tests proving non-loopback Firestore/Auth hosts block before Auth or
    Firestore writes.

## Diff Hygiene

Intentional:

- Mobile E2E suite/script wiring in `package.json`, `scripts/e2e/suites.json`,
  and `scripts/run-e2e-local.sh`.
- Backend local seeder loopback guard and focused tests.

User-owned / pre-existing:

- The current branch heads include owner-requested `AGENTS.md` review-guideline
  commits:
  - mobile `0ec1c616` (`docs: add review guidelines for pull requests`);
  - backend `c666175` (`docs: add review guidelines to AGENTS.md`).
  F1B did not modify `AGENTS.md`.

Accidental:

- None found.

Safety checks:

- Active mobile source search for the removed fake-auth markers returned no
  matches.
- Static production flag search returned no `EXPO_PUBLIC_ENABLE_FOOD_LIBRARY`,
  `FOOD_LIBRARY_ENABLED`, or `foodLibraryEnabled` production/default `true`
  matches in checked config files.
- No secret, bundle ID, package ID, Firebase, RevenueCat, or Sentry credential
  files were changed.

## Verification

Mobile:

```sh
node scripts/e2e/run-suite.mjs ingredient-autocomplete-runtime --validate
```

Result: passed, `7` flow(s) validated.

```sh
npm run e2e:ingredient-autocomplete-runtime -- --validate
```

Result: passed, `7` flow(s) validated.

```sh
bash -n scripts/run-e2e-local.sh
```

Result: passed.

```sh
env E2E_API_BASE_URL=https://fitaly-backend-smoke.up.railway.app bash scripts/run-e2e-local.sh e2e/maestro/release-gate/ingredient-autocomplete-no-results-manual.yaml
```

Result: expected failure, exit code `1`; runner refused non-local autocomplete
runtime API and printed the local-only guard message.

```sh
npm run lint
npm run typecheck
npm run e2e:coverage:check
npm run e2e:dynamic-text:check
git diff --check
```

Result: all passed. `e2e:coverage:check` and `e2e:dynamic-text:check` are
static gates only and do not prove runtime behavior.

Backend:

```sh
./.venv/bin/python -m pytest tests/test_seed_ingredient_autocomplete_e2e.py
```

Result: passed, `7` tests.

```sh
./.venv/bin/python -m pytest
```

Result: passed, `1381` passed / `36` skipped / `3` warnings.

```sh
./.venv/bin/python -m compileall app
./.venv/bin/ruff check .
./.venv/bin/ruff check scripts/seed_ingredient_autocomplete_e2e.py tests/test_seed_ingredient_autocomplete_e2e.py
./.venv/bin/pyright
./.venv/bin/pyright --pythonpath ./.venv/bin/python
git diff --check
```

Result: all passed.

Remote CI:

```text
https://github.com/lukaszkurczab/fitaly/actions/runs/28030428260
```

Result: success for mobile
`2eb2998b30c352e3f246ec8692eec59c1ab24ba9` with
`backend_contract_ref=f681d983941fe2d20cc857811493ee5bbd9def4f` and
`require_exact_backend_contract_ref=true`.

Passed jobs:

- `Cross-repo contract sync`: exact backend ref resolution, backend checkout,
  and contract sync.
- `Lint, Typecheck and Tests`: config fixture preparation, launch-readiness
  config validation for Android/iOS, lint, typecheck, `npm audit`, tests.

```text
https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28030431088
```

Result: success for backend
`f681d983941fe2d20cc857811493ee5bbd9def4f` with
`mobile_contract_ref=2eb2998b30c352e3f246ec8692eec59c1ab24ba9` and
`require_exact_mobile_contract_ref=true`.

Passed steps:

- exact mobile ref resolution, mobile checkout, dependency install, Ruff,
  Pyright, `pip-audit`, tests.

## QA

Independent QA returned `pass_with_gaps` with no blocking findings.

Accepted gaps:

- No full local Maestro runtime run for `ingredient-autocomplete-runtime` was
  produced in this slice.
- The seven autocomplete flows remain members of broader `release-gate` /
  `full-review` suites, so those broad suites now inherit the local-only guard
  whenever they include Food Library autocomplete flows. This is intentional
  for safety, but it means broad smoke/prod suite usage must split or authorize
  the Food Library portion separately.

## Remaining F1 Blockers

- No full local `ingredient-autocomplete-runtime` Maestro pass yet.
- No approved production corpus.
- No owner quality review or source/confidence sign-off.
- No PL/EN query coverage evidence beyond existing local seed mechanics.
- No latency evidence.
- No authorized production/provider evidence.

## Controller Decision

F1B is accepted as local harness wiring and safety-boundary evidence only.

F1 remains `partial`. Food Library remains production-off.
