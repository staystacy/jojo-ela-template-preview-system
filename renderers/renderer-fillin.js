/* T-FILLIN — Fill-in-the-Blank Renderer */

window.JOJO_RENDERERS['T-FILLIN'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  // Word bank (v3)
  if (data.word_bank && data.word_bank.length > 0) {
    var wb = R.wordBank(data.word_bank);
    R.annotate(wb, 'word_bank');
    container.appendChild(wb);
  }

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // 2-column grid for items (or single column for sentence-level fill-ins)
  var isSentenceMode = items[0] && items[0].display && items[0].display.length > 30;
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '14px';
  grid.style.gridTemplateColumns = isSentenceMode ? '1fr' : 'repeat(2, 1fr)';

  items.forEach(function (item, i) {
    var row = R.itemRow();
    row.style.flexWrap = 'nowrap';

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 48, 48);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Audio
    if (item.audio) {
      row.appendChild(R.audioButton(item.audio));
    }

    // Display text with inline blank cells
    var displayWrap = document.createElement('div');
    displayWrap.style.display = 'flex';
    displayWrap.style.alignItems = 'center';
    displayWrap.style.gap = '4px';
    displayWrap.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    displayWrap.style.fontSize = '20px';
    displayWrap.style.flexWrap = 'wrap';

    if (item.display) {
      var parts = item.display.split('_');
      parts.forEach(function (part, pi) {
        if (part) {
          var span = document.createElement('span');
          span.textContent = part;
          span.style.color = 'var(--text-primary)';
          displayWrap.appendChild(span);
        }
        if (pi < parts.length - 1) {
          var blankLen = item.blank_length || 1;
          for (var b = 0; b < blankLen; b++) {
            var answer = item.answer || '';
            var ch = answer[b] || '';
            displayWrap.appendChild(R.writingCell(cellSize, 'answer', ch));
          }
        }
      });
    }

    R.annotate(displayWrap, 'items[' + i + '].display');
    row.appendChild(displayWrap);

    R.annotate(row, 'items[' + i + ']');
    grid.appendChild(row);
  });

  container.appendChild(grid);
};
