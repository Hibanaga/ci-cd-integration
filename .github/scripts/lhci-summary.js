const fs = require('fs');

const ASSERT_PATH = '.lighthouseci/assertion-results.json';
const TARGET = process.env.TARGET || 'unknown';
const SUMMARY = process.env.GITHUB_STEP_SUMMARY;

if (!SUMMARY) {
  console.error('GITHUB_STEP_SUMMARY is not defined.');
  process.exit(1);
}

function round2(v) {
  if (v === undefined || v === null || Number.isNaN(Number(v))) return String(v);
  return (Math.round(Number(v) * 100) / 100).toString();
}

function shortAuditName(id = '', name = '', auditProperty = '') {
  const base = id || name || '';
  const cleaned = base.replace(/^categories\./, 'category/');
  return auditProperty ? `${cleaned}:${auditProperty}` : cleaned;
}

function levelIcon(level) {
  return level === 'error' ? '🛑' : '⚠️';
}

function compactUrl(u) {
  try {
    const x = new URL(u);
    const path = x.pathname === '/' ? '/' : x.pathname.replace(/\/$/, '');
    return `${x.hostname}${path}`;
  } catch {
    return u || '(no-url)';
  }
}

let md = `### Lighthouse CI — ${TARGET}\n\n`;

if (!fs.existsSync(ASSERT_PATH)) {
  md += `_No assertion results file found at \`${ASSERT_PATH}\`._\n`;
  fs.appendFileSync(SUMMARY, md);
  process.exit(0);
}

let results;
try {
  results = JSON.parse(fs.readFileSync(ASSERT_PATH, 'utf8'));
} catch (e) {
  md += `_Failed to parse \`${ASSERT_PATH}\`:_ ${String(e)}\n`;
  fs.appendFileSync(SUMMARY, md);
  process.exit(0);
}

if (!Array.isArray(results) || results.length === 0) {
  md += '_Assertion results file is empty._\n';
  fs.appendFileSync(SUMMARY, md);
  process.exit(0);
}

const failing = results.filter(r => r?.passed === false || r?.status === 'fail');
if (failing.length === 0) {
  md += 'No validation issues. ✅\n';
  fs.appendFileSync(SUMMARY, md);
  process.exit(0);
}

const byUrl = new Map();
for (const r of failing) {
  const url = r.url || r.entity?.url || '';
  const key = compactUrl(url);
  if (!byUrl.has(key)) byUrl.set(key, []);
  byUrl.get(key).push(r);
}

md += `Found **${failing.length}** validation issue(s).\n\n`;

for (const [urlKey, list] of byUrl.entries()) {

  list.sort((a, b) => {
    const la = a.level === 'error' ? 1 : 0;
    const lb = b.level === 'error' ? 1 : 0;
    if (lb !== la) return lb - la;
    const an = (a.auditId || a.name || '').localeCompare(b.auditId || b.name || '');
    return an;
  });

  md += `#### ${urlKey}\n\n`;
  md += '| Level | Metric | Expected | Actual |\n';
  md += '|:-----:|:-------|---------:|------:|\n';
  for (const r of list) {
    const metric = shortAuditName(r.auditId, r.name, r.auditProperty);
    const expected = r.expected ?? '';
    const actual = Array.isArray(r.values) ? r.values[0] : (r.actual ?? r.value ?? r.score ?? '');
    md += `| ${levelIcon(r.level)} ${r.level || ''} | \`${metric}\` | ${round2(expected)} | ${round2(actual)} |\n`;
  }
  md += '\n';
}

md += '<details>\n<summary>Raw assertion items</summary>\n\n';
md += '```json\n';
md += JSON.stringify(failing, null, 2);
md += '\n```\n</details>\n\n';

fs.appendFileSync(SUMMARY, md);
console.log('Wrote Lighthouse assertion summary (grouped by URL).');
