# Release Hardening Status

## Pair

Mobile branch: `codex/smart-memory-core-loop-fe`
Mobile SHA: `59feb230b74914ef5a7963b05d2a19dd695edef4`
Backend branch: `codex/smart-memory-core-loop-be`
Backend SHA: `fe01fbaf92921271968e9d7bde329530b42513eb`
Started at: `2026-06-20T11:54:01Z`
Last updated: `2026-06-24`
Controller: `Codex`

## Outcome Target

- [ ] CORE_RC_READY
- [ ] FULL_1_1_RC_READY

Current decision: `BLOCKED_EXTERNAL_DEPENDENCY`

Reason: C0-C4, C5A, C5B, C5C, C5D, F1A, F1B, F1C, F1D, F1E, F1F, M1A, M1B1, M1B2, M1C, M1D, M2A, M2B, M2C, M2D, M2E, M2F, M2G, K1A, K1B, K1C, and P1 Planning truth/lifecycle passed local worker/QA or controller evidence
gates, and Q0A/Q0B/Q0C/Q0D/Q0E/Q0G/Q0H
static/readiness/high-audit/full-local-regression/local release-artifact/local
unauthenticated runtime/local no-provider Maestro smoke evidence is partially
green. Q0H refreshes the current release-evidence artifact for the latest
mobile/backend SHAs while computing worktree status from git when repo paths
are available, requiring git-derived status for clean-worktree evidence, and
explicitly recording dirty worktrees plus
`BLOCKED_EXTERNAL_DEPENDENCY`. Q0I adds a core-only local Maestro suite,
repairs stale/flaky core flow contracts, and records local iOS no-provider
`core-release-gate` `20/20` evidence. Independent QA returned
`QA_PASS_WITH_GAPS` with no blockers and only the expected local no-provider
auth-boundary gap. Q0J refreshes the current release-evidence artifact at
`reports/Q0J-current-core-release-evidence.md`, preserving dirty worktree and
external-blocker status while adding the Q0I core gate evidence. Q0K hardens
that release-evidence path so `Release gate E2E` is derived from JUnit XML when
`RELEASE_GATE_RESULTS_DIR` is provided and expected flow IDs can be compared
against the configured suite; `reports/Q0K-verified-core-release-evidence.md`
records verified local Maestro `20/20` with zero failures/errors/skips.
Independent QA returned `pass_with_gaps` for Q0K with no blocking findings;
the accepted gap is that this is local evidence hardening, not clean RC
evidence, while the worktrees remain dirty and external Q0 gates remain open.
Q0L adds a readiness-decision guard: `CORE_RC_READY` and
`FULL_1_1_RC_READY` artifacts now require clean git-derived worktrees,
production target, complete critical launch/Q0 evidence, JUnit-verified release
gate evidence from an explicit `RELEASE_GATE_RESULTS_DIR`, and verified smoke
runtime backend SHA before the renderer will write an artifact. Q0L also
requires explicit release-gate breadth/identity metadata and rejects absolute
local artifact paths in release-critical evidence. A fresh local iOS
no-provider `core-release-gate` rerun passed `20/20` and generated
`fitaly/e2e/artifacts/core-release-gate-maestro-repair-20260622/reports/`.
The current Q0L artifact remains
`BLOCKED_EXTERNAL_DEPENDENCY`, and a negative `CORE_RC_READY` probe failed on
the current dirty worktree before writing output. Q0M rewires the GitHub RC
workflow to run `e2e:core-release-gate`, upload/download core JUnit reports,
and render release-gate evidence with `RELEASE_GATE_RESULTS_DIR`, expected
count, suite key, and suite name instead of a manual
`RELEASE_GATE_E2E_STATUS: passed`; independent QA returned
`QA_PASS_WITH_GAPS` after two P2 workflow-test hardening repairs, with only the
expected no-live-self-hosted-runner gap remaining. No live clean RC artifact is
claimed from this local workflow patch. Q0N adds proof-backed readiness
evidence requirements so `CORE_RC_READY` / `FULL_1_1_RC_READY` reject generic
critical-field values such as `passed`/`done` and negated proof language such
as `not verified`; the RC workflow now renders proof-backed GitHub Actions run
URLs/artifact references instead of bare status labels. Q0N independent QA
returned `QA_PASS_WITH_GAPS` with only no-live-run and pattern-vs-semantic
external-evidence gaps. Q0O repairs the local no-provider Maestro core gate by splitting
provider-backed offline reconnect sync evidence from core local pending-state
evidence; a fresh local iOS no-provider `core-release-gate` passed `20/20`
with `E2E_API_BASE_URL=http://127.0.0.1:9`, and the RC workflow Maestro job is
pinned to the same local-only API settings without smoke credential env. Q0P
refreshes the current blocked release-evidence artifact at
`reports/Q0P-current-blocked-release-evidence.md` with current dirty worktree
evidence, production-off feature flags, and the repaired Q0O local core JUnit
`20/20` set; independent QA returned `QA_PASS_WITH_GAPS` with only expected
external/runtime gaps. Q0F confirms remaining release-readiness evidence requires owner
authorization, external artifacts, provider credentials, production/smoke
access, or local Android/full-auth environment setup. Q0V adds a fail-closed
Android simulator preflight and records the current local Android state as
`not_ready`: `adb`, Android `emulator`, and Maestro are present, but no booted
emulator or configured AVD exists. Q0V was committed and pushed as mobile
`80790f6a0fb4c70bf949a39ee7737085195ca3f3`, and normal exact-SHA CI passed as
mobile run `28063907416` plus backend run `28063907468`. Q0W refreshes the
current blocked release-evidence artifact for mobile `80790f6a...` plus backend
`fe01fba...`, after fetch/clean/diff-to-origin checks, and keeps
`BLOCKED_EXTERNAL_DEPENDENCY`. Q0X commits and pushes the local iOS core-gate
harness repair as mobile `59feb230b74914ef5a7963b05d2a19dd695edef4`: no-provider
RevenueCat/billing env overrides now survive `.env` sourcing, and
`offline-save-pending-local` no longer mixes local pending-state evidence with
the separate reconnect-sync flow. Pre-commit local iOS core-release-gate passed
`20/20`; the post-push full attempt passed 15 flows and then hit a
Maestro/XCTest splash hierarchy failure in nested login before chat assertions.
Post-push isolated `chat-basic-history` passed `1/1`, and the four not-reached
remaining core flows passed `4/4`. This does not replace a single green
post-push full-suite artifact, and no exact remote CI run exists for
`59feb230...`; the decision remains `BLOCKED_EXTERNAL_DEPENDENCY`. The latest controller
Maestro rerun for Q0G on `2026-06-21T22:12:55Z` passed local no-provider smoke
`7/7` after the E2E-only login/session repair. F1A proves Food Library
seed/corpus validation mechanics only. F1B adds the focused
`ingredient-autocomplete-runtime` local harness, wires local-only Food Library
flag activation for autocomplete E2E runs, refuses non-local/smoke/prod API
targets for those runs, requires Auth/Firestore emulators, seeds autocomplete
records for every autocomplete flow, and adds loopback-only guards to the
backend autocomplete seeder before Auth or Firestore writes. F1B independent QA
returned `pass_with_gaps` with no blocking findings. F1B was committed and
pushed as mobile `2eb2998b30c352e3f246ec8692eec59c1ab24ba9` and backend
`f681d983941fe2d20cc857811493ee5bbd9def4f`; mobile remote CI
`https://github.com/lukaszkurczab/fitaly/actions/runs/28030428260` passed with
exact backend ref `f681d983941fe2d20cc857811493ee5bbd9def4f`, and backend
remote CI `https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28030431088`
passed with exact mobile ref `2eb2998b30c352e3f246ec8692eec59c1ab24ba9`.
F1C repairs the local runtime blocker for the focused autocomplete suite by
increasing the mobile ingredient add CTA touch target, preserving child tap
handling in the form scroll view, and preserving blank provider/secrets env
overrides in the local runner after `.env` sourcing. Local iOS simulator
`ingredient-autocomplete-runtime` passed `7/7` against local backend and
Firebase Auth/Firestore emulators with provider env blanked; artifacts are
under `/private/tmp/fitaly-f1c-ingredient-autocomplete-runtime-after-ui-fix/`.
F1C was committed and pushed as mobile
`5de157eb42ca79c15b1fd4e943a6157d64b99e7c`; mobile CI run
`28041016021` passed with exact backend ref
`f681d983941fe2d20cc857811493ee5bbd9def4f`. F1D was committed and pushed as
backend `fe01fbaf92921271968e9d7bde329530b42513eb`; it adds local API-route
PL/EN query-hit evidence for `Owies`, `Ostrzeżenie`, and `Oats` plus local
route latency evidence (`p95=1.17ms`, threshold `50ms`) through
`/api/v2/users/me/ingredient-products/search`. F1E refreshes the focused local
iOS simulator `ingredient-autocomplete-runtime` suite on the current pair
mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend
`fe01fbaf92921271968e9d7bde329530b42513eb`, passing `7/7` with seven JUnit XML
reports under
`/private/tmp/fitaly-f1-current-pair-ingredient-autocomplete-runtime-20260624-rerun1/reports/`.
F1F adds exact-SHA remote CI pairing for the same current pair: mobile run
`https://github.com/lukaszkurczab/fitaly/actions/runs/28062888358` passed with
backend contract ref `fe01fbaf92921271968e9d7bde329530b42513eb`, and backend
run `https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28062888045`
passed with mobile contract ref `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`.
Food Library production rollout remains blocked by missing approved corpus,
owner quality and source-confidence sign-off, authorized production/provider
evidence, deployed/network latency evidence, and feature-wave rollout approval;
the F1D/F1E/F1F evidence is not production/provider evidence. Physical-device
validation is skipped by owner instruction and is not claimed.
M1A proves Smart Memory backend capture no longer
auto-promotes candidates, M1B1 replaces typical-portion last-20 capture reads
with a saved-day anchored 21-day window, M1B2 adds deterministic
review-correction 30-day window semantics, M1C blocks typical-portion
source-deleted/tombstoned reactivation before candidate upsert, M1D proves
Review has no Smart Memory influence when Review apply is disabled, M1E removes
the old default 100-document cap from backend capture suppression scans, M1F
adds local Firestore emulator evidence for source-delete candidate
suppression/tombstone behavior with credentials cleared, and M1G adds bounded
category-only Memory Center telemetry for mute/delete controls. M1 is locally
accepted for the shadow-capture gate. M2A adds fail-closed mobile Smart Memory
item/candidate list parsing for malformed page shapes and unknown top-level
`memoryType`/`state`, and M2B adds fail-closed nested response parsing for
`stateReason`, `sourceRefs`, `confidenceReasonCodes`, `schemaVersion`, and
`serverRevision`. M2C narrows mobile item/candidate `sourceRefs` response types
to hash-only `SmartMemoryHashedSourceRef[]`. M2D proves Memory Center loading,
load-error, empty enabled/disabled, ready, pending, failed recovery,
retry/discard reload, and offline failed-row recovery-control states. Smart
Memory rollout remains blocked by Q0 evidence and feature rollout authorization. M2E proves Review saves
the current reviewed draft values while active memory explanation is visible and
does not silently substitute memory detail values. M2F makes Review memory reads
require a nutrition profile and fails closed for allergy/restriction profiles
without explicit compatibility evidence. M2G repaired the local no-provider
runtime path by stabilizing shared Maestro login through an E2E-only deep link
and allowing Firebase Admin to initialize against local emulators without
service-account credentials only when a Firestore or Storage emulator is
configured; auth-emulator-only and no-emulator paths still require configured
credentials. All seven targeted Smart Memory runtime UI flows passed locally
across a repaired combined run plus isolated backend-pull rerun; backend-pull
requires local backend `SMART_MEMORY_ENABLED=true`. M2G independent QA returned
`QA_PASS_WITH_GAPS` after the credential guard repair, and the controller
accepted only non-blocking gaps. Q0G records the same E2E-only login/session
repair as local core smoke evidence: local no-provider Maestro smoke passed
`7/7`, and independent QA returned `QA_PASS_WITH_GAPS` while confirming this is
not production auth readiness; a fresh controller rerun on
`2026-06-21T22:12:55Z` also passed local no-provider smoke `7/7` and cleaned up
Expo/Metro. M2 controls/apply is locally accepted. New
domains remain production-off.
K1A replaces Known Patterns name-based grouping with backend content-signature
identity and independent re-QA returned `QA_PASS` after a partial-content
fail-closed repair. K1B adds PL/EN alias canonicalization, explicit `2 / 3`
partial-overlap matching, malformed-row fail-closed parsing, and legacy
alias-form decline suppression. K1C records local iOS Known Patterns runtime
evidence against local backend/emulators: `known-pattern-review-draft` passed
`1/1` with zero failures after the E2E-only login/session/token repair and
unique-content fixture repair; independent QA returned `QA_PASS_WITH_GAPS` with
only non-blocking documentation/self-contained-artifact gaps, repaired by
`reports/K1C-known-pattern-runtime-maestro-report.md` and the repo-owned JUnit
snapshot. C5B adds QA-passed Known Patterns telemetry runtime evidence:
candidate shown/review/dismissed events are bounded/content-free, raw identity
and content props are rejected by the backend allowlist, the runtime flow
asserts telemetry and Known Patterns flags before baseline, and local iOS
`known-pattern-telemetry` passed `1/1` against local backend/emulators with a
repo-owned JUnit snapshot at
`reports/c5b-known-pattern-telemetry-artifacts/release-gate-known-pattern-runtime-telemetry.xml`.
C5C adds Planning telemetry runtime evidence: bounded/content-free Planning
events are emitted only after successful Planning actions, the local iOS
`planning-telemetry` flow asserts telemetry and Planning runtime flags, records
a backend summary baseline, performs Planning-to-Review handoff, and verifies
`planned_meal_confirmed` count increase against an isolated local
backend/emulator setup. The first C5C runtime failure was classified as a local
backend/API environment failure (`e2e-error:seed-api-http-error`), not a
Maestro/navigation defect, and no C5C code was reverted. The repo-owned JUnit
snapshot is
`reports/c5c-planning-telemetry-artifacts/release-gate-planning-runtime-telemetry.xml`.
C5D adds Smart Memory telemetry runtime evidence: a local iOS
`smart-memory-telemetry` flow asserts telemetry and Smart Memory runtime flags,
records a backend summary baseline, deletes one Memory Center item through UI,
and verifies `memory_deleted` count increase against an isolated local
backend/emulator setup. The repo-owned JUnit snapshot is
`reports/c5d-smart-memory-telemetry-artifacts/release-gate-smart-memory-runtime-telemetry.xml`.
Q0Q refreshes the current blocked release-evidence artifact at
`reports/Q0Q-current-blocked-release-evidence.md` after C5C/C5D, preserving
dirty-worktree evidence, production-off new-domain flags, and
`BLOCKED_EXTERNAL_DEPENDENCY`; it does not claim `CORE_RC_READY` or
`FULL_1_1_RC_READY`. Q0R records that both current branches now match their
upstreams (`0 ahead, 0 behind`) after owner/manual remote updates, while the
current uncommitted mobile/backend hardening diffs still keep clean RC evidence
blocked. Q0S commits those verified local hardening diffs in both repos,
leaving both worktrees clean at mobile
`829593cd75a534afeafb3657cb15f6a1141bbca0` and backend
`fa4711f0a43a0317c738b5394999942d30523afa`. Q0S refreshes blocked evidence at
`reports/Q0S-current-blocked-release-evidence.md`; the local commits are still
not pushed and remote CI/provider/manual Q0 evidence remains missing. Q0T
repairs the local auth/profile seed path by removing the temporary fake-auth
`fitaly://e2e/login` session/token path from active mobile source, restoring
real UI login in local Maestro flows, adding localhost/127.0.0.1-only Firebase
Auth/Profile emulator seeding, and removing the dead mobile E2E profile seed
helper. Q0T independent QA re-check returned `pass`; Q0T was committed and
pushed as mobile `21f8c52d` and backend `d82f938`, and both repos are clean and
`0 ahead / 0 behind` origin. The decision remains
`BLOCKED_EXTERNAL_DEPENDENCY` because remote CI/provider/manual Q0 evidence is
still missing or unverified. Current-state evidence is recorded at
`reports/Q0T-current-blocked-release-evidence.md`. Q0U records exact-SHA remote
CI pairing for mobile `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43` and backend
`706e2fff7788636d804339fd0845b98e523ce1ac`: mobile GitHub Actions run
`https://github.com/lukaszkurczab/fitaly/actions/runs/28013966826` passed with
`backend_contract_ref=706e2fff7788636d804339fd0845b98e523ce1ac` and
`require_exact_backend_contract_ref=true`, and backend GitHub Actions run
`https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28013971351`
passed with
`mobile_contract_ref=59189ae8cd7d49d3b836aa6e97a3033db8b3cb43` and
`require_exact_mobile_contract_ref=true`. Q0U independent QA returned
`pass_with_gaps` with no blocking findings. The decision remains
`BLOCKED_EXTERNAL_DEPENDENCY` because this proves only remote CI pairing, not
provider smoke, Android simulator runtime, live RC workflow,
deployed backend SHA, billing, backup/restore, privacy/Sentry, compliance,
rollback, production smoke, or release readiness. After Q0U, owner-requested
`AGENTS.md` review-guideline changes were restored and are now part of both
repo histories. F1B then pushed backend `f681d983...`, and F1C pushed mobile
`5de157eb...` with mobile CI passing against exact backend ref `f681d983...`.
During the 2026-06-23 documentation reconciliation, mobile was clean at
`5de157eb...`; backend remained at `f681d983...` but had local
autocomplete-seeding changes from parallel agent work. Those backend local
changes are not counted as completed evidence in this status file.
K1 identity/runtime is locally accepted. Known Patterns remains
production-off until Q0 release evidence and explicit feature rollout
authorization. R1A adds a backend
Recipe Catalog content approval gate so `RECIPE_CATALOG_ENABLED=true` alone no
longer exposes Recipe Catalog data; R1B removes foundation records from the
runtime default success path so the approved/enabled backend path returns an
explicit empty catalog until a canonical content source exists. R1C adds an
absolute-path Recipe Catalog content-pack loader/validator and route wiring that
fails closed before profile lookup/evaluation on invalid configured content.
Initial R1C QA failed on `needs_review`, `retired`, and relative-path gaps;
controller repair passed full backend gates and independent re-QA returned
`QA_PASS`. Recipe Catalog remains production-off and full R1 remains blocked by
missing approved content pack, canonical source/storage decision, owner content
review, nutrition/provenance sign-off, deployment configuration for
`RECIPE_CATALOG_CONTENT_PATH`, and real-pack runtime/E2E evidence.

## Packets

| Packet | Status | Worker | QA | Commits | Evidence | Blocker |
|---|---|---|---|---|---|---|
| C0 | qa_passed | Codex local worker + scope worker | independent QA pass after docs repair | none | `reports/C0-baseline-report.md` | none |
| C1 | qa_passed | C1 worker + repair worker | independent QA pass after Sentry bypass repair | none | `reports/C1-release-pairing-report.md` | live RC run and secrets remain Q0 evidence |
| C2 | qa_passed | C2A worker, C2B1 worker, C2B2 worker + repair | independent QA pass after Home Next Action / Review memory repair | none | `reports/C2A-feature-flags-backend-config-report.md`, `reports/C2B1-mobile-request-suppression-report.md`, `reports/C2B2-mobile-disabled-ui-routes-report.md` | none for local C2 disabled-behavior gate |
| C3 | qa_passed | Codex local worker + C3D/C3E repairs | independent QA pass after emulator and coverage repair | none | `reports/C3-durable-meal-side-effects-report.md` | none for local C3 durable-side-effect gate |
| C4 | qa_passed | Codex local worker for C4A/C4B/C4C repairs | independent QA pass after rate-limit and username-reservation repairs | none | `reports/C4-export-delete-reconciliation-report.md` | none for local C4 gate |
| C5 | partial | C5A worker; C5B local runtime worker + QA repairs; C5C local Planning telemetry runtime worker + backend-environment diagnosis; C5D local Smart Memory telemetry runtime worker | C5A independent QA `QA_PASS_WITH_GAPS`; controller accepted non-blocking gaps. C5B initial independent QA `pass_with_gaps`, controller repaired runtime self-containment, Known Patterns surface scope, and deep-link diagnostic coverage, then re-QA returned `pass`. C5C independent QA returned `pass_with_gaps`; controller closed the documentation gap with the C5C report and accepted only the non-blocking shared local E2E login attribution gap. C5D independent QA returned `pass_with_gaps`; controller closed the command/env evidence gap with the C5D report and accepted only the local runner pre-set-flag limitation as non-blocking. | none | `reports/C5A-new-domain-telemetry-contracts-report.md`, `reports/C5B-known-pattern-telemetry-runtime-report.md`, `reports/c5b-known-pattern-telemetry-artifacts/release-gate-known-pattern-runtime-telemetry.xml`, `reports/C5C-planning-telemetry-runtime-report.md`, `reports/c5c-planning-telemetry-artifacts/release-gate-planning-runtime-telemetry.xml`, `reports/C5D-smart-memory-telemetry-runtime-report.md`, `reports/c5d-smart-memory-telemetry-artifacts/release-gate-smart-memory-runtime-telemetry.xml` | C5 remains partial until every activated new domain has sufficient runtime/E2E telemetry evidence and rollout authorization; no smoke/prod telemetry evidence was authorized |
| F1 | partial | F1A worker + controller repairs; F1B local worker after worker disconnect; F1C local runtime repair/evidence; F1D backend local API-route evidence worker; F1E controller current-pair simulator refresh; F1F controller remote CI evidence refresh | F1A independent QA failed twice, then `QA_PASS_WITH_GAPS`; controller closed remaining test-only gap. F1B independent QA returned `pass_with_gaps` with no blockers and accepted only no-full-runtime and broad-suite local-guard gaps; exact-SHA remote mobile/backend CI passed for the F1B pair. F1C independent QA returned `pass_with_gaps` with no blocking findings and accepted only no-rerun-by-QA, iOS-only runtime, and non-hermetic provider-env-scrub gaps. F1C mobile CI run `28041016021` passed after push. F1D independent re-QA returned `pass` after route-verifier repair. F1E had no code changes; controller accepted it as local simulator evidence only. F1F had no code changes; controller accepted it as exact-SHA remote CI pairing evidence only. | F1B pair pushed: mobile `2eb2998b30c352e3f246ec8692eec59c1ab24ba9`, backend `f681d983941fe2d20cc857811493ee5bbd9def4f`; F1C mobile commit `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` is pushed; F1D backend commit `fe01fbaf92921271968e9d7bde329530b42513eb` is pushed; F1F remote CI pair passed as mobile run `28062888358` and backend run `28062888045` | `reports/F1A-food-library-seed-validation-report.md`, `reports/F1B-food-library-autocomplete-local-harness-report.md`, `reports/F1C-food-library-autocomplete-runtime-report.md`, `reports/F1D-food-library-autocomplete-local-api-evidence-report.md`, `reports/F1E-food-library-current-pair-simulator-runtime-report.md`, `reports/F1F-food-library-current-pair-remote-ci-report.md` | approved production corpus, owner quality review/source-confidence sign-off, authorized production/provider evidence, deployed/network latency evidence, and rollout approval remain required; physical-device validation is skipped by owner instruction and is not claimed; production flag must stay off |
| M1 | qa_passed | M1A worker + controller QA repair; M1B1 worker; M1B2 worker; M1C worker + controller repair; M1D local worker; M1E local worker; M1F local worker; M1G local worker | M1A independent QA `pass_with_gaps` and re-QA confirmed stale emulator expectation repaired; M1B1 independent QA `pass_with_gaps` with non-blocking emulator coverage gap; M1B2 independent QA `pass_with_gaps` with no blocking findings; M1C independent QA and re-QA `pass_with_gaps` with bounded-list legacy gap; M1D independent QA `pass_with_gaps` with dirty-worktree process gap; M1E/M1F independent QA `pass_with_gaps`; M1G independent QA `pass_with_gaps` | none | `reports/M1A-smart-memory-shadow-capture-report.md`, `reports/M1B1-smart-memory-typical-portion-window-report.md`, `reports/M1B2-smart-memory-review-correction-window-report.md`, `reports/M1C-smart-memory-source-delete-reactivation-report.md`, `reports/M1D-smart-memory-review-apply-disabled-report.md`, `reports/M1E-smart-memory-suppressed-subject-unbounded-report.md`, `reports/M1F-smart-memory-source-delete-emulator-report.md`, `reports/M1G-smart-memory-runtime-telemetry-report.md` | none for local M1 shadow-capture gate; Smart Memory production activation remains blocked by Q0 release evidence and feature rollout authorization |
| M2 | qa_passed | M2A worker; M2B worker; M2C local worker; M2D local worker; M2E local worker; M2F local worker; M2G local repair/runtime worker | M2A independent QA `pass_with_gaps`; M2B independent QA `pass_with_gaps`; M2C controller QA passed; M2D independent QA `pass`; M2E independent QA `pass` after repair; M2F independent QA `pass` after fail-closed repairs; M2G independent QA `QA_PASS_WITH_GAPS` after credential guard repair | Q0R verified mobile M2A-M2F on the current upstream branch; Q0S local mobile commit `829593cd75a534afeafb3657cb15f6a1141bbca0` now contains the later local M2G/Q0/C5 repair and evidence diffs and leaves the mobile worktree clean, but it is not pushed | `reports/M2A-smart-memory-api-fail-closed-report.md`, `reports/M2B-smart-memory-nested-payload-fail-closed-report.md`, `reports/M2C-smart-memory-source-ref-type-surface-report.md`, `reports/M2D-memory-center-control-states-report.md`, `reports/M2E-review-memory-no-silent-save-report.md`, `reports/M2F-review-memory-profile-constraints-report.md`, `reports/M2G-smart-memory-runtime-ui-blocked-report.md`, `reports/Q0R-remote-sync-dirty-state-report.md`, `reports/Q0S-local-commit-clean-evidence-report.md` | none for local M2 controls/apply gate; backend-pull local runtime requires `SMART_MEMORY_ENABLED=true`; Smart Memory production flags stay off until Q0 and feature rollout authorization |
| K1 | qa_passed | K1A local worker + controller repair; K1B local worker + QA repairs; K1C local runtime/Maestro repair evidence | K1A independent QA `QA_PASS` after partial-content fail-closed repair; K1B independent QA final `QA_PASS` after malformed-row and suppression-policy repairs; K1C independent QA `QA_PASS_WITH_GAPS` with non-blocking documentation/self-contained-artifact gaps repaired by the K1C report and repo-owned JUnit snapshot | none | `reports/K1A-known-pattern-content-identity-report.md`, `reports/K1B-known-pattern-alias-overlap-report.md`, `reports/K1C-known-pattern-runtime-maestro-report.md`, `reports/k1c-known-pattern-runtime-artifacts/release-gate-known-pattern-review-draft.xml` | none for local K1 identity/runtime gate; Known Patterns production flag stays off until Q0 release evidence and explicit feature rollout authorization |
| R1 | partial | R1A worker; R1B worker; R1C worker + controller repair | independent QA `QA_PASS_WITH_GAPS` for R1A and R1B; R1C initial QA `QA_FAIL`, controller repair, independent re-QA `QA_PASS` | none | `reports/R1A-recipe-catalog-content-boundary-report.md`, `reports/R1B-recipe-catalog-fixture-relocation-report.md`, `reports/R1C-recipe-catalog-content-pack-validator-report.md` | approved Recipe Catalog content pack, canonical source/storage decision, owner content review, nutrition/provenance sign-off, deployment config for `RECIPE_CATALOG_CONTENT_PATH`, and real-pack runtime/E2E evidence remain missing |
| P1 | qa_passed | P1A worker; P1B worker + repair; P1C worker + repair | P1A independent QA `pass_with_gaps`; P1B repair re-QA `QA_PASS`; P1C repair re-QA `QA_PASS` | none | `reports/P1-planning-truthful-lifecycle-report.md` | none for local P1 truth/lifecycle gate; Planning still production-off until later telemetry/Q0/feature rollout gates |
| H1 | pending | | | | | |
| Q0 | blocked_external | Q0A local preflight; Q0B dependency repair; Q0C local full regression + locale repair; Q0D local release artifact; Q0E local runtime preflight; Q0F blocker classification; Q0G local Maestro smoke auth repair plus fresh controller smoke rerun; Q0H release evidence dirty-state hardening; Q0I core release-gate Maestro repair; Q0J current evidence refresh; Q0K JUnit-backed release-gate evidence hardening; Q0L readiness decision guard; Q0M RC workflow JUnit wiring; Q0N proof-backed readiness evidence; Q0O local Maestro core-gate repair; Q0P current blocked release-evidence refresh; Q0Q current blocked release-evidence refresh after C5C/C5D; Q0R remote-sync evidence cleanup; Q0S local commit cleanup and current blocked evidence refresh; Q0T local auth/profile seed repair; Q0U exact-SHA remote CI pairing; Q0V Android simulator preflight; later F1B/F1C/F1D/F1E/F1F CI/runtime/local API evidence exists but does not close Q0 | Q0B independent QA `QA_PASS_WITH_GAPS`; Q0C independent QA `QA_PASS`; Q0D independent QA `QA_PASS_WITH_GAPS`; Q0E independent QA `QA_PASS_WITH_GAPS`; Q0G independent QA `QA_PASS_WITH_GAPS` and controller rerun `7/7` on `2026-06-21T22:12:55Z`; Q0H independent QA `QA_PASS_WITH_GAPS` with controller test-gap repair, then clean-git-evidence re-QA `QA_PASS`; Q0I controller local iOS no-provider `core-release-gate` passed `20/20`, independent QA `QA_PASS_WITH_GAPS` with non-blocking local-auth-boundary gap; Q0J local refresh was superseded by QA-passed Q0P current evidence; Q0K independent QA `pass_with_gaps` with no blockers; Q0L controller rerun local iOS no-provider `core-release-gate` passed `20/20` on `2026-06-22`; Q0L independent QA returned `QA_FAIL` on missing expected JUnit breadth and local absolute artifact paths, controller repaired, final re-QA `QA_PASS_WITH_GAPS` with only expected local/external gaps; Q0M independent QA `QA_PASS_WITH_GAPS` after P2 test-hardening repairs; Q0N independent QA `QA_PASS_WITH_GAPS` with only no-live-run and pattern-vs-semantic external-evidence gaps; Q0O local iOS no-provider `core-release-gate` passed `20/20` after splitting core offline pending evidence from provider reconnect-sync evidence; Q0P independent QA `QA_PASS_WITH_GAPS` with only expected external/runtime gaps; Q0Q independent QA returned `pass_with_gaps` with no blocking findings and confirmed `BLOCKED_EXTERNAL_DEPENDENCY`, dirty worktrees, production-off feature flags, local core `20/20` JUnit evidence, and no readiness claim; Q0R controller evidence check confirmed both branches were `0 ahead, 0 behind` their upstreams before local commit cleanup; Q0S verification passed and generated clean-worktree blocked evidence for the new local SHA pair; Q0T independent QA returned `pass`; Q0U independent QA returned `pass_with_gaps` with no blocking findings after both exact-SHA remote CI runs passed; Q0V Android simulator preflight returned `not_ready` before app runtime because no booted emulator or configured AVD exists; Q0V normal exact-SHA CI passed as mobile run `28063907416` and backend run `28063907468`; F1E local simulator refresh passed `7/7` on the current F1 pair; F1F exact-SHA remote CI pairing passed for the current F1 pair | Q0V mobile commit `80790f6a0fb4c70bf949a39ee7737085195ca3f3` is pushed; backend remains `fe01fbaf92921271968e9d7bde329530b42513eb`; Q0U pair pushed: mobile `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43`, backend `706e2fff7788636d804339fd0845b98e523ce1ac`; F1B pair pushed: mobile `2eb2998b30c352e3f246ec8692eec59c1ab24ba9`, backend `f681d983941fe2d20cc857811493ee5bbd9def4f`; F1C mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` pushed and mobile CI passed with backend `f681d983...`; F1D backend `fe01fbaf92921271968e9d7bde329530b42513eb` pushed | `reports/Q0A-core-off-release-evidence-preflight-report.md`, `reports/Q0B-mobile-dependency-audit-high-repair-report.md`, `reports/Q0C-local-full-regression-report.md`, `reports/Q0D-local-release-evidence.md`, `reports/Q0D-local-release-evidence-artifact-report.md`, `reports/Q0E-local-runtime-preflight-report.md`, `reports/Q0F-remaining-release-evidence-blockers-report.md`, `reports/Q0G-local-maestro-smoke-auth-repair-report.md`, `reports/Q0H-release-evidence-dirty-state-report.md`, `reports/Q0H-current-dirty-release-evidence.md`, `reports/Q0I-core-release-gate-maestro-repair-report.md`, `reports/Q0J-current-core-release-evidence-refresh-report.md`, `reports/Q0J-current-core-release-evidence.md`, `reports/Q0K-release-gate-junit-evidence-report.md`, `reports/Q0K-verified-core-release-evidence.md`, `reports/Q0L-readiness-decision-guard-report.md`, `reports/Q0L-readiness-guard-current-evidence.md`, `reports/Q0M-release-candidate-junit-wiring-report.md`, `reports/Q0N-readiness-proof-backed-evidence-report.md`, `reports/Q0O-local-maestro-core-gate-repair-report.md`, `reports/Q0P-current-blocked-release-evidence-refresh-report.md`, `reports/Q0P-current-blocked-release-evidence.md`, `reports/Q0Q-current-blocked-release-evidence-refresh-report.md`, `reports/Q0Q-current-blocked-release-evidence.md`, `reports/Q0R-remote-sync-dirty-state-report.md`, `reports/Q0S-local-commit-clean-evidence-report.md`, `reports/Q0S-current-blocked-release-evidence.md`, `reports/Q0T-local-auth-profile-seed-repair-report.md`, `reports/Q0T-current-blocked-release-evidence.md`, `reports/Q0U-exact-sha-remote-ci-pairing-report.md`, `reports/Q0V-android-simulator-preflight-report.md`, `reports/F1B-food-library-autocomplete-local-harness-report.md`, `reports/F1C-food-library-autocomplete-runtime-report.md`, `reports/F1D-food-library-autocomplete-local-api-evidence-report.md`, `reports/F1E-food-library-current-pair-simulator-runtime-report.md`, `reports/F1F-food-library-current-pair-remote-ci-report.md` | authenticated smoke-backend/provider/billing/backup/restore/production smoke/deployed SHA/manual evidence requires owner authorization or external artifacts; Android simulator runtime target remains unavailable/unverified; physical-device validation is skipped by owner instruction and not claimed; Q0U/F1B/F1C/F1D/F1E/F1F/Q0V evidence does not prove live RC workflow/provider/manual readiness |

| Q0W current blocked release evidence refresh | blocked_external | Current blocked release-evidence artifact generated for pushed mobile `80790f6a0fb4c70bf949a39ee7737085195ca3f3` plus backend `fe01fbaf92921271968e9d7bde329530b42513eb` after fetch/clean/diff-to-origin checks | controller local QA checks; no independent external runtime QA | none | `reports/Q0W-current-blocked-release-evidence.md`, `reports/Q0W-current-blocked-release-evidence-refresh-report.md` | no Android runtime, provider/manual evidence, live RC workflow, deployed backend SHA, billing, backup/restore, production smoke, privacy/Sentry/compliance, rollback or rollout authorization |
| Q0X local iOS core gate harness repair | blocked_external | Local iOS no-provider harness repair committed and pushed as mobile `59feb230b74914ef5a7963b05d2a19dd695edef4`; pre-commit worktree full core gate passed `20/20`, post-push full attempt passed 15 flows before a Maestro/XCTest splash hierarchy failure, post-push isolated chat passed `1/1`, and the four not-reached remaining core flows passed `4/4`; no exact remote CI run exists for this commit | controller local QA classification; no independent external/provider QA | mobile `59feb230b74914ef5a7963b05d2a19dd695edef4` pushed | `reports/Q0X-local-ios-core-gate-harness-repair-report.md` | no single green post-push full-suite artifact; no exact remote CI for `59feb230...`; no Android runtime, provider/manual evidence, live RC workflow, deployed backend SHA, billing provider evidence, backup/restore, production smoke, privacy/Sentry/compliance, rollback or rollout authorization |
| Q0Y current-pair local iOS core gate evidence refresh | blocked_external | Current-pair local iOS simulator `core-release-gate` passed as a single `20/20` suite for mobile `59feb230b74914ef5a7963b05d2a19dd695edef4` plus backend `fe01fbaf92921271968e9d7bde329530b42513eb` against local backend and Auth/Firestore emulators with provider env blanked and billing disabled | controller local QA checks; no independent external/provider QA | none | `reports/Q0Y-current-pair-local-ios-core-gate-report.md`; `/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624/reports/` | no exact remote CI for `59feb230...`; no Android runtime, provider/manual evidence, live RC workflow, deployed backend SHA, billing provider evidence, backup/restore, production smoke, privacy/Sentry/compliance, rollback or rollout authorization |

Note: Q0Y is the current local iOS simulator evidence refresh for the Q0 gate.
It supersedes Q0X only for the single green post-push local full-suite artifact
gap; it does not supersede the remaining Q0 blockers or convert Q0 into a
readiness decision.

## Open P0

- Q0 paired full regression and release evidence; runtime/provider/billing,
  backup/restore, production smoke, deployed backend SHA, and full E2E evidence
  remain open.
- Q0U exact-SHA remote CI pairing is QA-reviewed and passed for pushed mobile
  `59189ae8cd7d49d3b836aa6e97a3033db8b3cb43` plus backend
  `706e2fff7788636d804339fd0845b98e523ce1ac`, but provider/manual release
  evidence, live RC workflow evidence, and Android runtime remain unverified.
  Physical-device validation is skipped by owner instruction and is not claimed.
- Q0V Android simulator preflight is reproducible and currently `not_ready`:
  the Android SDK and Maestro are present, but there is no booted emulator or
  configured AVD. Mobile `80790f6a0fb4c70bf949a39ee7737085195ca3f3` is pushed,
  and normal exact-SHA CI passed for mobile run `28063907416` plus backend run
  `28063907468`. No Android app runtime flow was run.
- Q0W current blocked release evidence exists for pushed mobile
  `80790f6a0fb4c70bf949a39ee7737085195ca3f3` plus backend
  `fe01fbaf92921271968e9d7bde329530b42513eb`. Both repos were fetched, clean,
  and empty against origin before generation. The Q0W artifact preserves
  `BLOCKED_EXTERNAL_DEPENDENCY`; it does not prove Android runtime,
  provider/manual evidence, live RC workflow, deployed backend SHA, billing,
  backup/restore, production smoke, privacy/Sentry/compliance, rollback or
  rollout readiness.
- Q0X local iOS no-provider harness repair is pushed as mobile
  `59feb230b74914ef5a7963b05d2a19dd695edef4`. The exact pushed pair has
  targeted local simulator evidence for the repaired offline pending flow,
  isolated chat flow, and the four not-reached remaining core flows, but the
  post-push full-suite attempt is not green as a suite because Maestro/XCTest
  failed on splash hierarchy during nested login. Do not use Q0X to claim
  `CORE_RC_READY`.
- Q0Y current-pair local iOS simulator `core-release-gate` passed as a single
  `20/20` suite for mobile `59feb230b74914ef5a7963b05d2a19dd695edef4` plus
  backend `fe01fbaf92921271968e9d7bde329530b42513eb` against local backend and
  Auth/Firestore emulators with provider env blanked and billing disabled.
  Artifacts are under
  `/private/tmp/fitaly-q0y-core-release-gate-current-pair-20260624`. This is
  local simulator evidence only and does not provide exact remote CI for
  `59feb230...`, Android runtime, provider/manual release evidence, live RC
  workflow, deployed SHA, billing, backup/restore, production smoke,
  privacy/Sentry/compliance, rollback, rollout authorization, or
  `CORE_RC_READY`.
- F1E current-pair local iOS simulator `ingredient-autocomplete-runtime` passed
  `7/7` against local backend and Firebase emulators. F1D local API-route
  evidence proves PL/EN query hits and local route latency. F1F exact-SHA remote
  CI pairing passed for the same mobile/backend pair, but
  production/provider evidence, approved corpus, owner quality and
  source-confidence sign-off, deployed/network latency evidence, and rollout
  approval remain unverified.

## Open P1

- C5 runtime/E2E telemetry evidence for each activated new domain. C5A local
  Smart Memory + Planning telemetry contract is complete. C5B local Known
  Patterns telemetry runtime evidence is complete and QA-passed. C5C local
  Planning telemetry runtime evidence is complete and QA-reviewed. C5D local
  Smart Memory telemetry runtime evidence is complete and QA-reviewed, but C5
  remains partial until every activated domain has sufficient runtime/E2E
  evidence and rollout authorization.
- F1 full Food Library rollout gate remains partial: F1A local seed/corpus
  validator evidence is complete, F1B local harness/boundary evidence is
  complete, F1C local iOS simulator `ingredient-autocomplete-runtime` evidence
  is complete with `7/7` passing against local backend/emulators, and F1D local
  API-route PL/EN query-hit plus latency evidence is complete. F1E refreshed the
  local simulator runtime suite on the current mobile/backend pair with `7/7`
  passing, and F1F exact-SHA remote CI pairing passed for the same pair.
  Approved corpus, owner quality and source-confidence sign-off,
  authorized production/provider evidence, deployed/network latency evidence,
  and rollout approval are still missing. Physical-device validation is skipped
  by owner instruction and is not claimed.
- M1 Smart Memory shadow-capture gate is locally accepted: M1A-M1G cover
  candidate-only capture, explicit capture windows, source-delete/tombstone
  suppression, Review apply-disabled behavior, unbounded suppression scans,
  local Firestore emulator source-delete evidence, and bounded category-only
  Memory Center telemetry. Smart Memory production activation remains blocked
  by Q0 release evidence and feature rollout authorization.
- M2 Smart Memory controls/apply gate is locally accepted with
  `QA_PASS_WITH_GAPS`: M2A-M2F cover fail-closed parsing/type surface, Memory
  Center states, Review no-silent-save behavior, Dietary Profile precedence,
  and M2G local runtime UI evidence. Smart Memory production flags still remain
  off until Q0 and feature rollout authorization.
- Feature-wave gate R1 is partial after R1A/R1B/R1C and remains production-off
  until an approved content pack plus canonical source/storage decision, owner
  content review, nutrition/provenance sign-off, deployment config and real-pack
  runtime/E2E evidence exist. R1B removes foundation records from the runtime
  default success path, and R1C adds fail-closed absolute-path content-pack
  validation/loading. H1 remains pending unless promoted by evidence. K1 is
  locally accepted after K1A/K1B/K1C and remains production-off until Q0
  release evidence and explicit feature rollout authorization.

## External Dependencies

- Approved Recipe Catalog content pack: missing / required before Recipe
  Catalog production activation. R1A/R1B/R1C provide only the safe-off,
  empty-runtime, and fail-closed content-pack validation/loading boundaries.
  Approved content, canonical source/storage decision, owner content review,
  nutrition/provenance sign-off, deployment config and real-pack runtime/E2E
  evidence remain missing.
- Approved Food Library production corpus and owner quality review: missing;
  required before Food Library production activation. F1B adds local
  harness/boundary evidence, F1C adds local iOS simulator runtime evidence, and
  F1D adds local API-route PL/EN query-hit plus latency evidence, and F1E
  refreshes local simulator runtime on the current pair, and F1F adds exact-SHA
  remote CI pairing; none is
  production/provider/deployed evidence. Physical-device validation is skipped
  by owner instruction and is not claimed.
- GitHub `SENTRY_DSN` secret: unknown / required for production readiness CI.
- Backend `BACKEND_COMMIT_SHA` deployment env: unknown / required for smoke runtime SHA verification.
- Store/provider credentials: unknown / needs owner-authorized evidence path.
- Production smoke/prod access: not authorized in this loop.
- Legal URLs / store metadata evidence: unknown / needs evidence.

## Feature Flag Snapshot

C2A declares C2 rollout flags in mobile runtime config and EAS profiles.
Production readiness and release evidence now fail if a new-domain production
flag is missing or enabled before its feature gate. Smoke profiles must declare
explicit boolean values and may enable domains only for focused future gates.
C2B1 adds mobile request/background suppression for disabled new domains. Direct
UI entrypoints, direct screens/routes, Home Next Action local prompt handling,
Review memory explanation and repo-evidenced deep-link closure are covered by
C2B2. M1A adds backend Smart Memory capture/promotion separation, M1B1 adds
the typical-portion 21-day capture window, M1B2 adds the review-correction
30-day capture window, M1C blocks typical-portion source-deleted/tombstoned
reactivation before candidate upsert, M1D proves Review apply-disabled has
zero Review memory read/UI/navigation influence, M1E removes the old default
100-document cap from capture suppression scans, M1F adds local Firestore
emulator evidence for source-delete candidate suppression/tombstone behavior,
and M1G adds bounded category-only Memory Center telemetry. Smart Memory
remains production-off until Q0 and feature rollout authorization. M2A only adds
fail-closed mobile parsing for malformed Smart Memory item/candidate page
responses and unknown top-level item/candidate enum/state. M2B adds
fail-closed nested response parsing for Smart Memory API responses. M2C narrows
mobile sourceRef response types to the hash-only contract. M2D covers Memory
Center stable states and failed-control recovery behavior in focused component
tests. M2E covers Review no-silent-save behavior for active memory explanation
in focused component tests. M2F covers Dietary Profile hard-constraint
precedence for Review memory suggestions in focused service/component tests.
M2G local runtime UI evidence is `QA_PASS_WITH_GAPS`: the blocking shared Maestro
login path was repaired, local backend Firebase emulator initialization was
repaired for data emulators without weakening auth-emulator-only/no-emulator
credential requirements, and all seven targeted Smart Memory runtime flows have
passed locally without smoke/prod access. Q0G local Maestro smoke auth repair
then passed local no-provider smoke `7/7` and independent QA returned
`QA_PASS_WITH_GAPS`; a fresh controller rerun on `2026-06-21T22:12:55Z` also
passed local no-provider smoke `7/7`. This is local smoke evidence only, not
production auth readiness. Full M2 controls/apply is locally accepted; Q0 release evidence and
rollout authorization remain open. A live RC artifact has not been generated
yet.

## Latest Paired Test Run

C0 local baseline:

- Mobile: `npm run lint`, `npm run typecheck`, `npm test -- --runInBand`, and
  paired `BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh`
  passed.
- Backend: `./.venv/bin/python -m compileall app`, `ruff check .`,
  `./.venv/bin/pyright`, and `pytest` passed.

C1 local paired evidence:

- Mobile: targeted release/readiness tests passed (3 suites / 43 tests), full
  `npm test -- --runInBand` passed (314 suites / 2065 tests), `npm run
  typecheck`, `npm run lint`, paired backend contract check, workflow YAML parse,
  script syntax checks, and positive/negative Sentry readiness probes passed.
- Backend: `/api/v1/version` focused tests passed (4 tests), full `ruff check .`,
  `./.venv/bin/pyright`, and `./.venv/bin/python -m pytest -q` passed (1207
  passed / 33 skipped / 1 warning).

C2A local feature-flag evidence:

- Mobile: targeted readiness/runtime/evidence tests passed (4 suites / 54
  tests), `npm run typecheck`, `npm run lint`, and `git diff --check` passed.
- Backend: targeted disabled-mode and meal side-effect tests passed (102 tests),
  `ruff check .`, `./.venv/bin/pyright`, and `git diff --check` passed.

C2B1 local mobile request/background suppression evidence:

- Controller: targeted mobile Jest suites passed (9 suites / 106 tests), `npm
  run typecheck`, `npm run lint`, and `git diff --check` passed.
- Independent QA: targeted C2B1 suites plus push-orchestration coverage passed
  (10 suites / 116 tests).

C2B2 local mobile UI/direct-route disabled behavior evidence:

- Controller: post-repair focused Home/Review suites passed (3 suites / 107
  tests), full targeted C2B2 suites passed (8 suites / 150 tests), `npm run
  typecheck`, `npm run lint`, and `git diff --check` passed.
- Independent QA: initial `fail` found Home Next Action local review-draft and
  Review memory mixed-flag bypasses; repair passed re-QA with no blocking
  findings.

C3 local durable meal side-effect evidence:

- Backend: targeted C3 suites passed (`148 passed`), `firestore.indexes.json`
  parsed, `ruff check .`, `./.venv/bin/pyright`, `python3 -m compileall app`,
  `python3 -m py_compile scripts/reconcile_meal_effect_outbox.py`, and
  `git diff --check` passed. Full backend `pytest` passed (`1227 passed / 35
  skipped / 1 warning`).
- Backend emulator target:
  `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py tests/test_user_account_service_firestore_emulator.py -q`
  passed (`6 passed`), including account export/delete outbox coverage and a
  two-client Firestore emulator claim race.
- Mobile: export contract pairing passed
  (`npm test -- --runInBand --coverage=false src/services/user/profile.test.ts`
  with `18 passed`), `npm run typecheck`, `npm run lint`, and `git diff --check`
  passed.
- Independent QA initially returned `pass_with_gaps`; C3E emulator and coverage
  repairs passed final QA.

C4A local no-silent-export-truncation evidence:

- Backend: Smart Memory export cap removed and Known Patterns export cap removed;
  boundary tests for `0`, `1`, `249`, `250`, `251`, and `501` records passed.
- Targeted export/account verification passed:
  `./.venv/bin/pytest tests/test_smart_memory_service.py tests/test_known_pattern_service.py tests/test_user_account_service.py tests/test_api_users.py -q`
  with `152 passed`.
- Backend full gates passed: `ruff check .`, `python3 -m compileall app`,
  `git diff --check`, `./.venv/bin/pyright` (`0 errors`), and
  `./.venv/bin/pytest -q` (`1239 passed / 35 skipped / 1 warning`).
- Independent QA passed and reran the focused export tests (`13 passed`).

C4B local export manifest/count evidence:

- Backend: `UserExportResponse.exportManifest` added with
  `schemaVersion=user-export-manifest-v1` and `recordCounts` computed from the
  final export payload. Targeted API export tests passed (`2 passed`), expanded
  export/account tests passed (`153 passed`), and full backend `pytest` passed
  (`1240 passed / 35 skipped / 1 warning`).
- Backend gates passed: `ruff check .`, `python3 -m compileall app`,
  `./.venv/bin/pyright` (`0 errors`), and `git diff --check`.
- Mobile: `ExportedUserData` now includes all current backend export sections,
  nullable `profile`, and `exportManifest`.
- Mobile smoke export now requires all current export sections, validates
  manifest counts against returned payload, rejects unsupported count keys, and
  writes summary counts from the backend manifest.
- Mobile targeted tests passed (`2 suites / 30 tests`), P3 repair targeted
  release evidence test passed (`13 tests`), `npm run typecheck`, `npm run
  lint`, and `git diff --check` passed.
- Independent QA returned `pass_with_gaps`; the non-blocking extra-key manifest
  gap was repaired and verified.

C4C local account delete/reconciliation evidence:

- Backend: account delete now removes known top-level user-owned surfaces:
  telemetry by `userHash`, AI runs by `userId`, `rate_limits/{uid}`, and
  `usernames` reservations by `uid == user_id`; user subcollections and storage
  prefixes remain covered.
- Unit delete evidence passed:
  `./.venv/bin/pytest tests/test_user_account_service.py::test_delete_account_data_deletes_subcollections_username_and_user_doc tests/test_user_account_service.py::test_delete_account_data_cleans_partial_state_when_user_doc_is_missing -q`
  with `2 passed`.
- Emulator delete evidence passed:
  `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' ./.venv/bin/pytest tests/test_user_account_service_firestore_emulator.py::test_delete_account_data_scopes_user_hash_telemetry_events -q`
  with `1 passed`, including a second idempotent delete run.
- Backend account/API tests passed (`91 passed`), emulator account export/delete
  file passed (`2 passed`), and full backend pytest passed (`1241 passed / 35
  skipped / 1 warning`).
- Backend gates passed: `ruff check .`, `python3 -m compileall app`,
  `./.venv/bin/pyright` (`0 errors`), and `git diff --check`.
- Independent QA initially failed C4 for missing `rate_limits/{uid}` cleanup,
  then failed re-QA for orphanable `usernames` reservations. Both were repaired;
  final re-QA passed.

P1A local Planning name-only truthfulness evidence:

- Mobile: manual name-only Planning create no longer emits hardcoded
  `400/25/14/45` totals, a synthetic ingredient, or a `known` estimate. It now
  emits empty ingredients, null totals, explicit unknown estimate, all missing
  macro fields, and null confidence.
- Mobile: Review handoff no longer synthesizes fallback ingredients or macros
  for empty planned drafts; Planning UI shows the unknown/missing totals state.
- Backend: planned-meal service test proves a manual unknown name-only planned
  meal persists and lists without synthetic nutrition.
- Controller verification passed: targeted mobile Jest (`2 suites / 19 tests`),
  `npm run typecheck`, `npm run lint`, mobile `git diff --check`, backend
  targeted pytest (`20 passed`), backend `ruff check .`, `python3 -m compileall
  app`, backend `./.venv/bin/pyright` (`0 errors`), backend full pytest (`1242
  passed / 35 skipped / 1 warning`), and backend `git diff --check`.
- Independent QA returned `pass_with_gaps`; accepted for P1A because remaining
  findings were assigned to P1B rather than treated as a P1A regression. Those
  Review save and typed source metadata gaps were later repaired by P1B.

P1B local Planning Review save safety and typed source metadata evidence:

- Mobile: Planning Review handoff now carries typed `planningSource`
  (`plannedMealId`, `plannedMealVersion`, `sourceType`, `sourceRef`,
  `nutritionEstimateState`, `missingNutritionFields`) into the meal draft.
- Mobile: Review save now blocks any planned-source meal with no positive
  nutrition evidence, covering both `unknown` and `partial` planned estimates
  with empty ingredients/null totals. Positive explicit totals remain allowed.
- Mobile: meal repository, local SQLite persistence, local read-model equality,
  and offline meal push now preserve `planningSource`; SQLite migration adds
  `planning_source` at user_version `17`.
- Backend: `MealPlanningSource` is part of the meal schema; API/schema and
  service-layer validation reject any planned-source meal upsert without
  positive totals or positive ingredient nutrition before Firestore access.
- Cross-repo contract fixtures now cover `planningSource` in `meal_item.json`
  and enum parity for `MealPlanningSourceType`,
  `MealPlanningNutritionEstimateState`, and `MealPlanningNutritionField`.
- Controller verification passed: mobile targeted Jest (`6 suites / 72 tests`),
  mobile contract alignment (`2 suites / 107 tests`), `npm run typecheck`,
  `npm run lint`, mobile `git diff --check`, backend targeted pytest (`108
  passed / 3 warnings`), backend contract alignment (`125 passed`), backend
  `ruff check .`, `python3 -m compileall app`, backend `./.venv/bin/pyright`
  (`0 errors`), backend full pytest (`1254 passed / 35 skipped / 3 warnings`),
  and backend `git diff --check`.
- Independent QA initially failed P1B because `partial` planned estimates
  without positive nutrition evidence could still save as zero nutrition and
  contract fixtures did not cover `planningSource`. Repair re-QA passed with
  no blocking findings.

P1C local Planning idempotent lifecycle and production-off guard evidence:

- Backend: meal upsert now consumes/links a planned meal in the same Firestore
  transaction as the logged-meal write and mutation dedupe record, verifies the
  expected planned-meal version, rejects unavailable/stale/already-linked plans,
  and records `linkedMealId`, `convertedAt`, and
  `conversionClientMutationId`.
- Backend: same `clientMutationId` replay returns the existing mutation result
  without a second planned-meal write; linked logged-meal delete preserves the
  planned meal's converted/link evidence and does not reopen it.
- Backend: core meal API and service reject non-null `planningSource` while
  `PLANNED_MEALS_ENABLED=false` before service work/Firestore access.
- Mobile: Review, local save transaction, remote save, and offline queued
  upsert reject stale planned-source saves when Planning is disabled; Review
  renders an explicit disabled state and does not call `saveMeal`.
- Controller verification passed: backend targeted pytest (`101 passed / 3
  warnings`), backend Firestore emulator (`5 passed`), backend full pytest
  (`1266 passed / 36 skipped / 3 warnings`), backend `ruff check .`,
  `python3 -m compileall app`, backend `./.venv/bin/pyright` (`0 errors`),
  backend `git diff --check`, mobile targeted Jest (`6 suites / 83 tests`),
  mobile contract alignment (`1 suite / 98 tests`), `npm run typecheck`, `npm
  run lint`, and mobile `git diff --check`.
- Independent QA initially failed P1C because stale planned-source saves could
  bypass disabled Planning through core meal save paths. Repair re-QA first
  returned `QA_PASS_WITH_GAPS` because the QA emulator run skipped without
  `FIRESTORE_EMULATOR_HOST`; narrow re-QA reran the emulator file with
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` and returned `5 passed`, upgrading
  P1C to `QA_PASS`.

Q0A local core-off release evidence preflight:

- Mobile smoke runtime config passed: `npm run check:runtime-config`.
- Mobile production readiness config passed locally for Android and iOS:
  `npm run check:launch-readiness:android` and
  `npm run check:launch-readiness:ios`.
- Mobile/backend contract pairing passed:
  `BACKEND_REPO=/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend ./scripts/verify-backend-contract.sh`.
- Static E2E coverage checks passed:
  `npm run e2e:coverage:check` reported `18 covered`, `2 gap(s)`, and `37`
  flow references; `npm run e2e:dynamic-text:check` validated `11`
  release-relevant suites and `68` unique Maestro flows. These checks explicitly
  do not claim Maestro runtime acceptance.
- Release/readiness script tests passed:
  `npm run test:targeted -- --runTestsByPath src/services/release/checkLaunchReadinessConfig.test.ts src/services/release/launchReadiness.test.ts src/services/release/releaseEvidenceScripts.test.ts src/services/core/runtimeConfig.test.ts src/services/core/envValidation.test.ts`
  with `5 suites / 60 tests`.
- `npm audit --omit=dev --audit-level=high` failed with high findings in
  `protobufjs` and `ws`; this blocks release.
- `npm audit fix --omit=dev` and
  `npm audit fix --omit=dev --package-lock-only` both failed with `ENOSPC`.
  No `package.json` or `package-lock.json` changes remained after the failed
  attempts. After cache cleanup, `df -h` still reported only `624Mi` available
  on `/System/Volumes/Data`.

Q0B mobile dependency high-audit repair:

- Freed disposable npm `_npx` cache to recover local disk space; `df -h` then
  reported `2.2Gi` available.
- Non-force `npm audit fix --omit=dev --package-lock-only` cleared the high
  `ws` finding but left high `protobufjs`.
- Existing `package.json` override `protobufjs` was bumped from `8.3.0` to
  `8.6.4`, outside the audited vulnerable range.
- `npm install --package-lock-only` and `npm dedupe --package-lock-only`
  regenerated/deduped `package-lock.json`.
- Final lockfile checks: direct `react-native` remains `0.83.6`, direct `expo`
  remains `~55.0.23`, `node_modules/protobufjs` resolves to `8.6.4`, root
  `node_modules/ws` resolves to `6.2.4`, and no
  `node_modules/react-native/node_modules/react-native` lock artifact remains.
- `npm audit --omit=dev --audit-level=high` now exits `0`; remaining audit
  output is `22 vulnerabilities (1 low, 21 moderate)`, whose automatic fixes
  require `--force`/breaking changes and are not part of Q0B.
- Verification passed: `npm run typecheck`, `npm run lint`, targeted
  release/runtime Jest suites (`5 suites / 60 tests`), `git diff --check`,
  smoke/production readiness checks, static E2E coverage checks, and paired
  backend contract verification.
- Independent QA returned `QA_PASS_WITH_GAPS`; P2 gaps are residual
  low/moderate audit findings and large lockfile churn, with no required repair
  for the Q0B high-audit gate.

Q0C local full regression:

- Backend full local regression passed: `./.venv/bin/pytest -q` reported
  `1266 passed / 36 skipped / 3 warnings`; `ruff check .` and
  `./.venv/bin/pyright` passed with `0 errors`.
- Mobile full Jest initially failed only in `src/locales/i18n.audit.test.ts`
  because new disabled/new-domain `defaultValue` call sites lacked matching
  locale keys.
- Mobile locale-only repair added missing English/Polish keys for planned-meal
  unknown nutrition and disabled Planning, Recipe Catalog, and Smart Memory
  states.
- Focused i18n audit passed (`1 suite / 4 tests`), full mobile Jest passed
  (`314 suites / 2110 tests`), `npm run typecheck`, `npm run lint`, JSON parse,
  and `git diff --check` passed.
- Independent QA returned `QA_PASS` for the locale-regression repair and reran
  focused i18n audit, JSON parsing, and `git diff --check`.

Q0D local release evidence artifact:

- Generated `reports/Q0D-local-release-evidence.md` with exact mobile SHA
  `5827c0a8c7618ce1523734e83f752e15e25258be`, backend SHA
  `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`, and `Target environment:
  production`.
- Existing renderer accepted the artifact only after enforcing exact SHA inputs
  and production-off new-domain flags.
- Parsed artifact confirms all seven new-domain production flags are `false`.
- Artifact truthfully records runtime/provider/prod evidence as `not run`, `not
  generated`, `not provided`, `missing`, or `pending manual attachment`.
- Controller verification passed: high npm audit gate still exits `0`,
  Android/iOS launch-readiness checks passed, and mobile/backend diff-check
  passed.
- Independent QA returned `QA_PASS_WITH_GAPS`; the artifact is valid, but Q0
  still lacks runtime/provider/manual evidence.

Q0E local runtime preflight:

- Added `local-runtime-preflight`, a one-flow Maestro suite that boots the iOS
  dev client, asserts the E2E boot marker, resets to logged-out light-mode login,
  verifies login inputs, opens register, and verifies register inputs.
- The flow does not submit login or registration and was run with
  `E2E_SKIP_API_HEALTH=1` and `E2E_API_BASE_URL=http://127.0.0.1:9` to avoid
  smoke/prod backend and provider use.

- Controller runtime run passed on iOS simulator `Fitaly-MJ050` iOS `18.6`:
  `1/1 Flow Passed in 14s`; JUnit records `tests="1"` and `failures="0"`.
- The script stopped Expo/Metro and confirmed port `8099` was free after
  cleanup.
- Static E2E coverage/dynamic-text checks, suite validation, JSON parsing, and
  `git diff --check` passed after the new suite was added.
- Independent QA reran the runtime preflight on port `8100` with the same dead
  local API and got `1/1 Flow Passed in 14s`; QA verdict
  `QA_PASS_WITH_GAPS`.
- Q0E does not prove authenticated flows, backend connectivity, provider
  credentials, Android runtime, or full release-gate runtime readiness.

Q0G local Maestro smoke auth repair (historical; Q0T later removed the
temporary fake-auth path from active mobile source):

- Shared local smoke login and auth bootstrap now use the E2E-only
  `fitaly://e2e/login` session path instead of provider password entry during
  Q0G. This path is no longer active after Q0T/Q0X.
- Controller runtime smoke passed with local/no-provider settings:
  `env E2E_EXPO_PORT=8100 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`
  reported `7/7` flows passed: `login`, `foundation`, `auth-bootstrap`,
  `add-meal`, `chat-ai`, `offline-error`, and `account-launch`.
- Fresh controller runtime smoke rerun after the explicit Maestro stop passed:
  `env E2E_EXPO_PORT=8099 E2E_SKIP_API_HEALTH=1 E2E_API_BASE_URL=http://127.0.0.1:8000 npm run e2e:smoke`
  reported `7/7` flows passed and cleaned up Expo/Metro with port `8099` free.
- Mobile lint, typecheck, targeted Maestro/E2E auth-session tests (`165`
  tests), release-gate validation (`40` flows), and `git diff --check` passed.
- Independent QA returned `QA_PASS_WITH_GAPS`, rerunning seven focused Jest
  suites (`120` tests), smoke/auth suite validation, and E2E coverage static
  check. QA confirmed the E2E login/session bridge is inert outside E2E mode and
  does not claim production auth readiness.

Q0H release evidence dirty-state hardening:

- `scripts/render-release-evidence.mjs` now records mobile/backend worktree
  status, evidence decision, and evidence limitations, and computes worktree
  status from `git status --short` when the mobile cwd or `BACKEND_REPO` is
  available.
- `REQUIRE_CLEAN_WORKTREE=true` now fails unless both worktree statuses are
  exactly `clean`; clean-worktree evidence requires git-derived mobile/backend
  status, and env worktree-status overrides cannot mask dirty or missing repo
  evidence.
- Generated `reports/Q0H-current-dirty-release-evidence.md` for the current
  mobile/backend SHAs. It records mobile dirty state `17 modified, 2 untracked`,
  backend dirty state `10 modified, 3 untracked`, local Q0G smoke `7/7`, and
  `Evidence decision: BLOCKED_EXTERNAL_DEPENDENCY`.
- Controller verification passed: focused release-evidence Jest suite
  (`18` tests), mobile typecheck, mobile lint, mobile/backend `git diff --check`,
  and a negative clean-worktree probe on the current dirty state with
  `MOBILE_WORKTREE_STATUS=clean` and `BACKEND_WORKTREE_STATUS=clean` supplied.
- Independent QA returned `QA_PASS_WITH_GAPS`; the controller then added the
  missing backend-only dirty regression test, then later added the repo-derived
  auto-status / clean-git-evidence follow-up; independent re-QA returned
  `QA_PASS`.

Q0F remaining release evidence blocker classification:

- Android SDK tooling exists, but `adb devices` listed no attached devices and
  `emulator -list-avds` listed no configured AVDs.
- Firebase CLI `15.19.0` and `uvicorn 0.44.0` are available locally.
- Mobile supports `EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST`; backend
  `firebase.json` defines Auth/Firestore/Storage emulator ports.
- Repo does not provide a small turnkey mobile E2E harness that seeds Firebase
  Auth emulator, starts backend against emulators, seeds profile/bootstrap state
  for mobile `authLogin`, runs authenticated core-loop flows, and tears down the
  full stack.
- Remaining Q0 release evidence is external or owner-authorized: authenticated
  smoke/runtime E2E, production smoke, billing/provider purchase/restore,
  deployed backend SHA, backup/restore, delete smoke, privacy logging, Sentry,
  compliance, rollback, and store/legal evidence.
- Controller decision changed to `BLOCKED_EXTERNAL_DEPENDENCY`.

C5A local new-domain telemetry contract evidence:

- Smart Memory and Planning C5 event names are now present in mobile
  `TELEMETRY_EVENT_NAMES` and backend `ALLOWED_TELEMETRY_EVENT_NAMES`.
- Backend telemetry schema now allows only bounded C5 props/enums:
  `memoryType`, `surface`, `confidenceBucket`, `actionResult`, `sourceType`,
  `estimateState`, and `featureState`.
- Mobile adds typed helper functions for the C5 event payloads, but no live
  feature screen/service callsite wiring.
- Paired `c5_new_domain_telemetry.json` fixtures are byte-identical across
  mobile/backend.
- Backend negative tests reject forbidden C5 props such as meal/ingredient
  names, notes, raw IDs, raw prompt/response, image URLs, full payloads, and
  nutrition numbers.
- Controller verification passed:
  `./node_modules/.bin/jest --runInBand --watchman=false --coverage=false --runTestsByPath src/services/telemetry/telemetryInstrumentation.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  (`2 suites / 112 tests passed`), `npm run typecheck`, backend
  `./.venv/bin/pytest tests/test_api_telemetry.py tests/test_contract_alignment.py -q`
  (`179 passed`), `./.venv/bin/ruff check .`, `./.venv/bin/pyright`,
  `python3 -m compileall app`, both repo `git diff --check`, paired fixture
  `cmp -s`, and C5 event callsite scan.
- Independent QA returned `QA_PASS_WITH_GAPS`: no blocking telemetry contract
  repair was found; runtime/E2E event evidence remains a future gate per
  activated domain.
- C5A does not change release readiness; Q0 remains `BLOCKED_EXTERNAL_DEPENDENCY`.

F1A local Food Library seed/corpus validation evidence:

- Backend adds `app/services/food_library_seed_validator.py` with structured
  validation errors and deterministic summary evidence for Ingredient/Product
  seed/corpus data.
- Validator rejects unsafe corpus cases: missing schema fields, user-scoped
  records, global owner leakage, global `user_created` source truth,
  candidate-only source types, unsafe document IDs, non-verified lifecycle,
  low/unknown required confidence, placeholder metadata, incomplete/malformed
  search prefixes, AI-derived durable nutrition truth, missing kind-specific
  fields, basis/unit mismatch, implausible kcal, nutrients over 100g, and macro
  sums over 100g per 100.
- Local `scripts/seed_ingredient_autocomplete_e2e.py` now validates global E2E
  seed records before any emulator auth/write work and prints deterministic
  `globalSeedValidation` summary. This is emulator import evidence only, not
  approved production corpus evidence.
- Independent QA initially failed F1A for incomplete prefixes, global
  `user_created` corpus truth, incomplete placeholder scans, unsafe document
  IDs and implausible nutrition. Re-QA then failed for macro-sum and nested
  metadata placeholder gaps. Final re-QA returned `QA_PASS_WITH_GAPS`; the
  remaining test-only `sourceAttribution.observedAt` gap was closed by a named
  regression test.
- Controller verification passed:
  `./.venv/bin/python -m pytest tests/test_food_library_seed_validator.py tests/test_seed_ingredient_autocomplete_e2e.py`
  (`35 passed`), focused Ruff check on touched files (`All checks passed!`),
  `./.venv/bin/pyright` (`0 errors`), `./.venv/bin/python -m compileall app`,
  `git diff --check`, direct seed-script execution without emulator env
  (expected `RuntimeError: FIRESTORE_EMULATOR_HOST must be set...`, no
  `ModuleNotFoundError`), and full backend
  `./.venv/bin/python -m pytest` (`1310 passed / 36 skipped / 3 warnings`).
- F1 remains partial: no approved production corpus, owner quality review,
  PL/EN coverage, autocomplete E2E, offline recovery runtime evidence, or
  latency evidence exists in this slice. Food Library production flag must stay
  off.

M1A local Smart Memory shadow-capture evidence:

- Backend capture paths now upsert candidates without calling
  `smart_memory_service.promote_candidate`; typical-portion and
  review-correction capture both return the direct `upsert_candidate` result.
- Focused capture tests assert candidate-only mutation results and zero
  promotion calls for both ready paths; review-correction already-activated
  upsert results also return without promotion.
- The M1A-relevant emulator test expectation now matches shadow mode:
  candidate state remains `candidate`, no active `smartMemory` item exists
  before or after delete, and delete marks the candidate `source_deleted` with a
  source-deleted tombstone.
- Controller verification passed:
  `pytest tests/test_smart_memory_capture_service.py tests/test_meal_service_firestore_emulator.py`
  (`31 passed / 5 skipped`; emulator cases skipped because
  `FIRESTORE_EMULATOR_HOST` is not configured), focused Ruff check on M1A files
  (`All checks passed!`), `./.venv/bin/pyright` (`0 errors`),
  `git diff --check`, full backend `pytest`
  (`1311 passed / 36 skipped / 3 warnings`), `python3 -m compileall app`, and
  full backend `./.venv/bin/ruff check .`.
- Independent QA first returned `pass_with_gaps` for a stale emulator
  expectation that still asserted old activation behavior. Controller repaired
  the expectation; re-QA confirmed the P1 finding is resolved and reported no
  blocking M1A findings.
- M1 remains partial: explicit 21/30-day windows, emulator runtime evidence,
  durable outbox replay, source-delete/tombstone reactivation blocking,
  apply-disabled Review behavior and runtime telemetry evidence are still
  required. Smart Memory production flags must stay off.

M1B1 local Smart Memory typical-portion window evidence:

- Backend typical-portion capture no longer uses the old last-20-meals semantic
  boundary. It computes an inclusive 21-day window from the saved meal's
  canonical `dayKey` and reads history with `day_key_start` / `day_key_end`.
- The capture-window read paginates through `list_history` using a per-page size
  instead of treating one page as the capture boundary.
- Replay/dedupe coverage proves pending Smart Memory capture retry reuses the
  same saved-meal reference `dayKey`.
- Controller verification passed:
  `pytest tests/test_meal_service.py -k "smart_memory_capture or smart_memory_capture_read or smart_memory_capture_window or typical_portion_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  (`10 passed / 56 deselected`), `pytest tests/test_meal_service.py`
  (`66 passed`), focused Ruff check on `meal_service.py` and
  `test_meal_service.py` (`All checks passed!`), `./.venv/bin/pyright`
  (`0 errors`), `python3 -m compileall app`, `git diff --check`,
  full backend `./.venv/bin/ruff check .`, and full backend `pytest`
  (`1312 passed / 36 skipped / 3 warnings`).
- Independent QA returned `pass_with_gaps`: no blocking correctness finding;
  non-blocking P2 gap is that current M1B1 tests mock `list_history` rather than
  running the real Firestore emulator query and cursor path.
- M1 remains partial: review-correction/suppression 30-day windows, emulator
  runtime evidence, durable replay, source-delete/tombstone reactivation
  blocking, apply-disabled Review behavior, and runtime telemetry evidence are
  still required. Smart Memory production flags must stay off.

M1B2 local Smart Memory review-correction window evidence:

- Backend review-correction evaluation/capture now uses an explicit inclusive
  30-day `dayKey` window.
- The window is deterministic: an explicit `reference_day_key` can anchor it;
  otherwise it uses the latest valid signal `dayKey`. Invalid explicit anchors
  count no signals and no wall-clock fallback is introduced.
- Tests cover day 0/day 29 inclusion, day 30/day 31 exclusion, old outside-
  window signals failing to satisfy the threshold, default-anchor behavior, and
  invalid/missing `dayKey` safety.
- Controller verification passed: `pytest tests/test_smart_memory_capture_service.py`
  (`36 passed`), focused Ruff check on `smart_memory_capture_service.py` and
  `test_smart_memory_capture_service.py` (`All checks passed!`),
  `./.venv/bin/pyright` (`0 errors`), `python3 -m compileall app`,
  `git diff --check`, full backend `pytest`
  (`1317 passed / 36 skipped / 3 warnings`), and full backend
  `./.venv/bin/ruff check .`.
- Independent QA returned `pass_with_gaps`: no blocking correctness finding;
  remaining gap is lack of active non-test review-correction callsite and lack
  of runtime/outbox/emulator evidence for this path.
- M1 remains partial: suppression/preference 30-day semantics where applicable,
  emulator runtime evidence, durable replay, source-delete/tombstone
  reactivation blocking, apply-disabled Review behavior, and runtime telemetry
  evidence are still required. Smart Memory production flags must stay off.

M1C local Smart Memory source-delete/tombstone reactivation evidence:

- Backend typical-portion capture/replay now preserves exact tombstone checks
  for current candidate subject keys and also merges listed source-deleted or
  suppressed subjects before candidate evaluation/upsert.
- Replay coverage proves a source-deleted typical-portion subject blocks
  candidate reactivation and `upsert_candidate` is not called.
- Review-correction coverage proves source-deleted refs cannot provide the
  third observation needed to satisfy the candidate threshold.
- Controller verification passed:
  `pytest tests/test_meal_service.py -k "smart_memory_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  (`8 passed / 59 deselected`), `pytest tests/test_smart_memory_capture_service.py`
  (`37 passed`), focused Smart Memory tombstone/source-delete tests
  (`13 passed / 33 deselected`), `pytest tests/test_meal_service.py`
  (`67 passed`), focused Ruff check on M1C files (`All checks passed!`),
  `./.venv/bin/pyright` (`0 errors`), `python3 -m compileall app`,
  `git diff --check`, full backend `pytest`
  (`1319 passed / 36 skipped / 3 warnings`), and full backend
  `./.venv/bin/ruff check .`.
- Independent QA and re-QA returned `pass_with_gaps`: no blocking correctness
  finding; remaining gap is that legacy source-deleted-only records without
  tombstones beyond the bounded suppression list are not exhaustively proven.
- M1 remains partial: suppression/preference 30-day semantics where applicable,
  emulator runtime evidence, runtime telemetry evidence, and legacy
  source-deleted-only bounded-list evidence are still required. Smart Memory
  production flags must stay off.

M1D local Smart Memory Review apply-disabled evidence:

- Mobile Review read/UI remains gated by both `smartMemoryEnabled` and
  `reviewMemoryExplanationEnabled`. When the combined gate is false,
  `ReviewMealScreen` clears memory state and returns before calling
  `readReviewSmartMemoryExplanation`.
- A focused Review test sets Smart Memory globally on and Review memory/apply
  off, provides an active mocked memory explanation, and proves no memory read,
  memory row, memory modal, or Memory Center navigation is exposed.
- A C5 telemetry test lint repair replaced `if (false)` compile-time
  assertions with an uninvoked helper, preserving TypeScript
  `@ts-expect-error` checks while satisfying full lint.
- Controller verification passed:
  `npm run test:targeted -- --runTestsByPath src/feature/Meals/screens/MealAdd/ReviewMealScreen.test.tsx src/services/telemetry/telemetryInstrumentation.test.ts`
  (`2 passed suites / 41 passed tests`), `npm run typecheck`, `npm run lint`,
  and `git diff --check`.
- Independent QA returned `pass_with_gaps`: no blocking M1D finding; recorded a
  non-blocking dirty-worktree attribution gap and no runtime/Maestro evidence.
- M1 remains partial: suppression/preference 30-day semantics where applicable,
  emulator/runtime evidence, runtime telemetry evidence, and legacy
  source-deleted-only bounded-list evidence are still required. Smart Memory
  production flags must stay off.

M1E local Smart Memory suppressed-subject scan evidence:

- Backend capture-time suppression now uses
  `list_suppressed_subject_keys(..., limit_count=None)` by default, so
  tombstones, source-deleted/suppressed items, and source-deleted/suppressed
  candidates are scanned without the old `MAX_CAPTURE_CONTROL_DOCS=100`
  default cap.
- Direct `list_tombstone_subject_keys()` keeps its bounded default, and
  explicit `limit_count` calls to `list_suppressed_subject_keys()` remain
  bounded.
- Regression coverage proves a legacy source-deleted item at index
  `MAX_CAPTURE_CONTROL_DOCS` is included by default and explicit
  `limit_count=2` still applies the limit.
- Controller verification passed:
  `pytest tests/test_smart_memory_service.py -k "suppressed_subject_keys or tombstone_subject_keys or source_deleted_subject or read_export"`
  (`12 passed / 36 deselected`),
  `pytest tests/test_meal_service.py -k "smart_memory_capture or duplicate_retry_processes_pending_smart_memory_capture or duplicate_replay_uses_dedupe_record"`
  (`8 passed / 59 deselected`),
  `pytest tests/test_smart_memory_capture_service.py` (`37 passed`), focused
  Ruff check on M1E files (`All checks passed!`), `git diff --check`,
  `./.venv/bin/pyright` (`0 errors`), `python3 -m compileall app`, full
  backend `./.venv/bin/ruff check .`, and full backend `pytest`
  (`1321 passed / 36 skipped / 3 warnings`).
- Independent QA later returned `pass_with_gaps` for M1E/M1F. QA reran the
  focused suppressed-subject/tombstone tests (`4 passed / 44 deselected`) and
  confirmed default unbounded suppressed-subject scans, bounded explicit
  `limit_count`, bounded direct tombstone listing, and no tombstone expiry/TTL
  in the relevant Smart Memory service/tests.
- M1 remains partial: runtime telemetry evidence and later M2 controls/apply
  gates are still required. Smart Memory production flags must stay off.

M1F local Smart Memory source-delete emulator evidence:

- Existing backend emulator test
  `tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted`
  was run against a local Firestore emulator with credential env vars cleared.
- Repo wrapper `npm run evidence:emulators` was not used because the wrapper
  auto-loads local `service-account.json` when present; the sandbox reviewer
  rejected that credential-bearing path, and the controller classified it as a
  safety blocker for the wrapper rather than a pytest failure.
- Direct Firestore-only `firebase emulators:exec` could not start because port
  `8080` was already taken; `lsof` showed a local `java` process listening on
  `127.0.0.1:8080`, and `curl` returned `Ok`.
- Controller runtime evidence passed:
  `env FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q`
  reported `1 passed in 2.49s`.
- Skip behavior without emulator env passed:
  `env FIRESTORE_EMULATOR_HOST= FIREBASE_PROJECT_ID=demo-fitaly-local FIRESTORE_DATABASE_ID='(default)' GOOGLE_APPLICATION_CREDENTIALS= FIREBASE_CLIENT_EMAIL= FIREBASE_PRIVATE_KEY= ./.venv/bin/pytest tests/test_meal_service_firestore_emulator.py::test_meal_delete_marks_real_smart_memory_candidate_source_deleted -q`
  reported `1 skipped in 1.31s`.
- Independent QA returned `pass_with_gaps`. QA confirmed the local Firestore
  emulator was reachable and reran the source-delete emulator test with
  credential env vars explicitly empty (`1 passed in 2.47s`).
- M1F proves the local runtime path marks the real candidate `source_deleted`,
  does not create active shadow-mode `smartMemory` items, and writes a
  source-delete tombstone.
- M1 remains partial: runtime telemetry evidence and later M2 controls/apply
  gates are still required. Smart Memory production flags must stay off.

M1G local Smart Memory runtime telemetry evidence:

- Memory Center now emits Smart Memory telemetry only for existing
  production-off, flag-gated mute/delete controls.
- Mute emits `memory_muted` only after `queueSmartMemoryItemMute` succeeds,
  with bounded props: `memoryType`, `surface=memory_center`,
  `actionResult=queued`, and `featureState=enabled`.
- Delete emits `memory_deleted` only after `queueSmartMemoryItemDelete`
  succeeds, with the same bounded prop shape.
- Restore remains telemetry-silent because no C5 restore event exists.
- Disabled Memory Center returns a feature-disabled state before reading or
  mutating Smart Memory or emitting telemetry.
- Controller verification passed:
  `npm run test:targeted -- --runTestsByPath src/feature/UserProfile/screens/MemoryCenterScreen.test.tsx src/services/telemetry/telemetryInstrumentation.test.ts`
  (`2 suites passed / 21 tests passed`), `npm run typecheck`, `npm run lint`,
  mobile `git diff --check`, and backend
  `./.venv/bin/pytest tests/test_api_telemetry.py -k "smart_memory or memory_" -q`
  (`1 passed / 47 deselected`).
- Independent QA returned `pass_with_gaps` and reran the mobile targeted
  suites, mobile typecheck, mobile lint, backend Smart Memory telemetry allowlist
  test, and backend forbidden-props test. QA found no blocking privacy or
  contract issue.
- QA gap: no device/emulator UI flow captured actual outgoing telemetry from
  the app.
- M1 shadow-capture gate is locally accepted. Smart Memory production flags
  must stay off until M2 controls/apply gates pass.

M2A local Smart Memory API fail-closed parser evidence:

- Mobile Smart Memory item/candidate page parsing now rejects invalid page
  shapes and any row that fails normalization instead of filtering invalid rows
  out of the response.
- Regression tests cover missing `items`, non-record rows, unsupported
  top-level `memoryType`, and unknown top-level `state` for both item and
  candidate page responses.
- Valid empty item pages and existing Smart Memory contract fixture response
  examples still parse.
- Controller verification passed:
  `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/offline/strategies/smartMemory.strategy.test.ts`
  (`2 suites passed / 10 tests passed`), `npm run typecheck`, `npm run lint`,
  and `git diff --check`.
- Independent QA returned `pass_with_gaps`; QA reran focused Smart Memory
  parser/strategy tests, typecheck, lint, contract alignment, and scoped diff
  check with no blocking findings.
- QA gap at M2A time: nested field drift was not fully fail-closed yet. M2B
  now addresses `stateReason`, `sourceRefs`, `confidenceReasonCodes`,
  `schemaVersion`, and `serverRevision`; type-surface narrowing remains open.
- M2 remains partial. Smart Memory production flags must stay off until all M2
  controls/apply gates pass.

M2B local Smart Memory nested payload fail-closed evidence:

- Mobile Smart Memory item/candidate/settings response parsing now rejects
  wrong or missing `schemaVersion`, invalid/non-positive/non-integer
  `serverRevision`, unsupported item `stateReason`, unknown
  `confidenceReasonCodes`, and malformed or non-hash `sourceRefs`.
- Valid contract fixtures still parse, including hash-only source refs and
  positive revisions.
- Controller verification passed after clearing only the Jest cache directory
  that caused an initial `ENOSPC`:
  `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/offline/strategies/smartMemory.strategy.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  (`3 suites passed / 116 tests passed`), `npm run typecheck`,
  `npm run lint`, and `git diff --check`.
- Independent QA returned `pass_with_gaps`; QA reran the focused mobile
  Smart Memory API parser test (`7 passed`), backend contract alignment
  (`131 passed`), backend Smart Memory API tests (`11 passed`), and scoped
  diff check with no blocking findings.
- QA gap: exported mobile response types still type `sourceRefs` as generic
  records even though runtime now enforces hash-only source refs.
- Environment gap: disk space remains tight; independent broader mobile rerun
  hit `/private/tmp/jest_dx` `ENOSPC`, though controller already had a green
  broader rerun after cache cleanup.
- M2 remains partial. Smart Memory production flags must stay off until all M2
  controls/apply gates pass.

M2C local Smart Memory sourceRef type-surface evidence:

- Mobile `SmartMemoryItem.sourceRefs` and `SmartMemoryCandidate.sourceRefs`
  now use `SmartMemoryHashedSourceRef[]` instead of generic records, matching
  the runtime parser and backend hash-only contract.
- Controller verification passed:
  `npm run test:targeted -- --runTestsByPath src/services/smartMemory/smartMemoryApi.test.ts src/services/smartMemory/smartMemoryProjectionRepository.test.ts src/services/smartMemory/smartMemoryService.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  (`4 suites passed / 128 tests passed`), `npm run typecheck`,
  `npm run lint`, and `git diff --check`.
- No separate subagent QA was run because this was a two-line type-surface
  narrowing directly requested by M2B independent QA, and local disk pressure
  remained tight.
- M2 remains partial. Smart Memory production flags must stay off until all M2
  controls/apply gates pass.

## Decision Log

- `2026-06-20T11:54:01Z`: C0 baseline created for exact local pair.
- `2026-06-20T12:01:14Z`: C0 marked `qa_passed`; readiness remains `NO_GO`.
- `2026-06-20T12:54:02Z`: C1 started as the next smallest P0 slice after C0.
- `2026-06-20T13:27:21Z`: C1 marked `qa_passed` after independent QA and
  Sentry bypass repair; readiness remains `NO_GO`.
- `2026-06-20T13:54:04Z`: C2A accepted as `pass_with_gaps`; backend disabled
  behavior and mobile production-off config/readiness are in place, but C2
  remains `in_progress` until mobile request/deep-link gating passes.
- `2026-06-20T14:11:31Z`: C2B1 accepted as `pass_with_gaps`; mobile disabled
  request/background suppression is in place, but C2 remains `in_progress`
  until UI entrypoints, direct screens/routes and deep-link behavior pass.
- `2026-06-20T14:41:48Z`: C2B2 accepted as `qa_passed` after independent QA
  fail, repair, and re-QA pass; C2 marked `qa_passed` for local granular
  feature flags and predictable disabled behavior. Readiness remains `NO_GO`.
- `2026-06-20T16:01:54Z`: C3 marked `qa_passed` after transactional outbox
  implementation, C3D claim/lease repair, Firestore index repair, targeted
  emulator export/delete and two-worker claim race evidence, final coverage
  repair, and independent QA pass. Readiness remains `NO_GO`.
- `2026-06-20T16:16:18Z`: C4A accepted as `qa_passed`; Smart Memory and Known
  Patterns export caps were removed and boundary-tested, but C4 remains
  `in_progress` until manifest/count and delete idempotency evidence close.
  Readiness remains `NO_GO`.
- `2026-06-20T16:32:32Z`: C4B accepted after export manifest/count contract,
  mobile paired export type, smoke manifest validation, independent QA, and P3
  extra-key repair. C4 remains `in_progress` until delete idempotency,
  storage cleanup and top-level scoped cleanup evidence close. Readiness
  remains `NO_GO`.
- `2026-06-20T16:50:41Z`: C4 marked `qa_passed` after C4C delete
  idempotency/storage/top-level cleanup, QA-found `rate_limits/{uid}` and
  `usernames` reservation repairs, emulator rerun evidence, and final re-QA
  pass. Readiness remains `NO_GO`.
- `2026-06-20T17:08:09Z`: P1A accepted as `pass_with_gaps`; name-only manual
  Planning no longer fabricates macro totals or ingredients, but P1 remains
  `in_progress` because Review save safety, typed planned source metadata,
  idempotent consume/link, and linked-delete behavior are still open.
  Readiness remains `NO_GO`.
- `2026-06-20T17:47:23Z`: P1B accepted as `qa_passed` after repair; Review save
  now blocks planned-source meals without positive nutrition evidence,
  `planningSource` is preserved through mobile/backend/local/offline paths, and
  paired contract fixtures cover the new meal contract. P1 remains
  `in_progress` because P1C idempotent consume/link, duplicate prevention,
  failed-save behavior, and linked-delete behavior remain open. Readiness
  remains `NO_GO`.
- `2026-06-20T21:25:58Z`: P1 marked `qa_passed` after P1C idempotent
  consume/link, duplicate-save prevention, failed-save no-consume,
  linked-delete behavior, production-off stale planned-source guard repair, and
  emulator re-QA passed. Planning remains production-off until later
  telemetry/Q0/feature rollout gates. Readiness remains `NO_GO`.
- `2026-06-20T21:37:09Z`: Q0A local core-off release evidence preflight
  started. Smoke/runtime readiness, production config readiness, contract
  pairing, release-script tests, and static E2E coverage checks passed, but
  `npm audit --omit=dev --audit-level=high` failed on high `protobufjs` and
  `ws` findings. Non-force audit repair failed twice with `ENOSPC`; no package
  manifest/lockfile changes remained. Readiness remains `NO_GO`.
- `2026-06-20T21:43:23Z`: Q0B repaired the high mobile dependency audit gate
  without `npm audit fix --force` by bumping the existing `protobufjs` override
  to `8.6.4`, regenerating/deduping `package-lock.json`, and verifying
  `npm audit --omit=dev --audit-level=high` exits `0`. Independent QA returned
  `QA_PASS_WITH_GAPS` for residual low/moderate audit findings and lockfile
  churn. Readiness remains `NO_GO`.
- `2026-06-20T21:56:28Z`: Q0C local full regression passed after a locale-only
  repair for missing deterministic i18n fallback keys. Backend full pytest,
  ruff and pyright passed; mobile full Jest, typecheck, lint and diff-check
  passed; independent QA returned `QA_PASS` for the repair. Readiness remains
  `NO_GO` because runtime/provider/billing/backup/restore/production smoke and
  deployed backend SHA evidence are still missing.
- `2026-06-20T22:03:35Z`: Q0D generated and independently QA-verified a local
  production-target release-evidence artifact for the exact FE/BE SHA pair. The
  artifact proves production-off new-domain flags and preserves missing
  runtime/provider/prod/manual evidence as gaps rather than pass claims.
  Readiness remains `NO_GO`.
- `2026-06-20T22:11:12Z`: Q0E added and independently QA-reran a local iOS
  unauthenticated runtime preflight. The flow passed twice without external API
  or provider use, proving dev-client boot/login/register shell only. Readiness
  remains `NO_GO`.
- `2026-06-20T22:18:00Z`: Q0F classified remaining release-readiness evidence
  as requiring owner authorization, provider/production/smoke credentials,
  external artifacts, or Android/local full-auth environment setup. Current
  decision is `BLOCKED_EXTERNAL_DEPENDENCY`; new domains remain production-off.
- `2026-06-20T22:42:24Z`: C5A marked locally accepted after Smart Memory and
  Planning telemetry event allowlists, bounded props/enums, byte-identical
  fixtures, backend forbidden-prop rejection tests, controller reruns and
  independent QA `QA_PASS_WITH_GAPS`. C5 remains partial because runtime/E2E
  event evidence is required before any domain activation. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-20T23:16:43Z`: F1A marked locally accepted after Food Library
  Ingredient/Product seed/corpus validator, local E2E seed pre-write validation,
  QA-driven repairs, named regression tests and full backend gates. F1 remains
  partial and production-off because approved corpus, owner quality review,
  PL/EN coverage, E2E/offline runtime evidence and latency evidence are missing.
  Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-20T23:29:47Z`: M1A marked locally accepted after Smart Memory
  capture-time auto-promotion was removed, focused capture tests were updated,
  stale emulator expectations were repaired after QA, and full backend gates
  passed. M1 remains partial and production-off because explicit windows,
  emulator runtime evidence, durable replay, source-delete/tombstone
  reactivation blocking, apply-disabled Review behavior and runtime telemetry
  evidence are missing. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-20T23:42:57Z`: M1B1 marked locally accepted after typical-portion
  capture was moved from last-20-meal semantics to a saved-day anchored
  inclusive 21-day `dayKey` window with paginated history reads. Independent QA
  found no blocking issue and recorded a non-blocking emulator-query coverage
  gap. M1 remains partial and production-off because review-correction/
  suppression 30-day windows, emulator runtime evidence, durable replay,
  source-delete/tombstone reactivation blocking, apply-disabled Review behavior
  and runtime telemetry evidence are missing. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-20T23:55:35Z`: M1B2 marked locally accepted after review-correction
  evaluation/capture gained deterministic inclusive 30-day `dayKey` windowing.
  Independent QA found no blocking issue and recorded remaining runtime/callsite
  evidence gaps. M1 remains partial and production-off because
  suppression/preference 30-day semantics where applicable, emulator runtime
  evidence, durable replay, source-delete/tombstone reactivation blocking,
  apply-disabled Review behavior and runtime telemetry evidence are missing.
  Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T00:20:55Z`: M1C marked locally accepted after backend
  typical-portion capture/replay was repaired to preserve exact tombstone
  checks and merge listed source-deleted/suppressed subjects before candidate
  evaluation/upsert. Independent QA and re-QA found no blocking issue and
  recorded a bounded-list legacy gap. M1 remains partial and production-off
  because suppression/preference 30-day semantics where applicable, emulator
  runtime evidence, apply-disabled Review behavior, runtime telemetry evidence,
  and legacy source-deleted-only bounded-list evidence are missing. Current
  release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T00:29:04Z`: M1D marked locally accepted after mobile Review test
  evidence proved Smart Memory globally on with Review apply disabled performs
  no memory read and exposes no Review memory UI/modal or Memory Center
  navigation. Full mobile typecheck, lint, targeted tests, and diff-check
  passed; independent QA found no blocking issue and recorded a
  dirty-worktree/runtime-evidence gap. M1 remains partial and production-off
  because suppression/preference 30-day semantics where applicable,
  emulator/runtime evidence, runtime telemetry evidence, and legacy
  source-deleted-only bounded-list evidence are missing. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T13:33:32Z`: M1E marked `controller_verified_qa_pending` after
  backend capture suppression scans were repaired to avoid the old default
  100-document cap for source-deleted/suppressed subjects. Focused and full
  backend gates passed, including full `pytest` (`1321 passed / 36 skipped /
  3 warnings`). Independent QA did not run because the subagent returned a
  usage-limit error. M1 remains partial and production-off because M1E
  independent QA, emulator/runtime evidence, runtime telemetry evidence, and
  later M2 controls/apply gates remain open. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T13:46:02Z`: M1E/M1F accepted as `pass_with_gaps` after
  independent QA reran the focused suppressed-subject/tombstone tests and the
  Firestore emulator source-delete runtime test with credential env vars
  cleared. M1F records source-delete candidate suppression/tombstone evidence
  at `reports/M1F-smart-memory-source-delete-emulator-report.md`. M1 remains
  partial and production-off because runtime telemetry evidence and later M2
  controls/apply gates remain open. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T13:54:39Z`: M1 marked `qa_passed` for the local Smart Memory
  shadow-capture gate after M1G added bounded category-only Memory Center
  telemetry for mute/delete controls and independent QA returned
  `pass_with_gaps`. Smart Memory production activation remains blocked by M2
  controls/apply gates and Q0 release evidence. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:13:52Z`: M2 marked `partial` after M2A added fail-closed
  mobile Smart Memory item/candidate page parsing for malformed page shapes and
  unknown top-level `memoryType`/`state`. Controller verification and
  independent QA passed with gaps. Full M2 remains open for nested malformed
  payload drift, Memory Center states, offline retry/discard, Review apply,
  Dietary Profile precedence, and runtime UI evidence. Current release decision
  remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:17:42Z`: M2A mobile changes committed as
  `49695a265e1baa9206908dab8a0dc2e50ddc1ec0`. Origin later verified at the
  same SHA after owner manual push; mobile and backend are synced with their
  origins. Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:36:41Z`: M2B accepted as `pass_with_gaps` after mobile parser
  hardening made nested Smart Memory response drift fail closed for
  `stateReason`, `sourceRefs`, `confidenceReasonCodes`, `schemaVersion`, and
  `serverRevision`. Controller verification and independent QA passed with
  non-blocking gaps around TypeScript sourceRef types and local disk pressure.
  Full M2 remains open for type-surface narrowing, Memory Center states,
  offline retry/discard, Review apply, Dietary Profile precedence, and runtime
  UI evidence. Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:40:13Z`: M2B mobile changes committed locally as
  `2bc2ffb35113c720a1fc42cd8789c04bff014ee6`. Push to origin was attempted
  and rejected by execution policy because origin was treated as an untrusted
  external destination for non-public workspace code. Mobile remains `ahead 1`;
  backend remains clean and synced. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:40:13Z`: M2C accepted by controller QA after narrowing mobile
  item/candidate `sourceRefs` response types to `SmartMemoryHashedSourceRef[]`.
  Focused Smart Memory parser/projection/service/contract tests, typecheck,
  lint, and diff-check passed. Full M2 remains open for Memory Center states,
  offline retry/discard, Review apply, Dietary Profile precedence, and runtime
  UI evidence. Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:44:40Z`: M2C mobile changes committed locally as
  `4f23fb82d8fbd2e58ba296661ac49881b94af891`. Push to origin was attempted
  and rejected by execution policy because origin was treated as an untrusted
  external destination for non-public workspace code. Mobile remains `ahead 2`
  with M2B and M2C local; backend remains clean and synced. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T14:54:05Z`: M2D accepted as `controller_pass` after Memory
  Center component evidence covered loading, load-error, empty enabled/disabled,
  ready, pending, failed recovery, retry/discard projection reload, and offline
  failed-row recovery controls. Controller verification passed focused Jest,
  typecheck, lint, and diff-check; independent QA returned `pass`. Mobile M2D
  commit is `432584ae3ff6968f2c7dabdcffc7bf8c0c2a5c0e`. Mobile remains
  `ahead 3` with M2B, M2C, and M2D local; backend remains clean and synced.
  Full M2 remains open for Review apply, Dietary Profile precedence, and
  runtime UI evidence. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T15:04:15Z`: M2E accepted as `controller_pass` after Review
  component evidence proved active memory explanation can be visible while
  saving the current Review draft value (`90 g`) instead of silently
  substituting the memory detail value (`180 g`). Controller verification passed
  focused Jest, typecheck, lint, and diff-check; independent QA returned
  `pass` after a naming/value-assertion repair. Mobile M2E commit is
  `e5355945a8a89276ea2217df57d7bedc9bade1b0`. Mobile remains `ahead 4` with
  M2B, M2C, M2D, and M2E local; backend remains clean and synced. Full M2
  remains open for Dietary Profile precedence and runtime UI evidence. Current
  release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T15:25:40Z`: M2F accepted as `controller_pass` after Review
  memory reads were made profile-required and active Review suggestions were
  made fail-closed for allergy/restriction profiles without explicit
  compatibility evidence. Controller verification passed focused Jest,
  typecheck, lint, and diff-check. Independent QA initially failed the optimistic
  implementation, then returned final `pass` after fail-closed repairs. Mobile
  M2F commit is `b92d976ffbfeaabfd0325c14931dca53d0502df1`. Mobile remains
  `ahead 5` with M2B, M2C, M2D, M2E, and M2F local; backend remains clean and
  synced. Full M2 remains open for runtime UI evidence. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T15:38:45Z`: M2G runtime UI evidence marked
  `blocked_external`. Release-gate metadata validation passed (`40 flow(s)
  validated`), local Auth/Firestore/backend emulator runtime was prepared, and
  the Smart Memory E2E user/state was seeded without smoke/prod access. The
  Maestro run reached Metro/dev-client priming but failed before UI assertions
  with `No space left on device` while XCUITest runner/log artifacts were being
  written. At that point, full M2 remained blocked on runtime UI evidence after
  local disk was freed. Smart Memory production flags remained off. Current
  release decision remained `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T16:31:46Z`: M2G disk blocker superseded after local cleanup and
  runtime repair. Shared Maestro login now uses an E2E-only
  `fitaly://e2e/login` bootstrap that calls the real mobile auth path, and
  backend Firebase Admin can initialize against local Firebase emulators with
  anonymous emulator credentials when no service-account credentials are
  configured, while preserving credential fail-fast for auth-emulator-only and
  no-emulator initialization. Controller verification passed mobile deep-link tests, mobile
  typecheck, backend Firebase/auth tests, manual local auth/profile API
  contract, focused shared Maestro login, six Smart Memory runtime UI flows in
  a combined rerun, and isolated `smart-memory-backend-pull.yaml` after
  restarting the local backend with `SMART_MEMORY_ENABLED=true`. M2G is
  `worker_done`, pending independent QA before full M2 closure. Smart Memory
  production flags remain off. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T17:02:43Z`: M2G accepted as `QA_PASS_WITH_GAPS` after
  independent QA and controller repair of the backend credential guard. Firebase
  Admin anonymous credentials are now wrapped in a Firebase Admin credential
  adapter and are allowed only for `local`/`development` Firestore or Storage
  emulator mode; auth-emulator-only, no-emulator, and production paths still
  require configured credentials. Verification passed mobile targeted deep-link
  tests, mobile typecheck, backend focused Firebase/auth tests (`11` tests),
  backend ruff, backend pyright, backend compileall, and full backend pytest
  (`1324` passed / `36` skipped / `3` warnings). Remaining QA gaps are
  non-blocking: storage-emulator-only local init may fail later if Firestore is
  used without `FIRESTORE_EMULATOR_HOST`, login-form typing remains outside
  this M2G repair, and the final re-QA did not rerun Maestro. M2 controls/apply
  is locally accepted. Smart Memory production flags remain off. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T19:43:02Z`: K1A marked `worker_done`. Repo evidence confirmed
  Known Patterns previously grouped candidates by `meal_type|normalized_name`.
  Backend candidate identity now uses `known-pattern-v2-content-signature` with
  normalized ingredient names, compatible `g`/`ml` units, bucketed amounts, and
  bucketed macro totals; missing compatible quantified content fails closed.
  Verification passed focused Known Patterns service/API tests, backend ruff,
  backend pyright, backend compileall, and full backend pytest
  (`1327` passed / `36` skipped / `3` warnings). Independent QA was attempted
  but failed due account usage limit, so K1 remains `worker_done`, not
  `qa_passed`. Known Patterns production flag remains off. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-21T19:50:23Z`: K1A accepted as `qa_passed` after independent QA,
  controller repair, and re-QA. QA found partial unquantified ingredient content
  could be silently ignored; controller changed content identity to fail closed
  when any normalized ingredient lacks a compatible unit/quantity and added
  regression coverage. Re-QA returned `QA_PASS`. Verification passed focused
  Known Patterns service/API tests (`29` tests), backend ruff, backend pyright,
  backend compileall, and full backend pytest
  (`1328` passed / `36` skipped / `3` warnings). K1 remains partial for
  PL/EN aliases, partial overlap/similarity threshold, runtime evidence, and
  final feature-gate closure. Known Patterns production flag remains off.
  Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T06:42:15Z`: Q0K accepted as `pass_with_gaps` after
  release-evidence JUnit hardening. The renderer now derives `Release gate E2E`
  from JUnit XML when `RELEASE_GATE_RESULTS_DIR` is supplied, rejects missing,
  failed, errored, skipped, duplicate, non-success, wrong-suite, and wrong-flow
  evidence, and can compare testcase IDs against the configured
  `core-release-gate` suite. Verification passed focused release-evidence tests
  (`23` tests), `core-release-gate` suite metadata validation (`20` flows),
  `git diff --check`, Q0K invariant checks, and independent QA
  `pass_with_gaps`. The accepted gap is that Q0K validates existing Q0I local
  JUnit artifacts and does not rerun Maestro or external/provider/manual release
  gates. Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T07:10:00Z`: Q0L marked `controller_verified_qa_pending` after
  release-evidence readiness-decision hardening. The renderer now refuses
  `CORE_RC_READY` and `FULL_1_1_RC_READY` artifacts unless worktree status is
  git-derived clean for both repos, target environment is production, critical
  launch/Q0 evidence fields are complete, release-gate evidence is
  JUnit-verified, smoke runtime backend SHA is verified, declared SHAs match git
  `HEAD`, and release-critical fields do not contain placeholder or local-only
  evidence such as local/no-provider/simulator/emulator or `file://` artifacts.
  Verification passed focused release-evidence tests (`31` tests), mobile
  typecheck, mobile lint, `core-release-gate` suite metadata validation (`20`
  flows), `git diff --check`, Q0L invariant checks, and a negative
  `CORE_RC_READY` probe that failed on the current dirty worktree before writing
  an artifact. Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T07:48:26Z`: Q0L Maestro/evidence repair after independent QA
  found a manual release-gate bypass. `CORE_RC_READY` / `FULL_1_1_RC_READY`
  now require `RELEASE_GATE_RESULTS_DIR` for JUnit-backed `Release gate E2E`
  evidence, so a manually supplied `RELEASE_GATE_E2E_STATUS="verified ..."`
  cannot replace Maestro JUnit reports. The controller reran local iOS
  no-provider `core-release-gate` with loopback API and health check skipped:
  `20/20` Maestro flows passed and `20` JUnit XML files recorded `20`
  testcases, failures `0`, errors `0`, skipped `0` in
  `fitaly/e2e/artifacts/core-release-gate-maestro-repair-20260622/reports/`.
  Focused release-evidence tests (`31` tests), mobile typecheck, mobile lint,
  `core-release-gate` metadata validation, release coverage validation,
  dynamic text assertion validation, `git diff --check`, Q0L invariant checks,
  and a negative dirty-worktree `CORE_RC_READY` probe passed. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`; this is local no-provider
  evidence, not provider/prod/authenticated release readiness.
- `2026-06-22T07:59:37Z`: Q0L repair loop after independent QA found two
  additional readiness-evidence bypasses. Readiness decisions now require
  explicit `RELEASE_GATE_EXPECTED_FLOW_COUNT` plus
  `RELEASE_GATE_EXPECTED_SUITE_KEY` or `RELEASE_GATE_EXPECTED_FLOW_IDS`, so a
  single successful JUnit XML cannot stand in for the full core release gate.
  The local-only evidence guard now rejects absolute local artifact paths such
  as `/var/folders/...` and `/Volumes/...` in release-critical fields. Focused
  release-evidence tests now pass `32/32`; mobile typecheck, mobile lint,
  `git diff --check`, Q0L invariant checks, JUnit count checks, and the
  negative dirty-worktree `CORE_RC_READY` probe passed. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T07:59:37Z`: Q0L final independent re-QA returned
  `QA_PASS_WITH_GAPS` with no findings. QA reran the focused release-evidence
  tests (`32/32`), script syntax check, `core-release-gate` metadata
  validation, release coverage validation, dynamic text validation,
  `git diff --check`, JUnit count checks, and negative probes for manual
  `verified` status without JUnit, local/no-provider evidence, placeholder
  evidence, `file://`, single-JUnit/no breadth, missing suite/flow identity,
  `/var/folders`, `/Volumes`, dirty worktree, and SHA mismatch. Accepted gaps:
  no full Maestro, Android runtime, provider-backed smoke, billing,
  backup/restore, deployed backend SHA, Sentry, compliance, rollback, external
  CI, or clean worktree evidence. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T08:16:49Z`: Q0M marked `worker_done / qa_pending`. The RC
  workflow now runs `e2e:core-release-gate`, writes JUnit reports to
  `release-gate-reports`, uploads/downloads the core JUnit artifact, and passes
  `RELEASE_GATE_RESULTS_DIR`, expected count `20`, `core-release-gate` suite
  key, and suite name into release evidence rendering. The manual
  `RELEASE_GATE_E2E_STATUS: passed` path was removed from the RC workflow.
  Verification passed focused release-evidence tests (`33/33`), workflow YAML
  parse, renderer syntax check, `core-release-gate` metadata validation (`20`
  flows), mobile typecheck, mobile lint, release coverage validation, dynamic
  text validation, and `git diff --check`. No live GitHub RC run or external
  provider evidence was generated; current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T08:30:09Z`: Q0M accepted as `QA_PASS_WITH_GAPS` after two
  QA-driven P2 test repairs. The workflow contract test now scopes assertions
  to the active `release-gate-e2e` and `release-evidence` job blocks plus named
  steps, and rejects both unquoted and quoted manual pass/readiness values in
  the render step. Final focused verification passed release-evidence tests
  (`33/33`), mobile lint, mobile typecheck, and `git diff --check`. Independent
  QA reported no findings; the remaining accepted gap is that the modified
  workflow has not been executed on the self-hosted runner. Current release
  decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T08:36:53Z`: Q0N marked `worker_done / qa_pending`. Readiness
  decisions now require proof-backed release-critical fields: `verified`
  markers, external `http(s)` URLs, or named GitHub Actions artifacts. Generic
  `passed`/`done` evidence and negated proof language such as `not verified`,
  `unverified`, or `unproven` are rejected before readiness artifacts can be
  written. The RC workflow render step now emits GitHub Actions run
  URLs/attempts and artifact references instead of bare status labels. Focused
  verification passed release-evidence tests (`36/36`), mobile lint, mobile
  typecheck, workflow YAML parse, renderer syntax check, release coverage
  validation, dynamic text validation, `core-release-gate` metadata validation
  (`20` flows), and `git diff --check`. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T09:41:02Z`: Q0O repaired the local no-provider Maestro core
  gate after a local `core-release-gate --continue-on-failure` run passed
  `19/20` and isolated the only failure to provider-backed offline reconnect
  sync. Added `offline-save-pending-local.yaml`, moved `core-release-gate` to
  that local pending-state flow while preserving `offline-save-sync.yaml` in
  full `release-gate`, and pinned the RC workflow Maestro job to
  `E2E_API_BASE_URL=http://127.0.0.1:9` with no smoke credential env. Fresh
  local iOS no-provider `core-release-gate` passed `20/20`; lint, typecheck,
  static E2E validations, release-evidence focused tests (`36/36`), YAML parse,
  and diff checks passed. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T09:46:09Z`: Q0N independent re-QA accepted as
  `QA_PASS_WITH_GAPS`. QA confirmed `FULL_1_1_RC_READY` now rejects
  `core-release-gate`, generic/self-attesting evidence is rejected, the RC
  workflow no longer supplies bare status labels, and no new prod/provider
  credentials were introduced. Accepted residual gaps: no live self-hosted RC
  workflow run and pattern-based proof-shape checks do not semantically verify
  external artifact contents. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T09:54:50Z`: Q0P refreshed the current blocked release-evidence
  artifact at `reports/Q0P-current-blocked-release-evidence.md` after Q0N/Q0O.
  The artifact records current dirty worktrees, production-off feature flags,
  `BLOCKED_EXTERNAL_DEPENDENCY`, and the repaired local no-provider
  `core-release-gate` JUnit set with `20/20` flow reports, zero
  failures/errors/skips, and no readiness claim. Independent QA returned
  `QA_PASS_WITH_GAPS`; the only findings are expected external/runtime gaps:
  no live self-hosted RC workflow, no provider-backed full `release-gate`, no
  Android runtime, no smoke runtime backend SHA, no backup/restore/delete/
  paywall/privacy/Sentry/compliance/rollback evidence, and dirty repos. Current
  release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T10:22:31Z`: K1B accepted as `QA_PASS`. Backend Known Patterns
  now canonicalizes a small deterministic PL/EN alias set, applies explicit
  `2 / 3` partial ingredient-overlap matching only with identical macro
  buckets, fails closed on malformed/skipped raw ingredient evidence rows, and
  checks legacy exact subject hashes so old alias-form declines still suppress
  canonicalized candidates. Verification passed focused Known Patterns/API
  tests (`36` tests), backend ruff, backend pyright, backend compileall, full
  backend pytest (`1371` passed / `36` skipped / `3` warnings), and diff
  checks. Known Patterns production flag remains off; K1 still needs
  runtime/Maestro evidence and final feature-gate closure before rollout.
  Current release decision remains `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-22T14:17:51Z`: K1C accepted as `QA_PASS_WITH_GAPS`. Local iOS
  Known Patterns runtime/Maestro evidence passed against local backend/emulators
  with `known-pattern-review-draft` `1/1`, zero failures, after the E2E-only
  login/session/token repair and unique-content fixture repair. Verification
  passed mobile typecheck, targeted E2E/auth/runtime tests (`14` suites /
  `209` tests), mobile lint, Known Patterns suite validation, shell syntax, diff
  checks, and the local runtime flow. Independent QA reran diff checks, shell
  syntax and suite validation, and returned only non-blocking documentation and
  artifact-context gaps. The K1C report and repo-owned JUnit snapshot repair
  those gaps. K1 identity/runtime gate is locally accepted. Known Patterns
  production flag remains off until Q0 release evidence and explicit feature
  rollout authorization. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-23`: F1D accepted as local technical Food Library autocomplete
  PL/EN and latency evidence. Backend commit
  `fe01fbaf92921271968e9d7bde329530b42513eb` adds local EN seed record
  `e2e-local-oats-en` and a verifier that mounts a local FastAPI app with
  `api_v2_router`, calls `/api/v2/users/me/ingredient-products/search`, and
  reports matched IDs, normalized queries, seed validation, and local route
  latency. Final verifier output passed PL `Owies`, PL diacritic
  `Ostrzeżenie`, and EN `Oats`; latency p95 was `1.17ms` over `30`
  iterations with a `50ms` local threshold. Focused tests passed (`64/64`),
  full backend pytest passed (`1385 passed / 36 skipped / 3 warnings`),
  compileall, Ruff, Pyright, and diff checks passed. Independent QA found and
  controller repaired the global-app eager Firebase import risk and stale
  service-only helper; re-QA returned `pass`. This is local in-process API v2
  router evidence only: no production corpus approval, provider-backed auth,
  production Firebase, deployed backend, network, Android, physical-device
  latency, owner quality sign-off, or rollout approval. Food Library production
  flag remains off. Current release decision remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-24`: F1F accepted as exact-SHA remote CI pairing evidence for the
  current F1 pair. Mobile GitHub Actions run
  `https://github.com/lukaszkurczab/fitaly/actions/runs/28062888358` passed on
  mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` with backend contract ref
  `fe01fbaf92921271968e9d7bde329530b42513eb`; backend GitHub Actions run
  `https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28062888045`
  passed on backend `fe01fbaf92921271968e9d7bde329530b42513eb` with mobile
  contract ref `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`. This is remote CI
  pairing evidence only, not release-candidate, provider, production, Android,
  billing, backup/restore, Sentry/privacy/compliance, rollback, deployed
  backend, production smoke, or rollout evidence. Physical-device validation is
  skipped by owner instruction and is not claimed. Current release decision
  remains
  `BLOCKED_EXTERNAL_DEPENDENCY`.
- `2026-06-24`: Q0V added the mobile
  `e2e:android-simulator:preflight` script and report
  `reports/Q0V-android-simulator-preflight-report.md`. Syntax verification
  passed. The preflight returned expected exit `2` with `status=not_ready`:
  `adb`, Android `emulator`, and Maestro were found, but `adb devices` reported
  no booted emulator and `emulator -list-avds` reported no configured AVD.
  Physical devices are not accepted by policy. The mobile commit
  `80790f6a0fb4c70bf949a39ee7737085195ca3f3` was pushed, and normal exact-SHA
  CI passed as mobile run `28063907416` plus backend run `28063907468`. No
  Android runtime, provider,
  production, billing, backup/restore, deployed backend, Sentry/privacy,
  compliance, rollback, production smoke, or readiness claim was made.
- `2026-06-24`: Q0W generated
  `reports/Q0W-current-blocked-release-evidence.md` and
  `reports/Q0W-current-blocked-release-evidence-refresh-report.md` for the
  current pushed pair. `git fetch --prune`, clean worktree checks, empty
  diff-to-origin checks, renderer syntax checks, and the release-evidence
  renderer passed. The artifact records `BLOCKED_EXTERNAL_DEPENDENCY`, current
  SHAs, production-off new-domain flags, Q0V CI run IDs, Android preflight-only
  `not_ready`, and missing smoke/runtime/provider/manual evidence. No readiness
  claim was made.
