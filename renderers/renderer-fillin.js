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
  var list = document.createElement('div');
  list.className = 'ws-items-list';

  items.forEach(function (item, i) {
    var row = R.itemRow();

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 56, 56);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Audio
    if (item.audio) {
      row.appendChild(R.audioButton(item.audio));
    }

    // Display text with blank
    var displayWrap = document.createElement('div');
    displayWrap.style.display = 'flex';
    displayWrap.style.alignItems = 'center';
    displayWrap.style.gap = '4px';
    displayWrap.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    displayWrap.style.fontSize = '22px';

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
          // Insert blank cell(s)
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
    list.appendChild(row);
  });

  container.appendChild(list);
};
