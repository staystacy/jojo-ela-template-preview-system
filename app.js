/* JOJO ELA Template Preview v2 — App Shell */

(function () {
  'use strict';

  // ========== State ==========
  var state = {
    templateId: null,
    variant: null,
    grade: null,
    annotationsOn: false,
    mode: 'demo',
    bitable: {
      workbook: null,
      workbooks: [],
      workbookTitles: {},
      _allUnits: [],
      _allCourses: [],
      _activeSource: 'curriculum',
      unitCode: null,
      unitData: null,
      pageIndex: 0,
      jsonMode: 'raw',
      lastTranslated: null
    }
  };

  // ========== Interaction Guide Data ==========
  var INTERACTION_GUIDES = {
    'T-TRACE': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Trace letters/words along guide lines' }
      ],
      flow: 'Watch demo area \u2192 Tap \uD83D\uDD0A to hear pronunciation \u2192 Trace along dotted lines \u2192 Progress from guided to independent writing',
      workbooks: 'PK-1, K-5, G1-4',
      itemCount: '6\u20138 cells per page',
      estimatedTime: '2\u20133 minutes'
    },
    'T-WRITE': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Write letters or words in cells' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to word pronunciation' }
      ],
      flow: 'See picture / hear sound \u2192 Identify the word \u2192 Write the letter or word in the blank cells',
      workbooks: 'PK-1, K-2, K-9, G1-4',
      itemCount: '5\u20136 items per page',
      estimatedTime: '2\u20133 minutes'
    },
    'T-SOUNDBOX': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Fill in phoneme letters' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to full word' }
      ],
      flow: 'See picture \u2192 Tap \uD83D\uDD0A to hear full word \u2192 Segment each sound \u2192 Write one letter per box',
      workbooks: 'K-2, K-9, G1-2',
      itemCount: '5\u20136 items per page',
      estimatedTime: '3\u20134 minutes'
    },
    'T-BLEND': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Write the blended word' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to each phoneme' }
      ],
      flow: 'Tap each phoneme button to hear sounds \u2192 Blend sounds together \u2192 Write the complete word',
      workbooks: 'PK-1, K-2, G1-2',
      itemCount: '4\u20136 items per page',
      estimatedTime: '3\u20134 minutes'
    },
    'T-CIRCLE': {
      actions: [
        { icon: '\u2B55', label: 'Circle: Draw a circle around the correct answer' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to instruction (optional)' }
      ],
      flow: 'Read/hear the instruction \u2192 Look at all options \u2192 Circle the correct answer with Apple Pencil',
      workbooks: 'PK-1, K-2, K-5, G1-4, G2-3',
      itemCount: '4\u20138 options per page',
      estimatedTime: '1\u20132 minutes'
    },
    'T-MATCH': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Draw lines: Connect matching pairs' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to items (optional)' }
      ],
      flow: 'Read left column items \u2192 Find matching item in right column \u2192 Draw a line to connect the pair',
      workbooks: 'PK-1, K-2, K-5, G1-4',
      itemCount: '3\u20135 pairs per page',
      estimatedTime: '2\u20133 minutes'
    },
    'T-SORT': {
      actions: [
        { icon: '\uD83D\uDC46', label: 'Drag: Move cards into the correct category' }
      ],
      flow: 'Read category labels on buckets \u2192 Look at each card \u2192 Drag card to the correct bucket',
      workbooks: 'K-2, G1-2, G2-3',
      itemCount: '6\u20138 cards, 2\u20133 buckets',
      estimatedTime: '2\u20133 minutes'
    },
    'T-FILLIN': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Fill in missing letters or words' }
      ],
      flow: 'See picture / read sentence \u2192 Identify missing part \u2192 Write the answer in the blank',
      workbooks: 'K-2, K-9, G1-4, G2-3',
      itemCount: '5\u20136 items per page',
      estimatedTime: '2\u20133 minutes'
    },
    'T-LISTEN': {
      actions: [
        { icon: '\u2B55', label: 'Circle: Select the correct picture/word' },
        { icon: '\u270F\uFE0F', label: 'Handwrite: Write what you hear' },
        { icon: '\uD83D\uDD0A', label: 'Audio: Listen to the sound/word/sentence' }
      ],
      flow: 'Tap \uD83D\uDD0A to hear audio \u2192 Circle the correct picture OR write the word you heard',
      workbooks: 'PK-1, K-2, K-9, G1-2',
      itemCount: '4\u20136 items per page',
      estimatedTime: '2\u20133 minutes'
    },
    'T-FINDWORD': {
      actions: [
        { icon: '\u2B55', label: 'Circle: Find and circle all target words in the grid' }
      ],
      flow: 'Read the target word at top \u2192 Scan the letter grid \u2192 Circle every occurrence of the target word',
      workbooks: 'K-9, G1-2, G2-3',
      itemCount: '1\u20133 target words, 5\u00d75 or 6\u00d76 grid',
      estimatedTime: '3\u20134 minutes'
    },
    'T-LADDER': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite: Build new words by changing first letter' }
      ],
      flow: 'Read the word family root \u2192 Look at the hint letter \u2192 Write the new word \u2192 Climb the ladder step by step',
      workbooks: 'K-9, G1-2',
      itemCount: '2 ladders, 4\u20135 rungs each',
      estimatedTime: '3\u20134 minutes'
    },
    'T-PASSAGE': {
      actions: [
        { icon: '\u2B55', label: 'Circle: Choose correct answer' },
        { icon: '\u2328\uFE0F', label: 'Type: Write answers to questions' }
      ],
      flow: 'Read the passage on the left \u2192 Answer questions on the right (circle or type)',
      workbooks: 'K-9, G1-4, G2-3, G3-2',
      itemCount: '1 passage + 3\u20135 questions',
      estimatedTime: '4\u20136 minutes'
    },
    'T-SEQUENCE': {
      actions: [
        { icon: '\uD83D\uDC46', label: 'Drag: Arrange items in the correct order' }
      ],
      flow: 'Look at the scrambled cards \u2192 Determine correct order \u2192 Drag each card to the numbered slot',
      workbooks: 'PK-1, K-2, G1-4, G2-3',
      itemCount: '3\u20135 items to order',
      estimatedTime: '2\u20133 minutes'
    },
    'T-SENTENCE': {
      actions: [
        { icon: '\u2328\uFE0F', label: 'Type: Write complete sentences' }
      ],
      flow: 'Look at the picture / read the prompt / use word bank \u2192 Type a complete sentence',
      workbooks: 'K-9, G1-4, G2-3, G3-2',
      itemCount: '1\u20133 prompts per page',
      estimatedTime: '3\u20135 minutes'
    },
    'T-FIXUP': {
      actions: [
        { icon: '\u2B55', label: 'Circle: Mark errors in the sentence' },
        { icon: '\u2328\uFE0F', label: 'Type: Rewrite the corrected sentence' }
      ],
      flow: 'Read the incorrect sentence \u2192 Find the error(s) \u2192 Type the corrected version below',
      workbooks: 'G1-4, G2-3, G3-2',
      itemCount: '3\u20134 sentences per page',
      estimatedTime: '3\u20135 minutes'
    },
    'T-TRANSFORM': {
      actions: [
        { icon: '\u270F\uFE0F', label: 'Handwrite or Type: Apply the transformation rule' }
      ],
      flow: 'Read the original word/sentence \u2192 Apply the given rule \u2192 Write or type the transformed version',
      workbooks: 'G1-4, G2-3, G3-2',
      itemCount: '5\u20136 items per page',
      estimatedTime: '3\u20134 minutes'
    }
  };

  // ========== DOM References ==========
  var templateListEl = document.getElementById('template-list');
  var worksheetEl = document.getElementById('worksheet');
  var variantBtnsEl = document.getElementById('variant-buttons');
  var gradeBtnsEl = document.getElementById('grade-buttons');
  var annotationCb = document.getElementById('annotation-checkbox');
  var guideContainerEl = document.getElementById('interaction-guide-container');
  var jsonToggleBtn = document.getElementById('json-toggle');
  var jsonToggleIcon = jsonToggleBtn.querySelector('.json-toggle-icon');
  var jsonContentEl = document.getElementById('json-content');
  var jsonCodeEl = document.getElementById('json-code');
  // Bitable mode refs
  var modeRadios = document.querySelectorAll('input[name="mode"]');
  var bitableControlsEl = document.getElementById('bitable-controls');
  var bitablePageHeaderEl = document.getElementById('bitable-page-header');
  var controlsEl = document.getElementById('controls');
  var btWorkbookSel = document.getElementById('bt-workbook');
  var btUnitSel = document.getElementById('bt-unit');
  var btPrevBtn = document.getElementById('bt-prev');
  var btNextBtn = document.getElementById('bt-next');
  var btPageLabel = document.getElementById('bt-page-label');
  var btStatusEl = document.getElementById('bt-status');
  var btPhUnit = document.getElementById('bt-ph-unit');
  var btPhPage = document.getElementById('bt-ph-page');
  var btPhTotal = document.getElementById('bt-ph-total');
  var btPhStatus = document.getElementById('bt-ph-status');
  var btPhStatusWrap = document.getElementById('bt-ph-status-wrap');
  var btPhRecordLink = document.getElementById('bt-ph-record-link');
  var btPhTemplateId = document.getElementById('bt-ph-template-id');
  var btPhVariantName = document.getElementById('bt-ph-variant-name');
  var btPhSubtitle = document.getElementById('bt-ph-subtitle');
  var btPhSubtitleWrap = document.getElementById('bt-ph-subtitle-wrap');
  var btSourceTabs = document.querySelectorAll('#bt-source-tabs .bt-tab');
  var btUnitLabel = document.getElementById('bt-unit-label');
  var btSourceBadge = document.getElementById('bt-ph-source-badge');
  var btPhOverall = document.getElementById('bt-ph-overall');
  var btPhOverallTotal = document.getElementById('bt-ph-overall-total');
  var btPhOverallWrap = document.getElementById('bt-ph-overall-wrap');
  var btPhFilename = document.getElementById('bt-ph-filename');
  var demoSidebarBlock = document.getElementById('demo-sidebar-block');
  var jsonModeToggleEl = document.getElementById('json-mode-toggle');
  var COURSE_TITLES = {
    'B1': 'Phonics Inflections',
    'B2': 'Grammar Foundations',
    'B3': 'Reading Fluency',
    'C1': 'Advanced Phonics',
    'C2': 'Comprehension',
    'D1': 'Writing Skills',
    'D2': 'Language Arts Review'
  };
  var assetManifestLoaded = false;

  // ========== Init ==========
  function init() {
    buildSidebar();
    bindEvents();
    initBitableMode();
    bindBitableSelectors();
    restoreFromHash();
  }

  function bindBitableSelectors() {
    btWorkbookSel.addEventListener('change', function () {
      var wb = btWorkbookSel.value;
      if (!wb) return;
      state.bitable.workbook = wb;
      populateUnitSelector();
    });
    btSourceTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var src = tab.dataset.source;
        setSourceTab(src);
        var books = src === 'curriculum' ? state.bitable._allCourses : state.bitable.workbooks;
        state.bitable.workbook = books[0] || null;
        populateBookSelector(src);
        if (state.bitable.workbook) {
          btWorkbookSel.value = state.bitable.workbook;
          populateUnitSelector();
        }
      });
    });
  }

  function setSourceTab(source) {
    btSourceTabs.forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.source === source);
    });
    state.bitable._activeSource = source;
    btUnitLabel.textContent = source === 'curriculum' ? 'Station' : 'Unit';
  }

  function populateBookSelector(source) {
    btWorkbookSel.innerHTML = '';
    var books = source === 'curriculum' ? state.bitable._allCourses : state.bitable.workbooks;
    books.forEach(function (bk) {
      var opt = document.createElement('option');
      opt.value = bk;
      if (source === 'curriculum') {
        var ct = COURSE_TITLES[bk];
        opt.textContent = ct ? (bk + ' — ' + ct) : bk;
      } else {
        var meta = state.bitable.workbookTitles[bk];
        opt.textContent = meta && meta.title ? (bk + ' — ' + meta.title) : bk;
      }
      btWorkbookSel.appendChild(opt);
    });
  }

  // ========== Sidebar ==========
  function buildSidebar() {
    var templates = window.JOJO_TEMPLATES || [];
    templates.forEach(function (tmpl) {
      var item = document.createElement('div');
      item.className = 'template-item';
      item.dataset.id = tmpl.id;

      var header = document.createElement('div');
      header.className = 'template-item-header';

      var idSpan = document.createElement('span');
      idSpan.className = 'template-id';
      idSpan.textContent = tmpl.id;

      var nameSpan = document.createElement('span');
      nameSpan.className = 'template-name';
      nameSpan.textContent = tmpl.name;

      header.appendChild(idSpan);
      header.appendChild(nameSpan);

      var grades = document.createElement('div');
      grades.className = 'template-grades';
      tmpl.grades.forEach(function (g) {
        var tag = document.createElement('span');
        tag.className = 'grade-tag grade-tag-' + g;
        tag.textContent = g;
        grades.appendChild(tag);
      });

      item.appendChild(header);
      item.appendChild(grades);
      templateListEl.appendChild(item);

      item.addEventListener('click', function () {
        selectTemplate(tmpl.id);
      });
    });
  }

  // ========== Template Selection ==========
  function selectTemplate(templateId) {
    var tmpl = findTemplate(templateId);
    if (!tmpl) return;

    state.templateId = templateId;
    state.variant = tmpl.variants[0];
    state.grade = getDefaultGrade(tmpl);

    updateSidebarHighlight();
    buildVariantButtons(tmpl);
    buildGradeButtons(tmpl);
    render();
    updateHash();
  }

  function findTemplate(id) {
    return (window.JOJO_TEMPLATES || []).find(function (t) { return t.id === id; });
  }

  function getDefaultGrade(tmpl) {
    // Pick the first grade that has data for the default variant
    var data = (window.JOJO_DATA || {})[tmpl.id];
    if (data && data[tmpl.variants[0]]) {
      var grades = Object.keys(data[tmpl.variants[0]]);
      if (grades.length > 0) return grades[0];
    }
    return tmpl.grades[0];
  }

  function updateSidebarHighlight() {
    var items = templateListEl.querySelectorAll('.template-item');
    items.forEach(function (el) {
      el.classList.toggle('active', el.dataset.id === state.templateId);
    });
  }

  // ========== Variant Buttons ==========
  function buildVariantButtons(tmpl) {
    variantBtnsEl.innerHTML = '';
    tmpl.variants.forEach(function (v) {
      var btn = document.createElement('button');
      btn.className = 'ctrl-btn';
      btn.textContent = v;
      btn.classList.toggle('active', v === state.variant);

      // Check if data exists for this variant
      var data = (window.JOJO_DATA || {})[tmpl.id];
      var hasData = data && data[v] && Object.keys(data[v]).length > 0;
      btn.disabled = !hasData;

      btn.addEventListener('click', function () {
        state.variant = v;
        // Reset grade to first available for this variant
        if (data && data[v]) {
          var availGrades = Object.keys(data[v]);
          if (availGrades.indexOf(state.grade) === -1 && availGrades.length > 0) {
            state.grade = availGrades[0];
          }
        }
        updateVariantHighlight();
        buildGradeButtons(tmpl);
        render();
        updateHash();
      });
      variantBtnsEl.appendChild(btn);
    });
  }

  function updateVariantHighlight() {
    var btns = variantBtnsEl.querySelectorAll('.ctrl-btn');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.textContent === state.variant);
    });
  }

  // ========== Grade Buttons ==========
  function buildGradeButtons(tmpl) {
    gradeBtnsEl.innerHTML = '';
    var allGrades = ['PreK', 'K', 'G1', 'G2', 'G3'];
    var data = (window.JOJO_DATA || {})[tmpl.id];
    var variantData = data && data[state.variant];

    allGrades.forEach(function (g) {
      if (tmpl.grades.indexOf(g) === -1) return;
      var btn = document.createElement('button');
      btn.className = 'ctrl-btn';
      btn.textContent = g;
      btn.classList.toggle('active', g === state.grade);

      var hasData = variantData && variantData[g];
      btn.disabled = !hasData;

      btn.addEventListener('click', function () {
        state.grade = g;
        updateGradeHighlight();
        render();
        updateHash();
      });
      gradeBtnsEl.appendChild(btn);
    });
  }

  function updateGradeHighlight() {
    var btns = gradeBtnsEl.querySelectorAll('.ctrl-btn');
    btns.forEach(function (b) {
      b.classList.toggle('active', b.textContent === state.grade);
    });
  }

  // ========== Render ==========
  function render() {
    worksheetEl.innerHTML = '';
    worksheetEl.classList.toggle('annotations-on', state.annotationsOn);

    var data = getPageData();
    var renderer = (window.JOJO_RENDERERS || {})[state.templateId];

    if (!data || !renderer) {
      worksheetEl.innerHTML = '<div id="worksheet-empty"><p>No data available for ' +
        (state.templateId || '—') + ' / ' + (state.variant || '—') + ' / ' + (state.grade || '—') +
        '</p></div>';
      updateJsonPanel(null);
      guideContainerEl.innerHTML = '';
      return;
    }

    renderer(data, worksheetEl);
    updateJsonPanel(data);
    renderInteractionGuide();
  }

  function getPageData() {
    var d = window.JOJO_DATA || {};
    return d[state.templateId] &&
      d[state.templateId][state.variant] &&
      d[state.templateId][state.variant][state.grade] || null;
  }

  // ========== Interaction Guide ==========
  function renderInteractionGuide() {
    guideContainerEl.innerHTML = '';
    var guideData = INTERACTION_GUIDES[state.templateId];
    if (!guideData) return;
    var R = window.JOJO_RENDER;
    if (R && R.interactionGuide) {
      guideContainerEl.appendChild(R.interactionGuide(guideData));
    }
  }

  // ========== JSON Panel ==========
  function updateJsonPanel(data) {
    if (!data) {
      jsonCodeEl.textContent = '// No data';
      return;
    }
    jsonCodeEl.textContent = JSON.stringify(data, null, 2);
  }

  // ========== Annotation Toggle ==========
  function onAnnotationToggle() {
    state.annotationsOn = annotationCb.checked;
    worksheetEl.classList.toggle('annotations-on', state.annotationsOn);
  }

  // ========== JSON Panel Toggle ==========
  function onJsonToggle() {
    var isHidden = jsonContentEl.classList.toggle('hidden');
    jsonToggleIcon.classList.toggle('open', !isHidden);
  }

  // ========== JSON Hover Highlight ==========
  function onWorksheetHover(e) {
    if (!state.annotationsOn) return;
    var fieldEl = e.target.closest('[data-field]');
    // Clear previous highlights
    var marks = jsonCodeEl.querySelectorAll('mark');
    marks.forEach(function (m) {
      m.outerHTML = m.textContent;
    });
    if (!fieldEl) return;
    var fieldName = fieldEl.dataset.field;
    highlightJsonField(fieldName);
  }

  function highlightJsonField(fieldName) {
    var text = jsonCodeEl.textContent;
    // Escape for regex
    var escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('("' + escaped + '"\\s*:)', 'g');
    jsonCodeEl.innerHTML = text.replace(regex, '<mark>$1</mark>');
  }

  // ========== URL Hash ==========
  function updateHash() {
    if (state.templateId) {
      window.location.hash = state.templateId + '/' + state.variant + '/' + state.grade;
    }
  }

  function restoreFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (!hash) return;
    var parts = hash.split('/');
    if (parts.length >= 1) {
      var tmpl = findTemplate(parts[0]);
      if (tmpl) {
        state.templateId = parts[0];
        state.variant = parts[1] || tmpl.variants[0];
        state.grade = parts[2] || tmpl.grades[0];
        updateSidebarHighlight();
        buildVariantButtons(tmpl);
        buildGradeButtons(tmpl);
        render();
      }
    }
  }

  // ========== Events ==========
  function bindEvents() {
    annotationCb.addEventListener('change', onAnnotationToggle);
    jsonToggleBtn.addEventListener('click', onJsonToggle);
    worksheetEl.addEventListener('mouseover', onWorksheetHover);
    window.addEventListener('hashchange', restoreFromHash);
  }

  // ========== Bitable Mode ==========
  function initBitableMode() {
    // If URL hash points at a Bitable page, auto-switch to Bitable mode at boot
    if (parseHash()) {
      var radio = document.querySelector('input[name="mode"][value="bitable"]');
      if (radio) {
        radio.checked = true;
        // Defer to next tick so DOM refs are ready
        setTimeout(onModeChange, 0);
      }
    }
    modeRadios.forEach(function (r) {
      r.addEventListener('change', onModeChange);
    });
    btUnitSel.addEventListener('change', function () {
      var code = btUnitSel.value;
      if (code) loadBitableUnit(code);
    });
    btPrevBtn.addEventListener('click', function () { stepBitablePage(-1); });
    btNextBtn.addEventListener('click', function () { stepBitablePage(1); });
    document.addEventListener('keydown', function (e) {
      if (state.mode !== 'bitable') return;
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); stepBitablePage(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); stepBitablePage(1); }
    });
    jsonModeToggleEl.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        setJsonMode(b.dataset.jsonMode);
      });
    });
  }

  function onModeChange() {
    var mode = document.querySelector('input[name="mode"]:checked').value;
    state.mode = mode;
    if (mode === 'bitable') {
      demoSidebarBlock.hidden = true;
      bitableControlsEl.hidden = false;
      bitablePageHeaderEl.hidden = false;
      controlsEl.hidden = true;
      jsonModeToggleEl.hidden = false;
      ensureAssetManifest().then(loadBitableUnits);
    } else {
      demoSidebarBlock.hidden = false;
      bitableControlsEl.hidden = true;
      bitablePageHeaderEl.hidden = true;
      controlsEl.hidden = false;
      jsonModeToggleEl.hidden = true;
      // Re-render demo mode if a template was selected
      if (state.templateId) render();
      else worksheetEl.innerHTML = '<div id="worksheet-empty"><p>Select a template from the left panel</p></div>';
    }
  }

  function ensureAssetManifest() {
    if (assetManifestLoaded) return Promise.resolve();
    return window.JOJO_BITABLE.loadAssetManifest().then(function () {
      assetManifestLoaded = true;
    });
  }

  function setBitableStatus(msg, isError) {
    btStatusEl.textContent = msg || '';
    btStatusEl.style.color = isError ? '#c33' : 'var(--text-secondary)';
  }

  function loadBitableUnits() {
    setBitableStatus('Loading workbooks...');
    fetch('/api/units')
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (resp) {
        if (!resp.ok) throw new Error(resp.body && resp.body.error || 'units fetch failed');
        state.bitable._allUnits = resp.body.units || [];
        state.bitable.workbooks = resp.body.workbooks || [];
        state.bitable._allCourses = resp.body.courses || [];
        state.bitable.workbookTitles = resp.body.workbook_titles || {};

        // Update tab count badges
        btSourceTabs.forEach(function (tab) {
          if (tab.dataset.source === 'curriculum') {
            tab.setAttribute('data-count', '(' + state.bitable._allCourses.length + ')');
          } else {
            tab.setAttribute('data-count', '(' + state.bitable.workbooks.length + ')');
          }
        });

        // Determine which source tab to activate based on hash or default
        var hashTarget = parseHash();
        var matchedUnit = hashTarget && state.bitable._allUnits.find(function (u) { return u.unit_code === hashTarget.unitCode; });
        var hashWorkbook = matchedUnit ? matchedUnit.workbook : (hashTarget ? hashTarget.unitCode.split('_U')[0] : null);
        var activeSource = 'curriculum';
        if (hashWorkbook && state.bitable.workbooks.indexOf(hashWorkbook) !== -1) {
          activeSource = 'library';
        } else if (hashWorkbook && state.bitable._allCourses.indexOf(hashWorkbook) !== -1) {
          activeSource = 'curriculum';
        } else if (state.bitable._allCourses.length === 0) {
          activeSource = 'library';
        }
        setSourceTab(activeSource);

        // Set workbook from hash or default to first in active tab
        var tabBooks = activeSource === 'curriculum' ? state.bitable._allCourses : state.bitable.workbooks;
        if (hashWorkbook && tabBooks.indexOf(hashWorkbook) !== -1) {
          state.bitable.workbook = hashWorkbook;
        } else {
          state.bitable.workbook = tabBooks[0] || null;
        }
        populateBookSelector(activeSource);
        if (state.bitable.workbook) btWorkbookSel.value = state.bitable.workbook;

        populateUnitSelector(hashTarget);
      })
      .catch(function (err) {
        setBitableStatus('Units load failed: ' + err.message, true);
      });
  }

  function populateUnitSelector(preferred) {
    var all = state.bitable._allUnits || [];
    var units = state.bitable.workbook
      ? all.filter(function (u) { return u.workbook === state.bitable.workbook; })
      : all;
    btUnitSel.innerHTML = '';
    var overallStart = 0;
    var overallTotal = units.reduce(function (s, u) { return s + (u.page_count || 0); }, 0);
    units.forEach(function (u, i) {
      var opt = document.createElement('option');
      opt.value = u.unit_code;
      opt.textContent = u.unit_code + ' (' + u.page_count + ' pages)';
      opt.dataset.overallStart = overallStart;
      btUnitSel.appendChild(opt);
      overallStart += u.page_count || 0;
    });
    state.bitable._workbookPageTotal = overallTotal;

    if (units.length === 0) {
      setBitableStatus('No units found in ' + state.bitable.workbook, true);
      return;
    }
    var initialCode = (preferred && preferred.unitCode && units.find(function (u) { return u.unit_code === preferred.unitCode; }))
      ? preferred.unitCode
      : units[0].unit_code;
    var initialPage = (preferred && preferred.unitCode === initialCode) ? preferred.pageIndex : 0;
    btUnitSel.value = initialCode;
    loadBitableUnit(initialCode, initialPage);
  }

  function loadBitableUnit(code, startPage) {
    state.bitable.unitCode = code;
    setBitableStatus('Loading ' + code + '...');
    fetch('/api/unit/' + encodeURIComponent(code))
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (resp) {
        if (!resp.ok) throw new Error(resp.body && resp.body.error || 'unit fetch failed');
        state.bitable.unitData = resp.body;
        var pages = resp.body.pages || [];
        var idx = Math.max(0, Math.min(pages.length - 1, startPage || 0));
        state.bitable.pageIndex = idx;
        setBitableStatus(resp.body.fetched_at ? 'Loaded · ' + resp.body.fetched_at.slice(11, 19) : '');
        renderBitablePage(idx);
      })
      .catch(function (err) {
        setBitableStatus('Unit load failed: ' + err.message, true);
        worksheetEl.innerHTML = '<div id="worksheet-empty"><p style="color:#c33">' + err.message + '</p></div>';
      });
  }

  function stepBitablePage(delta) {
    var unit = state.bitable.unitData;
    if (!unit || !unit.pages) return;
    var n = unit.pages.length;
    var next = state.bitable.pageIndex + delta;
    if (next >= 0 && next < n) {
      renderBitablePage(next);
      return;
    }
    // Cross-unit: jump to neighbour unit in same workbook
    var units = (state.bitable._allUnits || []).filter(function (u) {
      return u.workbook === state.bitable.workbook;
    });
    var curIdx = units.findIndex(function (u) { return u.unit_code === state.bitable.unitCode; });
    if (curIdx === -1) return;
    if (delta > 0 && curIdx < units.length - 1) {
      var nextCode = units[curIdx + 1].unit_code;
      btUnitSel.value = nextCode;
      loadBitableUnit(nextCode, 0);
    } else if (delta < 0 && curIdx > 0) {
      var prevCode = units[curIdx - 1].unit_code;
      btUnitSel.value = prevCode;
      loadBitableUnit(prevCode, (units[curIdx - 1].page_count || 1) - 1);
    }
  }

  function renderBitablePage(idx) {
    var unit = state.bitable.unitData;
    if (!unit) return;
    var pages = unit.pages || [];
    if (idx < 0 || idx >= pages.length) return;
    state.bitable.pageIndex = idx;
    var page = pages[idx];

    var translated = window.JOJO_BITABLE.translatePage(page, unit.content_pool, unit.unit_code, 'K');
    state.bitable.lastTranslated = translated;

    window.JOJO_BITABLE.renderPage(translated, worksheetEl);

    // Source badge
    var isCourse = state.bitable._allCourses.indexOf(unit.workbook) !== -1;
    btSourceBadge.textContent = isCourse ? 'Course' : 'Library';
    btSourceBadge.className = 'bt-source-badge ' + (isCourse ? 'badge-course' : 'badge-library');
    btSourceBadge.hidden = false;

    // Update page header
    btPhUnit.textContent = unit.unit_code;
    btPhPage.textContent = String(idx + 1);
    btPhTotal.textContent = String(pages.length);
    btPhStatus.textContent = unit.status || '';
    btPhStatusWrap.hidden = !unit.status;

    // Workbook subtitle from naming.csv
    var wbMeta = (state.bitable.workbookTitles || {})[unit.workbook];
    var subtitle = (wbMeta && wbMeta.title) ? wbMeta.title : '';
    if (subtitle) {
      btPhSubtitle.textContent = subtitle;
      btPhSubtitleWrap.hidden = false;
    } else {
      btPhSubtitleWrap.hidden = true;
    }

    // Overall page indicator (1..workbook total)
    var overall = computeOverallPageNumber(unit.unit_code, idx);
    if (overall) {
      btPhOverall.textContent = String(overall);
      btPhOverallTotal.textContent = String(state.bitable._workbookPageTotal || pages.length);
      btPhOverallWrap.hidden = false;
    } else {
      btPhOverallWrap.hidden = true;
    }

    // Source filename (e.g. U01_P03.json)
    var sourceUrl = unit.source_files && unit.source_files[idx];
    if (sourceUrl) {
      btPhFilename.textContent = sourceUrl.split('/').pop();
      btPhRecordLink.href = sourceUrl;
      btPhRecordLink.hidden = false;
    } else {
      btPhFilename.textContent = '';
      btPhRecordLink.hidden = true;
    }

    // Cross-unit nav: enable buttons unless we're at workbook bounds
    var units = (state.bitable._allUnits || []).filter(function (u) {
      return u.workbook === state.bitable.workbook;
    });
    var curIdx = units.findIndex(function (u) { return u.unit_code === unit.unit_code; });
    btPrevBtn.disabled = (idx === 0 && curIdx === 0);
    btNextBtn.disabled = (idx >= pages.length - 1 && curIdx === units.length - 1);

    // URL hash persistence
    writeHash(unit.unit_code, idx);

    // Template / variant chip (母題版 / 子題版)
    var meta = translated.templateMeta || { templateId: '???', variantNumber: null, variantName: '(no metadata)' };
    btPhTemplateId.textContent = meta.templateId || '???';
    btPhTemplateId.classList.toggle('bt-ph-unknown', !meta.templateId || meta.templateId === '???');
    btPhVariantName.textContent = meta.variantName ? ' › ' + meta.variantName : '';

    // Update page nav label (disabled state set above with cross-unit awareness)
    btPageLabel.textContent = (idx + 1) + ' / ' + pages.length;

    // Update JSON panel
    refreshBitableJson();
  }

  function refreshBitableJson() {
    var unit = state.bitable.unitData;
    var idx = state.bitable.pageIndex;
    if (!unit || !unit.pages || !unit.pages[idx]) {
      jsonCodeEl.textContent = '// No page';
      return;
    }
    var page = unit.pages[idx];
    if (state.bitable.jsonMode === 'translated') {
      var t = state.bitable.lastTranslated || {};
      jsonCodeEl.textContent = JSON.stringify(
        t.kind === 'legacy' ? t.data : t,
        null, 2);
    } else {
      jsonCodeEl.textContent = JSON.stringify(page, null, 2);
    }
  }

  function computeOverallPageNumber(unitCode, pageIndex) {
    var units = (state.bitable._allUnits || []).filter(function (u) {
      return u.workbook === state.bitable.workbook;
    });
    var n = 0;
    for (var i = 0; i < units.length; i++) {
      if (units[i].unit_code === unitCode) return n + pageIndex + 1;
      n += units[i].page_count || 0;
    }
    return 0;
  }

  function parseHash() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    var m = raw.match(/^bitable\/([A-Za-z0-9_-]+)\/(\d+)$/);
    if (!m) return null;
    return { unitCode: m[1], pageIndex: Math.max(0, parseInt(m[2], 10) - 1) };
  }

  function writeHash(unitCode, pageIndex) {
    var newHash = '#bitable/' + unitCode + '/' + (pageIndex + 1);
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }

  function setJsonMode(mode) {
    state.bitable.jsonMode = mode;
    jsonModeToggleEl.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.jsonMode === mode);
    });
    refreshBitableJson();
  }

  // ========== Boot ==========
  document.addEventListener('DOMContentLoaded', init);

  // Also init immediately if DOM already loaded (script at bottom of body)
  if (document.readyState !== 'loading') {
    init();
  }
})();
