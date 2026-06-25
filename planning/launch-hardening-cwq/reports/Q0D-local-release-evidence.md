# Release Evidence

- Generated at: 2026-06-20T21:58:34Z
- Mobile commit SHA: 5827c0a8c7618ce1523734e83f752e15e25258be
- Backend commit SHA: 0988f53a9b76d25f3c38893cf54f5de44a9e9df7
- Target environment: production
- Feature flag snapshot: {"DEBUG_OCR":"false","DISABLE_BILLING":"false","E2E":"missing","EXPO_PUBLIC_ENABLE_BACKEND_LOGGING":"false","EXPO_PUBLIC_ENABLE_FOOD_LIBRARY":"false","EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION":"false","EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS":"false","EXPO_PUBLIC_ENABLE_PLANNING":"false","EXPO_PUBLIC_ENABLE_RECIPE_CATALOG":"false","EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION":"false","EXPO_PUBLIC_ENABLE_SMART_MEMORY":"false","EXPO_PUBLIC_ENABLE_SMART_REMINDERS":"true","EXPO_PUBLIC_ENABLE_TELEMETRY":"true","FORCE_PREMIUM":"missing"}
- Mobile CI: local Q0A-Q0C checks passed; remote CI not run
- Backend CI: local Q0C full pytest/ruff/pyright passed; remote CI not run
- Selected E2E platform: not run
- Smoke E2E: not run
- Release gate E2E: not run
- E2E results artifact: not generated
- Skipped E2E suites: runtime suites not run; provider/prod access not authorized
- Smoke runtime backend SHA: not provided
- Smoke export: not run
- Smoke flow contracts: not run
- Android targetSdk check: local launch-readiness checks passed in Q0A/Q0B; store artifact not built
- Android AAB check: not built
- Latest Firestore backup: missing
- Latest restore drill: missing
- Delete smoke evidence: pending manual attachment
- Delete smoke note: pending manual attachment
- Chat integrity tests: not run in Q0D
- Atomic onboarding contract: local targeted release tests passed in Q0A/Q0B
- Weekly Report premium gate: not run in Q0D
- Paywall truthfulness: pending manual attachment
- Privacy-safe logging e2e: pending runtime evidence
- Sentry scrubbing evidence: pending manual attachment
- Compliance evidence packet: pending manual attachment
- Rollback rehearsal note: pending manual attachment

## Smoke Export Summary
- Smoke export summary was not generated.

## Smoke Flow Contract Summary
- Smoke flow summary was not generated.

## Manual Follow-ups
- Attach the disposable smoke delete log before final release approval.
- Attach paywall screenshot + purchase/restore smoke note for visible offer.
- Attach fake-PII logging evidence and Sentry data-scrubbing/retention screenshots.
- Attach compliance packet link (retention matrix, processor list, DPA/SCC status, export/delete trail).
- Attach rollback rehearsal note with candidate version/build identifiers.
- Review any missing manual evidence explicitly as the release owner before rollout.
- Confirm Sentry production alerts for backend 5xx spike and mobile crash/session drop route to Discord.

