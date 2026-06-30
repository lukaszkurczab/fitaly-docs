# Launch Reports

Generated launch-hardening reports live here.

Current stable Sentry report target:

```text
fitaly-docs/launch/reports/sentry-error-report.md
```

Generate it with:

```bash
node fitaly-docs/scripts/export-sentry-error-report.mjs
```

The generated report is intentionally gitignored. Keep live Sentry evidence
local unless the release owner explicitly approves sharing a reviewed, redacted
artifact.
