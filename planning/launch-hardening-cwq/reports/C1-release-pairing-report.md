# C1 Release Pairing Report

Status: `qa_passed`
Packet: C1 Exact-SHA cross-repo CI and release evidence
Started from C0 pair: 2026-06-20
Closed at: 2026-06-20T13:27:21Z
Controller: Codex

## Confirmed Pair Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state after C1 implementation: expected C1 edits only.

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state after C1 implementation: expected C1 edits only.

## Scope

C1 hardened the release path so a release candidate cannot certify a moving
backend branch as if it were the reviewed backend commit.

Confirmed facts:

- The prior RC workflow used backend CI via `fitaly-backend/.github/workflows/ci.yml@main`.
- The prior release evidence fetched backend `main` SHA instead of using an explicit release pair.
- The prior smoke export and smoke flow checks hit the fixed smoke backend URL without verifying the deployed runtime SHA.
- The prior production readiness path allowed placeholder legal URLs and treated missing Sentry DSN as a warning or unverifiable local assumption.

Assumptions:

- C1 should not run live provider, smoke, or production credentials without owner authorization.
- GitHub `secrets.SENTRY_DSN` is the verifiable CI evidence path for production readiness; if absent, the readiness gate should fail.
- `BACKEND_COMMIT_SHA` is a non-secret deployment env var that must be set by backend deploy infrastructure for smoke/prod runtime SHA verification.

## Files Changed

Mobile:

- `.github/workflows/ci.yml`
- `.github/workflows/release-candidate.yml`
- `scripts/check-launch-readiness.lib.js`
- `scripts/check-launch-readiness.mjs`
- `scripts/render-release-evidence.mjs`
- `scripts/resolve-backend-contract-ref.sh`
- `scripts/smoke-auth-lib.mjs`
- `scripts/verify-smoke-export.mjs`
- `scripts/verify-smoke-flow-contracts.mjs`
- `src/services/core/runtimeConfig.test.ts`
- `src/services/release/checkLaunchReadinessConfig.test.ts`
- `src/services/release/launchReadiness.test.ts`
- `src/services/release/launchReadiness.ts`
- `src/services/release/releaseEvidenceScripts.test.ts` (new)

Backend:

- `.env.example`
- `app/core/config.py`
- `app/schemas/version.py`
- `app/services/version_service.py`
- `app/api/routes/version.py`
- `tests/test_version.py`

## Behavior After

- RC workflow is manual `workflow_dispatch` and requires `backend_commit_sha` as an exact 40-character SHA.
- Mobile CI receives the same backend SHA through `backend_contract_ref` with `require_exact_backend_contract_ref: true`.
- Backend CI in RC checks out `fitaly-backend` at the exact backend SHA instead of using backend `main`.
- Release evidence requires exact `MOBILE_SHA` and `BACKEND_SHA`, records target environment, records feature flag snapshot, and rejects non-SHA backend evidence.
- Feature flag snapshot records configured values and marks tracked rollout flags as `missing` when absent instead of silently omitting them.
- Backend `/api/v1/version` remains backward compatible and exposes optional `commitSha` from non-secret env var `BACKEND_COMMIT_SHA`.
- Smoke export and smoke flow scripts query `/api/v1/version` before authenticated checks and fail if deployed `commitSha` is missing or mismatched.
- Production readiness rejects empty, localhost, and `example.com` legal URLs.
- Production readiness requires real `SENTRY_DSN` from current env or CI secret; the prior bare `READINESS_ASSUME_EAS_SECRETS` bypass was removed.

## Controller Verification

Mobile commands:

- `npm run test:targeted -- src/services/release/checkLaunchReadinessConfig.test.ts src/services/release/launchReadiness.test.ts src/services/release/releaseEvidenceScripts.test.ts --no-coverage`
  - Result: passed, 3 suites / 43 tests.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `npm test -- --runInBand`
  - Result: passed, 314 suites / 2065 tests.
- `BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh`
  - Result: passed, 4 contract snapshots matched backend canonical snapshots.
- `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/ci.yml"); YAML.load_file(".github/workflows/release-candidate.yml"); puts "workflow yaml parsed"'`
  - Result: passed.
- `node --check scripts/render-release-evidence.mjs`
  - Result: passed.
- `node --check scripts/smoke-auth-lib.mjs`
  - Result: passed.
- `node --check scripts/verify-smoke-export.mjs`
  - Result: passed.
- `node --check scripts/verify-smoke-flow-contracts.mjs`
  - Result: passed.
- `git diff --check`
  - Result: passed.
- `command -v actionlint`
  - Result: failed; `actionlint` is not installed locally. YAML parse was used as available workflow syntax validation.

Readiness probes:

- `env TERMS_URL=https://fitaly.app/terms PRIVACY_URL=https://fitaly.app/privacy RC_IOS_API_KEY=appl_test SENTRY_DSN=https://public@sentry.io/1 npm run check:launch-readiness:ios`
  - Result: passed.
- `env TERMS_URL=https://fitaly.app/terms PRIVACY_URL=https://fitaly.app/privacy RC_IOS_API_KEY=appl_test SENTRY_DSN= npm run check:launch-readiness:ios`
  - Result: failed as expected with `SENTRY_DSN is not set`.

Backend commands:

- `./.venv/bin/python -m pytest tests/test_version.py -q`
  - Result: passed, 4 tests.
- `./.venv/bin/python -m compileall app`
  - Result: passed.
- `./.venv/bin/ruff check app/core/config.py app/schemas/version.py app/services/version_service.py app/api/routes/version.py tests/test_version.py`
  - Result: passed.
- `./.venv/bin/pyright app/core/config.py app/schemas/version.py app/services/version_service.py app/api/routes/version.py tests/test_version.py`
  - Result: passed, 0 errors.
- `./.venv/bin/ruff check .`
  - Result: passed.
- `./.venv/bin/pyright`
  - Result: passed, 0 errors.
- `./.venv/bin/python -m pytest -q`
  - Result: passed, 1207 passed / 33 skipped / 1 warning.
- `git diff --check`
  - Result: passed.

## Independent QA

Initial QA verdict: `QA_FAIL`, severity `P1`.

- Finding: `READINESS_ASSUME_EAS_SECRETS=true` allowed missing `SENTRY_DSN` to pass without verifiable evidence.

Repair:

- Removed the bypass from readiness code.
- CI now passes `SENTRY_DSN: ${{ secrets.SENTRY_DSN }}`.
- Added a regression test proving a bare EAS-secret assumption does not bypass missing `SENTRY_DSN`.

Re-QA verdict: `QA_PASS`, severity `none`.

QA reran targeted tests, positive and negative Sentry readiness probes, workflow YAML parse, diff hygiene, and confirmed `READINESS_ASSUME_EAS_SECRETS` has no matches in `.github`, `scripts`, `src`, `README.md`, or `.env.example`.

## Remaining Risks And Unverified Areas

- Live GitHub RC workflow was not executed.
- Live smoke/prod/provider checks were not executed; no credentials were used.
- `BACKEND_COMMIT_SHA` must be configured in backend deployment environments before RC smoke verification can pass.
- `secrets.SENTRY_DSN` must be configured in GitHub CI; missing secret now correctly blocks readiness.
- Backend CI steps are inlined in the mobile RC workflow and can drift from backend CI if backend CI changes later.
- C1 does not close C2 feature isolation, C3 durable side effects, C4 export/delete completeness, billing runtime evidence, provider evidence, or Q0 full release evidence.

## Packet Decision

C1 is `qa_passed`.

Overall launch decision remains `NO_GO` because later P0 packets and full runtime release evidence are still open.

Next smallest P0 slice: C2 Granular feature flags and predictable disabled behavior.
