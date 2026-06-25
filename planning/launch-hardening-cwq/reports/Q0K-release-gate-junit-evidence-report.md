# Q0K Release Gate JUnit Evidence Hardening Report

Status: controller-verified; independent QA `pass_with_gaps`
Date: 2026-06-22

## Objective

Repair the Maestro release-gate evidence path so the release evidence artifact does not trust a manually supplied `RELEASE_GATE_E2E_STATUS` string when JUnit result files are available.

## Confirmed Repo Snapshot

Mobile repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`

- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state before Q0K artifact generation: `27 modified, 2 untracked`

Backend repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`

- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state before Q0K artifact generation: `10 modified, 3 untracked`

## Evidence Inputs

- Existing Q0I Maestro result directory: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly/e2e/artifacts/core-release-gate-q0i-final-2/reports`
- JUnit XML files found in that directory: `20`
- All inspected Q0I report files use `testsuite name="core-release-gate"` and `testcase status="SUCCESS"`.

## Implementation

Changed mobile files:

- `scripts/render-release-evidence.mjs`
- `src/services/release/releaseEvidenceScripts.test.ts`

The renderer now supports `RELEASE_GATE_RESULTS_DIR`. When that variable is set, release evidence derives `Release gate E2E` from JUnit XML files and ignores any manually supplied `RELEASE_GATE_E2E_STATUS`.

The JUnit guard rejects:

- missing or non-directory result paths;
- result directories with no XML reports;
- report count mismatches when `RELEASE_GATE_EXPECTED_FLOW_COUNT` is set;
- testcase count mismatches when `RELEASE_GATE_EXPECTED_FLOW_COUNT` is set;
- flow-id mismatches when `RELEASE_GATE_EXPECTED_SUITE_KEY` or `RELEASE_GATE_EXPECTED_FLOW_IDS` is set;
- suite-name drift when `RELEASE_GATE_SUITE_NAME` is set;
- reports with `failure`, `error`, `skipped`, or non-`SUCCESS` testcase status evidence.

## Generated Artifact

Artifact: `reports/Q0K-verified-core-release-evidence.md`

Key evidence-backed fields:

- `Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY`
- `Release gate E2E: verified 20/20 flow report(s), 20 testcase(s), failures=0, errors=0, skipped=0 from e2e/artifacts/core-release-gate-q0i-final-2/reports`
- production new-domain flags remain `false`
- mobile worktree status remains dirty
- backend worktree status remains dirty

## Verification

- `npm test -- --runInBand --coverage=false src/services/release/releaseEvidenceScripts.test.ts`
  - Result: passed, `23` tests.
  - Note: the command prints expected error output from negative-path tests.
- Generated `reports/Q0K-verified-core-release-evidence.md` with `RELEASE_GATE_RESULTS_DIR=e2e/artifacts/core-release-gate-q0i-final-2/reports`, `RELEASE_GATE_EXPECTED_FLOW_COUNT=20`, `RELEASE_GATE_EXPECTED_SUITE_KEY=core-release-gate`, and `RELEASE_GATE_SUITE_NAME=core-release-gate`.
- Q0K invariant check passed:
  - verified JUnit-backed `20/20` release-gate status present;
  - `BLOCKED_EXTERNAL_DEPENDENCY` present;
  - production new-domain flags off;
  - dirty worktree statuses present;
  - no `CORE_RC_READY` or `FULL_1_1_RC_READY` decision present.

## Independent QA

Independent QA returned `pass_with_gaps` with no blocking findings.

QA-confirmed facts:

- no hidden fallback to manual `RELEASE_GATE_E2E_STATUS` when `RELEASE_GATE_RESULTS_DIR` is supplied;
- expected flow IDs can be checked through `RELEASE_GATE_EXPECTED_SUITE_KEY` / `RELEASE_GATE_EXPECTED_FLOW_IDS`;
- Q0I reports contain `20` XML files and `20` testcases for suite `core-release-gate`;
- Q0I report testcases match the current `core-release-gate` suite with no missing or unexpected IDs;
- Q0K docs keep `CORE_RC_READY` and `FULL_1_1_RC_READY` unclaimed and keep Q0 at `BLOCKED_EXTERNAL_DEPENDENCY`.

QA gap accepted by controller:

- Q0K is local evidence hardening only, not clean RC evidence, because both worktrees remain dirty and external/provider/manual release gates remain open.

## Unverified Areas

- Q0K did not rerun the full Maestro suite; it validates the existing Q0I JUnit result artifact.
- No provider, billing, production smoke, backup/restore, Sentry, compliance, rollback, or remote CI evidence was collected.
- Current evidence is not clean RC evidence because both worktrees are dirty.

## Controller Decision

Q0K passes the local controller gate for Maestro evidence hardening. Q0 remains `BLOCKED_EXTERNAL_DEPENDENCY` until external/provider/manual release evidence is supplied or explicitly authorized.
