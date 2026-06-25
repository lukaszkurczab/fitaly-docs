# Q0I Core Release Gate Maestro Repair Report

Status: `QA_PASS_WITH_GAPS`
Date: 2026-06-22
Controller: Codex

## Objective

Repair local Maestro release-gate reliability before continuing launch hardening,
and create a core-only local gate for the safe release target where new domains
remain production-off.

## Repo Snapshot

Mobile:

- Branch: `codex/smart-memory-core-loop-fe`
- SHA: `b92d976ffbfeaabfd0325c14931dca53d0502df1`
- Dirty state: dirty before and after Q0I; Q0I touched Maestro suite/flow files,
  suite metadata, and coverage metadata. Existing Q0G/Q0H mobile changes remain
  uncommitted in the same worktree.

Backend:

- Branch: `codex/smart-memory-core-loop-be`
- SHA: `6565a21514261444e9fed278296ef0e27b678e93`
- Dirty state: dirty with existing R1C changes; Q0I did not edit backend files.

## Confirmed Facts

- Existing `release-gate` mixes core release evidence with feature-wave/new-domain
  flows. Q0I added `core-release-gate` as the local no-provider core gate and
  left the broader `release-gate` intact.
- `core-release-gate` contains 20 local-safe flows and excludes Smart Memory,
  Recipe Catalog, Known Patterns, Planning, Home Next Action, Food Library
  autocomplete, provider-backed registration, and account user-switch isolation.
- Initial full `core-release-gate --continue-on-failure` passed `16/20`; failures
  were stale or flaky Maestro contracts, not accepted product readiness failures:
  `offline-save-sync`, `add-meal-manual-edit-save-propagates`,
  `review-edit-layout`, and `share-save-and-share`.
- Runtime screenshots/logs showed:
  - manual/offline ingredient flows were tapping the wrong area unless
    `ingredient-add-button` was centered;
  - `offline-save-sync` also needed a minimal macro estimate because the current
    sheet correctly blocks name-only ingredient commits;
  - `review-edit-layout` used stale `review-meal-edit-button`; current code and
    tests expose `review-meal-ingredients-edit-button`;
  - share/history failures were caused by Home CTA taps missing the centered
    `home-view-history-button`;
  - intermittent 6-second full-suite failures came from Maestro/XCTest
    `kAXErrorInvalidUIElement` during optional boot `runFlow when visible`
    predicates in shared login/bootstrap flows.

## Changed Files

Mobile Q0I files:

- `package.json`
- `scripts/e2e/suites.json`
- `scripts/e2e/validate-dynamic-text-assertions.mjs`
- `scripts/e2e/release-coverage.ch-08-003.json`
- `e2e/maestro/smoke/login.yaml`
- `e2e/maestro/smoke/auth-bootstrap.yaml`
- `e2e/maestro/release-gate/core-off-local-auth-shell.yaml`
- `e2e/maestro/release-gate/history-edit-delete.yaml`
- `e2e/maestro/release-gate/offline-save-sync.yaml`
- `e2e/maestro/release-gate/add-meal-manual-edit-save-propagates.yaml`
- `e2e/maestro/release-gate/review-edit-layout.yaml`
- `e2e/maestro/release-gate/share-save-and-share.yaml`

## Implementation Notes

- Added npm script `e2e:core-release-gate`.
- Added `core-release-gate` suite with 20 core/local-safe flows.
- Added `core-release-gate` to release-relevant dynamic text validation.
- Added `core-release-gate` suite ownership to relevant release coverage entries.
- Repaired Maestro flow drift by centering scroll targets, asserting visible
  targets before tapping, replacing stale Review edit selector, and aligning the
  offline ingredient test with the current macro-required sheet contract.
- Removed optional pre-boot `runFlow when visible` prompt handling from core
  bootstrap flows where Maestro/XCTest hierarchy reads were intermittently
  crashing. The deterministic readiness check is now the app-provided
  `e2e-booted` marker and E2E deeplink markers.

## Verification

Static/local:

- `node scripts/e2e/run-suite.mjs core-release-gate --list` listed 20 flows.
- `node scripts/e2e/run-suite.mjs core-release-gate --validate` passed.
- `npm run e2e:dynamic-text:check` passed:
  `CH-08-004 validated 12 release-relevant suite(s) and 69 unique Maestro flow(s)`.
- `npm run e2e:coverage:check` passed:
  `18 covered, 2 gap(s), 37 flow reference(s)`.
- `git diff --check` passed.

Targeted runtime:

- `offline-save-sync` isolated passed `1/1` after repair.
- `add-meal-manual-edit-save-propagates` isolated passed `1/1`.
- `review-edit-layout` isolated passed `1/1`.
- `share-save-and-share` isolated passed `1/1`.
- Two-flow bootstrap recheck `offline-save-sync` +
  `add-meal-photo-save-propagates` passed `2/2`.
- Two-flow sequence recheck `add-meal-text-save-propagates` +
  `add-meal-photo-save-propagates` passed `2/2`.

Full core gate:

- `env E2E_EXPO_PORT=8098 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 E2E_ARTIFACT_DIR=e2e/artifacts/core-release-gate-q0i-final-2 npm run e2e:core-release-gate -- --continue-on-failure`
  passed `20/20`.
- Report files: `fitaly/e2e/artifacts/core-release-gate-q0i-final-2/reports/`
  contains 20 JUnit XML files.
- Failure screenshots in final run: `0`.
- Expo/Metro cleanup confirmed: port `8098` was free after the run.

## Unverified Areas

- This is local iOS no-provider evidence only.
- No Android runtime evidence was produced in Q0I.
- No provider/prod smoke, RevenueCat provider, backup/restore, deployed backend
  SHA, Sentry secret, legal URL, store metadata, or production access evidence
  was produced or authorized in Q0I.
- Existing dirty worktrees remain, so this does not create a clean RC artifact.

## Controller Decision

Q0I local worker result: `worker_done`.

Independent QA result: `QA_PASS_WITH_GAPS`.

QA found no blocking issues. The non-blocking gap is that shared bootstrap now
uses E2E login deeplinks for the local no-provider core gate; this must not be
treated as login-form, prompt-handling, provider, or production-auth readiness.
The controller accepts this as non-blocking because Q0I is explicitly local
no-provider Maestro evidence and the external/provider auth gates remain open.

The local Maestro core gate is repaired and the new `core-release-gate` passed
`20/20` on iOS local no-provider runtime. This supports continuing Q0 hardening,
but it does not by itself justify `CORE_RC_READY` or `FULL_1_1_RC_READY`.

Overall release decision remains `BLOCKED_EXTERNAL_DEPENDENCY` until the open Q0
external gates and clean paired release evidence are resolved.
