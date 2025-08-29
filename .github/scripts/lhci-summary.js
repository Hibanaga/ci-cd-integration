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

function deltaInfo(r) {
  const op = r.operator || '';
  const exp = Number(r.expected);
  const act = Number(
    Array.isArray(r.values) ? r.values[0] : (r.actual ?? r.value ?? r.score)
  );
  if (!Number.isFinite(exp) || !Number.isFinite(act)) return {delta: 0, rel: 0};
  if (op === '<=' || op === '≤') {
    const d = act - exp;
    const rel = exp !== 0 ? d / exp : 0;
    return {delta: d, rel};
  }
  if (op === '>=' || op === '≥') {
    const d = exp - act;
    const rel = exp !== 0 ? -d / exp : 0;
    return {delta: -d, rel};
  }
  return {delta: 0, rel: 0};
}

function shortAuditName(id = '', name = '') {
  const base = id || name || '';
  return base.replace(/^categories\./, 'category/');
}

function levelIcon(level) {
  return level === 'error' ? '🛑' : '⚠️';
}

function operatorText(op) {
  if (op === '<=') return '≤';
  if (op === '>=') return '≥';
  return op || '';
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

const enriched = failing.map(r => ({...r, _d: deltaInfo(r)}));
enriched.sort((a, b) => {
  const da = Math.abs(a._d.delta);
  const db = Math.abs(b._d.delta);
  if (db !== da) return db - da;
  const la = a.level === 'error' ? 1 : 0;
  const lb = b.level === 'error' ? 1 : 0;
  return lb - la;
});

md += `Found **${enriched.length}** validation issue(s). Sorted by severity and gap to threshold.\n\n`;

md += '| Level | Metric | Expected | Actual | Gap | Operator | URL |\n';
md += '|:-----:|:------|---------:|------:|----:|:--------:|:----|\n';

for (const r of enriched) {
  const url = r.url || r.entity?.url || '';
  const metric = shortAuditName(r?.auditProperty ? `${r.auditId}:${r?.auditProperty}` : r.auditId, r.name);
  const expected = r.expected ?? '';
  const actual = Array.isArray(r.values) ? r.values[0] : (r.actual ?? r.value ?? r.score ?? '');
  const op = operatorText(r.operator);
  const gap = round2(Math.abs(r._d.delta));
  md += `| ${levelIcon(r.level)} ${r.level || ''} | \`${metric}\` | ${round2(expected)} | ${round2(actual)} | ${gap} | ${op} | ${url} |\n`;
}

md += '\n';

md += '<details>\n<summary>Raw assertion items</summary>\n\n';
md += '```json\n';
md += JSON.stringify(failing, null, 2);
md += '\n```\n</details>\n\n';

fs.appendFileSync(SUMMARY, md);
console.log('Wrote Lighthouse assertion summary.');
