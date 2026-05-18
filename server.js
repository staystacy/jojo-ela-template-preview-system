/* JOJO ELA Preview — Bitable Mode Server
 *
 * Express proxy that:
 *   - serves the existing static UI (index.html / app.js / data/* / renderers/* / styles.css)
 *   - mounts 10-Final-Assets at /assets
 *   - exposes /api/units, /api/unit/:code (Bitable via lark-cli, in-memory cached)
 *   - exposes /api/asset-manifest (boot-time scan of 10-Final-Assets)
 */

'use strict';

const express = require('express');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

// ---------- Config ----------
const PORT               = parseInt(process.env.PORT || '3000', 10);
const ASSETS_DIR         = process.env.ASSETS_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/10-Final-Assets';
const BITABLE_BASE_TOKEN = process.env.BITABLE_BASE_TOKEN || 'YSoZbDOKCadq3Ys4c9Gl0FkYgqe';
const BITABLE_TABLE_ID   = process.env.BITABLE_TABLE_ID   || 'tblRw0GDwu5DXVJG';
const BITABLE_HOST       = process.env.BITABLE_HOST       || 'feishu.cn';
const LARK_CLI_BIN       = process.env.LARK_CLI_BIN       || 'lark-cli';
const CACHE_TTL_MS       = parseInt(process.env.CACHE_TTL_MS || '300000', 10);

// ---------- Boot: scan asset manifest ----------
function scanAssetManifest() {
  const imagesDir = path.join(ASSETS_DIR, 'images');
  const audioDir  = path.join(ASSETS_DIR, 'audio');
  const words = {};

  function addWord(word, kind) {
    if (!words[word]) words[word] = { image: false, audio: false };
    words[word][kind] = true;
  }

  try {
    fs.readdirSync(imagesDir).forEach((f) => {
      const m = f.match(/^([^.]+)\.(webp|png|jpg|jpeg)$/i);
      if (m) addWord(m[1], 'image');
    });
  } catch (e) {
    console.warn('[server] images dir not readable:', imagesDir, e.message);
  }

  try {
    fs.readdirSync(audioDir).forEach((f) => {
      const m = f.match(/^([^.]+)\.(mp3|wav|m4a)$/i);
      if (m) addWord(m[1], 'audio');
    });
  } catch (e) {
    console.warn('[server] audio dir not readable:', audioDir, e.message);
  }

  return {
    generated_at: new Date().toISOString(),
    total: Object.keys(words).length,
    words
  };
}

const assetManifest = scanAssetManifest();
const imageCount = Object.values(assetManifest.words).filter((w) => w.image).length;
const audioCount = Object.values(assetManifest.words).filter((w) => w.audio).length;
console.log(`[server] asset manifest: ${assetManifest.total} words (${imageCount} with image, ${audioCount} with audio)`);

// ---------- In-memory cache ----------
let unitsCache = { rows: null, ts: 0 };

function execFileP(bin, args, opts) {
  return new Promise((resolve, reject) => {
    execFile(bin, args, opts, (err, stdout, stderr) => {
      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;
        return reject(err);
      }
      resolve({ stdout, stderr });
    });
  });
}

async function fetchAllUnits() {
  if (unitsCache.rows && Date.now() - unitsCache.ts < CACHE_TTL_MS) {
    return unitsCache.rows;
  }

  const { stdout } = await execFileP(LARK_CLI_BIN, [
    'base', '+record-list',
    '--base-token', BITABLE_BASE_TOKEN,
    '--table-id',   BITABLE_TABLE_ID,
    '--limit',      '200'
  ], {
    timeout: 25000,
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, LARK_CLI_NO_PROXY: '1' }
  });

  const json = JSON.parse(stdout);
  if (!json.ok || !json.data) {
    throw new Error('lark-cli returned ok=false: ' + JSON.stringify(json).slice(0, 200));
  }

  const fields = json.data.fields || [];
  const idx = (name) => fields.indexOf(name);
  const i_unit_code  = idx('unit_code');
  const i_workbook   = idx('workbook_ref');
  const i_status     = idx('status');
  const i_page_count = idx('unit_page_count');
  const i_gen        = idx('generator_output');
  const i_content    = idx('content_pool');
  const i_title      = idx('unit_title');

  const records  = json.data.data || [];
  const recordIds = json.data.record_id_list || [];

  // Bitable single-select fields come back as arrays of strings; flatten to scalar
  const flat = (v) => Array.isArray(v) ? (v.length ? String(v[0]) : null) : v;

  const rows = records.map((row, i) => ({
    unit_code:     flat(row[i_unit_code])  || null,
    status:        flat(row[i_status])     || null,
    workbook:      (flat(row[i_unit_code]) || '').split('_U')[0] || null,
    page_count:    flat(row[i_page_count]) || 0,
    unit_title:    flat(row[i_title])      || null,
    record_id:     recordIds[i]            || null,
    generator_raw: row[i_gen]              || null,
    content_raw:   row[i_content]          || null
  })).filter((r) => r.unit_code);

  unitsCache = { rows, ts: Date.now() };
  return rows;
}

function buildRecordUrl(recordId) {
  if (!recordId) return null;
  return `https://${BITABLE_HOST}/base/${BITABLE_BASE_TOKEN}?table=${BITABLE_TABLE_ID}&record=${recordId}`;
}

// ---------- App ----------
const app = express();

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Static: existing UI files (index.html, app.js, styles.css, data/*, renderers/*)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Static: final assets
app.use('/assets', express.static(ASSETS_DIR));

// ---------- API ----------
app.get('/api/asset-manifest', (_req, res) => {
  res.json(assetManifest);
});

app.get('/api/units', async (req, res) => {
  try {
    const rows = await fetchAllUnits();
    const workbookFilter = req.query.workbook;
    const filtered = workbookFilter ? rows.filter((r) => r.workbook === workbookFilter) : rows;
    res.json({
      cached: Date.now() - unitsCache.ts < CACHE_TTL_MS,
      units: filtered
        .map((r) => ({
          unit_code:  r.unit_code,
          workbook:   r.workbook,
          status:     r.status,
          page_count: r.page_count,
          unit_title: r.unit_title,
          record_id:  r.record_id
        }))
        .sort((a, b) => (a.unit_code > b.unit_code ? 1 : -1))
    });
  } catch (err) {
    sendLarkError(res, err);
  }
});

app.get('/api/unit/:code', async (req, res) => {
  try {
    const rows = await fetchAllUnits();
    const row = rows.find((r) => r.unit_code === req.params.code);
    if (!row) return res.status(404).json({ error: 'unit not found: ' + req.params.code });

    let generator;
    let content;
    try {
      generator = JSON.parse(row.generator_raw || 'null');
    } catch (e) {
      return res.status(502).json({
        error: 'generator_output JSON parse failed: ' + e.message,
        raw_preview: (row.generator_raw || '').slice(0, 300)
      });
    }
    try {
      content = JSON.parse(row.content_raw || 'null');
    } catch (e) {
      return res.status(502).json({
        error: 'content_pool JSON parse failed: ' + e.message,
        raw_preview: (row.content_raw || '').slice(0, 300)
      });
    }

    const pages = (generator && generator.pages) || [];

    res.json({
      unit_code:   row.unit_code,
      workbook:    row.workbook,
      status:      row.status,
      page_count:  row.page_count,
      unit_title:  row.unit_title,
      record_id:   row.record_id,
      record_url:  buildRecordUrl(row.record_id),
      pages,
      content_pool: content,
      fetched_at:  new Date(unitsCache.ts).toISOString()
    });
  } catch (err) {
    sendLarkError(res, err);
  }
});

app.get('/test/bitable-mode', (_req, res) => {
  res.redirect('/data/bitable-mode.test.html');
});

function sendLarkError(res, err) {
  const code = err.killed ? 504 : 502;
  const body = { error: 'lark-cli failed: ' + (err.message || '').slice(0, 200) };
  if (err.stderr) body.stderr_tail = String(err.stderr).slice(-500);
  if (err.stdout) body.stdout_preview = String(err.stdout).slice(0, 300);
  console.error('[server] lark-cli error:', body);
  res.status(code).json(body);
}

// ---------- Listen ----------
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] base_token=${BITABLE_BASE_TOKEN} table=${BITABLE_TABLE_ID}`);
  console.log(`[server] assets_dir=${ASSETS_DIR}`);
  console.log(`[server] cache_ttl_ms=${CACHE_TTL_MS}`);
});
