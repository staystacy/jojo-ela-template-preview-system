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

  // Resolve an audio filename into a real URL.
  // Lookup order: phoneme (semantic ID like onset_k, short_a, digraph_sh)
  //               → word → rime → instruction → letter (uppercase letter name).
  // Phoneme is checked first so that pages passing semantic phoneme IDs
  // (e.g. "onset_k.mp3") don't fall through to letter-name audio.
  function resolveAudioUrl(name, ext) {
    const M = State.assetManifest;
    ext = ext || 'mp3';
    if (M.phonemes && M.phonemes[name] && M.phonemes[name].audio) {
      return '/assets/audio/phoneme/' + name + '.' + ext;
    }
    if (M.words && M.words[name] && M.words[name].audio) {
      return '/assets/audio/word/' + name + '.' + ext;
    }
    if (M.rimes && M.rimes[name] && M.rimes[name].audio) {
      return '/assets/audio/rime/' + name + '.' + ext;
    }
    if (M.instructions && M.instructions[name] && M.instructions[name].audio) {
      return '/assets/audio/instruction/' + name + '.' + ext;
    }
    const upper = String(name).toUpperCase();
    if (M.letters && M.letters[upper] && M.letters[upper].audio) {
      return '/assets/audio/letter/' + upper + '.' + ext;
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

  function translateTraceWord(topics, ctx) {
    const t = topics[0];
    if (!t || !Array.isArray(t.wordsList)) {
      throw new Error('trace_word topic missing wordsList');
    }
    const words = t.wordsList;
    const SCAFFOLD_BY_GUIDE = {
      'All Guide':          ['trace', 'trace', 'trace', 'trace'],
      'Guided to Freehand': ['trace', 'trace', 'faded', 'faded'],
      'Free':               ['blank', 'blank', 'blank', 'blank']
    };
    const guide = t.guideMode || 'All Guide';
    const scaffolds = SCAFFOLD_BY_GUIDE[guide] || words.map(() => 'trace');
    const first = words[0] || {};
    return {
      kind: 'legacy',
      templateId: 'T-TRACE',
      variant: 'v2',
      sourceTraces: words.map(() => null),
      data: {
        page_id: ctx.pageId,
        template_id: 'T-TRACE',
        variant: 'v2',
        grade: ctx.grade,
        instruction_text: ctx.instructionText,
        instruction_audio: ctx.instructionAudio,
        cell_size: 48,
        demo_area: {
          content: first.word || '',
          animation: 'stroke_order',
          audio: first.audioName ? first.audioName + '.mp3' : null,
          image: first.imageName ? first.imageName + '.webp' : null
        },
        cells: words.map((w, i) => ({
          scaffold: scaffolds[i] || 'trace',
          content: w.word
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
        // Audio: prefer semantic IDs (onset_k.mp3, at.mp3) over graphemes (c.mp3, at.mp3).
        // Falling back to grapheme makes the resolver pick letter-name audio (C = "see"),
        // not the phoneme /k/, so always use *_id when JSON provides it.
        items: rows.map((r) => ({
          phoneme_audios: [
            (r.onset_phoneme_id || r.onset) + '.mp3',
            (r.rime_id          || r.rime ) + '.mp3'
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
        // graphemes ("h.mp3" → letter-name audio "aitch"). Falls back to grapheme if
        // the page predates phoneme_ids generation.
        items: rows.map((r) => {
          const ids = (Array.isArray(r.phoneme_ids) && r.phoneme_ids.length === (r.phonemes || []).length)
            ? r.phoneme_ids
            : (r.phonemes || []);
          return {
            phoneme_audios: ids.map((p) => p + '.mp3'),
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
          audio: letter.toLowerCase() + '.mp3',
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
          audio: letter.toLowerCase() + '.mp3',
          image: null,
          word: (t.wordList && t.wordList[0]) || null
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
          // v2605.25: image / audio key derived from words; no imageName/audioName field anymore
          image: isPicture ? (it.sourceWord + '.webp') : null,
          audio: it.sourceWord ? (it.sourceWord + '.mp3') : null,
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

  const TOPIC_TRANSLATORS = {
    english_sound_box_full:         translateSoundBoxFull,
    english_sound_box_partial_fill: translateSoundBoxPartialFill,
    english_picture_spelling:       translatePictureSpelling,
    english_matching:               translateMatching,
    english_trace_word:             translateTraceWord,
    english_onset_rime_blend:       translateOnsetRimeBlend,
    english_phoneme_blend_picture:  translatePhonemeBlendPicture,
    english_word_bank_cloze:        translateWordBankCloze,
    english_find_word:              translateFindWord,
    english_circle_word:            translateCircleWord,
    english_sort_words:             translateSortWords,
    english_sequence:               translateSequence,
    english_trace_letter:           translateTraceLetter,
    english_shadow_writing:         translateShadowWriting,
    // v2605.25: unified english_transform (displayType branch) + english_ladder (flat)
    english_transform:              translateTransform,
    english_ladder:                 translateLadder
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
      const letter = (topics[0] && topics[0].letter) || '';
      const isUpper = /^[A-Z]$/.test(letter);
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

    // instructionText resolution order: page-level → topic-level → topicType default → instructionId → fallback
    const TOPIC_DEFAULT_INSTR = {
      english_trace_word: 'Trace each word along the guide lines.',
      english_sound_box_full: 'Listen to the word. Write each sound in a box.',
      english_sound_box_partial_fill: 'Listen to the word. Fill in the missing sound.',
      english_picture_spelling: 'Look at the picture. Write the word.',
      english_circle_picture: 'Listen to the word. Circle the picture.',
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
      english_ladder: 'Climb the ladder! Change the first letter to make new words.'
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
    container.querySelectorAll('.ws-audio-btn, .ws-phoneme-btn').forEach((btn) => {
      const title = btn.getAttribute('title') || '';
      const m = title.match(/Audio:\s*([^.\s]+)\.(mp3|wav|m4a)$/i);
      if (!m) return;
      const name = m[1];
      const ext  = m[2].toLowerCase();
      const url  = resolveAudioUrl(name, ext);
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

  // ============ Expose ============
  window.JOJO_BITABLE = {
    loadAssetManifest,
    translatePage,
    renderPage,
    _state: State
  };
})();
