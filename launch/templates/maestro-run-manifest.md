# Maestro Run Manifest

Ten plik jest companion evidence dla surowego outputu runnera. Nie zastępuje
`manifest.json`, JUnit/reports, logs ani screenshotów.

## Identity

- RC id:
- Run id:
- Date/time UTC:
- Operator:
- FE branch:
- FE SHA:
- BE branch:
- BE SHA:
- Backend target/environment:
- Backend base URL label:
- Deployed BE SHA, jeśli dotyczy:
- Docs SHA:

## Raw bundle linkage

- Raw bundle path/URL:
- Raw `manifest.json` path/URL:
- Raw manifest SHA-256, jeśli bundle jest zewnętrzny:
- Runner version lub FE SHA zawierający runner:
- Reports directory:
- Logs directory:
- Screenshots directory:
- Raw bundle retained until:

## Runtime

- Platform:
- OS version:
- Device/simulator/AVD:
- Build profile:
- App version/build:
- Locale:
- Suite:
- Command:

## Flags

| Flag | Value |
| --- | --- |
| Telemetry | |
| Smart Reminders | |
| Weekly Reports | |
| Billing disabled | false |
| AI Chat | true |
| AI Meal Analysis | true |
| Food Library | false |
| Smart Memory | false |
| Known Patterns | false |
| Recipe Catalog | false |
| Planning | false |
| Home Next Action | false |
| Review Memory Explanation | false |

## Result

- Overall: `passed|failed|blocked`
- Tests passed/total:
- Expected screenshots:
- Produced screenshots:
- Missing screenshots:
- First failed flow/step:
- Failure classification: `product|harness|environment|external|unknown`
- Retry performed:
- Final accepted run:

## Artifacts

- JUnit/reports:
- Logs:
- Screenshots:
- Video:
- CI/EAS artifact URL or local bundle:
- Redaction reviewed: `yes|no`

## Review

- Scope matches `core-release-gate`: `yes|no`
- Exact FE/BE pair confirmed: `yes|no`
- Runtime config matches release candidate: `yes|no`
- Any 1.1 flow included: `yes|no`
- If yes, excluded from core decision: `yes|no|n/a`
- Known limitations:
- Follow-up findings:
- Evidence accepted by:
- Accepted at:
