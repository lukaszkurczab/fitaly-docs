# C5A New-Domain Telemetry Contracts Report

Status: `QA_PASS_WITH_GAPS` for the local contract slice
Controller decision: accept C5A as a local contract gate; keep C5 open for per-domain runtime/E2E evidence before any activation.
Timestamp: `2026-06-20T22:42:24Z`

## Scope

C5A covered only the cross-repo telemetry contract for inactive new domains:

- Smart Memory events:
  - `memory_candidate_created`
  - `memory_candidate_confirmed`
  - `memory_candidate_dismissed`
  - `memory_used`
  - `memory_muted`
  - `memory_deleted`
- Planning events:
  - `planned_meal_created`
  - `planned_meal_confirmed`
  - `planned_meal_changed`
  - `planned_meal_skipped`

Non-goals:

- No production feature activation.
- No live telemetry, provider, smoke, production, or credential-backed run.
- No Home Next Action activation.
- No feature screen/service callsite wiring.

## Confirmed Facts

- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- New domains remain production-off from prior C2/Q0 evidence.
- Q0 final release readiness remains `BLOCKED_EXTERNAL_DEPENDENCY`.

## Changed Files

Intentional C5A files:

- `fitaly/src/services/telemetry/telemetryTypes.ts`
- `fitaly/src/services/telemetry/telemetryInstrumentation.ts`
- `fitaly/src/services/telemetry/telemetryInstrumentation.test.ts`
- `fitaly/src/__contract_fixtures__/c5_new_domain_telemetry.json`
- `fitaly-backend/app/schemas/telemetry.py`
- `fitaly-backend/tests/test_api_telemetry.py`
- `fitaly-backend/tests/contract_fixtures/c5_new_domain_telemetry.json`

Shared contract test files also touched for C5A:

- `fitaly/src/__contract_fixtures__/contractAlignment.test.ts`
- `fitaly-backend/tests/test_contract_alignment.py`

Diff attribution note: both shared contract test files already contained dirty P1 Planning contract changes before C5A. C5A attribution is limited to the new `c5_new_domain_telemetry.json` fixture tests and C5 telemetry assertions in those files.

## Behavior Before

- Mobile did not list the C5 Smart Memory / Planning event names in `TELEMETRY_EVENT_NAMES`.
- Backend did not allow those event names in `ALLOWED_TELEMETRY_EVENT_NAMES`.
- Backend would reject these events as `event_not_allowed`.
- No shared C5 fixture existed for event names, props, enum values, disallowed events, or forbidden props.

## Behavior After

- Mobile and backend allowlists include the C5 Smart Memory / Planning event names.
- Backend validates only bounded C5 prop names:
  - `memoryType`
  - `surface`
  - `confidenceBucket`
  - `actionResult`
  - `sourceType`
  - `estimateState`
  - `featureState`
- Backend validates those props against bounded enum sets.
- Mobile exposes typed instrumentation helpers for the C5 event payloads.
- The paired `c5_new_domain_telemetry.json` fixture is byte-identical across repos.
- No live C5 callsites were added outside telemetry helpers/tests/fixtures/schema allowlists.

## Privacy Guardrails

Backend negative tests reject forbidden C5 props including:

- `mealName`
- `ingredientName`
- `notes`
- `candidateId`
- `memoryId`
- `plannedMealId`
- `sourceRef`
- `rawReason`
- `rawPrompt`
- `rawResponse`
- `imageUrl`
- `fullPayload`
- `calories`
- `kcal`
- `macros`
- `protein`
- `carbs`
- `fat`

## Verification

Controller rerun:

- Mobile:
  - `./node_modules/.bin/jest --runInBand --watchman=false --coverage=false --runTestsByPath src/services/telemetry/telemetryInstrumentation.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
  - Result: `2 passed`, `112 tests passed`.
- Mobile:
  - `npm run typecheck`
  - Result: passed.
- Backend:
  - `./.venv/bin/pytest tests/test_api_telemetry.py tests/test_contract_alignment.py -q`
  - Result: `179 passed`.
- Backend:
  - `./.venv/bin/ruff check .`
  - Result: `All checks passed!`
- Backend:
  - `./.venv/bin/pyright`
  - Result: `0 errors, 0 warnings, 0 informations`.
- Backend:
  - `python3 -m compileall app`
  - Result: passed.
- Both repos:
  - `git diff --check`
  - Result: passed.
- Cross-repo fixture identity:
  - `cmp -s fitaly/src/__contract_fixtures__/c5_new_domain_telemetry.json fitaly-backend/tests/contract_fixtures/c5_new_domain_telemetry.json`
  - Result: passed.
- Callsite scan:
  - `rg` for all C5 event names / helper names across mobile `src`, backend `app`, backend `tests`
  - Result: no live emitters outside telemetry helpers, schema allowlist, fixtures, and tests.

Worker verification additionally recorded:

- `npm test -- --runTestsByPath ...` ran the targeted suites but failed only on global coverage thresholds; the controller and QA used coverage-disabled targeted Jest for this slice.
- `python -m compileall app` failed because `python` is not installed; `python3 -m compileall app` passed.

## Independent QA

QA agent: `Hilbert`

Verdict: `QA_PASS_WITH_GAPS`

Accepted:

- Smart Memory and Planning C5 event names match the C5 doc and are present in both mobile/backend allowlists.
- C5 props are bounded domain categories.
- Backend rejects unbounded enum values and forbidden props.
- Mobile/backend C5 fixtures are byte-identical.
- Disabled telemetry no-op behavior was not weakened.
- No C5 telemetry event callsites exist outside helpers/schema/tests/fixtures.

QA gaps:

- Full C5 acceptance still requires E2E confirmation for at least one critical event per activated domain.
- Shared contract test files contain pre-existing non-C5 Planning contract assertions; those are not attributed to C5A.

## Controller Resolution

C5A is accepted as a local telemetry contract slice.

C5 as a feature-wave gate is not fully closed for domain activation. Each domain still needs runtime/E2E evidence when its telemetry events are actually wired into an activated domain. This is not a blocker for safe core release with new domains production-off.

## Unverified Areas

- No live telemetry ingestion in a smoke/prod environment.
- No E2E event capture for active Smart Memory or Planning domains.
- No dashboard/warehouse validation.
- No provider or production credentials used.

## Stop Conditions

- Do not activate Smart Memory, Planning, Known Patterns, Recipe Catalog, or Home Next Action in production solely because C5A passed.
- Do not claim `CORE_RC_READY`; Q0 remains blocked by external or owner-authorized evidence.
- Add runtime/E2E evidence before any C5 event is treated as rollout telemetry for an activated domain.
