import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join, dirname} from 'node:path';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const {account, repositories, syncedAt}=JSON.parse(await readFile(join(root,'src/generated/repoSnapshot.json'),'utf8'));
console.log(`GitHub account: ${account}; snapshot: ${syncedAt||'not synced'}; repositories: ${repositories.length}`);
for(const [i,r] of repositories.entries()) console.log(`${i+1}. ${r.name} — ${r.html_url}`);
