#!/usr/bin/env node
/* JOJO ELA — Workbook audit script
 *
 * Mirrors the audio/image resolution that data/bitable-mode.js performs in the
 * browser, then cross-references against /api/asset-manifest to surface:
 *   A. pages whose topicType has no translator (or translator throws) → blank renders
 *   B. buttons/images whose target file is missing from 10-Final-Assets
 *   C. semantic mismatches — what the button label *shows* vs. what gets played
 *
 * USAGE
 *   node scripts/audit-workbook.mjs                    # audits all 5 workbooks
 *   node scripts/audit-workbook.mjs PK-1a              # one
 *   node scripts/audit-workbook.mjs PK-1a PK-1b ...    # subset
 *
 * Reports are written to audit-reports/<WB>.md plus a summary.md.
 */

import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

// ---------- Config ----------
const SERVER  = process.env.SERVER  || 'http://localhost:3000';
const PAGES_DIR = process.env.PAGES_DIR
  || '/Users/stacywang/Desktop/JOJO-Worksheet-Research/03-Preview-Tool/data/workbooks';
const OUT_DIR  = join(process.cwd(), 'audit-reports');
const DEFAULT_WORKBOOKS = ['PK-1a', 'PK-1b', 'PK-2a', 'PK-2b', 'K-1b'];

// ---------- Manifest fetch ----------
async function loadManifest() {
  const res = await fetch(`${SERVER}/api/asset-manifest`);
  if (!res.ok) throw new Error('manifest HTTP ' + res.status);
  return res.json();
}

// Mirror of resolveAudioUrl() in data/bitable-mode.js.
// hint (optional): when the translator emits a category-prefixed filename
// ("letter:a.mp3", "rime:at.mp3"), the resolver tries that category first.
// Pass the expectCategory as hint so audit reflects runtime behaviour.
function resolveAudioCategory(name, M, hint) {
  if (!name) return null;
  const tryCat = {
    phoneme:     () => (M.phonemes && M.phonemes[name]) ? 'phoneme' : null,
    word:        () => (M.words && M.words[name] && M.words[name].audio) ? 'word' : null,
    rime:        () => (M.rimes && M.rimes[name]) ? 'rime' : null,
    instruction: () => (M.instructions && M.instructions[name]) ? 'instruction' : null,
    letter:      () => {
      const up = String(name).toUpperCase();
      return (M.letters && M.letters[up]) ? 'letter' : null;
    }
  };
  if (hint && tryCat[hint]) {
    const c = tryCat[hint]();
    if (c) return c;
  }
  for (const cat of ['phoneme', 'word', 'rime', 'instruction', 'letter']) {
    if (cat === hint) continue;
    const c = tryCat[cat]();
    if (c) return c;
  }
  return null;
}

function resolveImage(word, M) {
  return !!(M.words && M.words[word] && M.words[word].image);
}

// ---------- Per-topicType expectation extractor ----------
// For each topic, return:
//   { templateId, expectations: [{ slot, label, audioName, expectCategory }],
//     images:     [{ slot, word }],
//     issues:     [{ kind: 'translator_error', msg }] }
//
// expectCategory tells what semantics the LABEL implies — that lets us flag
// e.g. label "/k/" but audio resolved to letter "C" (which would play "see").
//
// `null` expectCategory means "any category is fine" (e.g. instruction button —
// only category that exists is `instruction`).
const EXTRACTORS = {
  english_trace_letter(t) {
    if (!t.letter) return { issues: [{ kind: 'translator_error', msg: 'missing letter' }] };
    const letter = t.letter;
    // T-TRACE demo plays `<letter.toLowerCase()>.mp3` → resolver tries
    // phoneme/word/rime/instruction/letter in order. For "a" → no phoneme/word/rime/instr
    // named "a", falls to letter A → letter-name audio.
    return {
      templateId: 'T-TRACE',
      expectations: [
        { slot: 'demo.audio', label: letter, audioName: letter.toLowerCase(), expectCategory: 'letter' }
      ],
      images: t.word ? [{ slot: 'demo.image', word: t.word }] : []
    };
  },

  english_shadow_writing(t) {
    if (!t.letter) return { issues: [{ kind: 'translator_error', msg: 'missing letter' }] };
    return {
      templateId: 'T-TRACE',
      expectations: [
        { slot: 'demo.audio', label: t.letter, audioName: t.letter.toLowerCase(), expectCategory: 'letter' }
      ],
      images: []
    };
  },

  english_trace_word(t) {
    // Spec: wordsList.length === 2, 2 row × 2 cells.
    if (!Array.isArray(t.wordsList) || !t.wordsList[0]) {
      return { issues: [{ kind: 'translator_error', msg: 'missing wordsList' }] };
    }
    const rowWords = t.wordsList.slice(0, 2);
    const exp = [];
    const imgs = [];
    rowWords.forEach((w, i) => {
      if (w.audioName) exp.push({ slot: `row[${i}].audio`, label: w.word || w.audioName, audioName: w.audioName, expectCategory: 'word' });
      if (w.imageName) imgs.push({ slot: `row[${i}].image`, word: w.imageName });
    });
    const issues = [];
    if (t.wordsList.length !== 2) {
      issues.push({ kind: 'json_schema_mismatch',
        msg: `wordsList.length=${t.wordsList.length} (spec: 2)` });
    }
    return { templateId: 'T-TRACE', expectations: exp, images: imgs, issues };
  },

  english_sound_box_full(t) {
    if (!t.word) return { issues: [{ kind: 'translator_error', msg: 'missing word' }] };
    return {
      templateId: 'T-SOUNDBOX',
      expectations: [
        { slot: 'item.audio', label: t.word, audioName: t.word, expectCategory: 'word' }
      ],
      images: [{ slot: 'item.image', word: t.word }]
    };
  },

  english_sound_box_partial_fill(t) {
    if (!t.word) return { issues: [{ kind: 'translator_error', msg: 'missing word' }] };
    return {
      templateId: 'T-SOUNDBOX',
      expectations: [
        { slot: 'item.audio', label: t.word, audioName: t.word, expectCategory: 'word' }
      ],
      images: [{ slot: 'item.image', word: t.word }]
    };
  },

  english_picture_spelling(t) {
    if (!t.word) return { issues: [{ kind: 'translator_error', msg: 'missing word' }] };
    return {
      templateId: 'T-SPELL',
      expectations: [
        { slot: 'item.audio', label: t.word, audioName: t.word, expectCategory: 'word' }
      ],
      images: [{ slot: 'item.image', word: t.word }]
    };
  },

  english_circle_picture(t) {
    // bitable-mode.js handles both shapes: correctWords (array, multi) and
    // correctAnswer (string, single). Either yields a valid `correct` array.
    const opts = t.options || [];
    const exp = [];
    const imgs = [];
    opts.forEach((w, i) => {
      exp.push({ slot: `option[${i}].audio`, label: w, audioName: w, expectCategory: 'word' });
      imgs.push({ slot: `option[${i}].image`, word: w });
    });
    return { templateId: 'T-CIRCLE', expectations: exp, images: imgs };
  },

  english_matching(t) {
    if (!t.topItems || !t.bottomItems || !t.correctPairs) {
      return { issues: [{ kind: 'translator_error', msg: 'missing topItems/bottomItems/correctPairs' }] };
    }
    const topMap = Object.fromEntries(t.topItems.map((x) => [x.id, x.value]));
    const botMap = Object.fromEntries(t.bottomItems.map((x) => [x.id, x.value]));
    const matchType = t.matchType || 'picture_to_word';
    const leftIsImage = matchType === 'picture_to_word';
    const exp = [];
    const imgs = [];
    const issues = [];
    t.correctPairs.forEach((pairStr, i) => {
      const [topId, botId] = String(pairStr).split('-');
      const leftValue = topMap[topId];
      const rightValue = botMap[botId];
      if (leftValue == null || rightValue == null) {
        issues.push({ kind: 'translator_error', msg: `pair[${i}] references missing id ${pairStr}` });
        return;
      }
      if (leftIsImage) {
        imgs.push({ slot: `pair[${i}].left.image`, word: leftValue });
        exp.push({ slot: `pair[${i}].left.audio`, label: leftValue, audioName: leftValue, expectCategory: 'word' });
      } else {
        // letter case / synonyms / antonyms / sound_to_word — left renders as word/letter card with audio
        exp.push({ slot: `pair[${i}].left.audio`, label: leftValue, audioName: leftValue, expectCategory: leftValue.length === 1 ? 'letter' : 'word' });
      }
    });
    return { templateId: 'T-MATCH', expectations: exp, images: imgs, issues };
  },

  english_onset_rime_blend(t) {
    if (!Array.isArray(t.rows)) return { issues: [{ kind: 'translator_error', msg: 'missing rows' }] };
    const exp = [];
    const imgs = [];
    t.rows.forEach((r, i) => {
      const onsetAudio = r.onset_phoneme_id || r.onset;
      const rimeAudio  = r.rime_id || r.rime;
      exp.push({ slot: `row[${i}].onset`, label: '/' + r.onset + '/', audioName: onsetAudio, expectCategory: 'phoneme' });
      exp.push({ slot: `row[${i}].rime`,  label: '/' + r.rime  + '/', audioName: rimeAudio,  expectCategory: 'rime' });
      if (r.imageName || r.word) imgs.push({ slot: `row[${i}].image`, word: r.imageName || r.word });
    });
    return { templateId: 'T-BLEND', expectations: exp, images: imgs };
  },

  english_phoneme_blend_picture(t) {
    if (!Array.isArray(t.rows)) return { issues: [{ kind: 'translator_error', msg: 'missing rows' }] };
    const exp = [];
    const imgs = [];
    t.rows.forEach((r, i) => {
      const phonemes = r.phonemes || [];
      const ids = (Array.isArray(r.phoneme_ids) && r.phoneme_ids.length === phonemes.length)
        ? r.phoneme_ids
        : phonemes;
      phonemes.forEach((p, j) => {
        exp.push({ slot: `row[${i}].phoneme[${j}]`, label: '/' + p + '/', audioName: ids[j], expectCategory: 'phoneme' });
      });
      if (r.imageName || r.word) imgs.push({ slot: `row[${i}].image`, word: r.imageName || r.word });
    });
    return { templateId: 'T-BLEND', expectations: exp, images: imgs };
  },

  english_word_bank_cloze(t) {
    // T-FILLIN v3 — wordBank pills + sentence rows. The translator does not
    // emit audio buttons in the items list (cloze rows have no audio prompts).
    // wordBank pills may carry audio in the renderer; verify by spot-check.
    return { templateId: 'T-FILLIN', expectations: [], images: [] };
  },

  english_find_word(t) {
    return { templateId: 'T-FINDWORD', expectations: [], images: [] };
  },

  english_circle_word(t) {
    // T-CIRCLE renderer only emits audio when opt.audio is set, and
    // translateCircleWord() does NOT set opt.audio — cards are silent.
    return { templateId: 'T-CIRCLE', expectations: [], images: [] };
  },

  english_sort_words(t) {
    // renderer-sort.js does not emit audio buttons.
    return { templateId: 'T-SORT', expectations: [], images: [] };
  },

  english_sequence(t) {
    // renderer-sequence.js does not emit audio buttons.
    return { templateId: 'T-SEQUENCE', expectations: [], images: [] };
  },

  english_word_transform_picture(t) {
    // Legacy topicType — production now uses english_transform with displayType.
    if (!Array.isArray(t.transformations)) return { issues: [{ kind: 'translator_error', msg: 'missing transformations' }] };
    const imgs = [];
    t.transformations.forEach((tf, i) => {
      const imgName = tf.imageName || tf.targetWord;
      if (imgName) imgs.push({ slot: `item[${i}].image`, word: imgName });
    });
    return { templateId: 'T-TRANSFORM', expectations: [], images: imgs };
  },

  english_word_transform_text(t) {
    return { templateId: 'T-TRANSFORM', expectations: [], images: [] };
  },

  english_transform(t) {
    // v2605.25 unified topicType: items[] with sourceWord/answer + displayType='image'|'text'
    if (!Array.isArray(t.items)) return { issues: [{ kind: 'translator_error', msg: 'missing items' }] };
    const isPicture = (t.displayType || 'image') === 'image';
    const imgs = [];
    if (isPicture) {
      t.items.forEach((it, i) => {
        if (it.sourceWord) imgs.push({ slot: `item[${i}].image`, word: it.sourceWord });
      });
    }
    return { templateId: 'T-TRANSFORM', expectations: [], images: imgs };
  },

  english_initial_sound_spelling(t) {
    // T-SPELL v1 (per spec) — uses T-WRITE renderer with prefill.
    // Visible audio button = prompt word; visible image = word picture.
    if (!t.word) return { issues: [{ kind: 'translator_error', msg: 'missing word' }] };
    return {
      templateId: 'T-WRITE',
      expectations: [
        { slot: 'item.audio', label: t.word, audioName: t.word, expectCategory: 'word' }
      ],
      images: [{ slot: 'item.image', word: t.word }]
    };
  },

  english_ladder(t) {
    // v2605.25 production translator: flat structure (one topic = one ladder).
    // T-LADDER renderer emits NO audio buttons for rungs (only the page
    // instruction button). Each rung gets an image placeholder only when
    // rung.word is truthy.
    //
    // Per spec ELA-Template-json-260525.html#ladder-2-partial-picture-support:
    // Partial Picture Support variant intentionally has ONE blank rung per
    // ladder (word + targetText both empty string by design). Kids guess the
    // first letter using the rime word bank. Skip empty rungs silently —
    // they're a feature, not a data gap.
    const rungs = Array.isArray(t.rungs) ? t.rungs : [];
    const images = [];
    rungs.forEach((r, i) => {
      if (r.word) images.push({ slot: `rung[${i}].image`, word: r.word });
    });
    return { templateId: 'T-LADDER', expectations: [], images };
  },

  english_sound_box_digraph_partial_fill(t) {
    // K-3+ digraph variant — same renderer expectations as single-letter partial:
    // one word audio + one word image per item. Digraph cell layout is renderer-side.
    return EXTRACTORS.english_sound_box_partial_fill(t);
  },

  english_sound_box_digraph_full(t) {
    // K-3+ digraph variant — same renderer expectations as single-letter full:
    // one word audio + one word image per item.
    return EXTRACTORS.english_sound_box_full(t);
  }
};

// ---------- Audit a single page ----------
function auditPage(page, ctx, M) {
  const out = {
    file: ctx.file,
    pageId: page.pageId,
    pageNumber: page.pageNumber,
    instruction: {
      key: page.instructionKey || null,
      text: page.instructionText || null
    },
    topicTypes: [],
    renderFailures: [],
    missing: [],     // B
    mismatch: [],    // C
    images: []       // accounting only
  };

  const topics = (page.englishLetterTopicList || []);
  if (topics.length === 0) {
    out.renderFailures.push({ reason: 'no english topics', topicType: null });
    return out;
  }

  // Instruction audio check
  if (page.instructionKey) {
    const cat = resolveAudioCategory(page.instructionKey, M, 'instruction');
    if (!cat) {
      out.missing.push({ slot: 'instruction.audio', label: page.instructionKey, audioName: page.instructionKey, expectCategory: 'instruction' });
    } else if (cat !== 'instruction') {
      out.mismatch.push({ slot: 'instruction.audio', label: page.instructionKey, audioName: page.instructionKey, expectCategory: 'instruction', actualCategory: cat });
    }
  }

  const types = [...new Set(topics.map((t) => t.topicType))];
  out.topicTypes = types;
  if (types.length !== 1) {
    out.renderFailures.push({ reason: 'mixed topicType: ' + types.join(','), topicType: types });
  }

  topics.forEach((t, ti) => {
    const tt = t.topicType;
    const extractor = EXTRACTORS[tt];
    if (!extractor) {
      out.renderFailures.push({ reason: 'no extractor / translator', topicType: tt, topicIndex: ti });
      return;
    }
    const { expectations = [], images = [], issues = [] } = extractor(t);
    issues.forEach((iss) => {
      if (iss.kind === 'no_translator' || iss.kind === 'translator_error') {
        out.renderFailures.push({ reason: iss.msg, topicType: tt, topicIndex: ti });
      } else if (iss.kind === 'translator_correct_lost') {
        out.mismatch.push({
          slot: `topic[${ti}].translator_contract`,
          label: '(answer marking lost)',
          audioName: null,
          expectCategory: 'translator_contract',
          actualCategory: iss.msg
        });
      } else if (iss.kind === 'json_schema_mismatch') {
        out.mismatch.push({
          slot: `topic[${ti}].json_schema`,
          label: '(schema mismatch)',
          audioName: null,
          expectCategory: 'json_schema',
          actualCategory: iss.msg
        });
      }
    });
    expectations.forEach((e) => {
      // Pass expectCategory as hint to mirror translator behaviour: translators
      // prefix audio with their expected category ("letter:a.mp3", "rime:at.mp3"),
      // so resolver finds it in that category first instead of falling through to word.
      const actualCat = resolveAudioCategory(e.audioName, M, e.expectCategory);
      const slot = `topic[${ti}].${e.slot}`;
      if (!actualCat) {
        out.missing.push({ slot, label: e.label, audioName: e.audioName, expectCategory: e.expectCategory });
      } else if (e.expectCategory && actualCat !== e.expectCategory) {
        out.mismatch.push({
          slot, label: e.label, audioName: e.audioName,
          expectCategory: e.expectCategory, actualCategory: actualCat
        });
      }
    });
    images.forEach((img) => {
      const ok = resolveImage(img.word, M);
      const slot = `topic[${ti}].${img.slot}`;
      out.images.push({ slot, word: img.word, ok });
      if (!ok) {
        out.missing.push({ slot: slot + ' (image)', label: img.word, audioName: img.word + '.webp', expectCategory: 'image' });
      }
    });
  });

  return out;
}

// ---------- Workbook audit ----------
function listPages(wb) {
  const dir = join(PAGES_DIR, wb);
  return readdirSync(dir).filter((f) => /^U\d+_P\d+\.json$/.test(f)).sort();
}

function auditWorkbook(wb, M) {
  const files = listPages(wb);
  const pages = [];
  for (const f of files) {
    try {
      const page = JSON.parse(readFileSync(join(PAGES_DIR, wb, f), 'utf8'));
      pages.push(auditPage(page, { file: f }, M));
    } catch (e) {
      pages.push({ file: f, parseError: e.message, renderFailures: [{ reason: 'JSON parse error: ' + e.message }] });
    }
  }
  return { workbook: wb, total: files.length, pages };
}

// ---------- Markdown render ----------
function renderReport(wbAudit) {
  const lines = [];
  lines.push(`# Audit · ${wbAudit.workbook}`);
  lines.push('');
  lines.push(`Total pages: **${wbAudit.total}**`);
  lines.push('');

  // A. Render failures
  lines.push('## A. 渲染失敗的頁');
  const failures = wbAudit.pages.flatMap((p) => (p.renderFailures || []).map((r) => ({ file: p.file, ...r })));
  if (failures.length === 0) {
    lines.push('_None — every page is supported by an existing translator._');
  } else {
    lines.push('| Page | topicType | reason |');
    lines.push('|------|-----------|--------|');
    failures.forEach((f) => {
      lines.push(`| ${f.file} | \`${f.topicType ?? '-'}\` | ${f.reason} |`);
    });
  }
  lines.push('');

  // B. Missing assets
  lines.push('## B. 缺資源的按鈕 / 圖片');
  const missing = wbAudit.pages.flatMap((p) => (p.missing || []).map((m) => ({ file: p.file, ...m })));
  if (missing.length === 0) {
    lines.push('_None — every expected audio/image exists in 10-Final-Assets._');
  } else {
    // Group by audioName/word for dedup view
    lines.push('| Page | slot | label | expects (category) | filename |');
    lines.push('|------|------|-------|--------------------|----------|');
    missing.forEach((m) => {
      lines.push(`| ${m.file} | ${m.slot} | \`${m.label}\` | ${m.expectCategory} | \`${m.audioName}\` |`);
    });
    // De-duped tally
    const tally = {};
    missing.forEach((m) => {
      const key = `${m.expectCategory}:${m.audioName}`;
      tally[key] = (tally[key] || 0) + 1;
    });
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 20);
    if (top.length) {
      lines.push('');
      lines.push('Top missing assets (deduped):');
      lines.push('');
      top.forEach(([k, n]) => lines.push(`- ${k} × ${n}`));
    }
  }
  lines.push('');

  // C. Semantic mismatch
  lines.push('## C. 資源語意錯位');
  const mismatch = wbAudit.pages.flatMap((p) => (p.mismatch || []).map((m) => ({ file: p.file, ...m })));
  if (mismatch.length === 0) {
    lines.push('_None — every audio button resolves to the category implied by its label._');
  } else {
    lines.push('| Page | slot | label | expects | actually plays |');
    lines.push('|------|------|-------|---------|----------------|');
    mismatch.forEach((m) => {
      lines.push(`| ${m.file} | ${m.slot} | \`${m.label}\` | ${m.expectCategory} | \`${m.actualCategory}/${m.audioName}\` |`);
    });
  }
  lines.push('');

  return lines.join('\n');
}

// ---------- Main ----------
async function main() {
  const argWBs = process.argv.slice(2);
  const wbs = argWBs.length ? argWBs : DEFAULT_WORKBOOKS;
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const manifest = await loadManifest();
  console.log(`[audit] manifest loaded — ${manifest.total} words, ${Object.keys(manifest.letters).length} letters, ${Object.keys(manifest.rimes).length} rimes, ${Object.keys(manifest.phonemes).length} phonemes, ${Object.keys(manifest.instructions).length} instructions`);

  const summary = { workbooks: [] };
  for (const wb of wbs) {
    const audit = auditWorkbook(wb, manifest);
    const report = renderReport(audit);
    const outPath = join(OUT_DIR, `${wb}.md`);
    writeFileSync(outPath, report);
    const fails    = audit.pages.flatMap((p) => p.renderFailures || []).length;
    const missing  = audit.pages.flatMap((p) => p.missing || []).length;
    const mismatch = audit.pages.flatMap((p) => p.mismatch || []).length;
    const imgCnt   = audit.pages.flatMap((p) => p.images || []).length;
    console.log(`[audit] ${wb}: ${audit.total} pages → A=${fails} B=${missing} C=${mismatch} (images=${imgCnt}) · ${outPath}`);
    summary.workbooks.push({ wb, total: audit.total, A: fails, B: missing, C: mismatch });
  }

  // Stats file (script-generated, safe to overwrite each run).
  // Hand-written `summary.md` lives alongside and is not touched.
  // _stats.json carries the previous run's numbers so the markdown table
  // can show diff per workbook (e.g. "C: 3→0") on this run.
  const histPath = join(OUT_DIR, '_stats.json');
  let prev = {};
  if (existsSync(histPath)) {
    try {
      const hist = JSON.parse(readFileSync(histPath, 'utf8'));
      (hist.workbooks || []).forEach((w) => { prev[w.wb] = w; });
    } catch (_) { /* ignore parse error */ }
  }
  writeFileSync(histPath, JSON.stringify({
    generated: new Date().toISOString(),
    workbooks: summary.workbooks
  }, null, 2));

  const sumLines = ['# Audit Stats (auto-generated)', '',
    `Generated: ${new Date().toISOString()}`, '',
    '| Workbook | Pages | A (render fail) | B (missing) | C (mismatch) | Δ from last run |',
    '|----------|-------|-----------------|-------------|--------------|-----------------|'];
  summary.workbooks.forEach((s) => {
    const p = prev[s.wb];
    let diff;
    if (!p) {
      diff = '_baseline_';
    } else {
      const parts = [];
      [['A', s.A, p.A], ['B', s.B, p.B], ['C', s.C, p.C]].forEach(([k, cur, prv]) => {
        if (cur !== prv) {
          const arrow = cur < prv ? '↓' : '↑';
          parts.push(`${k}: ${prv}→${cur} ${arrow}`);
        }
      });
      diff = parts.length === 0 ? '_no change_' : parts.join(' · ');
    }
    sumLines.push(`| ${s.wb} | ${s.total} | ${s.A} | ${s.B} | ${s.C} | ${diff} |`);
  });
  writeFileSync(join(OUT_DIR, '_stats.md'), sumLines.join('\n'));
  console.log(`[audit] stats → ${join(OUT_DIR, '_stats.md')}`);
}

main().catch((e) => {
  console.error('[audit] FATAL', e);
  process.exit(1);
});
