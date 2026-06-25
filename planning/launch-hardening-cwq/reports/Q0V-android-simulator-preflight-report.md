# Q0V Android Simulator Preflight Report

Date: 2026-06-24
Controller decision: `BLOCKED_EXTERNAL_DEPENDENCY`

## Objective

Make the Q0 Android runtime blocker reproducible without using production,
provider smoke, credentials, or physical-device validation.

## Scope

- Mobile repo:
  `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA at slice start: `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- Mobile SHA after Q0V commit/push:
  `80790f6a0fb4c70bf949a39ee7737085195ca3f3`
- Backend repo:
  `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA at slice start: `fe01fbaf92921271968e9d7bde329530b42513eb`

## Confirmed Facts

- Both repo worktrees were clean and synchronized with upstream before this
  slice.
- `scripts/run-e2e-local.sh` already has Android platform routing through
  `E2E_PLATFORM=android`.
- The local shell did not have `maestro` on `PATH`, but Maestro exists at
  `/Users/lukaszkurczab/.maestro/bin/maestro`.
- Sandboxed `emulator -list-avds` and Maestro initialization cannot be trusted
  because they require user-home tool access; the accepted preflight was run
  outside the sandbox.
- Physical-device validation is skipped by owner instruction and is not
  accepted by this preflight.

## Changes

- Added mobile script:
  `scripts/e2e/check-android-simulator-ready.mjs`
- Added mobile package script:
  `npm run e2e:android-simulator:preflight`
- Committed and pushed mobile commit:
  `80790f6a0fb4c70bf949a39ee7737085195ca3f3`
  (`test(e2e): add Android simulator preflight`)

The script fails closed unless all required local Android simulator conditions
are true:

- `adb` is available;
- Android `emulator` is available;
- Maestro CLI is available;
- at least one booted Android emulator is attached through `adb`;
- at least one Android Virtual Device is configured;
- physical devices are ignored, not accepted as evidence.

## Verification

| Command | Result |
| --- | --- |
| `node --check scripts/e2e/check-android-simulator-ready.mjs` | pass |
| `npm run e2e:android-simulator:preflight -- --json` | expected exit `2`; status `not_ready` |
| mobile GitHub Actions CI `28063907416` | success for mobile `80790f6a0fb4c70bf949a39ee7737085195ca3f3` with backend contract ref `fe01fbaf92921271968e9d7bde329530b42513eb` |
| backend GitHub Actions CI `28063907468` | success for backend `fe01fbaf92921271968e9d7bde329530b42513eb` with mobile contract ref `80790f6a0fb4c70bf949a39ee7737085195ca3f3` |

Accepted preflight output:

```json
{
  "status": "not_ready",
  "checks": {
    "adb": {
      "path": "/Users/lukaszkurczab/Library/Android/sdk/platform-tools/adb",
      "status": 0,
      "timedOut": false
    },
    "emulator": {
      "path": "/Users/lukaszkurczab/Library/Android/sdk/emulator/emulator",
      "status": 0,
      "timedOut": false
    },
    "maestro": {
      "path": "/Users/lukaszkurczab/.maestro/bin/maestro",
      "status": "found"
    }
  },
  "androidTargets": {
    "bootedEmulators": [],
    "configuredAvds": [],
    "ignoredPhysicalDevices": []
  },
  "policy": {
    "acceptsPhysicalDevices": false,
    "reason": "Owner instructed this hardening pass to skip physical-device validation and use simulators only."
  },
  "failures": [
    "No booted Android emulator is attached through adb.",
    "No configured Android Virtual Device was reported by emulator -list-avds."
  ]
}
```

## Classification

Q0 Android runtime evidence is still missing. The current local blocker is
earlier than app runtime: no Android emulator target is available because
`adb devices` reports no booted emulator and `emulator -list-avds` reports no
configured AVD.

This is not a provider/prod blocker and not a physical-device blocker. It is a
local simulator infrastructure blocker.

Normal remote CI pairing passed for the Q0V pair, but that CI does not run an
Android simulator app flow and does not replace Android runtime evidence.

## Non-Claims

- No Android Maestro app flow was run.
- No Android runtime pass is claimed.
- No production, smoke-provider, billing, backup/restore, Sentry/privacy,
  compliance, rollback, deployed backend, or launch readiness evidence is
  claimed.
- No physical-device validation is claimed.

## Next Step

Provision or boot an Android Virtual Device, then rerun:

```bash
npm run e2e:android-simulator:preflight -- --json
```

Only after that preflight returns `status=ready` should a simulator-only Android
Maestro runtime slice be attempted.
