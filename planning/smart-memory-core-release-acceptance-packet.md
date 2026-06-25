# Smart Memory Implementation Closure

Status: complete; future Smart Memory work should be treated as fixes or
hardening, not as continuation of plans `00-09`
Last updated: 2026-06-19

## Purpose

This is the single retained planning summary for the Smart Memory
implementation pass. Historical controller plans, handoffs, packaging reports,
and slice evidence files were removed after the implementation closed.

Repo code, tests, manifests, and current branches remain the source of truth.
Use this file only as a compact orientation note before inspecting the repos.

## Confirmed State

| Area | Current state |
| --- | --- |
| Mobile repo | `fitaly/`, branch `codex/smart-memory-core-loop-fe`, clean and pushed to `origin/codex/smart-memory-core-loop-fe` |
| Mobile closure commit | `5827c0a8 test(e2e): add telemetry runtime assertion` |
| Backend repo | `fitaly-backend/`, branch `codex/smart-memory-core-loop-be`, clean and pushed to `origin/codex/smart-memory-core-loop-be` |
| Backend closure commit | `0988f53 fix(telemetry): align daily summary window` |
| Docs | Local workspace docs only; this workspace root is not a git repo |

## Delivered Scope

| Plan | Delivered outcome |
| --- | --- |
| `00` Execution model and release quality | Controller/QA process, targeted gates, release-quality checks, and final runtime evidence were completed. |
| `01` Data scope, migration, measurement audit | Domain boundaries, account lifecycle expectations, cross-repo contracts, and measurement guardrails were established and reconciled with repo evidence. |
| `02` Food/Product/Ingredient foundation | Shared food-library foundation, user-scoped products, conflict handling, offline queues, cache/projection behavior, and Product/Ingredient runtime coverage were implemented. |
| `03` Smart Memory and Memory Center | Memory capture types, Review explanations, Memory Center controls, deletion/tombstone behavior, offline/degraded states, and user-control precedence were implemented. |
| `04` Manual ingredient autocomplete | Manual ingredient suggestions, warnings, no-results/manual fallback, private create/update/delete/conflict flows, and relevant telemetry were implemented. |
| `05` Recipes and onboarding filters | Curated recipe catalog/filter foundation, backend/mobile contracts, read-only mobile catalog access, deterministic filtering, unknown/reveal states, and catalog coverage gates were implemented. |
| `06` Known Pattern Confirmation | Known-pattern candidate contract/API, mobile confirmation surface, and Review draft handoff coverage were implemented. |
| `07` Light Planning 1-3 Days | Planned meal contract/API/mobile foundation and plan-to-Review handoff coverage were implemented. |
| `08` Home Next Action | Home next-action selector/surface for Review drafts, planned items, and known patterns plus runtime telemetry were implemented. |
| `09` Analytics, guardrails, packaging | Telemetry guardrails, privacy-sensitive event coverage, free/core boundary checks, local runtime QA, and final packaging verification were completed. |

## Final Verification

Mobile static and targeted gates passed:

- `npm run test:targeted -- --runTestsByPath src/services/e2e/fixtures.test.ts src/services/e2e/deepLink.test.ts src/__contract_fixtures__/contractAlignment.test.ts`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`
- `git diff -- src/components/TextInput.tsx` was empty

Backend static and targeted gates passed:

- `./.venv/bin/python -m compileall app`
- `./.venv/bin/ruff check .`
- `./.venv/bin/pyright`
- `./.venv/bin/pytest tests/test_contract_alignment.py tests/test_api_telemetry.py`

Final local runtime matrix passed `8/8` against backend
`http://127.0.0.1:8000` with local Firestore emulator:

- `recipe-catalog-review-draft`
- `known-pattern-review-draft`
- `planning-home-to-review`
- `home-next-action-review-draft`
- `home-next-action-planned-item`
- `home-next-action-known-pattern`
- `review-draft-no-silent-save-abort`
- `home-next-action-telemetry-runtime`

Independent QA found no high or medium findings. The remaining operational gap
is that the telemetry Maestro flow is direct-run only and intentionally not in
the default suite; run it explicitly with local backend and telemetry enabled
when touching that path.

## Boundaries For Future Fixes

- Do not resurrect the deleted `00-09` controller plans as active work.
- Treat future Smart Memory changes as bugfixes, hardening, or small scoped
  product iterations with fresh acceptance criteria.
- Do not add silent meal logging. Recipes, plans, known patterns, and Home
  actions must still pass through explicit Review/confirmation before creating
  a logged meal.
- Do not use runtime AI as eligibility, dietary compliance, catalog truth, or
  durable personalization truth.
- Do not let `chronicDiseases`, `allergiesOther` free text, or lifestyle fields
  drive eligibility logic.
- Unknown flags must remain visible as unknown/reveal states, not safe copy or
  silent exclusion.
- Backend runtime QA should use `http://127.0.0.1:8000` and local Firestore
  unless a new task explicitly requires another environment.
