/* JOJO ELA Preview — Bitable Mode Translator + Custom Renderer
 *
 * Translates Bitable `generator_output` pages (englishLetterTopicList / topicType / ...)
 * into the legacy demo-data schema that existing renderers (T-SOUNDBOX, T-WRITE, T-MATCH)
 * already consume. For Page 3 (english_circle_picture) we provide a custom multi-row
 * pseudo-renderer because the existing T-CIRCLE renderer only paints one flat grid.
 *
 * Public API (window.JOJO_BITABLE):
 *   loadAssetManifest()                 → Promise that fills _assetManifest
 *   translatePage(page, contentPool, unitCode, grade='K') → translated object
 *   renderPage(translated, container)   → mounts into container, applies fallbacks
 *
 * Translation contract (see plan §四):
 *   english_sound_box_full         → T-SOUNDBOX v2
 *   english_sound_box_partial_fill → T-SOUNDBOX v1
 *   english_picture_spelling       → T-WRITE     v2
 *   english_circle_picture         → kind:'circle_multi' (custom render)
 *   english_matching               → T-MATCH     v2
 */

(function () {
  'use strict';

  // ============ Module state ============
  const State = { assetManifest: { words: {} } };

  // Inject CSS for placeholder + tooltip + circle multi-row (once)
  function injectStylesOnce() {
    if (document.getElementById('bitable-mode-css')) return;
    const css = `
      .ws-bitable-circle-row {
        display: flex; gap: 12px; margin: 0 0 18px;
        position: relative; padding: 8px 0;
        align-items: stretch;
      }
      .ws-bitable-circle-row .ws-option-card {
        flex: 0 0 140px; min-height: 110px; padding: 8px;
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        position: relative;
      }
      .ws-bitable-placeholder {
        background: #eee; border: 1px dashed #b00;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        color: #666; font-size: 11px; text-align: center;
        padding: 4px; gap: 2px;
      }
      .ws-bitable-placeholder .word { font-size: 14px; font-weight: 600; color: #333; }
      .ws-bitable-placeholder .warn { color: #b00; font-size: 10px; line-height: 1.2; }
      .ws-bitable-audio-missing { opacity: 0.4; cursor: not-allowed; }
      [data-source-trace] { position: relative; }
      [data-source-trace]::before {
        content: attr(data-source-trace);
        position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
        background: #222; color: #fff; padding: 4px 8px; border-radius: 4px;
        font-size: 10px; font-family: "Fira Code", monospace; white-space: nowrap;
        opacity: 0; transition: opacity 0.15s; pointer-events: none;
        z-index: 10;
      }
      [data-source-trace]:hover::before { opacity: 0.95; }
      .ws-bitable-error {
        background: #fff3cd; border: 1px solid #ffeaa7;
        padding: 16px; border-radius: 8px;
        font-size: 14px; color: #856404;
      }
      .ws-bitable-error pre {
        margin-top: 8px; background: #fff; padding: 8px;
        font-size: 11px; font-family: monospace;
        max-height: 200px; overflow: auto;
      }
      .ws-bitable-instruction-fallback {
        background: #fff3cd; padding: 4px 8px; border-radius: 4px;
        font-size: 11px; color: #856404; margin-left: 8px;
      }
    `;
    const style = document.createElement('style');
    style.id = 'bitable-mode-css';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============ Asset manifest ============
  async function loadAssetManifest() {
    try {
      const res = await fetch('/api/asset-manifest');
      if (!res.ok) throw new Error('asset-manifest HTTP ' + res.status);
      State.assetManifest = await res.json();
    } catch (e) {
      console.warn('[bitable] asset manifest load failed:', e.message);
      State.assetManifest = { words: {}, error: e.message };
    }
    return State.assetManifest;
  }

  function hasAsset(word, kind) {
    const m = State.assetManifest.words || {};
    return !!(m[word] && m[word][kind]);
  }

  // ============ Topic translators ============

  function translateSoundBoxFull(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-SOUNDBOX',
      variant: 'v2',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SOUNDBOX',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => {
          const phonemes = Array.isArray(t.answer) ? t.answer.slice() : String(t.answer || t.word || '').split('');
          return {
            image: t.word + '.webp',
            audio: t.word + '.mp3',
            phonemes,
            boxes: phonemes.length,
            prefill: Array(phonemes.length).fill('')
          };
        })
      }
    };
  }

  function translateSoundBoxPartialFill(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-SOUNDBOX',
      variant: 'v1',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SOUNDBOX',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => {
          const before = t.blankBefore || '';
          const after  = t.blankAfter  || '';
          const answer = t.answer != null ? String(t.answer) : '';
          // answer can be a digraph (multi-letter) sitting in ONE cell
          const phonemes = [...before.split(''), answer, ...after.split('')];
          const prefill  = [...before.split(''), '',     ...after.split('')];
          return {
            image: t.word + '.webp',
            audio: t.word + '.mp3',
            phonemes,
            boxes: phonemes.length,
            prefill
          };
        })
      }
    };
  }

  function translatePictureSpelling(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-WRITE',
      variant: 'v2',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-WRITE',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => ({
          prompt_image: t.word + '.webp',
          prompt_audio: t.word + '.mp3',
          hint: null,
          answer: t.answer || t.word
        }))
      }
    };
  }

  function translateMatching(topics, ctx) {
    const t = topics[0];
    if (!t || !t.topItems || !t.bottomItems || !t.correctPairs) {
      throw new Error('matching topic missing required fields');
    }
    const topMap = Object.fromEntries(t.topItems.map((x) => [x.id, x.value]));
    const botMap = Object.fromEntries(t.bottomItems.map((x) => [x.id, x.value]));
    const pairs = t.correctPairs.map((pairStr) => {
      const [topId, botId] = String(pairStr).split('-');
      const word = topMap[topId];
      return {
        left:  { content: word + '.webp', type: 'image', audio: word + '.mp3' },
        right: { content: botMap[botId], type: 'word' }
      };
    });
    return {
      kind: 'legacy',
      templateId: 'T-MATCH',
      variant: 'v2',
      sourceTraces: pairs.map((p, i) => {
        const stm = t.source_trace_map || {};
        return stm['topItems[' + i + '].value'] || null;
      }),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-MATCH',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        pairs
      }
    };
  }

  const TOPIC_TRANSLATORS = {
    english_sound_box_full:         translateSoundBoxFull,
    english_sound_box_partial_fill: translateSoundBoxPartialFill,
    english_picture_spelling:       translatePictureSpelling,
    english_matching:               translateMatching
  };

  // ============ Template / variant labels (SSOT: Bitable 題型 Template 表) ============
  // Display only — decoupled from internal renderer ID. Renderer registry uses legacy
  // T-WRITE / T-LISTEN; canonical Bitable names are T-SPELL / T-DICTATION etc.
  // variantName must match the full descriptor verbatim from Bitable 題型 Template
  // 題型 Variant column (e.g. "Sound Box - Full (2 Rows)"). variantNumber is kept
  // for internal indexing/debugging but not shown in UI.
  const TEMPLATE_VARIANT_MAP = {
    english_sound_box_full:
      () => ({ templateId: 'T-SOUNDBOX', variantNumber: 2, variantName: 'Sound Box - Full (2 Rows)' }),
    english_sound_box_partial_fill:
      () => ({ templateId: 'T-SOUNDBOX', variantNumber: 1, variantName: 'Sound Box - Partial Fill (4 Rows, 2x2)' }),
    english_picture_spelling:
      () => ({ templateId: 'T-SPELL', variantNumber: 2, variantName: 'Picture Spelling (4 Cells)' }),
    english_circle_picture: (topics) => {
      const multi = ((topics[0] && topics[0].correctWords && topics[0].correctWords.length) || 0) > 1;
      return multi
        ? { templateId: 'T-CIRCLE', variantNumber: 2, variantName: 'Circle Pictures by Digraph (4 Cards, Multi-Select)' }
        : { templateId: 'T-CIRCLE', variantNumber: 1, variantName: 'Circle Picture by Sound (3 Cards, Single Choice)' };
    },
    english_matching: (topics) => {
      const m = topics[0] && topics[0].matchType;
      const SUB = {
        letter_case:     { variantNumber: 1, variantName: 'Match Letter Case (4 Pairs)' },
        picture_to_word: { variantNumber: 2, variantName: 'Match Picture to Word (4 Pairs)' },
        synonyms:        { variantNumber: 3, variantName: 'Match Synonyms (4 Pairs)' },
        antonyms:        { variantNumber: 3, variantName: 'Match Antonyms (4 Pairs)' },
        sound_to_word:   { variantNumber: 4, variantName: 'Match Sound to Word (4 Pairs)' }
      };
      const sub = SUB[m] || { variantNumber: null, variantName: '(unknown matchType: ' + m + ')' };
      return Object.assign({ templateId: 'T-MATCH' }, sub);
    }
  };

  function resolveTemplateMeta(topicType, topics) {
    const fn = TEMPLATE_VARIANT_MAP[topicType];
    if (!fn) {
      return {
        templateId: '???',
        variantNumber: null,
        variantName: topicType ? '(unknown topicType: ' + topicType + ')' : '(no topic)'
      };
    }
    return fn(topics);
  }

  // ============ translatePage ============

  function translatePage(page, contentPool, unitCode, grade) {
    grade = grade || 'K';
    const topics = (page && page.englishLetterTopicList) || [];

    const instructionTextRaw = page && page.instructionText;
    const instructionText = instructionTextRaw || (page && page.instructionId) || '(no instruction)';
    const instructionFallback = !instructionTextRaw && !!(page && page.instructionId);
    const instructionAudio = '/assets/audio/instr/' + unitCode + '_p' + (page && page.pageNumber) + '.mp3';

    const ctx = {
      pageId: page.pageId || (unitCode + '_p' + page.pageNumber),
      grade,
      instructionText,
      instructionAudio,
      instructionFallback
    };

    if (topics.length === 0) {
      return {
        kind: 'unsupported', reason: 'no english topics', ctx, rawPage: page,
        templateMeta: resolveTemplateMeta(null, [])
      };
    }

    const types = [...new Set(topics.map((t) => t.topicType))];
    if (types.length !== 1) {
      return {
        kind: 'unsupported', reason: 'mixed topic types: ' + types.join(','),
        ctx, rawPage: page, templateMeta: resolveTemplateMeta(null, topics)
      };
    }
    const type = types[0];
    const templateMeta = resolveTemplateMeta(type, topics);

    if (type === 'english_circle_picture') {
      return {
        kind: 'circle_multi',
        ctx, templateMeta,
        rows: topics.map((t) => ({
          options: (t.options || []).slice(),
          correct: (t.correctWords || []).slice(),
          sourceTraceMap: t.source_trace_map || {}
        }))
      };
    }

    const translator = TOPIC_TRANSLATORS[type];
    if (!translator) {
      return {
        kind: 'unsupported', reason: 'unknown topicType: ' + type,
        ctx, rawPage: page, templateMeta
      };
    }

    try {
      const result = translator(topics, ctx);
      result.ctx = ctx;
      result.templateMeta = templateMeta;
      return result;
    } catch (e) {
      console.error('[bitable] translator error', e);
      return { kind: 'error', reason: e.message, ctx, rawPage: page, templateMeta };
    }
  }

  // ============ renderPage ============

  function renderPage(translated, container) {
    injectStylesOnce();
    container.innerHTML = '';

    if (translated.kind === 'legacy') {
      const renderer = (window.JOJO_RENDERERS || {})[translated.templateId];
      if (!renderer) {
        renderErrorNotice({ reason: 'no renderer registered: ' + translated.templateId, rawPage: translated.data }, container);
        return;
      }
      renderer(translated.data, container);
      attachSourceTraces(container, translated);
      applyAssetFallbacks(container);
      markInstructionFallback(container, translated.ctx);
    } else if (translated.kind === 'circle_multi') {
      renderCircleMultiRow(translated, container);
      applyAssetFallbacks(container);
      markInstructionFallback(container, translated.ctx);
    } else {
      renderErrorNotice(translated, container);
    }
  }

  function markInstructionFallback(container, ctx) {
    if (!ctx || !ctx.instructionFallback) return;
    const inst = container.querySelector('.ws-instruction');
    if (!inst) return;
    const tag = document.createElement('span');
    tag.className = 'ws-bitable-instruction-fallback';
    tag.textContent = 'fallback to instructionId';
    inst.appendChild(tag);
  }

  function renderErrorNotice(translated, container) {
    const div = document.createElement('div');
    div.className = 'ws-bitable-error';
    div.innerHTML = '<strong>Unsupported / error page</strong>: ' +
      escapeHtml(translated.reason || translated.error || '(unknown)') +
      '<pre>' + escapeHtml(JSON.stringify(translated.rawPage || translated, null, 2)) + '</pre>';
    container.appendChild(div);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ============ renderCircleMultiRow ============

  function renderCircleMultiRow(payload, container) {
    const R = window.JOJO_RENDER;

    const inst = R.instruction(payload.ctx.instructionText, payload.ctx.instructionAudio);
    R.annotate(inst, 'instruction_text');
    container.appendChild(inst);

    payload.rows.forEach((row, rowIdx) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'ws-bitable-circle-row';

      const cardIds = [];
      (row.options || []).forEach((word, optIdx) => {
        const isCorrect = (row.correct || []).indexOf(word) !== -1;
        const card = document.createElement('div');
        card.className = 'ws-option-card';
        card.id = 'bt-circle-' + rowIdx + '-' + optIdx;
        card.dataset.correct = String(isCorrect);

        const img = R.imagePlaceholder(word + '.webp', 96, 72);
        card.appendChild(img);

        const label = document.createElement('span');
        label.className = 'ws-option-card-text';
        label.textContent = word;
        card.appendChild(label);

        const audioBtn = R.audioButton(word + '.mp3');
        card.appendChild(audioBtn);

        // source_trace tooltip
        const stm = row.sourceTraceMap || {};
        const trace = stm['options[' + optIdx + ']'] || null;
        if (trace) card.setAttribute('data-source-trace', trace);

        rowEl.appendChild(card);
        cardIds.push({ id: card.id, correct: isCorrect });
      });

      container.appendChild(rowEl);

      requestAnimationFrame(() => {
        const svg = R.svgOverlay();
        rowEl.appendChild(svg);
        const rowRect = rowEl.getBoundingClientRect();
        cardIds.forEach(({ id, correct }, i) => {
          if (!correct) return;
          const el = document.getElementById(id);
          if (!el) return;
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - rowRect.left;
          const cy = r.top + r.height / 2 - rowRect.top;
          svg.appendChild(R.createSvgCircle(cx, cy, r.width / 2 + 6, r.height / 2 + 6, rowIdx * 13 + i));
        });
      });
    });
  }

  // ============ attachSourceTraces ============

  function attachSourceTraces(container, translated) {
    if (!translated.sourceTraces) return;
    let nodes;
    if (translated.templateId === 'T-MATCH') {
      nodes = container.querySelectorAll('[data-field^="pairs["][data-field$=".left"]');
    } else {
      // T-SOUNDBOX / T-WRITE: items wrapped in .ws-item-row with data-field="items[N]"
      nodes = container.querySelectorAll('[data-field^="items["]:not([data-field*="."])');
    }
    translated.sourceTraces.forEach((trace, i) => {
      if (trace && nodes[i]) nodes[i].setAttribute('data-source-trace', trace);
    });
  }

  // ============ Asset fallback + audio playback wiring ============

  function applyAssetFallbacks(container) {
    // Image placeholders: parse filename from inner <span>, swap to real <img> if asset present,
    // otherwise enhance with warning text.
    container.querySelectorAll('.ws-image-placeholder').forEach((ph) => {
      const span = ph.querySelector('span');
      const filename = span ? span.textContent.trim() : '';
      const m = filename.match(/^([^.\s]+)\.(webp|png|jpg|jpeg)$/i);
      if (!m) return;
      const word = m[1];
      const ext  = m[2].toLowerCase();
      if (hasAsset(word, 'image')) {
        replaceWithRealImg(ph, word, ext);
      } else {
        enhanceMissingPlaceholder(ph, word, filename);
      }
    });

    // Audio buttons: parse "Audio: cat.mp3" out of title; if asset missing -> disable;
    // if present -> attach onclick to play /assets/audio/<file>.
    container.querySelectorAll('.ws-audio-btn').forEach((btn) => {
      const title = btn.getAttribute('title') || '';
      const m = title.match(/Audio:\s*([^.\s]+)\.(mp3|wav|m4a)$/i);
      if (!m) return;
      const word = m[1];
      const ext  = m[2].toLowerCase();
      // Instruction audio (path inside ctx.instructionAudio starts with '/assets/audio/instr/')
      // — those won't match this regex (the word will be K-1_U01_p1 etc.), so they fall through
      // and we treat the underscore-prefixed audio as missing without manifest entries.
      const inInstruction = !!btn.closest('.ws-instruction');
      const present = !inInstruction && hasAsset(word, 'audio');
      if (present) {
        btn.dataset.audioSrc = '/assets/audio/' + word + '.' + ext;
        wireAudioPlayback(btn);
      } else {
        btn.disabled = true;
        btn.classList.add('ws-bitable-audio-missing');
        btn.title = '⚠ Missing audio: ' + word + '.' + ext + (inInstruction ? ' (instruction audio not produced yet)' : '');
      }
    });
  }

  function replaceWithRealImg(placeholderEl, word, ext) {
    const img = document.createElement('img');
    img.src = '/assets/images/' + word + '.' + ext;
    img.alt = word;
    const widthAttr  = placeholderEl.style.width;
    const heightAttr = placeholderEl.style.height;
    if (widthAttr)  img.style.width  = widthAttr;
    if (heightAttr) img.style.height = heightAttr;
    img.style.objectFit = 'contain';
    img.style.borderRadius = '6px';
    img.style.background = '#fff';
    // Preserve annotation data-field if present
    const fieldName = placeholderEl.getAttribute('data-field');
    if (fieldName) img.setAttribute('data-field', fieldName);
    // Defensive: if image fails to load despite manifest claim, fall back to placeholder
    img.onerror = () => enhanceMissingPlaceholder(placeholderEl, word, word + '.' + ext);
    placeholderEl.replaceWith(img);
  }

  function enhanceMissingPlaceholder(placeholderEl, word, filename) {
    placeholderEl.classList.add('ws-bitable-placeholder');
    placeholderEl.innerHTML = '<span class="word">' + escapeHtml(word) + '</span>' +
                              '<span class="warn">⚠ ' + escapeHtml(filename) + ' missing</span>';
  }

  function wireAudioPlayback(btn) {
    if (btn._wired) return;
    btn._wired = true;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.dataset.audioSrc;
      if (!src) return;
      const audio = new Audio(src);
      audio.play().catch((err) => {
        console.warn('audio play failed', src, err);
      });
    });
  }

  // ============ Expose ============
  window.JOJO_BITABLE = {
    loadAssetManifest,
    translatePage,
    renderPage,
    _state: State
  };
})();
