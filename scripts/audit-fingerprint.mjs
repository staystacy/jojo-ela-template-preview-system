#!/usr/bin/env node
/* JOJO ELA — Audit fingerprint helper
 *
 * Decides which workbooks actually need re-auditing by hashing:
 *   - per-workbook page JSON content (PAGES_DIR/<WB>/U??_P??.json)
 *   - global asset manifest (/api/asset-manifest)
 *   - global audit code (data/bitable-mode.js + scripts/audit-*.mjs)
 *
 * A workbook is "stale" (needs re-audit) when ANY of these hold:
 *   - never audited before
 *   - last audit result != pass
 *   - its page JSON sha changed
 *   - the global manifest sha changed (assets added/removed/renamed)
 *   - the global code sha changed (translator or audit logic updated)
 *
 * USAGE
 *   node scripts/audit-fingerprint.mjs check  <WB> [<WB>...]
 *   node scripts/audit-fingerprint.mjs update <WB> [<WB>...] [--result=pass|fail]
 *
 * `check` prints JSON to stdout; never mutates the fingerprint file.
 * `update` only runs after audit + render smoke have actually passed
 * (or explicitly recorded fail).
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const SERVER    = process.env.SERVER || 'http://localhost:3000';
const PAGES_DIR = process.env.PAGES_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks';
const REPO_ROOT = process.cwd();
const FP_PATH   = join(REPO_ROOT, 'audit-reports', '_fingerprints.json');

// Files whose change should invalidate every workbook's fingerprint.
// Keep this list minimal; bloating it means churn even on cosmetic edits.
const CODE_FILES = [
  'data/bitable-mode.js',
  'scripts/audit-workbook.mjs',
  'scripts/audit-fingerprint.mjs'
];

function sha(buf) {
  return createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

function hashWorkbookJSON(wb) {
  const dir = join(PAGES_DIR, wb);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => /^U\d+_P\d+\.json$/.test(f)).sort();
  if (files.length === 0) return null;
  const concat = files.map((f) => f + '\0' + readFileSync(join(dir, f), 'utf8')).join('\0');
  return sha(concat);
}

async function hashManifest() {
  const r = await fetch(SERVER + '/api/asset-manifest');
  if (!r.ok) throw new Error('manifest HTTP ' + r.status + ' — is `node server.js` running?');
  const m = await r.json();
  // Hash a stable projection of the asset inventory only. Server stamps
  // generated_at: new Date() into the payload so the raw text is never
  // deterministic; we ignore that field and any future non-resource fields.
  const projection = {};
  for (const cat of ['words', 'letters', 'rimes', 'phonemes', 'instructions']) {
    const obj = m[cat] || {};
    projection[cat] = Object.keys(obj).sort().map((k) => [k, obj[k]]);
  }
  return sha(JSON.stringify(projection));
}

function hashCode() {
  const parts = CODE_FILES.map((p) => {
    const abs = join(REPO_ROOT, p);
    if (!existsSync(abs)) throw new Error('missing code file: ' + p);
    return p + '\0' + readFileSync(abs, 'utf8');
  });
  return sha(parts.join('\0'));
}

function loadFingerprints() {
  if (!existsSync(FP_PATH)) return { global: {}, workbooks: {} };
  try {
    const fp = JSON.parse(readFileSync(FP_PATH, 'utf8'));
    return { global: fp.global || {}, workbooks: fp.workbooks || {} };
  } catch (_) {
    return { global: {}, workbooks: {} };
  }
}

async function cmdCheck(wbs) {
  if (wbs.length === 0) {
    console.error('check: need at least one workbook');
    process.exit(2);
  }
  const fp = loadFingerprints();
  const manifestSha = await hashManifest();
  const codeSha     = hashCode();
  const manifestChanged = fp.global.manifest_sha !== manifestSha;
  const codeChanged     = fp.global.code_sha     !== codeSha;

  const result = wbs.map((wb) => {
    const jsonSha = hashWorkbookJSON(wb);
    if (!jsonSha) {
      return { wb, stale: true, reason: 'workbook not found in PAGES_DIR' };
    }
    const prev = fp.workbooks[wb];
    if (!prev) return { wb, stale: true, reason: 'never audited', json_sha: jsonSha };
    if (prev.result !== 'pass') return { wb, stale: true, reason: 'last result: ' + prev.result, json_sha: jsonSha };
    if (prev.page_json_sha !== jsonSha) return { wb, stale: true, reason: 'page JSON changed', json_sha: jsonSha };
    if (codeChanged)     return { wb, stale: true, reason: 'audit code changed', json_sha: jsonSha };
    if (manifestChanged) return { wb, stale: true, reason: 'asset manifest changed', json_sha: jsonSha };
    return { wb, stale: false, reason: 'fresh', json_sha: jsonSha, audited_at: prev.audited_at };
  });

  console.log(JSON.stringify({
    global: {
      manifest_sha: manifestSha,
      code_sha: codeSha,
      manifest_changed: manifestChanged,
      code_changed: codeChanged,
      prev_manifest_sha: fp.global.manifest_sha || null,
      prev_code_sha: fp.global.code_sha || null
    },
    workbooks: result,
    summary: {
      total: result.length,
      stale: result.filter((r) => r.stale).length,
      fresh: result.filter((r) => !r.stale).length
    }
  }, null, 2));
}

async function cmdUpdate(wbs, resultStr) {
  if (wbs.length === 0) {
    console.error('update: need at least one workbook');
    process.exit(2);
  }
  const fp = loadFingerprints();
  const manifestSha = await hashManifest();
  const codeSha     = hashCode();
  fp.global = {
    manifest_sha: manifestSha,
    code_sha: codeSha,
    updated_at: new Date().toISOString()
  };
  const now = new Date().toISOString();
  let written = 0;
  for (const wb of wbs) {
    const jsonSha = hashWorkbookJSON(wb);
    if (!jsonSha) {
      console.warn('[fingerprint] skip ' + wb + ' — not found in PAGES_DIR');
      continue;
    }
    fp.workbooks[wb] = {
      page_json_sha: jsonSha,
      audited_at: now,
      result: resultStr || 'pass'
    };
    written++;
  }
  writeFileSync(FP_PATH, JSON.stringify(fp, null, 2));
  console.log('[fingerprint] updated ' + written + ' workbook(s) → ' + FP_PATH);
}

// ---------- CLI ----------
const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'check') {
  cmdCheck(rest).catch((e) => { console.error('[fingerprint] FATAL', e.message); process.exit(1); });
} else if (cmd === 'update') {
  let result = 'pass';
  const wbs = rest.filter((a) => {
    if (a.startsWith('--result=')) { result = a.slice('--result='.length); return false; }
    return true;
  });
  cmdUpdate(wbs, result).catch((e) => { console.error('[fingerprint] FATAL', e.message); process.exit(1); });
} else {
  console.error([
    'Usage:',
    '  node scripts/audit-fingerprint.mjs check  <WB> [<WB>...]',
    '  node scripts/audit-fingerprint.mjs update <WB> [<WB>...] [--result=pass|fail]',
    '',
    'env:',
    '  SERVER     (default http://localhost:3000)',
    '  PAGES_DIR  (default /Users/stacywang/.../03-Preview-Tool/data/workbooks)'
  ].join('\n'));
  process.exit(2);
}
