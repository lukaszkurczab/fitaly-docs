# Release Evidence

- Generated at: 2026-06-22T00:40:05.603Z
- Mobile commit SHA: b92d976ffbfeaabfd0325c14931dca53d0502df1
- Mobile worktree status: dirty: 27 modified, 2 untracked
- Backend commit SHA: 6565a21514261444e9fed278296ef0e27b678e93
- Backend worktree status: dirty: 10 modified, 3 untracked
- Target environment: production
- Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY
- Evidence limitations: dirty worktrees; local iOS no-provider core-release-gate only; provider/prod/Android/backup/restore/deployed-SHA/manual evidence still missing or not owner-authorized
- Feature flag snapshot: {"DISABLE_BILLING":"false","EXPO_PUBLIC_ENABLE_TELEMETRY":"true","EXPO_PUBLIC_ENABLE_FOOD_LIBRARY":"false","EXPO_PUBLIC_ENABLE_SMART_MEMORY":"false","EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS":"false","EXPO_PUBLIC_ENABLE_RECIPE_CATALOG":"false","EXPO_PUBLIC_ENABLE_PLANNING":"false","EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION":"false","EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION":"false"}
- Mobile CI: not rerun in Q0J
- Backend CI: not rerun in Q0J
- Selected E2E platform: ios
- Smoke E2E: not rerun in Q0J; Q0G local smoke 7/7 remains prior evidence
- Release gate E2E: core-release-gate local iOS no-provider 20/20 from e2e/artifacts/core-release-gate-q0i-final-2
- E2E results artifact: fitaly/e2e/artifacts/core-release-gate-q0i-final-2/reports
- Skipped E2E suites: full release-gate feature-wave/provider suites; Android; prod/provider smoke
- Smoke runtime backend SHA: not provided
- Smoke export: not provided in Q0J
- Smoke flow contracts: not provided in Q0J
- Android targetSdk check: not rerun in Q0J
- Android AAB check: not rerun in Q0J
- Latest Firestore backup: missing
- Latest restore drill: missing
- Delete smoke evidence: pending manual attachment
- Delete smoke note: pending manual attachment
- Chat integrity tests: not rerun in Q0J
- Atomic onboarding contract: not rerun in Q0J
- Weekly Report premium gate: not rerun in Q0J
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

