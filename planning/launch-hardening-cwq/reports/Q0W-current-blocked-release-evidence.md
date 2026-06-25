# Release Evidence

- Generated at: 2026-06-23T23:37:31.712Z
- Mobile commit SHA: 80790f6a0fb4c70bf949a39ee7737085195ca3f3
- Mobile worktree status: clean
- Backend commit SHA: fe01fbaf92921271968e9d7bde329530b42513eb
- Backend worktree status: clean
- Target environment: production
- Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY
- Evidence limitations: Q0V pair is pushed and normal exact-SHA CI passed, but Android simulator runtime cannot start because no booted emulator or configured AVD exists; provider/manual evidence is not supplied; production smoke, backup/restore, delete, paywall, privacy/Sentry, compliance, rollback, live self-hosted RC workflow, deployed backend SHA, and production rollout authorization are not verified in this packet; physical-device validation is skipped by owner instruction and not claimed.
- Feature flag snapshot: {"DISABLE_BILLING":"false","EXPO_PUBLIC_ENABLE_TELEMETRY":"true","EXPO_PUBLIC_ENABLE_FOOD_LIBRARY":"false","EXPO_PUBLIC_ENABLE_SMART_MEMORY":"false","EXPO_PUBLIC_ENABLE_KNOWN_PATTERNS":"false","EXPO_PUBLIC_ENABLE_RECIPE_CATALOG":"false","EXPO_PUBLIC_ENABLE_PLANNING":"false","EXPO_PUBLIC_ENABLE_HOME_NEXT_ACTION":"false","EXPO_PUBLIC_ENABLE_REVIEW_MEMORY_EXPLANATION":"false"}
- Mobile CI: verified mobile CI run https://github.com/lukaszkurczab/fitaly/actions/runs/28063907416 for mobile 80790f6a0fb4c70bf949a39ee7737085195ca3f3 with backend ref fe01fbaf92921271968e9d7bde329530b42513eb
- Backend CI: verified backend CI run https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28063907468 for backend fe01fbaf92921271968e9d7bde329530b42513eb with mobile ref 80790f6a0fb4c70bf949a39ee7737085195ca3f3
- Selected E2E platform: Android simulator preflight only; not_ready because no booted emulator or configured AVD; physical-device validation skipped.
- Smoke E2E: not rerun in Q0W; prior local no-provider smoke evidence exists in Q0G but is not fresh for this artifact.
- Release gate E2E: not rerun in Q0W; prior local iOS no-provider core-release-gate 20/20 evidence exists in Q0O/Q0P/Q0Q but is not fresh for this artifact.
- E2E results artifact: none generated in Q0W
- Skipped E2E suites: Android runtime, provider-backed full release-gate, nightly regression, platform layout, production/smoke provider checks, billing, backup/restore, delete, privacy/Sentry, compliance, rollback, and live self-hosted RC workflow were not run in this packet; physical-device validation skipped by owner instruction.
- Smoke runtime backend SHA: not provided
- Smoke export: not generated in Q0W
- Smoke flow contracts: not generated in Q0W
- Android targetSdk check: verified mobile CI run 28063907416 passed launch readiness config checks, including Android config check.
- Android AAB check: not built in Q0W; no production Android AAB evidence.
- Latest Firestore backup: missing
- Latest restore drill: missing
- Delete smoke evidence: pending manual attachment
- Delete smoke note: pending manual attachment
- Chat integrity tests: not rerun in Q0W
- Atomic onboarding contract: not rerun in Q0W
- Weekly Report premium gate: not rerun in Q0W
- Paywall truthfulness: not attached in Q0W
- Privacy-safe logging e2e: not run in Q0W
- Sentry scrubbing evidence: not attached in Q0W
- Compliance evidence packet: not attached in Q0W
- Rollback rehearsal note: not attached in Q0W

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

