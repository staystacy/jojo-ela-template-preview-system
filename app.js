/* JOJO ELA Template Preview v2 — App Shell */

(function () {
  'use strict';

  // ========== State ==========
  var state = {
    templateId: null,
    variant: null,
    grade: null,
    annotationsOn: false
  };

  // ========== DOM References ==========
  var templateListEl = document.getElementById('template-list');
  var worksheetEl = document.getElementById('worksheet');
  var variantBtnsEl = document.getElementById('variant-buttons');
  var gradeBtnsEl = document.getElementById('grade-buttons');
  var annotationCb = document.getElementById('annotation-checkbox');
  var jsonToggleBtn = document.getElementById('json-toggle');
  var jsonToggleIcon = jsonToggleBtn.querySelector('.json-toggle-icon');
  var jsonContentEl = document.getElementById('json-content');
  var jsonCodeEl = document.getElementById('json-code');

  // ========== Init ==========
  function init() {
    buildSidebar();
    bindEvents();
    restoreFromHash();
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
      return;
    }

    renderer(data, worksheetEl);
    updateJsonPanel(data);
  }

  function getPageData() {
    var d = window.JOJO_DATA || {};
    return d[state.templateId] &&
      d[state.templateId][state.variant] &&
      d[state.templateId][state.variant][state.grade] || null;
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

  // ========== Boot ==========
  document.addEventListener('DOMContentLoaded', init);

  // Also init immediately if DOM already loaded (script at bottom of body)
  if (document.readyState !== 'loading') {
    init();
  }
})();
