# Sentry Error Export Report

Status: active launch-hardening runbook
Last updated: 2026-06-30

## Purpose

Generate a normalized markdown report of current frontend and backend Sentry
issues/events for GPT-assisted diagnosis and repair planning.

This runbook is collection-only. Do not use it as permission to fix errors,
change app code, or make speculative runtime changes.

## Location

Run from the workspace root:

```bash
node fitaly-docs/scripts/export-sentry-error-report.mjs
```

Default generated report:

```text
fitaly-docs/launch/reports/sentry-error-report.md
```

The generated report is gitignored because it may contain operational error
context from Sentry. Commit the exporter and runbook, not live incident data.

This path is under `fitaly-docs/launch/reports` because the report is launch
evidence spanning both `fitaly` and `fitaly-backend`. The parent workspace is
not a git repo, and `fitaly-docs` is the active tracked launch documentation
repo in this checkout.

## Environment

Create a local env file from the docs template:

```bash
cp fitaly-docs/.env.example fitaly-docs/.env.sentry.local
```

Fill values locally. Do not commit tokens, DSNs, org slugs, project slugs, user
data, or private URLs.

Required variables:

```bash
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT_FRONTEND=
SENTRY_PROJECT_BACKEND=
```

Supported optional variables:

```bash
SENTRY_ENVIRONMENT_PROD=production
SENTRY_ENVIRONMENT_DEV=development
SENTRY_LOOKBACK=14d
SENTRY_REPORT_LIMIT=100
SENTRY_EVENTS_PER_ISSUE=1
SENTRY_ISSUE_QUERY=is:unresolved
SENTRY_REPORT_OUTPUT=fitaly-docs/launch/reports/sentry-error-report.md
SENTRY_API_BASE_URL=https://sentry.io/api/0
```

At least one of `SENTRY_PROJECT_FRONTEND` or `SENTRY_PROJECT_BACKEND` must be
set. `SENTRY_REPORT_LIMIT` is capped at 100 per project. `SENTRY_EVENTS_PER_ISSUE`
is capped at 5 to keep the report bounded.

## Run

From workspace root:

```bash
set -a
source fitaly-docs/.env.sentry.local
set +a
node fitaly-docs/scripts/export-sentry-error-report.mjs
```

Validate config without calling Sentry:

```bash
set -a
source fitaly-docs/.env.sentry.local
set +a
node fitaly-docs/scripts/export-sentry-error-report.mjs --check-config
```

## Output Contract

The generated report includes:

- report scope, environments, lookback, query, and limits;
- per-project issue counts;
- top issue table sorted by lookback signal;
- normalized issue fields: id, short id, title, status, level, priority, count,
  user count, first seen, last seen, culprit, platform, category, and type;
- latest event summaries with safe tags.

The report intentionally omits:

- auth tokens and DSNs;
- user objects;
- request bodies;
- breadcrumbs;
- full event payloads;
- private Sentry permalinks.

String fields are best-effort redacted for URLs, email addresses, query strings,
token-like values, and local user paths. Treat the generated file as
confidential launch evidence until manually reviewed.

## GPT Review

When asking GPT to review the report, provide only the generated markdown and
ask for:

- likely root-cause clusters;
- suspected owning area: frontend, backend, config, provider, or release
  instrumentation;
- minimal verification needed before repair;
- repair plan only, unless a separate implementation task is explicitly opened.

Do not ask GPT to infer user identity, inspect private links, or diagnose from
missing full payload fields.
