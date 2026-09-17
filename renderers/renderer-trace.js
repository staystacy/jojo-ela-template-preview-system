/* T-TRACE — Tracing Progression Renderer */

(function () {
  'use strict';

  // ===== Handwriting rule geometry (viewBox 100 x 120) =====
  // Ratios taken from the Figma frames trace-01..07: a 4-zone card —
  // ascender space / cap line / x-height line / baseline (red) / descender space.
  var VB_W = 100;
  var VB_H = 120;
  var TOP_LINE  = VB_H * 0.274;   // cap / ascender line
  var MID_LINE  = VB_H * 0.50;    // x-height line
  var BASE_LINE = VB_H * 0.726;   // baseline (red)
  var TALL_LOWERCASE = 'bdfhklt';

  // Measure the real cap-height / x-height ratio of the handwriting font so a
  // capital fills cap-line→baseline and a plain lowercase fills mid-line→baseline,
  // the way the Figma frames scale them. Falls back to generic sans metrics when
  // the webfont has not loaded yet.
  function fontMetrics() {
    var fallback = { cap: 0.72, x: 0.52, width: function (text) { return text.length * 0.6; } };
    try {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.font = '100px Andika, "Comic Neue", sans-serif';
      var cap = ctx.measureText('H').actualBoundingBoxAscent / 100;
      var x   = ctx.measureText('x').actualBoundingBoxAscent / 100;
      if (cap > 0.3 && x > 0.2) {
        return {
          cap: cap,
          x: x,
          // advance width per 1px of font-size
          width: function (text) { return ctx.measureText(text).width / 100; }
        };
      }
    } catch (e) { /* canvas unavailable */ }
    return fallback;
  }

  function glyphFontSize(content, m) {
    var tall = content.split('').some(function (ch) {
      return /[A-Z0-9]/.test(ch) || TALL_LOWERCASE.indexOf(ch) !== -1;
    });
    var fs = tall ? (BASE_LINE - TOP_LINE) / m.cap : (BASE_LINE - MID_LINE) / m.x;
    // Mixed-case demo content ("Ww") would otherwise run past the card edges.
    var perPx = m.width(content);
    if (perPx > 0) fs = Math.min(fs, (VB_W - 14) / perPx);
    return fs;
  }

  var NS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    var el = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  // One ruled handwriting card. `glyphClass` = 'is-guide' (light grey trace guide)
  // or 'is-model' (blue demo letter). scaffold 'blank' renders lines only.
  function ruledCell(content, scaffold, m, glyphClass) {
    var svg = svgEl('svg', {
      viewBox: '0 0 ' + VB_W + ' ' + VB_H,
      preserveAspectRatio: 'xMidYMid meet',
      class: 'ws-ruled-cell'
    });
    svg.appendChild(svgEl('rect', {
      x: 1, y: 1, width: VB_W - 2, height: VB_H - 2, rx: 3, class: 'ws-ruled-cell-bg'
    }));
    [[TOP_LINE, 'blue'], [MID_LINE, 'blue'], [BASE_LINE, 'red']].forEach(function (l) {
      svg.appendChild(svgEl('line', {
        x1: 5, x2: VB_W - 5, y1: l[0], y2: l[0], class: 'ws-rule-line-' + l[1]
      }));
    });
    if (content && scaffold !== 'blank') {
      var t = svgEl('text', {
        x: VB_W / 2, y: BASE_LINE, 'text-anchor': 'middle',
        'font-size': glyphFontSize(content, m).toFixed(2),
        class: 'ws-ruled-glyph ' + (glyphClass || 'is-guide')
      });
      t.textContent = content;
      svg.appendChild(t);
    }
    return svg;
  }

  function cellBox(maxWidth) {
    var box = document.createElement('div');
    box.className = 'ws-ruled-cell-box';
    box.style.maxWidth = maxWidth + 'px';
    return box;
  }

  // ===== Letter variants 1-7: left demo column + right ruled writing grid =====
  function renderLetterRuled(data, container, R) {
    var m = fontMetrics();
    var demo = data.demo_area || {};
    var cols = data.grid_columns || 2;
    var cellW = cols <= 2 ? 170 : 132;

    var layout = document.createElement('div');
    layout.className = 'ws-layout-a';

    // --- Left: demo column (model letter card + word card(s)) ---
    var panel = document.createElement('div');
    panel.className = 'ws-demo-panel is-plain';

    if (demo.content) {
      var demoBox = cellBox(cols <= 2 ? 170 : 150);
      demoBox.appendChild(ruledCell(demo.content, 'trace', m, 'is-model'));
      R.annotate(demoBox, 'demo_area.content');
      panel.appendChild(demoBox);
    }

    // demo_area.audio sits directly under the model card: the letter for shadow /
    // freehand writing (the Figma frames omit the button, but the App does play it),
    // the word for letter tracing.
    if (demo.audio) {
      var ab = R.audioButton(demo.audio);
      R.annotate(ab, 'demo_area.audio');
      panel.appendChild(ab);
    }

    // Two word cards (variants 3/4/6/7) render as tinted picture cards; a single
    // word card (variants 1/2/5) renders as picture + word label, per Figma.
    var cards = Array.isArray(demo.wordCards) ? demo.wordCards : [];

    if (cards.length >= 2) {
      cards.forEach(function (wc, wi) {
        var card = document.createElement('div');
        card.className = 'ws-trace-word-card ' + (wi % 2 === 0 ? 'tone-blue' : 'tone-amber');
        if (wc.audio) {
          var wb = R.audioButton(wc.audio);
          wb.classList.add('ws-trace-word-card-audio');
          card.appendChild(wb);
        }
        card.appendChild(R.imagePlaceholder(wc.image, 64, 56));
        var wl = document.createElement('span');
        wl.className = 'ws-trace-word-label';
        wl.textContent = wc.label || wc.word;
        card.appendChild(wl);
        R.annotate(card, 'demo_area.wordCards[' + wi + ']');
        panel.appendChild(card);
      });
    } else {
      var single = cards[0] || null;
      var prefix = single ? 'demo_area.wordCards[0].' : 'demo_area.';
      var imageName = demo.image || (single && single.image);
      var wordLabel = demo.word || (single && (single.label || single.word));

      if (imageName) {
        var img = R.imagePlaceholder(imageName, 96, 96);
        R.annotate(img, prefix + 'image');
        panel.appendChild(img);
      }
      if (wordLabel) {
        var labelRow = document.createElement('div');
        labelRow.className = 'ws-trace-word-label-row';
        var label = document.createElement('span');
        label.className = 'ws-trace-word-label is-large';
        label.textContent = wordLabel;
        R.annotate(label, single ? prefix + 'word' : 'demo_area.word');
        labelRow.appendChild(label);
        // Guided-to-Freehand (v5) carries its word card here; keep its word audio
        // reachable next to the label, since demo_area.audio is the letter.
        if (single && single.audio) {
          var sb = R.audioButton(single.audio);
          sb.classList.add('ws-trace-word-label-audio');
          R.annotate(sb, prefix + 'audio');
          labelRow.appendChild(sb);
        }
        panel.appendChild(labelRow);
      }
    }

    layout.appendChild(panel);

    // --- Right: ruled writing grid ---
    var grid = document.createElement('div');
    grid.className = 'ws-trace-letter-grid';
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    grid.style.maxWidth = (cols * cellW + (cols - 1) * 14) + 'px';

    (data.cells || []).forEach(function (cellData, i) {
      var box = cellBox(cellW);
      var content = cellData.content || demo.content || '';
      box.appendChild(ruledCell(content, cellData.scaffold, m, 'is-guide'));
      R.annotate(box, 'cells[' + i + ']');
      grid.appendChild(box);
    });

    layout.appendChild(grid);
    container.appendChild(layout);
  }

  window.JOJO_RENDERERS['T-TRACE'] = function (data, container) {
    var R = window.JOJO_RENDER;

    // Instruction
    var inst = R.instruction(data.instruction_text, data.instruction_audio);
    R.annotate(inst, 'instruction_text');
    container.appendChild(inst);

    // === T-TRACE Word variant 8/9/10 row-based layout (spec: 2 word × 2 cells) ===
    // Each row = left (image + audio) + right (2 trace cells, each showing the
    // full word split into letters). Matches Figma frames trace-08/09/10.
    if (Array.isArray(data.rows) && data.rows.length > 0) {
      var rowCellSize = data.cell_size || 48;
      var rowsContainer = document.createElement('div');
      rowsContainer.className = 'ws-trace-word-rows';
      rowsContainer.style.display = 'flex';
      rowsContainer.style.flexDirection = 'column';
      rowsContainer.style.gap = '16px';

      data.rows.forEach(function (row, ri) {
        var rowEl = document.createElement('div');
        rowEl.className = 'ws-trace-word-row';
        rowEl.style.display = 'flex';
        rowEl.style.alignItems = 'center';
        rowEl.style.gap = '20px';

        var leftCol = document.createElement('div');
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.style.alignItems = 'center';
        leftCol.style.gap = '6px';
        if (row.image) {
          var rImg = R.imagePlaceholder(row.image, 56, 56);
          R.annotate(rImg, 'rows[' + ri + '].image');
          leftCol.appendChild(rImg);
        }
        if (row.audio) {
          var rAb = R.audioButton(row.audio);
          R.annotate(rAb, 'rows[' + ri + '].audio');
          leftCol.appendChild(rAb);
        }
        rowEl.appendChild(leftCol);

        var cellsCol = document.createElement('div');
        cellsCol.style.display = 'flex';
        cellsCol.style.gap = '12px';
        (row.cells || []).forEach(function (cellData, ci) {
          var group = document.createElement('div');
          group.className = 'ws-soundbox-group';
          (cellData.content || '').split('').forEach(function (ch) {
            group.appendChild(R.writingCell(rowCellSize, cellData.scaffold, ch));
          });
          R.annotate(group, 'rows[' + ri + '].cells[' + ci + ']');
          cellsCol.appendChild(group);
        });
        rowEl.appendChild(cellsCol);

        R.annotate(rowEl, 'rows[' + ri + ']');
        rowsContainer.appendChild(rowEl);
      });

      container.appendChild(rowsContainer);
      return;
    }

    // === Letter variants 1-7: ruled handwriting cards (Figma trace-01..07) ===
    var demoContent = (data.demo_area && data.demo_area.content) || '';
    if (data.layout === 'letter_ruled' || (demoContent.length > 0 && demoContent.length <= 2)) {
      renderLetterRuled(data, container, R);
      return;
    }

    // === Legacy: demo_area + cells layout (word content in Demo Mode mock data) ===
    // Layout A: left demo panel + right writing grid
    var layout = document.createElement('div');
    layout.className = 'ws-layout-a';

    // === Left: Demo Panel ===
    var demoPanel = document.createElement('div');
    demoPanel.className = 'ws-demo-panel';

    if (data.demo_area) {
      // Large letter/word display
      var letter = document.createElement('span');
      letter.className = 'ws-demo-letter';
      letter.textContent = data.demo_area.content || '';
      demoPanel.appendChild(letter);

      if (data.demo_area.animation === 'stroke_order') {
        var animLabel = document.createElement('span');
        animLabel.className = 'ws-demo-label';
        animLabel.textContent = '✍ Trace guide';
        demoPanel.appendChild(animLabel);
      }

      // Audio button
      if (data.demo_area.audio) {
        var audioBtn = R.audioButton(data.demo_area.audio);
        R.annotate(audioBtn, 'demo_area.audio');
        demoPanel.appendChild(audioBtn);
      }

      if (data.demo_area.image) {
        var img = R.imagePlaceholder(data.demo_area.image, 64, 64);
        R.annotate(img, 'demo_area.image');
        demoPanel.appendChild(img);
      }

      R.annotate(demoPanel, 'demo_area');
    }

    layout.appendChild(demoPanel);

    // === Right: Writing Cells Grid ===
    var cellSize = data.cell_size || 48;
    var cells = data.cells || [];

    var grid = document.createElement('div');
    grid.className = 'ws-content-grid';
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';

    cells.forEach(function (cellData, i) {
      var cellWrap = document.createElement('div');
      cellWrap.style.display = 'flex';
      cellWrap.style.flexDirection = 'column';
      cellWrap.style.alignItems = 'center';
      cellWrap.style.gap = '4px';

      var content = cellData.content || (data.demo_area && data.demo_area.content) || '';

      var wordRow = document.createElement('div');
      wordRow.className = 'ws-soundbox-group';
      content.split('').forEach(function (ch) {
        wordRow.appendChild(R.writingCell(cellSize, cellData.scaffold, ch));
      });
      cellWrap.appendChild(wordRow);

      // Scaffold label below cell
      var label = document.createElement('span');
      label.style.fontSize = '9px';
      label.style.color = 'var(--text-hint)';
      label.style.textTransform = 'uppercase';
      label.textContent = cellData.scaffold;
      cellWrap.appendChild(label);

      R.annotate(cellWrap, 'cells[' + i + ']');
      grid.appendChild(cellWrap);
    });

    layout.appendChild(grid);
    container.appendChild(layout);
  };
})();
