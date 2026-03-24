/* T-TRACE — Tracing Progression Renderer */

window.JOJO_RENDERERS['T-TRACE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

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
