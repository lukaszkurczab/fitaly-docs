# Q0U Exact-SHA Remote CI Pairing Report

Generated: `2026-06-23T08:56:58Z`

## Objective

Convert the pushed Q0T pair into a remote CI-backed exact-SHA pair without
claiming release readiness.

## Scope

In scope:

- Repair backend CI so it can be triggered manually and validate against an
  exact mobile contract SHA.
- Repair backend CI dependency/type/security/test blockers exposed by the first
  remote runs.
- Repair mobile CI test determinism exposed by the exact backend SHA run.
- Commit and push the needed CI/test repairs.
- Trigger mobile and backend GitHub Actions with exact cross-repo SHA inputs.

Out of scope:

- Provider-backed smoke, production smoke, billing, backup/restore, Android
  runtime, deployed backend SHA, privacy/Sentry, compliance, rollback, or owner
  rollout authorization evidence. Physical-device validation was not performed
  and is now skipped by owner instruction.
- Home Next Action implementation.
- Any secret, bundle ID, package ID, Firebase, RevenueCat, or Sentry credential
  change.
- `CORE_RC_READY` or `FULL_1_1_RC_READY`.

## Exact Pair

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- Commit: `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43`
- Message: `test(ci): stabilize mobile contract gate`
- Origin state after push: `0 ahead / 0 behind`

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- Commit: `706e2fff7788636d804339fd0845b98e523ce1ac`
- Message: `ci: checkout mobile contracts in backend gate`
- Origin state after push: `0 ahead / 0 behind`

## Diff Hygiene

Intentional backend CI hardening:

- `.github/workflows/ci.yml` now supports `workflow_dispatch` with
  `mobile_contract_ref` and `require_exact_mobile_contract_ref`.
- Backend CI checks out the mobile repo into `_mobile` and runs tests with
  `MOBILE_REPO=_mobile`.
- `tests/test_contract_alignment.py` resolves mobile fixtures from
  `MOBILE_REPO` when provided, otherwise falls back to the sibling repo path.
- `requirements.txt` upgrades vulnerable `starlette` and `pydantic-settings`
  versions and adds `httpx2` so Starlette `TestClient` remains typed under
  Pyright.
- Route contract tests use a narrow `JsonResponse` protocol instead of
  depending on the old `httpx.Response` type shape.

Intentional mobile CI/test hardening:

- `src/__contract_fixtures__/contractAlignment.test.ts` resolves backend
  fixtures from `BACKEND_REPO` when CI checks out the backend repo to
  `_backend`.
- `src/feature/Recipes/services/recipeReviewDraft.test.ts` no longer asserts a
  Warsaw-specific `loggedAtLocalMin`; it derives the expected local minute from
  the same fixed `Date` used by the test runtime.

Reverse-patch / fake-auth check:

- `rg "authSession|authToken|fitaly://e2e/login|getE2EAuthSession|establishE2EAuthSession|buildE2EProfileSeed" src e2e scripts --glob '!coverage/**'`
  returned no active-source matches in mobile during Q0U.

User-owned local changes:

- After Q0U CI passed, owner-requested review-guideline additions were restored
  in `AGENTS.md` in both repos. These are not part of the Q0U pushed pair and
  are currently local dirty state.

Accidental:

- None left in the Q0U commits.

## Local Verification

Mobile:

```sh
git diff --check
```

Result: passed before commit.

```sh
npm run lint
```

Result: passed.

```sh
npm run typecheck
```

Result: passed.

```sh
npm test
```

Result: passed, `314` suites / `2166` tests.

Backend:

```sh
./.venv/bin/python -m pytest
```

Result after final backend CI repairs: passed, `1377` passed / `36` skipped /
`3` warnings.

```sh
./.venv/bin/python -m compileall app
./.venv/bin/ruff check .
./.venv/bin/pyright
./.venv/bin/pyright --pythonpath ./.venv/bin/python
./.venv/bin/python -m pip check
./.venv/bin/python -m pip_audit -r requirements.txt
```

Result: all passed; `pip-audit` reported no known vulnerabilities.

## Remote CI Evidence

Mobile GitHub Actions:

- Run: `https://github.com/lukaszkurczab/fitaly/actions/runs/28013966826`
- Event: `workflow_dispatch`
- Head branch: `codex/smart-memory-core-loop-fe`
- Head SHA: `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43`
- Inputs used by controller:
  - `backend_contract_ref=706e2fff7788636d804339fd0845b98e523ce1ac`
  - `require_exact_backend_contract_ref=true`
- Result: success.
- Passed jobs/steps:
  - `Cross-repo contract sync`: checkout mobile repo, resolve exact backend
    contract ref, checkout backend repo, verify contract sync.
  - `Lint, Typecheck and Tests`: checkout backend repo, prepare Firebase
    config fixtures, validate launch readiness config for Android and iOS,
    lint, typecheck, `npm audit`, tests.

Backend GitHub Actions:

- Run: `https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28013971351`
- Event: `workflow_dispatch`
- Head branch: `codex/smart-memory-core-loop-be`
- Head SHA: `706e2fff7788636d804339fd0845b98e523ce1ac`
- Inputs used by controller:
  - `mobile_contract_ref=59189ae8cd7d49d3b836aa6e97a3033db8b3cb43`
  - `require_exact_mobile_contract_ref=true`
- Result: success.
- Passed steps:
  - resolve exact mobile contract ref, checkout mobile repo, install
    dependencies, Ruff, Pyright, `pip-audit`, tests.

## QA

Independent QA returned `pass_with_gaps` with no blocking findings.

QA-confirmed facts:

- Both origin heads match the exact pair above.
- Mobile `59189ae8` touches only the two intended test files.
- Backend `d82f938..706e2fff` touches only CI, dependency, and contract-test
  files.
- Mobile and backend workflows enforce exact cross-repo refs and use `_backend`
  / `_mobile` checkout paths correctly.
- The remote CI runs support only Q0U remote CI pairing evidence.

Accepted non-blocking gaps:

- QA did not rerun local full gates; it verified remote run metadata/logs and
  static repo evidence.
- Backend remote CI does not include the extra local `compileall`, `pip check`,
  or alternate Pyright invocation.
- Provider smoke, Android runtime, live RC workflow, deployed backend SHA,
  billing, backup/restore, privacy/Sentry, compliance, rollback, and production
  smoke remain unverified. Physical-device validation was not performed and is
  now skipped by owner instruction.

## Controller Decision

Q0U is accepted as exact-SHA remote CI pairing evidence for the pushed mobile
`59189ae8` and backend `706e2fff` pair.

Current launch decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
