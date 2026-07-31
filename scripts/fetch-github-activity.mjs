import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const username = "Rajikshank";
const outputPath = resolve("src/data/github-activity.json");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "Rajikshank-Portfolio-Activity",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const previous = JSON.parse(await readFile(outputPath, "utf8"));

const request = async (url, options = {}) => {
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const summarizeEvent = (event) => {
  const repository = event.repo?.name?.split("/").at(-1) ?? "a public repository";
  switch (event.type) {
    case "PushEvent": {
      const count = event.payload?.size ?? event.payload?.commits?.length ?? 1;
      return {
        type: "push",
        summary: `Pushed ${count} ${count === 1 ? "commit" : "commits"} to ${repository}`,
        count,
      };
    }
    case "PullRequestEvent":
      return {
        type: "pull-request",
        summary: `${event.payload?.action ?? "Updated"} a pull request in ${repository}`,
      };
    case "ReleaseEvent":
      return {
        type: "release",
        summary: `Published ${event.payload?.release?.tag_name ?? "a release"} in ${repository}`,
      };
    case "IssuesEvent":
      return {
        type: "issue",
        summary: `${event.payload?.action ?? "Updated"} an issue in ${repository}`,
      };
    case "CreateEvent":
      return {
        type: "create",
        summary: `Created ${event.payload?.ref_type ?? "work"} in ${repository}`,
      };
    default:
      return null;
  }
};

const groupEvents = (events) => {
  const groups = new Map();
  for (const event of events) {
    const summary = summarizeEvent(event);
    if (!summary || !event.public) continue;
    const day = event.created_at.slice(0, 10);
    const key = `${event.repo.name}:${summary.type}:${day}`;
    const existing = groups.get(key);
    if (existing && summary.type === "push") {
      existing.count += summary.count ?? 1;
      const repository = event.repo.name.split("/").at(-1);
      existing.summary = `Pushed ${existing.count} commits to ${repository}`;
      continue;
    }
    groups.set(key, {
      id: String(event.id),
      type: summary.type,
      repository: event.repo.name.split("/").at(-1),
      repositoryUrl: `https://github.com/${event.repo.name}`,
      occurredAt: event.created_at,
      summary: summary.summary,
      ...(summary.count ? { count: summary.count } : {}),
    });
  }
  return [...groups.values()].slice(0, 5);
};

const fetchContributions = async () => {
  if (!token) return null;
  const response = await request("https://api.github.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { contributionCount date }
              }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
  });
  const calendar = response.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks
      .slice(-12)
      .flatMap((week) => week.contributionDays.map((day) => Math.min(day.contributionCount, 4))),
  };
};

try {
  const [events, contributions] = await Promise.all([
    request(`https://api.github.com/users/${username}/events/public?per_page=100`),
    fetchContributions(),
  ]);
  const next = {
    username,
    profileUrl: `https://github.com/${username}`,
    fetchedAt: new Date().toISOString(),
    sourceWindowDays: 30,
    totalContributionsLastYear:
      contributions?.total ?? previous.totalContributionsLastYear ?? 0,
    weeks: contributions?.weeks ?? previous.weeks ?? Array(84).fill(0),
    events: groupEvents(events),
  };
  await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${outputPath} with ${next.events.length} public activity groups.`);
} catch (error) {
  console.warn(`GitHub refresh skipped; preserving last-known-good snapshot. ${error.message}`);
  process.exitCode = 0;
}
