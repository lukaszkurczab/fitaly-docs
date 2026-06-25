# Release Evidence

- Generated at: 2026-06-23T07:34:16Z
- Updated after commit/push: 2026-06-23T07:40:02Z
- Mobile commit SHA: 21f8c52d
- Mobile branch: codex/smart-memory-core-loop-fe
- Mobile worktree status: clean
- Mobile origin sync: 0 ahead / 0 behind
- Backend commit SHA: d82f938
- Backend branch: codex/smart-memory-core-loop-be
- Backend worktree status: clean
- Backend origin sync: 0 ahead / 0 behind
- Target environment: production
- Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY
- Evidence limitations: current auth/profile seed repair is committed and
  pushed, but provider evidence not supplied; production smoke, backup/restore,
  delete, paywall, privacy/Sentry, compliance, rollback, remote CI, Android
  runtime, live self-hosted RC workflow evidence, deployed backend SHA, and
  production rollout authorization are not verified in this packet.
- Feature flag snapshot: new-domain production flags remain required to stay
  off; this slice did not change production feature activation.
- Mobile CI: unknown
- Backend CI: unknown
- Selected E2E platform: not rerun in this packet
- Smoke E2E: YAML validation only in this packet; no new smoke runtime pass
- Release gate E2E: not rerun in this packet
- E2E results artifact: none generated in this packet
- Skipped E2E suites: provider-backed full release-gate, nightly regression,
  platform layout, Android runtime, production/smoke provider checks, live
  self-hosted RC workflow, and full local Maestro runtime were not run in this
  packet.
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

## Local Auth/Profile Seed Repair Summary

- Active-source search found no `fitaly://e2e/login`, fake auth session/token,
  or `buildE2EProfileSeed` references.
- Local E2E Auth/Profile seeding now requires a loopback backend API plus
  explicit Firebase Auth and Firestore emulator hosts.
- Backend seeder rejects non-loopback emulator hosts.
- Independent QA re-check returned `pass`.

## Manual Follow-ups

- Inspect remote CI for the exact pushed FE/BE pair.
- Attach the disposable smoke delete log before final release approval.
- Attach paywall screenshot plus purchase/restore smoke note for visible offer.
- Attach fake-PII logging evidence and Sentry data-scrubbing/retention
  screenshots.
- Attach compliance packet link.
- Attach rollback rehearsal note with candidate version/build identifiers.
- Confirm Sentry production alerts for backend 5xx spike and mobile
  crash/session drop route to Discord.
