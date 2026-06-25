# Fitaly Core Release Evidence

## Candidate identity

- RC id:
- Evidence date/time UTC:
- Release owner:
- Mobile branch:
- Mobile SHA:
- Backend branch:
- Backend SHA:
- Smoke deployment id/SHA:
- Production deployment id/SHA:
- iOS build id/version:
- Android build id/version:
- Runtime config snapshot/hash:

## Scope

- Included core surfaces:
- Explicitly excluded 1.1 surfaces:
- Confirmation that all 1.1 production flags are false: `yes|no`

## Gate summary

| Gate | Status | Evidence | Open finding/waiver |
| --- | --- | --- | --- |
| A Source integrity/exact pair | | | |
| B Runtime config/feature isolation | | | |
| C Mobile static/unit/contract | | | |
| D Backend static/unit/emulator | | | |
| E iOS runtime | | | |
| F Android runtime | | | |
| G Visual/UI | | | |
| H Security/privacy/compliance | | | |
| I Billing/premium | | | |
| J Backend smoke/deployed SHA | | | |
| K Backup/restore | | | |
| L Build/store readiness | | | |
| M Rollback/operations | | | |

## Runtime evidence

### iOS

- Suite/result:
- Artifact manifest:
- Accepted screenshot inventory:
- Open issues:

### Android

- Suite/result:
- Artifact manifest:
- Accepted screenshot inventory:
- Open issues:

## External integrations

| Integration | Evidence | Result |
| --- | --- | --- |
| Firebase/Auth/Firestore/Storage | | |
| OpenAI | | |
| RevenueCat | | |
| Sentry | | |
| Railway/deployment | | |
| App Store/TestFlight | | |
| Play Console/internal track | | |

## Security, privacy i data lifecycle

- Cross-user isolation:
- Firestore/Storage rules:
- Telemetry/Sentry PII audit:
- Export:
- Account deletion:
- Backup/restore:
- Legal URLs/store disclosures:

## Findings

### Open P0

- none / list

### Open P1

- none / list

### Waived P1

| Finding | Reason | Owner | Post-release due date |
| --- | --- | --- | --- |
| | | | |

## Rollback

- Previous stable backend deployment:
- Previous stable mobile artifact:
- Kill switches verified:
- Rollback rehearsal evidence:
- Monitoring/incident channel:

## Decision

Choose exactly one:

```text
CORE_RC_READY
NO_GO
BLOCKED_EXTERNAL_DEPENDENCY
```

- Decision:
- Reason:
- Rollout scope/percentage:
- Conditions:
- Signed by release owner:
- Signed at:
