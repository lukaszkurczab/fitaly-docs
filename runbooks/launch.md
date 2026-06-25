# Launch Runbook

Runbook dla release candidates i public rollout `fitaly` + `fitaly-backend`.

## Ownership

- Release manager: Engineering Lead
- Mobile runtime/config gate: Mobile Engineer
- Backend runtime/config gate: Backend Engineer
- Store metadata/compliance: Product + Ops
- Incident commander Day0-Day7: Engineering Lead
- Primary incident channel: Discord `launch-ops`
- ACK SLA Day0-Day7: `<= 15 minutes` dla production alerts

## Launch Checklist

- Mobile CI passes: lint, typecheck, tests, launch-readiness config gate.
- Backend CI passes: ruff, pyright, pytest.
- Cross-repo contract sync job is green.
- Release Candidate workflow is green and produced release evidence.
- RC smoke E2E passes on prepared runner.
- RC smoke flow-contract verification passes:
  - `GET /api/v1/ai/credits`
  - `GET /api/v2/users/me/reports/weekly` returns expected free-user denial on smoke.
- Optional bounded provider smoke matrix evidence is attached only when
  intentionally scheduled by the release owner; it follows the
  [runtime-config bounded provider smoke matrix](./runtime-config.md#bounded-provider-smoke-matrix)
  for OpenAI, RevenueCat sandbox/webhook, Railway health/smoke, telemetry
  ingest, and backend/mobile flow-contract checks. It is distinct from RC smoke
  E2E, emulator-backed tests, mocked/provider-fake tests, and flow-contract
  acceptance.
- Chat integrity evidence is green.
- Onboarding backend contract tests are green.
- Weekly report premium boundary is backend-true.
- Paywall evidence matches real purchasable offer.
- Privacy-safe logging and Sentry hardening evidence is attached.
- Compliance packet is attached.
- Release rehearsal packet is attached.
- `TERMS_URL` and `PRIVACY_URL` are valid public HTTPS URLs.
- Runtime config matches [runtime-config](./runtime-config.md).
- Latest Firestore backup and restore drill evidence are available.
- Android release artifact is AAB.

## Intentional iOS Identifier Exception

App Store iOS releases keep legacy bundle identifier `com.lkurczab.foodscannerai`. This is intentional because the App Store listing is already tied to that identifier. Do not block release only because Android package naming differs.

## Solo-Release Convention

Projekt jest operowany solo. Nie wymagaj osobnego GitHub production environment reviewer jako launch criterion. Release approval robi release owner.

## Release Steps

1. Build RC with `smoke` or `internal` profile.
2. Run Release Candidate workflow and attach disposable smoke delete evidence when required.
3. Review release evidence as operator checklist.
4. If intentionally scheduled, run only the selected bounded smoke
   surface with disposable smoke data and attach only sanitized operational
   evidence.
5. Approve release directly as release owner.
6. Execute manual sanity check on both platforms.
7. Build production artifacts: `publish:android`, `publish:ios`.
8. Upload to store tracks with phased rollout.
9. Monitor Day0-Day7 metrics and Discord `launch-ops`.

## Rollback Matrix

- Routing/config regression: stop rollout and rebuild with corrected env mapping.
- Backend startup failure: restore previous deployment and correct production env.
- Smart Reminders incident: set `SMART_REMINDERS_ENABLED=false`.
- Weekly Reports incident: set `WEEKLY_REPORTS_ENABLED=false`.
- Telemetry incident: set `TELEMETRY_ENABLED=false`.
- Severe user-impact issue: pause rollout/unpublish until hotfix is validated.

## Release Acceptance Follow-up

Latest migrated status from release-hardening docs: final No-Go was verification incompleteness, not a confirmed product regression. Static/unit/visual/release-gate checks passed, but clean full-review did not complete after harness fixes.

Post-release strategy lives in
[Post Release Intelligence](../Fitaly_Post_Release_Intelligence.md). Current
release blockers or follow-ups should be tracked from fresh repo evidence, not
from removed historical planning docs.

## Zrodla

Runbook zostal skondensowany z poprzednich dokumentow launch/readiness i aktualnych README repozytoriow.
