/* T-TRANSFORM — Word/Sentence Transformation Renderer */

window.JOJO_RENDERERS['T-TRANSFORM'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];
  var list = document.createElement('div');
  list.className = 'ws-items-list';

  items.forEach(function (item, i) {
    var row = R.itemRow();

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image (optional)
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 50, 50);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Original word/sentence
    var original = document.createElement('span');
    original.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    original.style.fontSize = item.input_type === 'type' ? '16px' : '22px';
    original.style.fontWeight = '600';
    original.style.padding = '6px 14px';
    original.style.background = 'var(--card-bg)';
    original.style.border = '2px solid var(--card-border)';
    original.style.borderRadius = '10px';
    original.style.color = 'var(--text-primary)';
    original.textContent = item.original;
    R.annotate(original, 'items[' + i + '].original');
    row.appendChild(original);

    // Rule indicator
    if (item.rule) {
      var rule = document.createElement('span');
      rule.style.fontSize = '11px';
      rule.style.color = 'var(--text-hint)';
      rule.style.fontFamily = '"Fira Code", monospace';
      rule.textContent = item.rule;
      row.appendChild(rule);
    }

    // Arrow
    row.appendChild(R.arrow());

    // Answer area
    if (item.input_type === 'type') {
      // Typing for sentences
      var typing = R.typingArea(1, 'Type the transformed sentence...', item.answer);
      typing.style.flex = '1';
      typing.style.minWidth = '200px';
      R.annotate(typing, 'items[' + i + '].answer');
      row.appendChild(typing);
    } else {
      // Handwriting cells for words
      var answer = item.answer || '';
      answer.split('').forEach(function (ch) {
        row.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
    }

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
