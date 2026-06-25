# Q0C Local Full Regression Report

Status: `qa_passed`
Created: `2026-06-20T21:56:28Z`
Controller decision: `NO_GO` remains unchanged.

## Scope

Q0C runs paired local regression evidence for the exact mobile/backend branch
pair without production/provider credentials, then repairs only local failures
that are supported by repo evidence.

Non-goals:

- No production smoke.
- No provider or billing live calls.
- No store, legal, Sentry, RevenueCat, Firebase credential changes.
- No feature-domain activation.

## Pair Snapshot

Mobile:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly`
- Branch: `codex/smart-memory-core-loop-fe`
- HEAD: `5827c0a8c7618ce1523734e83f752e15e25258be`
- Dirty state: existing C1-C4/P1/Q0 worktree changes plus Q0C locale repair in
  `src/locales/en/meals.json`, `src/locales/pl/meals.json`,
  `src/locales/en/profile.json`, and `src/locales/pl/profile.json`.

Backend:

- Repo: `/Users/lukaszkurczab/Desktop/Projects/Fitaly/fitaly-backend`
- Branch: `codex/smart-memory-core-loop-be`
- HEAD: `0988f53a9b76d25f3c38893cf54f5de44a9e9df7`
- Dirty state: existing C1-C4/P1 worktree changes; no Q0C backend edits.

## Baseline Failure

Initial mobile full Jest failed after Q0B:

- `npm test -- --runInBand`
  - Result: failed.
  - Summary: `313 passed / 1 failed / 314 total` suites and
    `2109 passed / 1 failed / 2110 total` tests.
  - Failing suite: `src/locales/i18n.audit.test.ts`.
  - Missing locale keys:
    - `meals:review_meal_planned_unknown_nutrition_title`
    - `meals:review_meal_planned_unknown_nutrition_description`
    - `profile:planning.disabledTitle`
    - `profile:planning.disabledBody`
    - `profile:recipeCatalog.disabledTitle`
    - `profile:recipeCatalog.disabledBody`
    - `profile:memoryCenter.featureDisabledTitle`
    - `profile:memoryCenter.featureDisabledBody`

Classification: local regression introduced by prior hardening changes that
added deterministic `defaultValue` call sites for disabled/new-domain states
without adding matching locale keys. No evidence suggests it pre-existed C1-C4/P1
hardening.

## Implemented Repair

Mobile locale-only repair:

- `src/locales/en/meals.json`
  - Added planned-meal unknown-nutrition title/body keys.
- `src/locales/pl/meals.json`
  - Added Polish planned-meal unknown-nutrition title/body keys.
- `src/locales/en/profile.json`
  - Added disabled-state title/body keys for Planning, Recipe Catalog, and
    Smart Memory.
- `src/locales/pl/profile.json`
  - Added Polish disabled-state title/body keys for Planning, Recipe Catalog,
    and Smart Memory.

Diff hygiene note: these four locale files already contained earlier dirty P1
changes such as Planning disabled review copy and `planning.statusLinkedMeal`.
Q0C only attributes the missing-key repair above to this slice.

## Commands Run

Backend local regression:

- `./.venv/bin/pytest -q`
  - Result: `1266 passed, 36 skipped, 3 warnings in 8.50s`.
- `ruff check .`
  - Result: passed, all checks passed.
- `./.venv/bin/pyright`
  - Result: passed, `0 errors`.

Mobile repair and regression:

- `node -e "const fs=require('fs'); for (const f of ['src/locales/en/meals.json','src/locales/pl/meals.json','src/locales/en/profile.json','src/locales/pl/profile.json']) JSON.parse(fs.readFileSync(f,'utf8'));"`
  - Result: passed.
- `npm run test:targeted -- --runTestsByPath src/locales/i18n.audit.test.ts`
  - Result: `1 suite passed / 4 tests passed`.
- `npm test -- --runInBand`
  - Result: `314 passed / 314 total` suites and
    `2110 passed / 2110 total` tests.
  - Note: release-evidence and offline/provider tests print expected console
    errors/warnings for negative-path assertions; final suite result is pass.
- `npm run typecheck`
  - Result: passed.
- `npm run lint`
  - Result: passed.
- `GIT_OPTIONAL_LOCKS=0 git diff --check`
  - Result: passed.

## QA Status

Independent QA:

- Agent: `James`.
- Verdict: `QA_PASS`.
- Severity: `none`.
- Commands rerun:
  - `npm run test:targeted -- --runTestsByPath src/locales/i18n.audit.test.ts`
    -> exit `0`, `1 suite / 4 tests` passed.
  - JSON parse of all four changed locale files -> exit `0`, all files `OK`.
  - `GIT_OPTIONAL_LOCKS=0 git diff --check` -> exit `0`, no output.
- QA findings:
  - No blocking findings.
  - Added keys are paired across English and Polish locales.
  - Added keys match active call sites in `ReviewMealScreen`,
    `MemoryCenterScreen`, `RecipeCatalogScreen`, and `PlanningScreen`.
- QA unverified areas:
  - QA did not rerun full Jest; controller did, with the green result above.
  - Runtime UI rendering and visual copy QA were not performed.
  - QA did not review unrelated dirty files outside Q0C.

## Remaining Q0 Blockers

Q0C closes local full unit/static regression for this branch pair, but does not
close Q0 final release readiness. Remaining blockers:

- Runtime Maestro smoke/release-gate evidence is not yet green for this exact
  pair.
- Provider/billing evidence is not present.
- Backup/restore evidence is not present.
- Production smoke is not authorized or run.
- Deployed backend SHA evidence is not present.
- Store/legal metadata evidence remains incomplete.
- Residual low/moderate dependency audit findings from Q0B remain open for a
  separate risk/upgrade plan.

## Next Smallest Slice

Q0D: produce the next local, non-provider release evidence slice for the exact
FE/BE pair. Acceptance criteria should include exact SHA evidence in generated
release artifacts, production-off new-domain flags, high audit still green, and
clear separation between local runtime evidence and owner-authorized external
provider/prod blockers.
