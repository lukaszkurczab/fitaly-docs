# F1F Food Library Current-Pair Remote CI Report

Date: 2026-06-24

Status: remote CI pairing evidence, not release readiness

## Objective

Convert the current Food Library F1D/F1E pair into exact-SHA remote CI evidence
after the backend F1D commit changed the backend head.

## Scope

- Mobile repo: `fitaly/`
- Backend repo: `fitaly-backend/`
- Mobile branch: `codex/smart-memory-core-loop-fe`
- Mobile SHA: `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- Backend branch: `codex/smart-memory-core-loop-be`
- Backend SHA: `fe01fbaf92921271968e9d7bde329530b42513eb`
- Workflows: normal `ci.yml` only

No release-candidate workflow, production smoke, provider smoke, billing,
backup/restore, deployed backend, or physical-device validation was run.

## Preflight

- Local mobile branch matched remote ref
  `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`.
- Local backend branch matched remote ref
  `fe01fbaf92921271968e9d7bde329530b42513eb`.
- Both local worktrees were clean.
- `git diff --name-status` was empty in both repos.
- `git diff --name-status origin/<branch> --` was empty in both repos.

## Commands

```bash
gh workflow run ci.yml \
  --ref codex/smart-memory-core-loop-fe \
  -f backend_contract_ref=fe01fbaf92921271968e9d7bde329530b42513eb \
  -f require_exact_backend_contract_ref=true
```

```bash
gh workflow run ci.yml \
  --ref codex/smart-memory-core-loop-be \
  -f mobile_contract_ref=5de157eb42ca79c15b1fd4e943a6157d64b99e7c \
  -f require_exact_mobile_contract_ref=true
```

## Results

Mobile CI:

- Run: `https://github.com/lukaszkurczab/fitaly/actions/runs/28062888358`
- Event: `workflow_dispatch`
- Head branch: `codex/smart-memory-core-loop-fe`
- Head SHA: `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`
- Conclusion: `success`
- `Lint, Typecheck and Tests`: success
- `Cross-repo contract sync`: success
- The contract-sync log recorded
  `BACKEND_CONTRACT_REF_INPUT=fe01fbaf92921271968e9d7bde329530b42513eb`,
  `BACKEND_CONTRACT_REF_REQUIRE_EXACT_SHA=true`, selected the backend ref from
  workflow input, checked out backend
  `fe01fbaf92921271968e9d7bde329530b42513eb`, and verified contract snapshots.

Backend CI:

- Run:
  `https://github.com/lukaszkurczab/fitaly-backend/actions/runs/28062888045`
- Event: `workflow_dispatch`
- Head branch: `codex/smart-memory-core-loop-be`
- Head SHA: `fe01fbaf92921271968e9d7bde329530b42513eb`
- Conclusion: `success`
- `Ruff, Pyright and Pytest`: success
- The job log recorded
  `MOBILE_CONTRACT_REF_INPUT=5de157eb42ca79c15b1fd4e943a6157d64b99e7c`,
  `MOBILE_CONTRACT_REF_REQUIRE_EXACT_SHA=true`, checked out mobile
  `5de157eb42ca79c15b1fd4e943a6157d64b99e7c`, and completed Ruff, Pyright,
  pip-audit, and tests.
- Test summary: `1385 passed, 36 skipped, 3 warnings`; coverage threshold
  reached with total coverage `87.12%`.
- Non-failing annotation: GitHub Actions reported the Node.js 20 deprecation
  warning for `actions/setup-python@v5`.

## Limitations

- This is remote CI pairing evidence only.
- This is not a live release-candidate workflow run.
- This is not production, provider, billing, backup/restore, deployed backend,
  Sentry/privacy/compliance, rollback, Android runtime, or production smoke
  evidence.
- Physical-device validation is skipped by owner instruction and is not
  claimed.
- Food Library production rollout still requires approved corpus, owner
  quality/source-confidence sign-off, authorized production/provider or deployed
  evidence, and rollout approval.

## Controller Decision

F1F is accepted as exact-SHA remote CI pairing evidence for the current F1 pair:
mobile `5de157eb42ca79c15b1fd4e943a6157d64b99e7c` plus backend
`fe01fbaf92921271968e9d7bde329530b42513eb`. F1 remains partial, Q0 remains
`BLOCKED_EXTERNAL_DEPENDENCY`, and Food Library production activation must stay
off until the remaining gates pass.
