# C0 Baseline, Scope Lock, And Reproducibility

Status: historical / completed
Priority: P0
Repos: `fitaly/`, `fitaly-backend/`
Dependencies: none

This packet was executed and accepted in
`reports/C0-baseline-report.md`. Do not treat it as the next active task unless
the controller intentionally starts a fresh baseline for a new branch pair.

## Goal

Create a reproducible starting point for the exact mobile/backend pair and a baseline status package before any hardening implementation.

## Scope

Inspect both repos and produce evidence only. C0 may create or update documentation/status/evidence artifacts, but must not fix code failures.

## Non-goals

- No production deploy.
- No provider smoke.
- No store submission.
- No feature implementation.
- No broad refactor.
- No package upgrades unless required only to run a baseline command and explicitly approved.

## Inputs

- `docs/Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md`
- `docs/planning/launch-hardening-cwq/00-source-and-evidence-inventory.md`
- `docs/planning/launch-hardening-cwq/01-packet-status.md`
- root `AGENTS.md`
- `fitaly/AGENTS.md`
- `fitaly-backend/AGENTS.md`
- current local branches and working trees

## Confirmed Starting Facts

| Area | Fact |
| --- | --- |
| Mobile branch | `codex/smart-memory-core-loop-fe` |
| Mobile HEAD | `5827c0a8c7618ce1523734e83f752e15e25258be` |
| Backend branch | `codex/smart-memory-core-loop-be` |
| Backend HEAD | `0988f53a9b76d25f3c38893cf54f5de44a9e9df7` |
| Initial dirty state | No files printed by `git status --short` in either repo during package prep. Re-check at C0 start. |

## Worker Objective

Produce a baseline package that another controller can use to reproduce the exact branch pair, changed file set, tooling versions, initial failures, and next packet decision.

## Required Inspection

In both repos:

- branch name
- exact HEAD SHA
- `git status --short`
- local main SHA
- changed files relative to `main`
- Node/npm/Python/Java/Expo/EAS/Firebase CLI availability where applicable
- package/test scripts relevant to release hardening
- existing evidence folders and newest evidence summaries

## Acceptance Criteria

- Exact mobile and backend SHA are recorded.
- Working-tree dirty state is recorded before any command that can generate files.
- Changed files relative to `main` are recorded for both repos.
- Baseline command log exists with exact commands and results.
- Failures are classified as `pre-existing`, `introduced during C0`, or `unknown / needs evidence`.
- `01-packet-status.md` is updated only if C0 evidence justifies a status change.
- A C0 report is saved under `reports/`.
- No implementation packet is marked `done` or `closed`.

## Recommended Baseline Commands

Run cheap read-only commands first. Use repo instructions to select validation scope.

Mobile candidates:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse main
git diff --name-only main...HEAD
node --version
npm --version
npx expo --version
npx eas-cli --version
npm run lint
npm run typecheck
npm test -- --runInBand
BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh
```

Backend candidates:

```bash
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse main
git diff --name-only main...HEAD
python --version
python -m compileall app
ruff check .
./.venv/bin/pyright
pytest
```

If a command is missing, record the missing tool as evidence. Do not install dependencies unless the controller explicitly accepts the cost/risk for C0.

## Required Evidence

Save:

- command log
- changed-file list for both repos
- status snapshot
- baseline failures with classification
- any generated report path

Preferred path:

```text
docs/planning/launch-hardening-cwq/reports/C0-baseline-report.md
```

If runtime evidence is generated, put sanitized references in:

```text
docs/planning/launch-hardening-cwq/evidence/
```

## Risks

- Test commands may generate artifacts or mutate local caches.
- Full suites may be expensive; narrow only if clearly documented.
- If repo working trees become dirty during C0, classify generated files before continuing.
- If local `main` is stale, record that C0 used local refs unless an approved fetch is run.

## Stop Conditions

Stop and report if:

- dirty state appears before C0 commands and cannot be attributed safely;
- required tools are missing and installing them would change the environment;
- tests need credentials or production access;
- cross-repo contract checks point at the wrong backend pair;
- evidence reveals data loss or cross-user access.
