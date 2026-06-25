# Q0H Release Evidence Dirty-State Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T21:59:51Z`
Updated: `2026-06-21T22:25:00Z`

## Scope

Q0H hardens local release evidence integrity after Q0G/R1C changed the current
working state. It prevents a generated release-evidence artifact from looking
like a clean exact-SHA RC while the mobile and backend worktrees are dirty.

Non-goals:

- no production smoke;
- no provider, billing, Firebase, RevenueCat, Sentry, backup, restore, or store
  credential use;
- no clean RC certification;
- no commit, push, build upload, or store submission;
- no feature-domain production activation.

## Repo Snapshot

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Mobile dirty state at Q0H generation: `17 modified, 2 untracked`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Backend dirty state at Q0H generation: `10 modified, 3 untracked`

## Confirmed Facts

- Existing Q0D artifact recorded older SHAs:
  - mobile `5827c0a8c7618ce1523734e83f752e15e25258be`
  - backend `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Current controller status records the newer pair above.
- Both repos are dirty after Q0G/R1C and prior hardening work.
- A release-evidence artifact that records only exact SHAs without dirty state
  is insufficient evidence for a clean RC.

## Changes

Mobile:

- `scripts/render-release-evidence.mjs`
  - Computes mobile worktree status from `git status --short` in the renderer
    working directory when that repo is available.
  - Computes backend worktree status from `git status --short` when
    `BACKEND_REPO` points at a readable backend repo.
  - Uses caller-provided `MOBILE_WORKTREE_STATUS` /
    `BACKEND_WORKTREE_STATUS` only as a fallback when repo status is
    unavailable.
  - Adds `Mobile worktree status`.
  - Adds `Backend worktree status`.
  - Adds `Evidence decision`.
  - Adds `Evidence limitations`.
  - Adds `REQUIRE_CLEAN_WORKTREE=true` guard that fails unless both statuses are
    exactly `clean`; when repo paths are available, this guard uses the
    computed git status rather than trusting env overrides.
  - Requires git-derived mobile/backend worktree evidence for
    `REQUIRE_CLEAN_WORKTREE=true`; env-provided `clean` is not sufficient for
    clean RC evidence.
- `src/services/release/releaseEvidenceScripts.test.ts`
  - Verifies clean worktree status fields, evidence decision, and limitations.
  - Verifies env-provided dirty statuses are used only when repo status is
    unavailable.
  - Verifies git dirty status is auto-recorded when worktree-status env is
    omitted.
  - Verifies dirty mobile state fails when clean worktrees are required even if
    `MOBILE_WORKTREE_STATUS=clean` is supplied.
  - Verifies backend-only dirty state fails when clean worktrees are required
    even if `BACKEND_WORKTREE_STATUS=clean` is supplied.
  - Verifies clean-worktree evidence is rejected when backend git evidence is
    missing.

Docs/evidence:

- Added generated artifact:
  `reports/Q0H-current-dirty-release-evidence.md`.
- The artifact records the current mobile/backend SHAs, dirty worktree statuses,
  production-off feature flags, local Q0G smoke evidence, and
  `Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY`.

## Verification

Controller:

- `npm run test:targeted -- --runTestsByPath src/services/release/releaseEvidenceScripts.test.ts`
  passed after the clean-gate git-evidence hardening: `1` suite, `18` tests.
- `npm run typecheck` passed.
- `npm run lint` passed.
- `git diff --check` in mobile passed.
- `git diff --check` in backend passed.
- Generated:
  `docs/planning/launch-hardening-cwq/reports/Q0H-current-dirty-release-evidence.md`.
- Generated artifact was produced without `MOBILE_WORKTREE_STATUS` or
  `BACKEND_WORKTREE_STATUS`; the renderer computed current dirty states from
  mobile cwd and `BACKEND_REPO`.
- Negative clean gate with current dirty state failed as expected even with
  `MOBILE_WORKTREE_STATUS=clean` and `BACKEND_WORKTREE_STATUS=clean` supplied:
  `Mobile worktree status must be clean when REQUIRE_CLEAN_WORKTREE=true; got dirty: 17 modified, 2 untracked.`

Initial independent QA:

- Verdict: `QA_PASS_WITH_GAPS`.
- QA confirmed:
  - renderer outputs worktree status, evidence decision, and limitations;
  - Q0H artifact records expected SHAs, dirty states, and
    `BLOCKED_EXTERNAL_DEPENDENCY`;
  - Q0H artifact contains no `CORE_RC_READY`, `FULL_1_1_RC_READY`, or
    `RC_READY` claim;
  - packet docs remain consistent with blocked-external status;
  - no prod/smoke/provider credentials were introduced.
- QA ran:
  - mobile/backend `git rev-parse HEAD`;
  - mobile/backend `git status --short`;
  - focused release evidence Jest suite: `15` tests passed before controller
    added the backend-only dirty regression test;
  - direct mobile dirty clean-gate probe;
  - direct backend dirty clean-gate probe;
  - Q0H readiness-claim search;
  - scoped `git diff --check`.

Controller repair after QA:

- Added the missing backend-only dirty clean-gate Jest regression test.
- Reran focused release evidence suite: `16` tests passed.

Controller follow-up after Maestro stop:

- Changed the renderer so repo-derived git status wins over caller-provided
  worktree status when repo paths are available.
- Added regression coverage for auto-recorded git dirty status and for
  env-masked dirty mobile/backend clean-gate failures.
- Closed the QA-noted fallback gap for clean RC evidence by requiring git
  worktree evidence when `REQUIRE_CLEAN_WORKTREE=true`.
- Reran focused release evidence suite: `18` tests passed.

Independent re-QA after clean-git-evidence repair:

- Verdict: `QA_PASS`.
- QA reran the focused release evidence suite: `18/18` tests passed.
- QA confirmed dirty current-repo clean-gate probe with env `clean` failed as
  expected and did not create an output file.
- QA confirmed missing `BACKEND_REPO` clean-gate probe with env `clean` failed
  with `Backend worktree status must come from git...` and did not create an
  output file.
- QA confirmed targeted mobile `git diff --check`, backend `git diff --check`,
  and readiness-claim search passed.

## Remaining Gaps

- Env-provided worktree status remains a fallback only for non-clean evidence
  generation when repo status is unavailable. Clean RC evidence now requires
  git-derived mobile/backend worktree evidence and `REQUIRE_CLEAN_WORKTREE=true`.
- The generated Q0H artifact is a dirty-worktree evidence packet, not a clean
  release candidate.
- Authenticated smoke-backend/provider/billing/backup/restore/production
  smoke/deployed SHA/manual evidence remains missing or owner-authorized.

## Controller Decision

Q0H: `qa_passed_with_gaps`.

Release evidence is now more honest for the current state: the artifact records
both exact SHAs and dirty worktree status, and the renderer can fail closed when
a clean-worktree artifact is required.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. `CORE_RC_READY`
and `FULL_1_1_RC_READY` are not justified.
