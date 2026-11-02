// Builds the chunk matrix for GitHub Actions: one bundle, one entry per (language, chunk).
//   node scripts/plan.mjs <Episode> <EN,DE,ES> <chunks per language>
// stdout: one JSON line {"include":[{"comp":"Day3-EN","lang":"EN","name":"EN-000","a":0,"b":87}, ...]}
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const [episode, langsCsv = 'EN', n = '16'] = process.argv.slice(2);
const r = spawnSync('npx', ['remotion', 'bundle', 'src/index.ts', '--out-dir=build', '--public-dir=public'], {stdio: ['ignore', 'ignore', 'inherit'], shell: true});
if (r.status !== 0) process.exit(1);
const R = await import('@remotion/renderer');
const exe = process.env.TOON_BROWSER || null;
const include = [];
for (const lang of langsCsv.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean)) {
  const comp = `${episode}-${lang}`;
  const c = await R.selectComposition({serveUrl: path.resolve('build'), id: comp, browserExecutable: exe, logLevel: 'error', chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 120000});
  const total = c.durationInFrames, k = Math.min(Number(n), total), size = Math.ceil(total / k);
  for (let i = 0; i * size < total; i++) {
    include.push({comp, lang, name: `${lang}-${String(i).padStart(3, '0')}`, a: i * size, b: Math.min(total - 1, (i + 1) * size - 1)});
  }
  console.error(`${comp}: ${total} frames, ${c.fps} fps`);
}
console.log(JSON.stringify({include}));
