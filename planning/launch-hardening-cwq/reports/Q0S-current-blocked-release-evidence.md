# Release Evidence

- Generated at: 2026-06-22T22:32:38.966Z
- Mobile commit SHA: 829593cd75a534afeafb3657cb15f6a1141bbca0
- Mobile worktree status: clean
- Backend commit SHA: fa4711f0a43a0317c738b5394999942d30523afa
- Backend worktree status: clean
- Target environment: production
- Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY
- Evidence limitations: local commits are clean but not pushed to origin; provider evidence not supplied; production smoke, backup/restore, delete, paywall, privacy/Sentry, compliance, rollback, remote CI, Android runtime, live self-hosted RC workflow evidence, and production rollout authorization are not verified in this local packet
- Feature flag snapshot: {"DISABLE_BILLING":"false","EXPO_PUBLIC_ENABLE_TELEMETRY":"true","EXPO_PUBLIC_ENABLE_FOOD_LIBRARY":"false","EXPO_PUBLIC_ENABLE_SMART_MEMORY":"false","EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS":"false","EXPO_PUBLIC_ENABLE_RECIPE_CATALOG":"false","EXPO_PUBLIC_ENABLE_PLANNING":"false","EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION":"false","EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION":"false"}
- Mobile CI: unknown
- Backend CI: unknown
- Selected E2E platform: iOS simulator local no-provider
- Smoke E2E: local smoke 7/7 from Q0G; not rerun after Q0S local commits
- Release gate E2E: verified 20/20 flow report(s), 20 testcase(s), failures=0, errors=0, skipped=0 from e2e/artifacts/core-release-gate-q0p-current/reports
- E2E results artifact: fitaly/e2e/artifacts/core-release-gate-q0p-current/reports
- Skipped E2E suites: Provider-backed full release-gate, nightly regression, platform layout, Android runtime, production/smoke provider checks, and live self-hosted RC workflow were not run in this local packet.
- Smoke runtime backend SHA: not provided
- Smoke export: unknown
- Smoke flow contracts: unknown
- Android targetSdk check: unknown
- Android AAB check: unknown
- Latest Firestore backup: missing
- Latest restore drill: missing
- Delete smoke evidence: pending manual attachment
- Delete smoke note: pending manual attachment
- Chat integrity tests: unknown
- Atomic onboarding contract: unknown
- Weekly Report premium gate: unknown
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

