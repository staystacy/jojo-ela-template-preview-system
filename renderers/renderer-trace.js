/* T-TRACE — Tracing Progression Renderer */

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

  // === Legacy: demo_area + cells layout (T-TRACE letter variants 1-7, demo mode data-trace.js) ===
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

    // v1 (letter mode): stroke order animation indicator
    // v2 (word mode): audio + optional image
    var isLetterMode = data.variant === 'v1' && data.demo_area.content && data.demo_area.content.length <= 2;

    if (data.demo_area.animation === 'stroke_order') {
      var animLabel = document.createElement('span');
      animLabel.className = 'ws-demo-label';
      animLabel.textContent = isLetterMode ? '\u270D Stroke order animation' : '\u270D Trace guide';
      demoPanel.appendChild(animLabel);
    }

    // Audio button
    if (data.demo_area.audio) {
      var audioBtn = R.audioButton(data.demo_area.audio);
      R.annotate(audioBtn, 'demo_area.audio');
      demoPanel.appendChild(audioBtn);
    }

    // For word mode (v2), show small image if available
    if (data.demo_area.image) {
      var img = R.imagePlaceholder(data.demo_area.image, 64, 64);
      R.annotate(img, 'demo_area.image');
      demoPanel.appendChild(img);
    }

    R.annotate(demoPanel, 'demo_area');
  }

  layout.appendChild(demoPanel);

  // === Right: Writing Cells Grid (2 rows × 4 columns) ===
  var cellSize = data.cell_size || 48;
  var cells = data.cells || [];

  var grid = document.createElement('div');
  grid.className = 'ws-content-grid';
  // For words (longer content), use 2-column grid with wider cells
  var isWord = data.demo_area && data.demo_area.content && data.demo_area.content.length > 2;
  if (isWord) {
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  }

  cells.forEach(function (cellData, i) {
    var cellWrap = document.createElement('div');
    cellWrap.style.display = 'flex';
    cellWrap.style.flexDirection = 'column';
    cellWrap.style.alignItems = 'center';
    cellWrap.style.gap = '4px';

    var content = cellData.content || (data.demo_area && data.demo_area.content) || '';

    if (isWord) {
      // Word mode: render each letter in connected cells
      var wordRow = document.createElement('div');
      wordRow.className = 'ws-soundbox-group';
      var letters = content.split('');
      letters.forEach(function (ch) {
        var cell = R.writingCell(cellSize, cellData.scaffold, ch);
        wordRow.appendChild(cell);
      });
      cellWrap.appendChild(wordRow);
    } else {
      // Letter mode: single cell
      var cell = R.writingCell(cellSize, cellData.scaffold, content);
      cellWrap.appendChild(cell);
    }

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
