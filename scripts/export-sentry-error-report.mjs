#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_REPORT_PATH = path.join(
  DOCS_ROOT,
  "launch",
  "reports",
  "sentry-error-report.md",
);
const DEFAULT_API_BASE_URL = "https://sentry.io/api/0";
const DEFAULT_LOOKBACK = "14d";
const DEFAULT_LIMIT = 100;
const DEFAULT_EVENTS_PER_ISSUE = 1;
const MAX_LIMIT = 100;
const MAX_EVENTS_PER_ISSUE = 5;
const SAFE_TAG_KEYS = new Set([
  "app.build",
  "app.version",
  "device",
  "device.family",
  "dist",
  "environment",
  "handled",
  "level",
  "mechanism",
  "os",
  "os.name",
  "release",
  "runtime",
  "runtime.name",
  "sdk.name",
]);

class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConfigError";
  }
}

function env(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function requiredEnv(name) {
  const value = env(name);
  if (!value) {
    throw new ConfigError(`${name} is required.`);
  }
  return value;
}

function parsePositiveInt(name, fallback, max) {
  const raw = env(name);
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new ConfigError(`${name} must be a positive integer.`);
  }
  return Math.min(parsed, max);
}

function validateLookback(value) {
  if (!/^\d+[dhmsw]$/.test(value)) {
    throw new ConfigError(
      "SENTRY_LOOKBACK must use Sentry statsPeriod format, for example 24h, 14d, or 2w.",
    );
  }
  return value;
}

function getConfig() {
  const output = env("SENTRY_REPORT_OUTPUT");
  const projects = [
    { label: "frontend", slug: env("SENTRY_PROJECT_FRONTEND") },
    { label: "backend", slug: env("SENTRY_PROJECT_BACKEND") },
  ].filter((project) => project.slug);

  if (projects.length === 0) {
    throw new ConfigError(
      "At least one of SENTRY_PROJECT_FRONTEND or SENTRY_PROJECT_BACKEND is required.",
    );
  }

  const environments = [
    env("SENTRY_ENVIRONMENT_PROD") || "production",
    env("SENTRY_ENVIRONMENT_DEV") || "development",
  ].filter(Boolean);

  return {
    apiBaseUrl: env("SENTRY_API_BASE_URL") || DEFAULT_API_BASE_URL,
    authToken: requiredEnv("SENTRY_AUTH_TOKEN"),
    environments,
    eventsPerIssue: parsePositiveInt(
      "SENTRY_EVENTS_PER_ISSUE",
      DEFAULT_EVENTS_PER_ISSUE,
      MAX_EVENTS_PER_ISSUE,
    ),
    issueQuery: env("SENTRY_ISSUE_QUERY") || "is:unresolved",
    limit: parsePositiveInt("SENTRY_REPORT_LIMIT", DEFAULT_LIMIT, MAX_LIMIT),
    lookback: validateLookback(env("SENTRY_LOOKBACK") || DEFAULT_LOOKBACK),
    org: requiredEnv("SENTRY_ORG"),
    outputPath: output ? path.resolve(process.cwd(), output) : DEFAULT_REPORT_PATH,
    projects,
  };
}

function redactString(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [redacted-secret]")
    .replace(
      /\b(api[_-]?key|auth[_-]?token|access[_-]?token|refresh[_-]?token|secret|dsn)=([^&\s]+)/gi,
      "$1=[redacted-secret]",
    )
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[redacted-email]",
    )
    .replace(
      /\bhttps?:\/\/[^\s)>\]]+/gi,
      "[redacted-url]",
    )
    .replace(/([?&])[^=\s]+=[^&\s]+/g, "$1[redacted-query]")
    .replace(/\/Users\/[^/\s]+/g, "/Users/[redacted-user]")
    .replace(/\\Users\\[^\\\s]+/g, "\\Users\\[redacted-user]")
    .trim();
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function markdownEscape(value) {
  return redactString(String(value ?? ""))
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
}

function truncate(value, maxLength = 320) {
  const redacted = redactString(String(value ?? ""));
  if (redacted.length <= maxLength) {
    return redacted;
  }
  return `${redacted.slice(0, maxLength - 3)}...`;
}

function getTagValue(tags, key) {
  if (!Array.isArray(tags)) {
    return "";
  }
  const tag = tags.find((item) => item?.key === key);
  return typeof tag?.value === "string" ? tag.value : "";
}

function pickSafeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags
    .filter((tag) => SAFE_TAG_KEYS.has(tag?.key))
    .map((tag) => ({
      key: tag.key,
      value: truncate(tag.value, 160),
    }))
    .filter((tag) => tag.value);
}

function statsTotal(issue, lookback) {
  const stats = issue?.stats;
  if (!stats || typeof stats !== "object") {
    return 0;
  }
  const timeline = stats[lookback] || stats["24h"] || Object.values(stats)[0];
  if (!Array.isArray(timeline)) {
    return 0;
  }
  return timeline.reduce((total, point) => {
    if (!Array.isArray(point) || point.length < 2) {
      return total;
    }
    return total + asNumber(point[1]);
  }, 0);
}

function normalizeEvent(event) {
  return {
    eventId: event?.eventID || event?.id || "",
    created: event?.dateCreated || "",
    title: truncate(event?.title || ""),
    message: truncate(event?.message || "", 500),
    culprit: truncate(event?.culprit || ""),
    location: truncate(event?.location || ""),
    platform: truncate(event?.platform || ""),
    release: truncate(getTagValue(event?.tags, "release")),
    environment: truncate(getTagValue(event?.tags, "environment")),
    tags: pickSafeTags(event?.tags),
  };
}

function normalizeIssue(issue, lookback, events) {
  const metadata = issue?.metadata && typeof issue.metadata === "object" ? issue.metadata : {};
  return {
    id: issue?.id || "",
    shortId: issue?.shortId || "",
    title: truncate(issue?.title || metadata.title || ""),
    culprit: truncate(issue?.culprit || ""),
    level: truncate(issue?.level || ""),
    platform: truncate(issue?.platform || issue?.project?.platform || ""),
    project: truncate(issue?.project?.slug || ""),
    status: truncate(issue?.status || ""),
    substatus: truncate(issue?.substatus || ""),
    priority: truncate(issue?.priority || ""),
    issueCategory: truncate(issue?.issueCategory || ""),
    issueType: truncate(issue?.issueType || ""),
    count: asNumber(issue?.count),
    userCount: asNumber(issue?.userCount),
    isUnhandled: Boolean(issue?.isUnhandled),
    firstSeen: issue?.firstSeen || "",
    lastSeen: issue?.lastSeen || "",
    statsTotal: statsTotal(issue, lookback),
    latestEvents: events.map(normalizeEvent),
  };
}

function buildUrl(config, pathname, params = {}) {
  const base = config.apiBaseUrl.endsWith("/")
    ? config.apiBaseUrl
    : `${config.apiBaseUrl}/`;
  const url = new URL(pathname.replace(/^\//, ""), base);
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          url.searchParams.append(key, item);
        }
      }
    } else if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

async function sentryGet(config, pathname, params) {
  const url = buildUrl(config, pathname, params);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.authToken}`,
    },
  });
  const bodyText = await response.text();

  if (!response.ok) {
    const message = bodyText ? truncate(bodyText, 500) : response.statusText;
    throw new Error(`Sentry API ${response.status} ${response.statusText}: ${message}`);
  }

  if (!bodyText.trim()) {
    return null;
  }
  return JSON.parse(bodyText);
}

async function fetchIssueEvents(config, issueId) {
  const events = await sentryGet(
    config,
    `/organizations/${encodeURIComponent(config.org)}/issues/${encodeURIComponent(
      issueId,
    )}/events/`,
    {
      environment: config.environments,
      full: "false",
      per_page: config.eventsPerIssue,
      statsPeriod: config.lookback,
    },
  );
  return Array.isArray(events) ? events : [];
}

async function fetchProjectReport(config, project) {
  const issues = await sentryGet(
    config,
    `/organizations/${encodeURIComponent(config.org)}/issues/`,
    {
      environment: config.environments,
      limit: config.limit,
      project: project.slug,
      query: config.issueQuery,
      sort: "freq",
      statsPeriod: config.lookback,
    },
  );

  const normalizedIssues = [];
  for (const issue of Array.isArray(issues) ? issues : []) {
    let events = [];
    let eventError = "";
    try {
      events = await fetchIssueEvents(config, issue.id);
    } catch (error) {
      eventError = redactString(error.message);
    }
    const normalized = normalizeIssue(issue, config.lookback, events);
    if (eventError) {
      normalized.eventFetchError = eventError;
    }
    normalizedIssues.push(normalized);
  }

  return {
    label: project.label,
    slug: project.slug,
    issues: normalizedIssues,
  };
}

function issueSortValue(issue) {
  return issue.statsTotal || issue.count || 0;
}

function renderTags(tags) {
  if (!tags.length) {
    return "_No safe tags exported._";
  }
  return tags.map((tag) => `\`${tag.key}=${markdownEscape(tag.value)}\``).join(", ");
}

function renderReport(config, projectReports) {
  const generatedAt = new Date().toISOString();
  const totalIssues = projectReports.reduce(
    (total, report) => total + report.issues.length,
    0,
  );
  const topIssues = projectReports
    .flatMap((report) =>
      report.issues.map((issue) => ({
        ...issue,
        reportLabel: report.label,
      })),
    )
    .sort((a, b) => issueSortValue(b) - issueSortValue(a))
    .slice(0, 10);

  const lines = [
    "# Sentry Error Export Report",
    "",
    "Status: generated diagnostic artifact",
    `Generated at: ${generatedAt}`,
    "",
    "## Scope",
    "",
    `- Organization: configured by \`SENTRY_ORG\` (${config.org ? "set" : "missing"})`,
    `- Projects: ${projectReports
      .map((report) => `${report.label}=\`${markdownEscape(report.slug)}\``)
      .join(", ")}`,
    `- Environments: ${config.environments.map((item) => `\`${markdownEscape(item)}\``).join(", ")}`,
    `- Lookback: \`${markdownEscape(config.lookback)}\``,
    `- Query: \`${markdownEscape(config.issueQuery)}\``,
    `- Limit per project: \`${config.limit}\``,
    `- Latest events per issue: \`${config.eventsPerIssue}\``,
    "",
    "## Privacy Notes",
    "",
    "- This report intentionally omits Sentry auth tokens, DSNs, user objects, request bodies, breadcrumbs, private Sentry permalinks, and full event payloads.",
    "- String fields are normalized with best-effort redaction for URLs, emails, tokens, query strings, and local user paths.",
    "- Treat this artifact as confidential launch evidence until manually reviewed.",
    "",
    "## Summary",
    "",
    `- Total exported issues: ${totalIssues}`,
  ];

  for (const report of projectReports) {
    const totalEvents = report.issues.reduce(
      (total, issue) => total + (issue.statsTotal || issue.count || 0),
      0,
    );
    lines.push(
      `- ${report.label} (${markdownEscape(report.slug)}): ${report.issues.length} issues, ${totalEvents} issue events/count signals`,
    );
  }

  lines.push("", "## Top Issues", "");
  if (topIssues.length === 0) {
    lines.push("_No matching Sentry issues were returned._", "");
  } else {
    lines.push(
      "| Rank | Area | Issue | Status | Level | Count | Users | Last seen | Title |",
      "| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |",
    );
    topIssues.forEach((issue, index) => {
      lines.push(
        `| ${index + 1} | ${markdownEscape(issue.reportLabel)} | ${markdownEscape(
          issue.shortId || issue.id,
        )} | ${markdownEscape(issue.status)} | ${markdownEscape(issue.level)} | ${
          issue.statsTotal || issue.count
        } | ${issue.userCount} | ${markdownEscape(issue.lastSeen)} | ${markdownEscape(
          issue.title,
        )} |`,
      );
    });
    lines.push("");
  }

  for (const report of projectReports) {
    lines.push(`## ${report.label[0].toUpperCase()}${report.label.slice(1)} Project`, "");
    lines.push(`Project slug: \`${markdownEscape(report.slug)}\``, "");

    if (report.issues.length === 0) {
      lines.push("_No matching Sentry issues were returned for this project._", "");
      continue;
    }

    report.issues
      .sort((a, b) => issueSortValue(b) - issueSortValue(a))
      .forEach((issue, index) => {
        lines.push(`### ${index + 1}. ${markdownEscape(issue.shortId || issue.id)}`, "");
        lines.push(`- Title: ${markdownEscape(issue.title)}`);
        lines.push(`- Project/platform: ${markdownEscape(issue.project)} / ${markdownEscape(issue.platform)}`);
        lines.push(`- Status: ${markdownEscape(issue.status)}${issue.substatus ? ` / ${markdownEscape(issue.substatus)}` : ""}`);
        lines.push(`- Level/priority: ${markdownEscape(issue.level)} / ${markdownEscape(issue.priority || "n/a")}`);
        lines.push(`- Category/type: ${markdownEscape(issue.issueCategory || "n/a")} / ${markdownEscape(issue.issueType || "n/a")}`);
        lines.push(`- Count/users: ${issue.statsTotal || issue.count} / ${issue.userCount}`);
        lines.push(`- Unhandled: ${issue.isUnhandled ? "yes" : "no"}`);
        lines.push(`- First seen: ${markdownEscape(issue.firstSeen || "unknown")}`);
        lines.push(`- Last seen: ${markdownEscape(issue.lastSeen || "unknown")}`);
        if (issue.culprit) {
          lines.push(`- Culprit: ${markdownEscape(issue.culprit)}`);
        }
        if (issue.eventFetchError) {
          lines.push(`- Event fetch error: ${markdownEscape(issue.eventFetchError)}`);
        }
        lines.push("");

        if (issue.latestEvents.length === 0) {
          lines.push("_No latest events exported for this issue._", "");
          return;
        }

        issue.latestEvents.forEach((event, eventIndex) => {
          lines.push(`Latest event ${eventIndex + 1}:`);
          lines.push("");
          lines.push(`- Event id: ${markdownEscape(event.eventId || "unknown")}`);
          lines.push(`- Created: ${markdownEscape(event.created || "unknown")}`);
          lines.push(`- Environment/release: ${markdownEscape(event.environment || "unknown")} / ${markdownEscape(event.release || "unknown")}`);
          lines.push(`- Platform/location: ${markdownEscape(event.platform || "unknown")} / ${markdownEscape(event.location || "unknown")}`);
          if (event.culprit) {
            lines.push(`- Culprit: ${markdownEscape(event.culprit)}`);
          }
          if (event.message) {
            lines.push(`- Message: ${markdownEscape(event.message)}`);
          }
          lines.push(`- Safe tags: ${renderTags(event.tags)}`);
          lines.push("");
        });
      });
  }

  lines.push("## GPT Review Prompt", "");
  lines.push(
    "Use this report to identify likely root-cause clusters and propose a repair plan. Do not assume the report contains full stack traces or user context; ask for targeted Sentry details only when the normalized issue/event fields are insufficient.",
  );
  lines.push("");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const config = getConfig();

  if (args.has("--check-config")) {
    console.log(
      JSON.stringify(
        {
          environments: config.environments,
          eventsPerIssue: config.eventsPerIssue,
          issueQuery: config.issueQuery,
          limit: config.limit,
          lookback: config.lookback,
          outputPath: config.outputPath,
          projects: config.projects,
        },
        null,
        2,
      ),
    );
    return;
  }

  const projectReports = [];
  for (const project of config.projects) {
    projectReports.push(await fetchProjectReport(config, project));
  }

  const markdown = renderReport(config, projectReports);
  await mkdir(path.dirname(config.outputPath), { recursive: true });
  await writeFile(config.outputPath, markdown, "utf8");
  console.log(`Sentry error report written to ${config.outputPath}`);
}

main().catch((error) => {
  const message =
    error instanceof ConfigError
      ? error.message
      : redactString(error?.message || String(error));
  console.error(`Sentry export failed: ${message}`);
  process.exitCode = 1;
});
