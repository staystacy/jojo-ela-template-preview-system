/* T-TRANSFORM — Word/Sentence Transformation Renderer */

window.JOJO_RENDERERS['T-TRANSFORM'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // Determine if sentence mode (type) or word mode (write)
  var isSentenceMode = items[0] && items[0].input_type === 'type';

  // Grid: 2 columns for word mode, 1 column for sentence mode
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '14px';
  grid.style.gridTemplateColumns = isSentenceMode ? '1fr' : 'repeat(2, 1fr)';

  items.forEach(function (item, i) {
    var row = R.itemRow();
    row.style.flexWrap = 'nowrap';

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image (optional)
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 44, 44);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Original word/sentence
    var original = document.createElement('span');
    original.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    original.style.fontSize = isSentenceMode ? '14px' : '20px';
    original.style.fontWeight = '600';
    original.style.padding = '4px 12px';
    original.style.background = 'var(--card-bg)';
    original.style.border = '2px solid var(--card-border)';
    original.style.borderRadius = '10px';
    original.style.color = 'var(--text-primary)';
    original.style.whiteSpace = 'nowrap';
    original.textContent = item.original;
    R.annotate(original, 'items[' + i + '].original');
    row.appendChild(original);

    // Rule indicator
    if (item.rule) {
      var rule = document.createElement('span');
      rule.style.fontSize = '10px';
      rule.style.color = 'var(--text-hint)';
      rule.style.fontFamily = '"Fira Code", monospace';
      rule.textContent = item.rule;
      row.appendChild(rule);
    }

    // Arrow
    row.appendChild(R.arrow());

    // Answer area
    if (item.input_type === 'type') {
      var typing = R.typingArea(1, 'Type the transformed sentence...', item.answer);
      typing.style.flex = '1';
      typing.style.minWidth = '180px';
      R.annotate(typing, 'items[' + i + '].answer');
      row.appendChild(typing);
    } else {
      var cellGroup = document.createElement('div');
      cellGroup.className = 'ws-soundbox-group';
      var answer = item.answer || '';
      answer.split('').forEach(function (ch) {
        cellGroup.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
      row.appendChild(cellGroup);
    }

    R.annotate(row, 'items[' + i + ']');
    grid.appendChild(row);
  });

  container.appendChild(grid);
};
