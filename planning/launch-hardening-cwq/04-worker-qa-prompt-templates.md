# Worker And QA Prompt Templates

Status: active templates
Created: 2026-06-20

Use these templates inside the controller loop. Replace bracketed text and remove irrelevant lines.

## Controller Slice Header

```text
Task: [packet/slice id]
Slice objective: [one sentence]
Scope: [files, modules, behavior]
Non-goals: [explicit exclusions]

Facts:
- [repo evidence]

Assumptions:
- [labelled assumptions]

Acceptance criteria:
- [observable criterion]
- [observable criterion]

Required verification:
- [command/check]

Stop conditions:
- [condition]
```

## Worker Prompt

```text
You are the worker for one controller-managed Fitaly launch-hardening slice.

Read first:
- /Users/lukaszkurczab/Desktop/Projects/Fitaly/AGENTS.md
- /Users/lukaszkurczab/Desktop/Projects/Fitaly/docs/planning/launch-hardening-cwq/README.md
- /Users/lukaszkurczab/Desktop/Projects/Fitaly/docs/planning/launch-hardening-cwq/01-packet-status.md
- [active packet doc]
- [relevant repo AGENTS.md]
- [relevant files/areas]

Objective:
[one sentence]

Scope:
[only this slice]

Non-goals:
[do not touch]

Acceptance criteria:
- [AC]

Constraints:
- Inspect repo evidence before editing.
- Separate facts from assumptions.
- Implement only this slice.
- Do not preserve legacy paths or add hidden fallbacks unless explicitly required.
- Prefer existing project patterns.
- Do not modify secrets, credentials, production data, bundle IDs or package IDs.
- Run the narrowest meaningful verification.

Report:
- Facts inspected.
- Assumptions.
- Files inspected.
- Existing patterns followed.
- Changed files with short rationale.
- Verification commands with exact result.
- Unverified areas.
- Risks or follow-ups.
```

## Independent QA Prompt

```text
You are an independent QA reviewer for a controller-managed Fitaly launch-hardening slice.

Read:
- /Users/lukaszkurczab/Desktop/Projects/Fitaly/AGENTS.md
- [relevant repo AGENTS.md]
- [active task doc or issue]
- [worker report]
- [changed files or diff]

You are intentionally not given the controller's original acceptance criteria. Evaluate independently from repo evidence, task docs, the worker report, and the changed files or diff.

Check:
- Correctness.
- Scope drift.
- Missed atomic task coverage.
- Violated decisions or project constraints.
- Hidden fallback, compatibility debt, or legacy preservation.
- Incomplete evidence or unsupported claims.
- Verification gaps.
- Privacy, telemetry, billing, data integrity, and release-safety risks when relevant.

Verdict: pass / pass with gaps / fail.

Evidence supporting verdict:
- [repo evidence, diff evidence, command output, or task-doc evidence]
```

## Packet Report Skeleton

```md
# [Packet] Report

Status:
Controller decision:
Date:

## Objective

## Facts

## Assumptions

## Files Inspected

## Changes Made

## Verification

| Command | Result | Notes |
| --- | --- | --- |

## QA

Verdict:
Evidence:

## Evidence Paths

## Unverified Areas

## Remaining Risks

## Next Packet Recommendation
```

