/* JOJO ELA Preview — Local JSON server (Phase 3)
 *
 * Express server that:
 *   - serves the existing static UI (index.html / app.js / data/* / renderers/* / styles.css)
 *   - mounts 10-Final-Assets at /assets
 *   - mounts PAGES_DIR at /data/workbooks (so "Open JSON" link in UI works)
 *   - exposes /api/units, /api/unit/:code by scanning the local PAGES_DIR
 *   - exposes /api/asset-manifest (boot-time scan of 10-Final-Assets)
 *
 * Bitable / lark-cli is no longer used. The historical names (bitable-mode.js,
 * window.JOJO_BITABLE) are kept for now to minimise churn — a future PR can
 * rename them.
 */

'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

// ---------- Config ----------
const PORT       = parseInt(process.env.PORT || '3000', 10);
const ASSETS_DIR = process.env.ASSETS_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/10-Final-Assets';
const PAGES_DIR  = process.env.PAGES_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks';
const NAMING_CSV = process.env.NAMING_CSV
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/Framework/assets/naming.csv';
const COURSE_DIR = process.env.COURSE_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/03b-Course-Page-JSON';

// ---------- Boot: scan asset manifest ----------
// New layout (May 2026): 10-Final-Assets/
//   images/word/<word>.webp        — word images
//   images/scene/<name>.webp       — scene images (future)
//   audio/word/<word>.mp3          — word TTS
//   audio/letter/<UPPER>.mp3       — single letter sound
//   audio/rime/<rime>.mp3          — rime sound (-at, -an, …)
//   audio/instruction/<id>.mp3     — instruction TTS (future)
//   audio/phoneme/<x>.mp3          — phoneme sound (future)
//   audio/sfx/<name>.mp3           — sound effects
function scanDir(dir, extRegex) {
  try {
    return fs.readdirSync(dir).map((f) => {
      const m = f.match(extRegex);
      return m ? m[1] : null;
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function scanAssetManifest() {
  const IMG_RE   = /^([^.]+)\.(webp|png|jpg|jpeg)$/i;
  const AUDIO_RE = /^([^.]+)\.(mp3|wav|m4a)$/i;

  const wordImageNames        = scanDir(path.join(ASSETS_DIR, 'images', 'word'),         IMG_RE);
  const panelImageNames       = scanDir(path.join(ASSETS_DIR, 'images', 'panel'),        IMG_RE);
  const sceneImageNames       = scanDir(path.join(ASSETS_DIR, 'images', 'scene'),        IMG_RE);
  const wordAudioNames        = scanDir(path.join(ASSETS_DIR, 'audio',  'word'),         AUDIO_RE);
  const letterAudioNames      = scanDir(path.join(ASSETS_DIR, 'audio',  'letter'),       AUDIO_RE);
  const rimeAudioNames        = scanDir(path.join(ASSETS_DIR, 'audio',  'rime'),         AUDIO_RE);
  const phonemeAudioNames     = scanDir(path.join(ASSETS_DIR, 'audio',  'phoneme'),      AUDIO_RE);
  const instructionAudioNames = scanDir(path.join(ASSETS_DIR, 'audio',  'instruction'),  AUDIO_RE);
  const sentenceAudioNames   = scanDir(path.join(ASSETS_DIR, 'audio',  'sentence'),     AUDIO_RE);

  const words = {};
  function ensure(w) { if (!words[w]) words[w] = { image: false, audio: false }; return words[w]; }
  wordImageNames.forEach((w) => { ensure(w).image = true; });
  wordAudioNames.forEach((w) => { ensure(w).audio = true; });

  const letters = {};
  letterAudioNames.forEach((l) => { letters[l] = { audio: true }; });

  const rimes = {};
  rimeAudioNames.forEach((r) => { rimes[r] = { audio: true }; });

  // Phoneme audio is keyed by semantic ID (onset_k, short_a, digraph_sh, long_a, ...)
  const phonemes = {};
  phonemeAudioNames.forEach((p) => { phonemes[p] = { audio: true }; });

  // Instruction audio is keyed by slugified source text (matches page JSON's instructionKey)
  const instructions = {};
  instructionAudioNames.forEach((k) => { instructions[k] = { audio: true }; });

  // Sentence / clue audio (T-SPELL definition clues, T-DICTATION sentences, etc.)
  const sentences = {};
  sentenceAudioNames.forEach((s) => { sentences[s] = { audio: true }; });

  const panels = {};
  panelImageNames.forEach((p) => { panels[p] = { image: true }; });

  const scenes = {};
  sceneImageNames.forEach((s) => { scenes[s] = { image: true }; });

  return {
    generated_at: new Date().toISOString(),
    total: Object.keys(words).length,
    words,
    panels,
    scenes,
    letters,
    rimes,
    phonemes,
    instructions,
    sentences
  };
}

// ---------- Boot: read workbook naming.csv ----------
function readNamingCsv() {
  try {
    const raw = fs.readFileSync(NAMING_CSV, 'utf8');
    const lines = raw.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return {};
    // Header: Workbook ID,Title,Title Len,Subtitle,Subtitle Len,Description,...
    const titles = {};
    for (let i = 1; i < lines.length; i++) {
      // Naive CSV parse: split on commas not inside quotes
      const cells = parseCsvLine(lines[i]);
      const id = cells[0] && cells[0].trim();
      const title = cells[1] && cells[1].trim();
      const subtitle = cells[3] && cells[3].trim();
      if (id) titles[id] = { title: title || '', subtitle: subtitle || '' };
    }
    return titles;
  } catch (e) {
    console.warn('[server] naming.csv not readable:', NAMING_CSV, e.message);
    return {};
  }
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i+1] === '"' && inQuote) { cur += '"'; i++; continue; }
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === ',' && !inQuote) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

const workbookTitles = readNamingCsv();
console.log(`[server] naming.csv: ${Object.keys(workbookTitles).length} workbook titles loaded`);

// Per-request manifest with 5s TTL — lets users add files without restarting server.
const manifestCache = { ts: 0, data: null };
function getAssetManifest() {
  if (manifestCache.data && Date.now() - manifestCache.ts < 5000) return manifestCache.data;
  manifestCache.data = scanAssetManifest();
  manifestCache.ts = Date.now();
  return manifestCache.data;
}

// Boot log (also primes the cache).
{
  const m = getAssetManifest();
  const imageCount = Object.values(m.words).filter((w) => w.image).length;
  const audioCount = Object.values(m.words).filter((w) => w.audio).length;
  const letterCount = Object.keys(m.letters || {}).length;
  const rimeCount = Object.keys(m.rimes || {}).length;
  const phonemeCount = Object.keys(m.phonemes || {}).length;
  const instructionCount = Object.keys(m.instructions || {}).length;
  const sentenceCount = Object.keys(m.sentences || {}).length;
  const panelCount = Object.keys(m.panels || {}).length;
  const sceneCount = Object.keys(m.scenes || {}).length;
  console.log(`[server] asset manifest: ${m.total} words (${imageCount} img, ${audioCount} audio) · ${panelCount} panel · ${sceneCount} scene · ${letterCount} letter · ${rimeCount} rime · ${phonemeCount} phoneme · ${instructionCount} instruction · ${sentenceCount} sentence`);
}

// ---------- Filesystem-backed unit catalog ----------
function scanWorkbooks() {
  let workbookDirs = [];
  try {
    workbookDirs = fs.readdirSync(PAGES_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch (e) {
    throw new Error('PAGES_DIR not readable (' + PAGES_DIR + '): ' + e.message);
  }

  const units = [];
  for (const wb of workbookDirs) {
    const dir = path.join(PAGES_DIR, wb);
    const byUnit = {};
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^U(\d+)_P(\d+)\.json$/);
      if (!m) continue;
      const key = wb + '_U' + m[1];
      (byUnit[key] = byUnit[key] || []).push({
        pageNum: parseInt(m[2], 10),
        file: f
      });
    }
    for (const code of Object.keys(byUnit)) {
      const pages = byUnit[code].sort((a, b) => a.pageNum - b.pageNum);
      units.push({
        unit_code: code,
        workbook: wb,
        page_count: pages.length,
        files: pages.map((p) => p.file)
      });
    }
  }
  units.sort((a, b) => a.unit_code.localeCompare(b.unit_code));
  return units;
}

function scanCoursePages() {
  try {
    if (!fs.existsSync(COURSE_DIR)) return [];
  } catch (e) {
    return [];
  }
  const units = [];
  const bookDirs = fs.readdirSync(COURSE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name);
  for (const book of bookDirs) {
    const bookPath = path.join(COURSE_DIR, book);
    const bankDirs = fs.readdirSync(bookPath, { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name);
    for (const bank of bankDirs) {
      const bankPath = path.join(bookPath, bank);
      const stationDirs = fs.readdirSync(bankPath, { withFileTypes: true })
        .filter((d) => d.isDirectory()).map((d) => d.name);
      for (const stationId of stationDirs) {
        const stationPath = path.join(bankPath, stationId);
        const pageFiles = fs.readdirSync(stationPath)
          .filter((f) => /^P\d+\.json$/.test(f))
          .sort();
        if (pageFiles.length === 0) continue;
        units.push({
          unit_code: stationId,
          workbook: book,
          page_count: pageFiles.length,
          files: pageFiles,
          source: 'curriculum',
          bank: bank
        });
      }
    }
  }
  units.sort((a, b) => a.unit_code.localeCompare(b.unit_code));
  return units;
}

function loadUnit(code) {
  // Try library first
  const libMeta = scanWorkbooks().find((u) => u.unit_code === code);
  if (libMeta) {
    const pages = [];
    for (const f of libMeta.files) {
      const fpath = path.join(PAGES_DIR, libMeta.workbook, f);
      try {
        pages.push(JSON.parse(fs.readFileSync(fpath, 'utf8')));
      } catch (e) {
        pages.push({ _parseError: e.message, _sourceFile: f, pageNumber: pages.length + 1 });
      }
    }
    return {
      unit_code: libMeta.unit_code,
      workbook: libMeta.workbook,
      page_count: libMeta.page_count,
      pages,
      source_files: libMeta.files.map((f) => '/data/workbooks/' + libMeta.workbook + '/' + f),
      fetched_at: new Date().toISOString()
    };
  }

  // Try curriculum
  const curMeta = scanCoursePages().find((u) => u.unit_code === code);
  if (!curMeta) return null;
  const pages = [];
  for (const f of curMeta.files) {
    const fpath = path.join(COURSE_DIR, curMeta.workbook, curMeta.bank, curMeta.unit_code, f);
    try {
      pages.push(JSON.parse(fs.readFileSync(fpath, 'utf8')));
    } catch (e) {
      pages.push({ _parseError: e.message, _sourceFile: f, pageNumber: pages.length + 1 });
    }
  }
  return {
    unit_code: curMeta.unit_code,
    workbook: curMeta.workbook,
    page_count: curMeta.page_count,
    pages,
    source_files: curMeta.files.map((f) => '/data/course/' + curMeta.workbook + '/' + curMeta.bank + '/' + curMeta.unit_code + '/' + f),
    fetched_at: new Date().toISOString()
  };
}

// Try boot-time scan to fail fast if PAGES_DIR is missing
try {
  const initial = scanWorkbooks();
  const wbs = [...new Set(initial.map((u) => u.workbook))];
  console.log(`[server] pages_dir: ${initial.length} units across ${wbs.length} workbooks (${wbs.join(', ')})`);
} catch (e) {
  console.error('[server] FATAL:', e.message);
  process.exit(1);
}

// Boot-time scan: curriculum course pages
try {
  const courseUnits = scanCoursePages();
  if (courseUnits.length > 0) {
    const courseBooks = [...new Set(courseUnits.map((u) => u.workbook))];
    console.log(`[server] course_dir: ${courseUnits.length} stations across ${courseBooks.length} books (${courseBooks.join(', ')})`);
  } else {
    console.log('[server] course_dir: no stations found');
  }
} catch (e) {
  console.warn('[server] course_dir scan failed:', e.message);
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

// Static: workbook JSON files (so "Open JSON" link in UI works)
app.use('/data/workbooks', express.static(PAGES_DIR));

// Static: curriculum course JSON files
app.use('/data/course', express.static(COURSE_DIR));

// ---------- API ----------
app.get('/api/asset-manifest', (_req, res) => {
  res.json(getAssetManifest());
});

app.get('/api/units', (req, res) => {
  try {
    const libUnits = scanWorkbooks().map((u) => ({ ...u, source: 'library' }));
    const curUnits = scanCoursePages();
    const all = [...libUnits, ...curUnits];
    const workbookFilter = req.query.workbook;
    const filtered = workbookFilter ? all.filter((r) => r.workbook === workbookFilter) : all;
    const workbooks = [...new Set(libUnits.map((u) => u.workbook))].sort();
    const courses = [...new Set(curUnits.map((u) => u.workbook))].sort();
    res.json({
      workbooks,
      courses,
      workbook_titles: workbookTitles,
      units: filtered.map((r) => ({
        unit_code: r.unit_code,
        workbook: r.workbook,
        page_count: r.page_count,
        source: r.source || 'library'
      }))
    });
  } catch (e) {
    sendFsError(res, e);
  }
});

app.get('/api/unit/:code', (req, res) => {
  try {
    const unit = loadUnit(req.params.code);
    if (!unit) return res.status(404).json({ error: 'unit not found: ' + req.params.code });
    res.json(unit);
  } catch (e) {
    sendFsError(res, e);
  }
});

app.get('/test/bitable-mode', (_req, res) => {
  res.redirect('/data/bitable-mode.test.html');
});

function sendFsError(res, err) {
  console.error('[server] fs error:', err);
  res.status(502).json({ error: err.message || String(err) });
}

// ---------- Listen ----------
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[server] pages_dir=${PAGES_DIR}`);
  console.log(`[server] course_dir=${COURSE_DIR}`);
  console.log(`[server] assets_dir=${ASSETS_DIR}`);
});
