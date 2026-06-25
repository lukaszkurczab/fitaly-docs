# M1G Smart Memory Runtime Telemetry Report

Status: `qa_passed_with_gaps`
Created: `2026-06-21T13:54:00Z`

## Scope

M1G closes the Smart Memory runtime telemetry gap for the current production-off
shadow-capture gate. It wires category-only telemetry to existing Memory Center
control actions that are already behind the `smartMemory` runtime feature flag.

Non-goals:

- no Smart Memory production activation;
- no Review apply enablement;
- no Home Next Action integration;
- no provider smoke, production data, credentials, Firebase, RevenueCat,
  Sentry, bundle ID, or package ID changes;
- no raw user content, IDs, source refs, nutrition values, prompts, responses,
  images, or full payloads in telemetry.

## Repo Snapshot

Mobile before M1G verification:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: broad pre-existing hardening dirty state plus M1G-relevant
  changes in `src/feature/UserProfile/screens/MemoryCenterScreen.tsx` and
  `src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`.

Backend before M1G backend telemetry verification:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: broad pre-existing hardening dirty state. M1G made no backend
  code edits.

## Confirmed Facts

- C5A already added Smart Memory telemetry event helpers and backend allowlist
  coverage, but `rg` found no active non-test callsites for
  `trackMemoryCandidate*`, `trackMemoryUsed`, `trackMemoryMuted`, or
  `trackMemoryDeleted`.
- `MemoryCenterScreen` is already guarded by `isRuntimeFeatureEnabled("smartMemory")`.
- Existing Memory Center mute/delete controls queue local Smart Memory control
  operations and do not require provider or production access.

## Changes

Mobile:

- Updated `src/feature/UserProfile/screens/MemoryCenterScreen.tsx`.
  - After a successful local mute queue, it emits `memory_muted` with:
    `memoryType`, `surface="memory_center"`, `actionResult="queued"`, and
    `featureState="enabled"`.
  - After a successful local delete queue, it emits `memory_deleted` with the
    same bounded prop shape.
  - Restore remains telemetry-silent because there is no C5 restore event.
- Updated `src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx`.
  - Proves disabled Smart Memory renders unavailable state and emits no mute or
    delete telemetry.
  - Proves mute emits only bounded category props and does not include
    `memory-1` or the local display label `Owsianka`.
  - Proves restore does not emit mute/delete telemetry.
  - Proves delete emits only bounded category props and does not include
    `memory-1` or the local display label `Owsianka`.

## Verification

Controller mobile verification:

- `npm run test:targeted -- --runTestsByPath src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx src/services/telemetry/telemetryInstrumentation.test.ts`
  - Result: `2 passed, 2 total`; `21 passed, 21 total`.
- `npm run typecheck`
  - Result: `tsc --noEmit` passed.
- `npm run lint`
  - Result: `eslint src --ext .ts,.tsx,.js,.jsx` passed.
- `git diff --check`
  - Result: passed.

Controller backend telemetry verification:

- `./.venv/bin/pytest tests/test_api_telemetry.py -k "smart_memory or memory_" -q`
  - Result: `1 passed, 47 deselected`.

## QA

Independent QA agent `Popper` returned `pass_with_gaps`.

QA reran:

- `npm run test:targeted -- --runTestsByPath src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx src/services/telemetry/telemetryInstrumentation.test.ts`
  - Result: passed; `2 suites passed`, `21 tests passed`.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `./.venv/bin/pytest tests/test_api_telemetry.py -k "smart_memory or memory_" -q`
  - Result: `1 passed, 47 deselected`.
- `./.venv/bin/pytest tests/test_api_telemetry.py::test_telemetry_batch_rejects_c5_forbidden_props -q`
  - Result: `1 passed`.

QA findings:

- Disabled Memory Center returns a feature-disabled state before reading or
  mutating Smart Memory or emitting telemetry.
- Mute telemetry is emitted only after `queueSmartMemoryItemMute`, with bounded
  props: `memoryType`, `surface="memory_center"`, `actionResult="queued"`,
  `featureState="enabled"`.
- Delete telemetry is emitted only after `queueSmartMemoryItemDelete`, with the
  same bounded prop shape.
- Restore returns after `queueSmartMemoryItemRestore` and does not emit
  mute/delete telemetry.
- Backend allowlist accepts Smart Memory C5 events and rejects forbidden props
  including raw text, IDs, source refs, prompts/responses, images, nutrition,
  and full payload fields.

QA gaps:

- QA did not run a device/emulator UI flow that captures actual outgoing
  telemetry from the app.
- M2 controls/apply gates remain outside this QA scope.

## Classification

M1G local runtime telemetry wiring: `qa_passed_with_gaps`.

M1 full launch gate: `partial`.

Reason: Memory Center now emits category-only Smart Memory telemetry for active
mute/delete control actions, tests prove no IDs or display labels are sent, and
independent QA found no blocking privacy/contract issue. Smart Memory
production flags must stay off until M2 controls/apply gates pass.

## Remaining Gate Blockers

- Keep Smart Memory production flags off until M2 controls/apply gates pass.

## Controller Decision

M1G: `qa_passed_with_gaps`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. Smart Memory is
not ready for production rollout.
