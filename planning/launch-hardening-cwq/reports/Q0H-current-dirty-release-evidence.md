# Release Evidence

- Generated at: 2026-06-21T22:25:00.335Z
- Mobile commit SHA: b92d976ffbfeaabfd0325c14931dca53d0502df1
- Mobile worktree status: dirty: 17 modified, 2 untracked
- Backend commit SHA: 6565a21514261444e9fed278296ef0e27b678e93
- Backend worktree status: dirty: 10 modified, 3 untracked
- Target environment: production
- Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY
- Evidence limitations: local evidence only; authenticated smoke-backend/provider/billing/backup/restore/production/deployed-SHA/manual evidence missing; current worktrees are dirty
- Feature flag snapshot: {"DEBUG_OCR":"false","DISABLE_BILLING":"false","E2E":"missing","EXPO_PUBLIC_ENABLE_BACKEND_LOGGING":"false","EXPO_PUBLIC_ENABLE_FOOD_LIBRARY":"false","EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION":"false","EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS":"false","EXPO_PUBLIC_ENABLE_PLANNING":"false","EXPO_PUBLIC_ENABLE_RECIPE_CATALOG":"false","EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION":"false","EXPO_PUBLIC_ENABLE_SMART_MEMORY":"false","EXPO_PUBLIC_ENABLE_SMART_REMINDERS":"true","EXPO_PUBLIC_ENABLE_TELEMETRY":"true","FORCE_PREMIUM":"missing"}
- Mobile CI: local Q0/Q0G targeted checks passed; remote CI not run
- Backend CI: local R1C full backend checks passed; remote CI not run
- Selected E2E platform: ios
- Smoke E2E: local no-provider smoke passed 7/7 in Q0G; fresh controller rerun 2026-06-21T22:12:55Z passed 7/7
- Release gate E2E: metadata validated; full runtime release-gate not run
- E2E results artifact: Q0G local smoke artifacts not attached to release packet
- Skipped E2E suites: authenticated smoke-backend/provider/prod suites not authorized; Android runtime unavailable
- Smoke runtime backend SHA: not provided
- Smoke export: unknown
- Smoke flow contracts: unknown
- Android targetSdk check: local launch-readiness checks passed in Q0A/Q0B/Q0D
- Android AAB check: not built
- Latest Firestore backup: missing
- Latest restore drill: missing
- Delete smoke evidence: pending manual attachment
- Delete smoke note: pending manual attachment
- Chat integrity tests: not run in Q0H
- Atomic onboarding contract: local targeted release tests passed in Q0A/Q0B
- Weekly Report premium gate: not run in Q0H
- Paywall truthfulness: pending manual attachment
- Privacy-safe logging e2e: pending manual attachment
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

