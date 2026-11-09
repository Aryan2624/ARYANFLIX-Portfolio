import {BookOpen, Code2, Database, FileCode2, Globe2, Layers3, Cpu, Shield, BrainCircuit} from 'lucide-react';

export const GITHUB_USER = 'Aryan2624';
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const BASE_URL = 'https://api.github.com';
const MAX_PAGES = 20;

// The API is the source of truth. No guessed repository names or descriptions.
export async function getAllPublicRepositories({signal} = {}) {
  const repositories = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BASE_URL}/users/${encodeURIComponent(GITHUB_USER)}/repos?per_page=100&page=${page}&sort=updated&direction=desc`;
    const response = await fetch(url, {
      signal,
      headers: {Accept: 'application/vnd.github+json'},
    });
    if (!response.ok) {
      const message = response.status === 403 || response.status === 429
        ? 'GitHub API rate limit reached. Please try again after it resets.'
        : `GitHub could not load the repositories (HTTP ${response.status}).`;
      if (repositories.length) return {repositories, warning: `${message} Some repositories may be missing.`};
      throw new Error(message);
    }
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected response from the GitHub API.');
    repositories.push(...batch.filter(repo => repo && repo.html_url && repo.full_name && repo.visibility !== 'private'));
    if (batch.length < 100) return {repositories, warning: null};
  }
  return {repositories, warning: 'GitHub returned an unusually large repository list; only the first 1,000 are shown.'};
}

export function repoIdentity(repoUrl = '') {
  try {
    const u = new URL(repoUrl);
    if (u.hostname.toLowerCase() !== 'github.com') return null;
    const parts = u.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    return parts.length === 2 ? `${parts[0]}/${parts[1]}`.toLowerCase() : null;
  } catch { return null; }
}

function chooseIcon(repo) {
  const text = [repo.name, repo.description, ...(repo.topics || [])].filter(Boolean).join(' ').toLowerCase();
  if (/security|malware|phish|cyber|fraud/.test(text)) return Shield;
  if (/neural|llm|machine.learning|deep.learning|ai-|\bai\b|vision/.test(text)) return BrainCircuit;
  if (/data|sql|database|analytics/.test(text)) return Database;
  if (/website|webapp|frontend|portfolio/.test(text)) return Globe2;
  if (/system|hardware|drone|robot|iot/.test(text)) return Cpu;
  return FileCode2;
}

export function repoToProject(repo, index) {
  const topics = (repo.topics || []).filter(Boolean);
  const tags = [...new Set([repo.language, ...topics.map(t => t.replace(/-/g, ' '))].filter(Boolean))];
  return {
    id: `GH-${repo.id || index}`,
    title: repo.name,
    category: repo.fork ? 'FORKED GITHUB REPOSITORY' : 'PUBLIC GITHUB REPOSITORY',
    desc: repo.description?.trim() || 'Explore this repository’s source code and documentation on GitHub.',
    overview: repo.description?.trim() || '',
    tags,
    repo: repo.html_url,
    origin: 'github',
    featured: false,
    status: repo.archived ? 'ARCHIVED' : repo.fork ? 'FORKED REPOSITORY' : 'PUBLIC REPOSITORY',
    icon: chooseIcon(repo),
    color: ['#972337','#b13d51','#8d2347','#bc2744','#97344c'][index % 5],
    githubData: {
      fullName: repo.full_name,
      defaultBranch: repo.default_branch || 'main',
      language: repo.language || null,
      topics,
      updated: repo.updated_at || null,
      created: repo.created_at || null,
      fork: !!repo.fork,
      archived: !!repo.archived,
      website: /^https:\/\//.test(repo.homepage || '') ? repo.homepage : null,
    },
  };
}

export function mergeProjects(curated, repositories) {
  const byIdentity = new Map(repositories.map(r => [r.full_name.toLowerCase(), r]));
  const matched = new Set();
  // Match exact repository URL first. For curated entries with no URL, use an
  // unambiguous title match (e.g. CampusIQ / campus-iq) to avoid duplicates.
  const cleanName = name => String(name || '').toLowerCase().replace(/[^a-z0-9]/g,'');
  const byTitle = new Map();
  for (const candidate of repositories.filter(r => !r.fork)) {
    const key=cleanName(candidate.name);
    if (!byTitle.has(key)) byTitle.set(key,[]);
    byTitle.get(key).push(candidate);
  }
  const featured = curated.map(p => {
    const identity = repoIdentity(p.repo);
    const exact = identity ? byIdentity.get(identity) : undefined;
    const titleMatches = byTitle.get(cleanName(p.title)) || [];
    const repo = exact || (titleMatches.length === 1 ? titleMatches[0] : undefined);
    if (repo) matched.add(repo.full_name.toLowerCase());
    return {
      ...p,
      origin: 'featured',
      featured: true,
      ...(repo ? {
        repo: repo.html_url,
        githubData: repoToProject(repo, 0).githubData,
        note: p.note,
      } : identity ? {
        repo: null,
        note: 'A public repository matching the previously supplied link was not found. No source link is shown.',
      } : {}),
    };
  });
  const additional = repositories
    .filter(repo => !matched.has(repo.full_name.toLowerCase()))
    .map((repo, i) => repoToProject(repo, i));
  return [...featured, ...additional];
}

function decodeBase64Utf8(value) {
  const binary = atob(value.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}

export async function getRepositoryReadme(repoUrl, {signal} = {}) {
  const identity = repoIdentity(repoUrl);
  if (!identity || !identity.startsWith(`${GITHUB_USER.toLowerCase()}/`)) {
    throw new Error('This source link is not a repository under the portfolio GitHub account.');
  }
  const response = await fetch(`${BASE_URL}/repos/${identity}/readme`, {
    signal,
    headers: {Accept: 'application/vnd.github+json'},
  });
  if (response.status === 404) return {markdown: null, message: 'This repository does not contain a README file.'};
  if (!response.ok) {
    throw new Error(response.status === 403 || response.status === 429
      ? 'GitHub has temporarily limited documentation requests. Open the repository to read its README.'
      : `README unavailable (HTTP ${response.status}).`);
  }
  const data = await response.json();
  if (data.encoding !== 'base64' || !data.content) {
    throw new Error('The README format is not supported in this view. Open it on GitHub.');
  }
  const contents = decodeBase64Utf8(data.content);
  const limit = 110000;
  return {
    markdown: contents.slice(0, limit),
    message: contents.length > limit ? 'Long README preview shortened here. Open the repository for the complete document.' : null,
  };
}
