# Source And Evidence Inventory

Status: active inventory
Created: 2026-06-20

## Purpose

Record the documents and repo evidence reviewed before starting the CWQ implementation loop. This file is an orientation aid, not proof that implementation packets are complete.

## Moved Source Brief

| File | Status | Notes |
| --- | --- | --- |
| `docs/Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md` | active work order | Found at `/Users/lukaszkurczab/Desktop/Fitaly_Codex_Controller_Worker_QA_Launch_Hardening.md`; current canonical copy is at the docs root and carries the reconciled status snapshot. |

## External Downloaded Context

These files were found in `/Users/lukaszkurczab/Downloads/`. They are useful context for the controller but are not automatically promoted into canonical workspace docs.

| File | Declared status | Role for CWQ |
| --- | --- | --- |
| `Fitaly_Product_SoT_PRD_v2.md` | working SoT / draft do zatwierdzenia | Product priority, launch loop, controlled/post-release scope. |
| `Fitaly_1_1_Smart_Memory_Release_Slicing_Plan_v0_1-3.md` | working draft | Historical/product slicing direction for 1.1; must not override current repo evidence. |
| `Fitaly_Technical_Architecture_SoT_v2.md` | working SoT | Mobile/backend responsibility split, runtime governance, flags, contracts. |
| `Fitaly_Analytics_KPI_Spec_v2.md` | working SoT / draft do zatwierdzenia | Telemetry privacy, schema and KPI direction. |
| `Fitaly_Launch_Readiness_Playbook_v1.md` | working SoT | Release gates, Go/No-Go, smoke, rollback, first-days monitoring. |
| `Fitaly_Screen_Feature_Architecture_Spec_v2.md` | working SoT / draft do zatwierdzenia | Surface map, routing, feature boundaries, screen states. |
| `Fitaly_Brand_Marketing_Direction_SoT_v4.md` | not fully reviewed in this pass | Brand/copy guidance; relevant for UI/copy QA only. |
| `Fitaly_Share_Composer_Spec_v1.md` | not fully reviewed in this pass | Share surface context; not first-wave unless active in release gate. |

## Canonical Workspace Docs Reviewed

| File | Status in repo | Key finding |
| --- | --- | --- |
| `AGENTS.md` | active workspace entrypoint | Parent workspace is not a git repo; mobile/backend repos are separate; canonical docs live in `docs/`. |
| `docs/README.md` | active docs index | Fitaly is pre-launch/release-hardening; old Smart Memory plans are closed; avoid monolithic archives. |
| `docs/planning/README.md` | planning index | New work should start from current repo evidence with its own acceptance criteria. |
| `docs/architecture/decisions.md` | active guardrails | Legacy paths and hidden fallbacks are removal scope; disabled/degraded states must be explicit. |
| `docs/runbooks/launch.md` | active runbook | Release requires CI, contract sync, RC evidence, smoke, privacy/Sentry/compliance, runtime config. |
| `fitaly/AGENTS.md` | active mobile instructions | Feature-first mobile architecture; cross-repo contracts require paired fixtures and tests. |
| `fitaly-backend/AGENTS.md` | active backend instructions | Thin FastAPI layer, service/db ownership, mandatory backend quality gates for code changes. |

## Initial Repo Evidence Snapshot

| Area | Evidence |
| --- | --- |
| Mobile branch | `codex/smart-memory-core-loop-fe` |
| Mobile HEAD | `5827c0a8c7618ce1523734e83f752e15e25258be` |
| Mobile dirty state | `git status --short` printed no files |
| Backend branch | `codex/smart-memory-core-loop-be` |
| Backend HEAD | `0988f53a9b76d25f3c38893cf54f5de44a9e9df7` |
| Backend dirty state | `git status --short` printed no files |
| Graph output | `graphify-out` was not present |

Later packet status and current-state evidence are tracked in
`01-packet-status.md`, `RELEASE_HARDENING_STATUS.md`, and the reports folder.
Do not treat this initial snapshot as the current branch pair.

## Local Script Evidence

Mobile `package.json` has these relevant scripts:

- `lint`
- `typecheck`
- `test`
- `test:targeted`
- `test:profile-contract`
- `check:launch-readiness:android`
- `check:launch-readiness:ios`
- `e2e:smoke`
- `e2e:release-gate`
- `e2e:coverage:check`
- `e2e:dynamic-text:check`
- focused suites such as `e2e:add-meal`, `e2e:home-history-statistics`, `e2e:premium-billing`, `e2e:notifications-retention`, `e2e:share`, `e2e:platform-layout`

Backend `package.json` has:

- `firebase:emulators`
- `firebase:emulators:export`
- `evidence:local`
- `evidence:emulators`

Backend `requirements.txt` includes pytest, pytest-cov, ruff, pip-audit and pyright.

## Verified Diff Orientation

Local `git diff --name-only main...HEAD` shows broad mobile/backend changes touching:

- Food Library
- Smart Memory
- Planning
- Recipe Catalog
- Known Patterns
- Home Next Action
- telemetry
- contract fixtures
- E2E/release-gate flows
- user account export/delete areas

This supports treating the hardening pass as cross-repo, release-risk work requiring CWQ rather than a direct single-agent implementation.
