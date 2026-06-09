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
 *   english_circle_picture_rhyme  → T-CIRCLE    v5
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

  // Resolve an audio filename into a real URL.
  // hint (optional) ∈ { 'letter' | 'rime' | 'phoneme' | 'word' | 'instruction' }
  //   When given, the named category is tried first so that same-token files
  //   in multiple categories (e.g. word/at.mp3 vs rime/at.mp3, word/a.mp3 vs
  //   letter/A.mp3) resolve to the semantically-correct one.
  // Fallback order when no hint or hint miss: phoneme → word → rime → instruction → letter.
  function resolveAudioUrl(name, ext, hint) {
    const M = State.assetManifest;
    ext = ext || 'mp3';
    const tryCategory = {
      phoneme:     () => (M.phonemes && M.phonemes[name] && M.phonemes[name].audio)
                          ? '/assets/audio/phoneme/' + name + '.' + ext : null,
      word:        () => (M.words && M.words[name] && M.words[name].audio)
                          ? '/assets/audio/word/' + name + '.' + ext : null,
      rime:        () => (M.rimes && M.rimes[name] && M.rimes[name].audio)
                          ? '/assets/audio/rime/' + name + '.' + ext : null,
      instruction: () => (M.instructions && M.instructions[name] && M.instructions[name].audio)
                          ? '/assets/audio/instruction/' + name + '.' + ext : null,
      letter:      () => {
        const upper = String(name).toUpperCase();
        return (M.letters && M.letters[upper] && M.letters[upper].audio)
               ? '/assets/audio/letter/' + upper + '.' + ext : null;
      }
    };
    if (hint && tryCategory[hint]) {
      const url = tryCategory[hint]();
      if (url) return url;
    }
    for (const cat of ['phoneme', 'word', 'rime', 'instruction', 'letter']) {
      if (cat === hint) continue;
      const url = tryCategory[cat]();
      if (url) return url;
    }
    return null;
  }

  // Word images live under /assets/images/word/<word>.<ext>
  function resolveImageUrl(word, ext) {
    const M = State.assetManifest;
    ext = ext || 'webp';
    if (M.words && M.words[word] && M.words[word].image) {
      return '/assets/images/word/' + word + '.' + ext;
    }
    return null;
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

  function translateInitialSoundSpelling(topics, ctx) {
    // T-SPELL variant 1 (per spec). answer is the prefix of word
    // (e.g. word='banana', answer='b'); remaining letters render as
    // light-gray prefilled cells via the T-WRITE renderer's prefill path.
    //
    // Audio: one button plays the letter name then the word, sequentially
    // ("A...Apple"). renderer-write reads prompt_audio_sequence and
    // applyAssetFallbacks wires sequential playback. prompt_audio kept as
    // single-button fallback for mock/demo data that lacks the sequence.
    return {
      kind: 'legacy',
      templateId: 'T-WRITE',
      variant: 'v1',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-WRITE',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => {
          const word    = t.word || '';
          const answer  = t.answer || '';
          const letters = word.split('');
          const prefill = letters.map((ch, i) => i < answer.length ? '' : ch);
          return {
            prompt_image: word + '.webp',
            prompt_audio: word + '.mp3',
            prompt_audio_sequence: answer
              ? ['letter:' + answer.toLowerCase() + '.mp3', word + '.mp3']
              : null,
            hint: null,
            answer: word,
            prefill: prefill
          };
        })
      }
    };
  }

  function translateTraceWord(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.wordsList)) {
      throw new Error('trace_word topic missing wordsList');
    }
    const words = t.wordsList;
    // Spec (ELA-Template-json.html #8/#9/#10-shadow-writing/guided-to-freehand/freehand-...-word-4-cells):
    // wordsList.length === 2, each word renders in its own row with image + audio + 2 trace cells.
    if (words.length !== 2) {
      console.warn('[bitable] english_trace_word: spec expects wordsList.length === 2, got ' +
        words.length + ' — rendering first ' + Math.min(words.length, 2));
    }
    const SCAFFOLD_BY_GUIDE = {
      'All Guide':          ['trace', 'trace', 'trace', 'trace'],
      'Guided to Freehand': ['trace', 'trace', 'faded', 'faded'],
      'Free':               ['blank', 'blank', 'blank', 'blank']
    };
    const guide = t.guideMode || 'All Guide';
    const scaffolds = SCAFFOLD_BY_GUIDE[guide] || ['trace', 'trace', 'trace', 'trace'];
    const rowWords = words.slice(0, 2);
    return {
      kind: 'legacy',
      templateId: 'T-TRACE',
      variant: 'v2',
      sourceTraces: rowWords.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-TRACE',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        rows: rowWords.map((w, ri) => ({
          word: w.word || '',
          image: w.imageName ? w.imageName + '.webp' : null,
          audio: w.audioName ? w.audioName + '.mp3' : null,
          cells: [
            { scaffold: scaffolds[ri * 2],     content: w.word || '' },
            { scaffold: scaffolds[ri * 2 + 1], content: w.word || '' }
          ]
        }))
      }
    };
  }

  function translateOnsetRimeBlend(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.rows)) {
      throw new Error('onset_rime_blend topic missing rows');
    }
    const rows = t.rows;
    return {
      kind: 'legacy',
      templateId: 'T-BLEND',
      variant: 'v1',
      sourceTraces: rows.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-BLEND',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 56,
        // Audio: onset is a phoneme (onset_k.mp3); rime gets explicit 'rime:' prefix
        // so the resolver routes 'at.mp3' to rime/ rather than word/at.mp3.
        items: rows.map((r) => ({
          phoneme_audios: [
            'phoneme:' + (r.onset_phoneme_id || r.onset) + '.mp3',
            'rime:'    + (r.rime_id          || r.rime ) + '.mp3'
          ],
          phoneme_labels: ['/' + r.onset + '/', '/' + r.rime + '/'],
          image: (r.imageName || r.word) + '.webp',
          answer: r.answer || r.word
        }))
      }
    };
  }

  function translatePhonemeBlendPicture(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.rows)) {
      throw new Error('phoneme_blend_picture topic missing rows');
    }
    const rows = t.rows;
    return {
      kind: 'legacy',
      templateId: 'T-BLEND',
      variant: 'v2',
      sourceTraces: rows.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-BLEND',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        // Prefer semantic phoneme IDs ("onset_h.mp3", "short_i.mp3") over single-letter
        // graphemes ("h.mp3" → letter-name audio "aitch"). 'phoneme:' prefix forces the
        // resolver to look in phoneme/ first even when the grapheme collides with a word.
        items: rows.map((r) => {
          const ids = (Array.isArray(r.phoneme_ids) && r.phoneme_ids.length === (r.phonemes || []).length)
            ? r.phoneme_ids
            : (r.phonemes || []);
          return {
            phoneme_audios: ids.map((p) => 'phoneme:' + p + '.mp3'),
            phoneme_labels: (r.phonemes || []).map((p) => '/' + p + '/'),
            image: (r.imageName || r.word) + '.webp',
            answer: r.answer || r.word
          };
        })
      }
    };
  }

  function translateWordBankCloze(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.rows)) {
      throw new Error('word_bank_cloze topic missing rows');
    }
    const rows = t.rows;
    const bank = Array.isArray(t.wordBank) ? t.wordBank : [];
    return {
      kind: 'legacy',
      templateId: 'T-FILLIN',
      variant: 'v3',
      sourceTraces: rows.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-FILLIN',
        variant: 'v3',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 36,
        word_bank: bank.map((w) => (typeof w === 'string' ? w : (w && w.text) || '')),
        items: rows.map((r) => ({
          display: (r.sentence || '').replace(/_+/g, '_'),
          blank_position: 0,
          blank_length: (r.answer || '').length || 1,
          answer: r.answer || ''
        }))
      }
    };
  }

  function translateFindWord(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.options)) {
      throw new Error('find_word topic missing options grid');
    }
    return {
      kind: 'legacy',
      templateId: 'T-FINDWORD',
      variant: 'v1',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-FINDWORD',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        target_words: (t.words || []).map((w) => String(w).toLowerCase()),
        grid: (t.options || []).map((row) =>
          row.map((c) => String(c).toLowerCase())
        )
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
    const matchType = t.matchType || 'picture_to_word';
    const leftIsImage = matchType === 'picture_to_word';
    const pairs = t.correctPairs.map((pairStr) => {
      const [topId, botId] = String(pairStr).split('-');
      const leftValue = topMap[topId];
      const rightValue = botMap[botId];
      const left = leftIsImage
        ? { content: leftValue + '.webp', type: 'image', audio: leftValue + '.mp3' }
        : { content: leftValue, type: 'word', audio: leftValue + '.mp3' };
      return { left, right: { content: rightValue, type: 'word' } };
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

  function translateCircleWord(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.options)) {
      throw new Error('circle_word topic missing options');
    }
    const target = t.targetWord;
    return {
      kind: 'legacy',
      templateId: 'T-CIRCLE',
      variant: 'v3',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-CIRCLE',
        variant: 'v3',
        grade: ctx.grade,
        instruction: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        select_mode: 'multi',
        target_word: target,
        options: t.options.map((w) => ({
          content: w,
          type: 'word',
          correct: w === target
        }))
      }
    };
  }

  function translateCirclePictureRhyme(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.options)) {
      throw new Error('circle_picture_rhyme topic missing options');
    }
    const correct = t.correctAnswer || (t.correctWords && t.correctWords[0]) || '';
    return {
      kind: 'legacy',
      templateId: 'T-CIRCLE',
      variant: 'v5',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-CIRCLE',
        variant: 'v5',
        grade: ctx.grade,
        instruction: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        select_mode: 'single',
        options: t.options.map((w) => ({
          content: w + '.webp',
          label: w,
          type: 'image',
          audio: w + '.mp3',
          correct: w === correct
        }))
      }
    };
  }

  function translateSortWords(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.cardGroups)) {
      throw new Error('sort_words topic missing cardGroups');
    }
    return {
      kind: 'legacy',
      templateId: 'T-SORT',
      variant: 'v2',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SORT',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        buckets: t.cardGroups.map((g, i) => ({
          label: g.category || ('Group ' + (i + 1)),
          id: 'b' + i
        })),
        cards: t.cardGroups.flatMap((g, i) =>
          (g.cards || []).map((c) => ({
            content: String(c),
            type: 'word',
            correct_bucket: 'b' + i
          }))
        )
      }
    };
  }

  function translateSequence(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.cards)) {
      throw new Error('sequence topic missing cards');
    }
    const cards = t.cards.slice().sort((a, b) => (a.cardOrder || 0) - (b.cardOrder || 0));
    const isText = t.cardDisplay === 'sentence' || t.cardDisplay === 'text';
    // Deterministic scrambled display: reverse order
    const displayOrder = cards.map((_, i) => cards.length - 1 - i + 1);
    return {
      kind: 'legacy',
      templateId: 'T-SEQUENCE',
      variant: isText ? 'v2' : 'v1',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SEQUENCE',
        variant: isText ? 'v2' : 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        items: cards.map((c) => ({
          content: c.cardKey,
          type: isText ? 'text' : 'word',
          order: c.cardOrder
        })),
        display_order: displayOrder
      }
    };
  }

  function translateTraceLetter(topics, ctx) {
    const t = topics[0];
    if (!t || !t.letter) {
      throw new Error('trace_letter topic missing letter');
    }
    const letter = t.letter;
    const isUpper = /^[A-Z]$/.test(letter);
    const variant = isUpper ? 'v1' : 'v2';
    return {
      kind: 'legacy',
      templateId: 'T-TRACE',
      variant: variant,
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-TRACE',
        variant: variant,
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 56,
        demo_area: {
          content: letter,
          animation: 'stroke_order',
          // 'letter:' prefix forces resolver to look up letter category first,
          // so word/a.mp3 doesn't hijack letter/A.mp3 when both exist.
          audio: 'letter:' + letter.toLowerCase() + '.mp3',
          image: t.word ? t.word + '.webp' : null,
          word: t.word || null
        },
        cells: [
          { scaffold: 'trace', content: letter },
          { scaffold: 'trace', content: letter },
          { scaffold: 'faded', content: letter },
          { scaffold: 'faded', content: letter },
          { scaffold: 'blank', content: letter },
          { scaffold: 'blank', content: letter },
          { scaffold: 'blank', content: letter },
          { scaffold: 'blank', content: letter }
        ]
      }
    };
  }

  function translateShadowWriting(topics, ctx) {
    const t = topics[0];
    if (!t || !t.letter) {
      throw new Error('shadow_writing topic missing letter');
    }
    const letter = t.letter;
    const isUpper = /^[A-Z]$/.test(letter);
    const variant = isUpper ? 'v3' : 'v4';
    return {
      kind: 'legacy',
      templateId: 'T-TRACE',
      variant: variant,
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-TRACE',
        variant: variant,
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        demo_area: {
          content: letter,
          animation: 'stroke_order',
          // mixed-case letter ("Ff") → first char for letter audio (f.mp3, not ff.mp3)
          audio: 'letter:' + letter[0].toLowerCase() + '.mp3',
          image: null,
          wordCards: (t.wordList || []).filter(Boolean).map(w => ({
            word: w, image: w + '.webp', audio: w + '.mp3'
          }))
        },
        cells: Array.from({ length: 10 }, () => ({ scaffold: 'faded', content: letter }))
      }
    };
  }

  // v2605.25: unified english_transform with displayType branch
  // Old english_word_transform_picture / english_word_transform_text are deprecated
  function translateTransform(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.items)) {
      throw new Error('english_transform topic missing items[]');
    }
    const isPicture = (t.displayType || 'image') === 'image';
    return {
      kind: 'legacy',
      templateId: 'T-TRANSFORM',
      variant: isPicture ? 'v1' : 'v2',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-TRANSFORM',
        variant: isPicture ? 'v1' : 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 40,
        items: t.items.map((it) => ({
          original: it.sourceWord,
          rule: 'add_silent_e',
          answer: it.answer,
          // v2605.25: image / audio key derived from words; no imageName/audioName field anymore.
          // Picture variant (v1) gets dual audio: sourceWord ("hop") + new word ("hope").
          image: isPicture ? (it.sourceWord + '.webp') : null,
          audio: it.sourceWord ? (it.sourceWord + '.mp3') : null,
          target_audio: (isPicture && it.answer) ? (it.answer + '.mp3') : null,
          input_type: 'handwrite'
        }))
      }
    };
  }

  // v2605.25: english_ladder — flat structure (one topic = one ladder)
  // A page typically has 2 topics (left + right ladders) under englishLetterTopicList.
  // Renderer expects {ladders: [{word_family, rungs: [{hint, answer, image}]}]}.
  function translateLadder(topics, ctx) {
    const ladderTopics = topics.filter((t) => t && t.topicType === 'english_ladder');
    if (ladderTopics.length === 0) {
      throw new Error('english_ladder: no ladder topics found');
    }
    return {
      kind: 'legacy',
      templateId: 'T-LADDER',
      variant: 'v1',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-LADDER',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 36,
        ladders: ladderTopics.map((t) => ({
          word_family: '-' + (t.rime || '') + ' family',
          rime: t.rime || '',
          rungs: (t.rungs || []).map((r) => {
            const isBlank = !r.word;  // partial picture无图阶
            return {
              hint: r.targetText || '',
              answer: r.word || '',
              image: isBlank ? null : (r.word + '.webp')
            };
          })
        }))
      }
    };
  }

  // english_fixup — error correction. K-8 ships flat camelCase
  // (incorrectSentence / correctSentence / errorWords[]); renderer-fixup expects
  // snake_case + structured errors[{incorrect, correct, type}].
  // renderer matches an error word via clean = word.replace(/[.,!?;:]/g,'').toLowerCase()
  // against errorMap keyed by err.incorrect.toLowerCase(), so err.incorrect MUST be
  // the punctuation-stripped, lowercased form (else "sat?" / "hop." never circle).
  // correct / type are tooltip-only: derived by index-aligning the two sentences
  // (K-8's pairs are equal-length, same-order), falling back to the raw word.
  function translateFixup(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.items)) {
      throw new Error('english_fixup topic missing items[]');
    }
    const STRIP = /[.,!?;:]/g;
    const norm = (s) => String(s).replace(STRIP, '').toLowerCase();
    return {
      kind: 'legacy',
      templateId: 'T-FIXUP',
      variant: 'v1',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-FIXUP',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        items: t.items.map((it) => {
          const incorrect = it.incorrectSentence || '';
          const correct   = it.correctSentence   || '';
          const incTok = incorrect.split(/\s+/).filter(Boolean);
          const corTok = correct.split(/\s+/).filter(Boolean);
          const aligned = incTok.length === corTok.length;
          const errors = (it.errorWords || []).map((ew) => {
            const key = norm(ew);                                    // matches renderer's errorMap[clean]
            const idx = incTok.findIndex((w) => norm(w) === key);
            const correctForm = (aligned && idx !== -1) ? corTok[idx] : String(ew);
            return { incorrect: key, correct: correctForm, type: classifyFixupError(ew, correctForm) };
          });
          return { incorrect_sentence: incorrect, errors, correct_sentence: correct, input_type: 'type' };
        })
      }
    };
  }

  // Tooltip-only error-type inference (cosmetic; does not affect rendering).
  function classifyFixupError(incorrectWord, correctWord) {
    const STRIP = /[.,!?;:]/g;
    const a = String(incorrectWord).replace(STRIP, '');
    const b = String(correctWord).replace(STRIP, '');
    if (a.toLowerCase() === b.toLowerCase()) return a !== b ? 'capitalization' : 'punctuation';
    return 'spelling';
  }

  // ---- v2606.04: new translators for remaining spec topicTypes ----

  function translatePassage(topics, ctx) {
    const t = topics[0];
    if (!t || !t.reading) {
      throw new Error('english_passage topic missing reading');
    }
    const r = t.reading;
    const isWriteAnswer = t.variant === 'write_answer';
    return {
      kind: 'legacy',
      templateId: 'T-PASSAGE',
      variant: isWriteAnswer ? 'v2' : 'v1',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-PASSAGE',
        variant: isWriteAnswer ? 'v2' : 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        passage: {
          title: r.title || '',
          text: r.passageText || '',
          image: Array.isArray(r.imageGroup) && r.imageGroup[0]
            ? r.imageGroup[0] + '.webp'
            : null
        },
        questions: (t.questions || []).map((q) => {
          const isChoice = q.answerMode === 'choice';
          const opts = isChoice && Array.isArray(q.options)
            ? q.options.map((o) => ({ text: String(o), correct: String(o) === String(q.answer) }))
            : null;
          return {
            question: q.prompt || '',
            response_type: isChoice ? 'circle' : 'type',
            options: opts,
            answer: q.answer || '',
            keywords: q.keywords || null
          };
        })
      }
    };
  }

  function translateCircleSentence(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.sentences)) {
      throw new Error('english_circle_sentence topic missing sentences');
    }
    const correct = new Set(t.correctIndexes || []);
    return {
      kind: 'legacy',
      templateId: 'T-CIRCLE',
      variant: 'v3',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-CIRCLE',
        variant: 'v3',
        grade: ctx.grade,
        instruction: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        select_mode: 'multi',
        target_word: t.mainIdea || '',
        options: t.sentences.map((s, i) => ({
          content: s,
          type: 'sentence',
          correct: correct.has(i)
        }))
      }
    };
  }

  function translateSentenceWordBank(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-SENTENCE',
      variant: 'v1',
      sourceTraces: topics.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SENTENCE',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        prompts: topics.map((t) => ({
          image: t.imageKey ? t.imageKey + '.webp' : null,
          instruction: t.prompt || '',
          word_bank: Array.isArray(t.wordBank) ? t.wordBank : [],
          expected_sentences: 1
        }))
      }
    };
  }

  function translatePictureSentence(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-SENTENCE',
      variant: 'v2',
      sourceTraces: topics.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SENTENCE',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        prompts: topics.map((t) => ({
          image: t.imageKey ? t.imageKey + '.webp' : null,
          instruction: t.prompt || '',
          expected_sentences: 2
        }))
      }
    };
  }

  function translateSortFactOpinion(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.cardGroups)) {
      throw new Error('sort_fact_opinion topic missing cardGroups');
    }
    return {
      kind: 'legacy',
      templateId: 'T-SORT',
      variant: 'v3',
      sourceTraces: null,
      data: {
        page_id: ctx.pageId,
        template_id: 'T-SORT',
        variant: 'v3',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        buckets: t.cardGroups.map((g, i) => ({
          label: g.category || ('Group ' + (i + 1)),
          id: 'b' + i
        })),
        cards: t.cardGroups.flatMap((g, i) =>
          (g.cards || []).map((c) => ({
            content: String(c),
            type: 'sentence',
            correct_bucket: 'b' + i
          }))
        )
      }
    };
  }

  function translateDictationSpelling(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-WRITE',
      variant: 'v3',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-WRITE',
        variant: 'v3',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => ({
          prompt_image: null,
          prompt_audio: (t.word || '') + '.mp3',
          hint: null,
          answer: t.answer || t.word || ''
        }))
      }
    };
  }

  function translateDefinitionSpelling(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-WRITE',
      variant: 'v4',
      sourceTraces: topics.map((t) => t.source_trace || null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-WRITE',
        variant: 'v4',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: topics.map((t) => ({
          prompt_image: null,
          prompt_audio: t.clueAudio ? t.clueAudio + '.mp3' : null,
          hint: t.clueText || null,
          answer: t.answer || t.word || ''
        }))
      }
    };
  }

  function translatePhonemeBlendAuditory(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.rows)) {
      throw new Error('phoneme_blend_auditory topic missing rows');
    }
    return {
      kind: 'legacy',
      templateId: 'T-BLEND',
      variant: 'v3',
      sourceTraces: t.rows.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-BLEND',
        variant: 'v3',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        items: t.rows.map((r) => {
          const ids = (Array.isArray(r.phoneme_ids) && r.phoneme_ids.length === (r.phonemes || []).length)
            ? r.phoneme_ids
            : (r.phonemes || []);
          return {
            phoneme_audios: ids.map((p) => 'phoneme:' + p + '.mp3'),
            phoneme_labels: (r.phonemes || []).map((p) => '/' + p + '/'),
            image: null,
            answer: r.answer || r.word
          };
        })
      }
    };
  }

  function translatePrefixSuffixAdd(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.rows)) {
      throw new Error('prefix_suffix_add topic missing rows');
    }
    const isPrefix = t.kind === 'prefix';
    return {
      kind: 'legacy',
      templateId: 'T-FILLIN',
      variant: 'v4',
      sourceTraces: t.rows.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-FILLIN',
        variant: 'v4',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 36,
        items: t.rows.map((r) => ({
          display: isPrefix ? ('_' + (r.root || '')) : ((r.root || '') + '_'),
          blank_position: isPrefix ? 0 : 1,
          blank_length: (r.answer || '').length || 1,
          answer: r.answer || '',
          hint: r.hint || null
        }))
      }
    };
  }

  function translateDictation(topics, ctx) {
    return {
      kind: 'legacy',
      templateId: 'T-DICTATION',
      variant: 'v1',
      sourceTraces: topics.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-DICTATION',
        variant: 'v1',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        items: topics.map((t) => ({
          audio: (t.audio || t.audioKey || '') + '.mp3',
          sentence: t.sentence || '',
          answer: t.answer || t.sentence || ''
        }))
      }
    };
  }

  const TOPIC_TRANSLATORS = {
    english_sound_box_full:                 translateSoundBoxFull,
    english_sound_box_digraph_full:         translateSoundBoxFull,         // K-3+ digraph variant — reuses Full translator (answer array allows digraph element per cell)
    english_sound_box_partial_fill:         translateSoundBoxPartialFill,
    english_sound_box_digraph_partial_fill: translateSoundBoxPartialFill,  // K-3+ digraph variant — reuses Partial translator (answer string allows digraph in one cell)
    english_picture_spelling:       translatePictureSpelling,
    english_initial_sound_spelling: translateInitialSoundSpelling,
    english_matching:               translateMatching,
    english_trace_word:             translateTraceWord,
    english_onset_rime_blend:       translateOnsetRimeBlend,
    english_phoneme_blend_picture:  translatePhonemeBlendPicture,
    english_word_bank_cloze:        translateWordBankCloze,
    english_find_word:              translateFindWord,
    english_circle_word:            translateCircleWord,
    english_circle_picture_rhyme:   translateCirclePictureRhyme,
    english_sort_words:             translateSortWords,
    english_sequence:               translateSequence,
    english_trace_letter:           translateTraceLetter,
    english_shadow_writing:         translateShadowWriting,
    // v2605.25: unified english_transform (displayType branch) + english_ladder (flat)
    english_transform:              translateTransform,
    english_ladder:                 translateLadder,
    english_fixup:                  translateFixup,
    // v2606.04: remaining spec topicTypes
    english_passage:                translatePassage,
    english_circle_sentence:        translateCircleSentence,
    english_sentence_word_bank:     translateSentenceWordBank,
    english_picture_sentence:       translatePictureSentence,
    english_sort_fact_opinion:      translateSortFactOpinion,
    english_dictation_spelling:     translateDictationSpelling,
    english_definition_spelling:    translateDefinitionSpelling,
    english_phoneme_blend_auditory: translatePhonemeBlendAuditory,
    english_prefix_suffix_add:      translatePrefixSuffixAdd,
    english_dictation:              translateDictation
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
    english_sound_box_digraph_full:
      () => ({ templateId: 'T-SOUNDBOX', variantNumber: 4, variantName: 'Sound Box - Digraph Full (2 Rows)' }),
    english_sound_box_partial_fill:
      () => ({ templateId: 'T-SOUNDBOX', variantNumber: 1, variantName: 'Sound Box - Partial Fill (4 Rows, 2x2)' }),
    english_sound_box_digraph_partial_fill:
      () => ({ templateId: 'T-SOUNDBOX', variantNumber: 3, variantName: 'Sound Box - Digraph Partial Fill (4 Rows, 2x2)' }),
    english_picture_spelling:
      () => ({ templateId: 'T-SPELL', variantNumber: 2, variantName: 'Picture Spelling (4 Cells)' }),
    english_initial_sound_spelling:
      () => ({ templateId: 'T-SPELL', variantNumber: 1, variantName: 'Initial Sound Spelling (4 Cells)' }),
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
    },
    english_trace_word: (topics) => {
      const g = (topics[0] && topics[0].guideMode) || 'All Guide';
      const SUB = {
        'All Guide':          { variantNumber: 8,  variantName: 'Shadow Writing - Word (4 Cells)' },
        'Guided to Freehand': { variantNumber: 9,  variantName: 'Guided to Freehand - Word (4 Cells)' },
        'Free':               { variantNumber: 10, variantName: 'Freehand Writing - Word (4 Cells)' }
      };
      const sub = SUB[g] || { variantNumber: null, variantName: '(unknown guideMode: ' + g + ')' };
      return Object.assign({ templateId: 'T-TRACE' }, sub);
    },
    english_onset_rime_blend:
      () => ({ templateId: 'T-BLEND', variantNumber: 1, variantName: 'Onset-Rime Blend (2 Rows)' }),
    english_phoneme_blend_picture:
      () => ({ templateId: 'T-BLEND', variantNumber: 2, variantName: 'Phoneme Blend - Picture Support (2 Rows)' }),
    english_word_bank_cloze:
      () => ({ templateId: 'T-FILLIN', variantNumber: 1, variantName: 'Word Bank Cloze (2 Rows)' }),
    english_find_word:
      () => ({ templateId: 'T-FINDWORD', variantNumber: null, variantName: 'Find Words in Grid' }),
    english_circle_word:
      () => ({ templateId: 'T-CIRCLE', variantNumber: 3, variantName: 'Circle the Word (6 or 8 Cards, Multi-Select)' }),
    english_circle_picture_rhyme:
      () => ({ templateId: 'T-CIRCLE', variantNumber: 5, variantName: 'Circle Picture by Rhyme (4 Cards, Single-Select)' }),
    english_sort_words: (topics) => {
      const display = topics[0] && topics[0].cardDisplay;
      return display === 'letter'
        ? { templateId: 'T-SORT', variantNumber: 2, variantName: 'Sort Words (2 Buckets, Letter Case)' }
        : { templateId: 'T-SORT', variantNumber: 2, variantName: 'Sort Words (2 Buckets, 6 Cards)' };
    },
    english_sequence: (topics) => {
      const display = topics[0] && topics[0].cardDisplay;
      return display === 'letter'
        ? { templateId: 'T-SEQUENCE', variantNumber: 2, variantName: 'ABC Order Sequencing (4 Cards, 4 Slots)' }
        : { templateId: 'T-SEQUENCE', variantNumber: 1, variantName: 'Story Pictures in Order (4 Cards, 4 Slots)' };
    },
    english_trace_letter: (topics) => {
      const letter = (topics[0] && topics[0].letter) || '';
      const isUpper = /^[A-Z]$/.test(letter);
      return isUpper
        ? { templateId: 'T-TRACE', variantNumber: 1, variantName: 'Letter Tracing - Uppercase (4 Cells)' }
        : { templateId: 'T-TRACE', variantNumber: 2, variantName: 'Letter Tracing - Lowercase (4 Cells)' };
    },
    english_shadow_writing: (topics) => {
      const t = topics[0] || {};
      const letter = t.letter || '';
      const hint = t.showHint !== false; // default true
      const isMixed = letter.length > 1; // "Aa", "Ff" etc.
      const isUpper = /^[A-Z]$/.test(letter);
      if (isMixed) {
        return { templateId: 'T-TRACE', variantNumber: 5, variantName: 'Guided to Freehand - Mixed Case (10 Cells)' };
      }
      if (!hint && isUpper) {
        return { templateId: 'T-TRACE', variantNumber: 6, variantName: 'Freehand Writing - Uppercase (10 Cells)' };
      }
      if (!hint) {
        return { templateId: 'T-TRACE', variantNumber: 7, variantName: 'Freehand Writing - Lowercase (10 Cells)' };
      }
      return isUpper
        ? { templateId: 'T-TRACE', variantNumber: 3, variantName: 'Shadow Writing - Uppercase (10 Cells)' }
        : { templateId: 'T-TRACE', variantNumber: 4, variantName: 'Shadow Writing - Lowercase (10 Cells)' };
    },
    // v2605.25: unified english_transform with displayType, and english_ladder
    english_transform: (topics) => {
      const dt = topics[0] && topics[0].displayType;
      return dt === 'text'
        ? { templateId: 'T-TRANSFORM', variantNumber: 2, variantName: 'Word Transformation - Text Only (4 Cells, 2×2)' }
        : { templateId: 'T-TRANSFORM', variantNumber: 1, variantName: 'Word Transformation - With Picture (4 Cells, 2×2)' };
    },
    english_ladder: (topics) => {
      // Partial picture detected by any rung having empty word
      const hasBlank = topics.some((t) => (t.rungs || []).some((r) => !r.word));
      return hasBlank
        ? { templateId: 'T-LADDER', variantNumber: 2, variantName: 'Word Family Ladder - Partial Picture Support (2 Ladders, 3 Rungs Each)' }
        : { templateId: 'T-LADDER', variantNumber: 1, variantName: 'Word Family Ladder - Full Picture Support (2 Ladders, 3 Rungs Each)' };
    },
    english_fixup:
      () => ({ templateId: 'T-FIXUP', variantNumber: 1, variantName: 'Fix the Mistakes - Capitalization & Punctuation' }),
    // v2606.04: remaining spec topicTypes
    english_passage: (topics) => {
      const v = topics[0] && topics[0].variant;
      return v === 'write_answer'
        ? { templateId: 'T-PASSAGE', variantNumber: 2, variantName: 'Reading Comprehension - Write the Answer (3 Questions)' }
        : { templateId: 'T-PASSAGE', variantNumber: 1, variantName: 'Reading Comprehension - Multiple Choice (3 Questions)' };
    },
    english_circle_sentence:
      () => ({ templateId: 'T-CIRCLE', variantNumber: 4, variantName: 'Circle Sentences by Main Idea (6 Cards, Multi-Select)' }),
    english_sentence_word_bank:
      () => ({ templateId: 'T-SENTENCE', variantNumber: 1, variantName: 'Sentence with Word Bank (x2, 1 Sentence per Item)' }),
    english_picture_sentence:
      () => ({ templateId: 'T-SENTENCE', variantNumber: 2, variantName: 'Picture Sentence Writing (x2, 2 Sentences per Item)' }),
    english_sort_fact_opinion:
      () => ({ templateId: 'T-SORT', variantNumber: 3, variantName: 'Sort Fact vs Opinion (2 Buckets, 4 Cards)' }),
    english_dictation_spelling:
      () => ({ templateId: 'T-SPELL', variantNumber: 3, variantName: 'Dictation Spelling (4 Cells)' }),
    english_definition_spelling:
      () => ({ templateId: 'T-SPELL', variantNumber: 4, variantName: 'Definition Spelling (2 Cells)' }),
    english_phoneme_blend_auditory:
      () => ({ templateId: 'T-BLEND', variantNumber: 3, variantName: 'Phoneme Blend - Auditory Only (2 Rows)' }),
    english_prefix_suffix_add:
      () => ({ templateId: 'T-FILLIN', variantNumber: 2, variantName: 'Prefix / Suffix Add (4 Rows)' }),
    english_dictation:
      () => ({ templateId: 'T-DICTATION', variantNumber: 1, variantName: 'Listen and Type Sentence (x3)' })
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

    // instructionText resolution order: page-level → topic-level → topicType default → instructionId → fallback
    const TOPIC_DEFAULT_INSTR = {
      english_trace_word: 'Trace each word along the guide lines.',
      english_sound_box_full: 'Listen to the word. Write each sound in a box.',
      english_sound_box_digraph_full: 'Listen to the word. Write each sound in a box.',
      english_sound_box_partial_fill: 'Listen to the word. Fill in the missing sound.',
      english_sound_box_digraph_partial_fill: 'Listen to the word. Fill in the missing sounds.',
      english_picture_spelling: 'Look at the picture. Write the word.',
      english_initial_sound_spelling: 'Look at the picture. Listen to the word. Write the first letter.',
      english_circle_picture: 'Listen to the word. Circle the picture.',
      english_circle_picture_rhyme: 'Find a word that rhymes with the target. Circle the picture.',
      english_matching: 'Listen to the word. Draw a line to match.',
      english_onset_rime_blend: 'Tap each sound. Blend them together. Write the word.',
      english_phoneme_blend_picture: 'Listen to each sound. Blend and write the word.',
      english_word_bank_cloze: 'Pick a word from the word bank. Write it in the blank.',
      english_find_word: 'Find and circle each word in the grid.',
      english_circle_word: 'Circle the target word every time you see it.',
      english_sort_words: 'Sort the cards into the right group.',
      english_sequence: 'Put the cards in the correct order.',
      english_trace_letter: 'Trace the letter. Say its sound.',
      english_shadow_writing: 'Trace each letter along the shadow.',
      english_transform: 'Add a silent e. Write the new word!',
      english_ladder: 'Climb the ladder! Change the first letter to make new words.',
      english_fixup: 'Circle the mistakes. Then write the correct sentence.',
      english_passage: 'Read the story. Answer the questions.',
      english_circle_sentence: 'Circle ALL the sentences that tell about the main idea.',
      english_sentence_word_bank: 'Use the words to write a sentence about the picture.',
      english_picture_sentence: 'Look at each picture. Write two sentences about it.',
      english_sort_fact_opinion: 'Is it a fact or an opinion? Sort each sentence.',
      english_dictation_spelling: 'Listen to the word. Write it.',
      english_definition_spelling: 'Read the clue. Write the word.',
      english_phoneme_blend_auditory: 'Listen to all the sounds. Blend and write the word.',
      english_prefix_suffix_add: 'Add the correct prefix or suffix.',
      english_dictation: 'Listen to the sentence. Type it exactly as you hear it.'
    };
    const pageInstr = page && page.instructionText;
    const topicInstr = topics[0] && topics[0].instructionText;
    const topicTypeForDefault = topics[0] && topics[0].topicType;
    const defaultInstr = TOPIC_DEFAULT_INSTR[topicTypeForDefault];
    const instructionTextRaw = pageInstr || topicInstr;
    const instructionText = instructionTextRaw || defaultInstr || (page && page.instructionId) || '(no instruction)';
    const instructionFallback = !instructionTextRaw && !defaultInstr && !!(page && page.instructionId);

    // Instruction audio convention (aligned with Bitable Resource Library tblMfdbfq0TdRwjL):
    //   page.instructionKey → audio/instruction/<instructionKey>.mp3
    // We pass just "<key>.mp3" to the renderer (renderer puts it in title=); the
    // fallback layer below resolves the full /assets/audio/instruction/ URL.
    // If neither page nor topic carries instructionKey, no audio button is emitted.
    const instructionKey = (page && page.instructionKey)
                        || (topics[0] && topics[0].instructionKey)
                        || null;
    const instructionAudio = instructionKey ? instructionKey + '.mp3' : null;

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
          correct: t.correctWords || (t.correctAnswer ? [t.correctAnswer] : []),
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
    const meta = translated.templateMeta || {};
    const tplLabel = meta.templateId
      ? '<code>' + escapeHtml(meta.templateId) + '</code>'
        + (meta.variantName ? ' › ' + escapeHtml(meta.variantName) : '')
      : '(unknown)';
    const reason = translated.reason || translated.error || '(unknown)';
    const topicType = (translated.rawPage
      && translated.rawPage.englishLetterTopicList
      && translated.rawPage.englishLetterTopicList[0]
      && translated.rawPage.englishLetterTopicList[0].topicType) || null;
    const hintLine = topicType
      ? 'Add a translator in <code>data/bitable-mode.js</code> mapping <code>'
        + escapeHtml(topicType) + '</code> → an existing renderer.'
      : reason;

    const div = document.createElement('div');
    div.className = 'ws-bitable-error';
    div.innerHTML =
      '<div class="ws-bitable-error-head"><strong>Not yet rendered</strong> · ' + tplLabel + '</div>' +
      '<p class="hint">' + hintLine + '</p>' +
      '<details><summary>Show raw JSON</summary>' +
      '<pre>' + escapeHtml(JSON.stringify(translated.rawPage || translated, null, 2)) + '</pre>' +
      '</details>';
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
    // Image placeholders → swap to real <img> using resolveImageUrl, else enhance with warning.
    container.querySelectorAll('.ws-image-placeholder').forEach((ph) => {
      const span = ph.querySelector('span');
      const filename = span ? span.textContent.trim() : '';
      const m = filename.match(/^([^.\s]+)\.(webp|png|jpg|jpeg)$/i);
      if (!m) return;
      const word = m[1];
      const ext  = m[2].toLowerCase();
      const url  = resolveImageUrl(word, ext);
      if (url) {
        replaceWithRealImg(ph, word, url);
      } else {
        enhanceMissingPlaceholder(ph, word, filename);
      }
    });

    // Audio + phoneme buttons → resolveAudioUrl handles all categories in one pass.
    // T-BLEND uses R.phonemeButton (class .ws-phoneme-btn); everything else uses
    // R.audioButton (class .ws-audio-btn). Both put filename in `title=Audio: …`.
    // Optional category prefix in filename ("letter:a.mp3" / "rime:at.mp3" / "phoneme:onset_k.mp3")
    // becomes the resolver hint so same-token files in multiple categories
    // (e.g. word/at.mp3 vs rime/at.mp3) resolve to the right semantic.
    container.querySelectorAll('.ws-audio-btn, .ws-phoneme-btn').forEach((btn) => {
      if (btn.dataset.audioSequence) return;  // sequence buttons handled by wireSequencePlayback
      const title = btn.getAttribute('title') || '';
      const m = title.match(/Audio:\s*(?:(letter|rime|phoneme|word|instruction):)?([^.\s:]+)\.(mp3|wav|m4a)$/i);
      if (!m) return;
      const hint = m[1] || null;
      const name = m[2];
      const ext  = m[3].toLowerCase();
      const url  = resolveAudioUrl(name, ext, hint);
      if (url) {
        btn.dataset.audioSrc = url;
        wireAudioPlayback(btn);
      } else {
        btn.disabled = true;
        btn.classList.add('ws-bitable-audio-missing');
        const inInstruction = !!btn.closest('.ws-instruction');
        btn.title = '⚠ Missing audio: ' + name + '.' + ext + (inInstruction ? ' (instruction TTS)' : '');
      }
    });

    // Sequence buttons (T-SPELL initial_sound_spelling) — resolve each token then
    // play them back-to-back with a short gap on click.
    container.querySelectorAll('.ws-audio-btn[data-audio-sequence]').forEach((btn) => {
      const tokens = parseSequence(btn.dataset.audioSequence);
      const urls = tokens.map((tok) => {
        const m = tok.match(/^(?:(letter|rime|phoneme|word|instruction):)?([^.\s:]+)\.(mp3|wav|m4a)$/i);
        if (!m) return null;
        return resolveAudioUrl(m[2], m[3].toLowerCase(), m[1] || null);
      }).filter(Boolean);
      if (urls.length === 0) {
        btn.disabled = true;
        btn.classList.add('ws-bitable-audio-missing');
        btn.title = '⚠ Missing audio sequence: ' + btn.dataset.audioSequence;
        return;
      }
      btn.dataset.audioSrcSequence = JSON.stringify(urls);
      wireSequencePlayback(btn);
    });
  }

  function parseSequence(raw) {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function replaceWithRealImg(placeholderEl, word, url) {
    const img = document.createElement('img');
    img.src = url;
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
    img.onerror = () => {
      const fallbackName = url.split('/').pop() || word + '.webp';
      enhanceMissingPlaceholder(placeholderEl, word, fallbackName);
    };
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

  // Sequential playback for T-SPELL: play urls[0] → 200ms gap → urls[1] → ...
  function wireSequencePlayback(btn) {
    if (btn._wired) return;
    btn._wired = true;
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      let urls;
      try { urls = JSON.parse(btn.dataset.audioSrcSequence || '[]'); } catch (_) { return; }
      if (!Array.isArray(urls) || urls.length === 0) return;
      for (let i = 0; i < urls.length; i++) {
        await playOnce(urls[i]);
        if (i < urls.length - 1) await sleep(200);
      }
    });
  }

  function playOnce(src) {
    return new Promise((resolve) => {
      const audio = new Audio(src);
      audio.addEventListener('ended', resolve, { once: true });
      audio.addEventListener('error', resolve, { once: true });
      audio.play().catch((err) => {
        console.warn('audio play failed', src, err);
        resolve();
      });
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ============ Expose ============
  window.JOJO_BITABLE = {
    loadAssetManifest,
    translatePage,
    renderPage,
    _state: State
  };
})();
