/**
 * Save all public GitHub repositories to a static snapshot for ARYANFLIX.
 * Run: npm run sync:github
 * No GitHub token needed for public repositories (subject to rate limits).
 * Fails safely: a previous successful snapshot is never overwritten on error.
 */
import {writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const USER = process.env.GITHUB_USER || 'Aryan2624';
const optional = process.argv.includes('--optional');
const quiet = process.argv.includes('--quiet');
const TOKEN = process.env.GITHUB_TOKEN;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src', 'generated', 'repoSnapshot.json');

async function fetchAll() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const url = new URL(`https://api.github.com/users/${encodeURIComponent(USER)}/repos`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('sort','updated');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    let response;
    try {
      response = await fetch(url, {signal: controller.signal, headers: {'Accept':'application/vnd.github+json','User-Agent':'ARYANFLIX-portfolio-sync','X-GitHub-Api-Version':'2022-11-28',...(TOKEN ? {Authorization:`Bearer ${TOKEN}`} : {})}});
    } finally { clearTimeout(timer); }
    if (!response.ok) {
      throw new Error(response.status === 404
        ? `GitHub account '${USER}' could not be found (HTTP 404). Confirm the username.`
        : response.status === 403 || response.status === 429
          ? 'GitHub API rate limit exceeded; retry later or supply a GITHUB_TOKEN.'
          : `GitHub returned HTTP ${response.status}`);
    }
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub API response.');
    all.push(...batch.filter(r=>r && r.owner?.login?.toLowerCase() === USER.toLowerCase() && r.private === false && r.html_url));
    if (batch.length < 100) return all;
  }
  throw new Error('GitHub has more than 2,000 public repositories. Increase the sync page limit.');
}

try {
  const repositories = await fetchAll();
  await mkdir(dirname(out), {recursive:true});
  const snapshot = {account: USER, syncedAt: new Date().toISOString(), repositories};
  await writeFile(out, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');
  if (!quiet) {
    console.log(`\n✓ ARYANFLIX: Saved ${repositories.length} GitHub repositories for @${USER}.`);
    console.log(`  Snapshot: src/generated/repoSnapshot.json`);
    console.log(`  Now run: npm run dev\n`);
    for (const r of repositories) console.log(`  • ${r.name}`);
  }
} catch (err) {
  console.warn(`[ARYANFLIX GitHub sync] ${err.message}`);
  if (!optional) {
    console.error('No existing project snapshot was changed. If this is a network error, open https://api.github.com/users/Aryan2624/repos?per_page=100 in Chrome to test access.');
    process.exitCode = 1;
  }
}
