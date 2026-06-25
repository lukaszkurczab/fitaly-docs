# Fitaly Launch Hardening CWQ Workspace

Status: active working-docs package
Created: 2026-06-20
Mode: Controller -> Worker -> independent QA -> repair loop -> gate close

## Objective

Prepare a reproducible Controller/Worker/QA loop for launch hardening across:

- mobile repo: `fitaly/`
- backend repo: `fitaly-backend/`

The first execution target is an honest decision between:

- `CORE_RC_READY`
- `FULL_1_1_RC_READY`
- `NO_GO`
- `BLOCKED_EXTERNAL_DEPENDENCY`

The safe default is core release readiness with immature 1.1 domains production-off until their own gates pass.

## Canonical Package Files

- [Execution brief](../../Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md)
- [Source and evidence inventory](./00-source-and-evidence-inventory.md)
- [Packet status register](./01-packet-status.md)
- [Controller loop runbook](./02-controller-loop-runbook.md)
- [First packet: C0 baseline](./03-first-packet-c0-baseline.md)
- [Worker and QA prompt templates](./04-worker-qa-prompt-templates.md)
- [Evidence folder](./evidence/README.md)
- [Reports folder](./reports/README.md)

## Confirmed Facts

| Fact | Evidence |
| --- | --- |
| Workspace root is not a git repo. | `AGENTS.md`; `docs/README.md` |
| Canonical workspace documentation lives in `docs/`. | `AGENTS.md`; `docs/README.md` |
| Current mobile repo path is `fitaly/`. | `AGENTS.md`; local filesystem |
| Current backend repo path is `fitaly-backend/`. | `AGENTS.md`; local filesystem |
| Mobile branch is `codex/smart-memory-core-loop-fe`. | local `git branch --show-current` |
| Current mobile HEAD after Q0Y is `59feb230b74914ef5a7963b05d2a19dd695edef4`. | local `git rev-parse HEAD`; `reports/Q0X-local-ios-core-gate-harness-repair-report.md`; `reports/Q0Y-current-pair-local-ios-core-gate-report.md` |
| Backend branch is `codex/smart-memory-core-loop-be`. | local `git branch --show-current` |
| Backend HEAD is `fe01fbaf92921271968e9d7bde329530b42513eb`. | local `git rev-parse HEAD`; F1D backend push |
| Both repo working trees were clean when the initial package was prepared. | initial local `git status --short` printed no files in each repo |
| The moved execution brief was found on Desktop, not in Downloads. | local file search |
| Graph orientation output is not present at workspace root. | `graphify-out` missing |
| Existing docs say old Smart Memory plans `00-09` are closed and must not be treated as active backlog. | `docs/README.md`; `docs/planning/README.md`; `docs/architecture/decisions.md` |
| Q0U exact-SHA remote CI pairing passed for mobile `59189ae8` plus backend `706e2fff`. | `reports/Q0U-exact-sha-remote-ci-pairing-report.md` |
| F1B exact-SHA remote CI pairing passed for mobile `2eb2998b` plus backend `f681d98`. | `reports/F1B-food-library-autocomplete-local-harness-report.md` |
| F1C local iOS simulator `ingredient-autocomplete-runtime` passed `7/7` against local backend and Firebase emulators with provider env blanked. | `reports/F1C-food-library-autocomplete-runtime-report.md`; `/private/tmp/fitaly-f1c-ingredient-autocomplete-runtime-after-ui-fix/reports/` |
| F1C mobile commit `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` is pushed and mobile CI passed with exact backend ref `f681d983941fe2d20cc857811493ee5bbd9def4f`. | GitHub Actions run `28041016021` |
| F1D backend commit `fe01fbaf92921271968e9d7bde329530b42513eb` is pushed and adds local API-route PL/EN autocomplete evidence plus local latency evidence. | `reports/F1D-food-library-autocomplete-local-api-evidence-report.md` |
| F1E current-pair local iOS simulator `ingredient-autocomplete-runtime` passed `7/7` for mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend `fe01fbaf92921271968e9d7bde329530b42513eb`. | `reports/F1E-food-library-current-pair-simulator-runtime-report.md`; `/private/tmp/fitaly-f1-current-pair-ingredient-autocomplete-runtime-20260624-rerun1/reports/` |
| F1F exact-SHA remote CI pairing passed for the current F1 pair: mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend `fe01fbaf92921271968e9d7bde329530b42513eb`. | `reports/F1F-food-library-current-pair-remote-ci-report.md`; GitHub Actions runs `28062888358` and `28062888045` |
| Q0V Android simulator preflight is `not_ready`: Android SDK `adb`/`emulator` and Maestro are present, but no booted Android emulator or configured AVD exists. Mobile commit `80790f6a0fb4c70bf949a39ee7737085195ca3f3` is pushed and normal exact-SHA CI passed for the Q0V pair. | `reports/Q0V-android-simulator-preflight-report.md`; `npm run e2e:android-simulator:preflight -- --json`; GitHub Actions runs `28063907416` and `28063907468` |
| Q0W current blocked release evidence records the pushed pair as clean/synced while preserving `BLOCKED_EXTERNAL_DEPENDENCY`. | `reports/Q0W-current-blocked-release-evidence.md`; `reports/Q0W-current-blocked-release-evidence-refresh-report.md`; local `git status --short --branch`; local `git diff --name-status origin/<branch> --` |
| Q0X local iOS core-gate harness repair is pushed, with targeted simulator evidence but no single green post-push full-suite artifact. | `reports/Q0X-local-ios-core-gate-harness-repair-report.md`; `/private/tmp/fitaly-q0x-core-release-gate-pushed-20260624`; `/private/tmp/fitaly-q0x-chat-basic-history-pushed-isolated-20260624`; `/private/tmp/fitaly-q0x-remaining-core-flows-pushed-20260624` |
| Q0Y current-pair local iOS simulator `core-release-gate` passed as a single `20/20` suite for mobile `59feb230...` plus backend `fe01fba...` with local backend/emulators and provider env blanked. | `reports/Q0Y-current-pair-local-ios-core-gate-report.md`; `/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624/reports/` |
| Both repo worktrees are clean and synchronized after the Q0Y controller check. | local `git status --short --branch`; local `git diff --name-status`; local `git diff --name-status origin/<branch> --` |

## Assumptions

| Assumption | Reason | Owner action if wrong |
| --- | --- | --- |
| This folder is the canonical active working-docs location for this launch-hardening pass. | `docs/planning/` is the existing planning surface and old Smart Memory plans are closed. | Move/rename before starting C0. |
| Downloaded SoT/playbook docs are context inputs, not wholesale canonical docs to import. | `docs/README.md` warns against monolithic release-hardening archives after active guidance is condensed. | Promote only targeted current decisions into canonical docs if owner requests. |
| C0 was the first executable task for the original preparation pass. | The execution brief required baseline, scope lock, exact SHA and reproducibility before packet work. | Use the current packet register for subsequent slices. |
| No code implementation happened in the original preparation pass. | That package used the `working-docs` skill; implementation moved into later CWQ loop slices. | Continue implementation only through current packet gates and evidence. |

## Active Decision

The initial C0-C4 baseline/safety packets are complete in this package. Continue
from the current packet register and release status, not from the original
preparation order. F1C produced local iOS simulator runtime evidence for the
focused Food Library autocomplete suite against a local backend and Firebase
emulators. F1D added local API-route technical evidence for PL/EN query hits
and local route latency. F1E refreshed the same focused runtime suite on the
current pushed mobile/backend pair and passed `7/7` on the local iOS simulator.
F1F added exact-SHA remote CI pairing evidence for that same pair. Keep Food
Library production-off unless its remaining corpus, quality, provider/production
or deployed evidence, and feature-rollout gates pass. Q0V added a fail-closed
Android simulator preflight and confirmed the current local Android runtime
blocker is missing simulator infrastructure, not an app runtime failure. Q0V
normal exact-SHA CI passed for mobile `80790f6a...` plus backend `fe01fba...`,
but that CI does not run Android runtime. Q0W refreshed the current blocked
release-evidence artifact for that pushed pair and kept the decision at
`BLOCKED_EXTERNAL_DEPENDENCY`. Q0X then pushed the local iOS core-gate harness
repair as mobile `59feb230...`; it preserves no-provider billing/RevenueCat
overrides and keeps offline-pending evidence scoped to local pending state.
Q0Y reran the current pushed pair as a single local iOS simulator
`core-release-gate` suite and passed `20/20`, closing only the Q0X local
single-green-suite evidence gap. Q0 still remains blocked by missing exact
remote CI for `59feb230...`, Android runtime, provider/manual release evidence,
live RC workflow, deployed backend SHA, billing, backup/restore, production
smoke, privacy/Sentry/compliance, rollback and rollout authorization.

## Completed Work Removed From Active Plan

Historical preparation note: the initial working-docs package did not mark any
implementation packet done. Current completed packet state is tracked in
`01-packet-status.md` and `RELEASE_HARDENING_STATUS.md`.

## Gaps, Contradictions, And Blockers

| Item | Status | Handling |
| --- | --- | --- |
| The user described the execution brief as being in downloaded documents, but it was found on Desktop. | partial | File was moved from Desktop to this folder; source location mismatch is recorded. |
| The execution brief lists 12 audit risks, but this preparation pass did not re-run tests to confirm them. | unknown / needs evidence | C0 records baseline; later packets must reproduce or inspect each risk before closing it. |
| Downloaded SoT docs are outside canonical `docs/`. | partial | Inventory links them as external inputs; this package does not import monolithic archives. |
| No graph orientation exists. | deferred | Direct repo evidence was enough for this docs-prep pass. Regenerate graph only if a later controller slice needs it. |
| Recipe Catalog content gate likely needs external curated content. | unknown / needs evidence | R1 must classify as `BLOCKED_EXTERNAL_DEPENDENCY` if no approved content pack exists. |
| Store/provider/prod credentials and smoke/prod evidence are not available in this package. | unknown / needs evidence | Q0/C1 must request explicit owner authorization or mark external blocker. |

## Current Next Task

Choose the next smallest non-external feature-gate slice from the packet
register.

Reason: Q0Y now has a pushed current-pair local iOS simulator `core-release-gate`
`20/20` artifact for mobile `59feb230...` plus backend `fe01fba...`, but it
intentionally does not close Q0. F1E has a full local current-pair
`ingredient-autocomplete-runtime` Maestro pass, F1D has local API-route PL/EN
query-hit and latency evidence, and F1F has exact-SHA remote CI pairing for the
same pair. F1 still lacks approved production corpus, owner quality
review/source-confidence sign-off, authorized production/provider evidence,
deployed/network latency evidence, and rollout approval. Q0V shows Android
simulator runtime cannot start locally until an AVD is configured and booted.
Physical-device validation is skipped by owner instruction and is not claimed.
