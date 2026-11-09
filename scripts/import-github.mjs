/** Import a JSON array of public GitHub repositories saved from the GitHub API. */
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
const arg=process.argv[2];
if(!arg){console.error('Usage: npm run import:github -- C:\\path\\to\\repos.json');process.exit(1)}
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
try{
  const raw=JSON.parse(await readFile(resolve(arg),'utf8'));
  const repos=Array.isArray(raw)?raw:raw.repositories;
  if(!Array.isArray(repos)) throw new Error('Expected a GitHub API JSON array or a snapshot with a repositories array.');
  const valid=repos.filter(r=>r?.full_name?.toLowerCase().startsWith('aryan2624/') && r.html_url?.startsWith('https://github.com/') && r.private !== true);
  if(!valid.length) throw new Error('No public Aryan2624 repositories found in this file.');
  const snapshot={account:'Aryan2624',syncedAt:new Date().toISOString(),repositories:valid};
  await writeFile(join(root,'src/generated/repoSnapshot.json'),JSON.stringify(snapshot,null,2)+'\n');
  console.log(`✓ Imported ${valid.length} repositories into the ARYANFLIX project library.`);
}catch(err){console.error(`Import failed: ${err.message}`);process.exitCode=1}
