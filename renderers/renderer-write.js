/* T-WRITE — Independent Writing Renderer */

window.JOJO_RENDERERS['T-WRITE'] = function (data, container) {
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

    // Image prompt
    if (item.prompt_image) {
      var img = R.imagePlaceholder(item.prompt_image, 64, 64);
      R.annotate(img, 'items[' + i + '].prompt_image');
      row.appendChild(img);
    }

    // Audio
    if (item.prompt_audio) {
      var audio = R.audioButton(item.prompt_audio);
      R.annotate(audio, 'items[' + i + '].prompt_audio');
      row.appendChild(audio);
    }

    // Hint text
    if (item.hint) {
      var hint = document.createElement('span');
      hint.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      hint.style.fontSize = '20px';
      hint.style.color = 'var(--text-hint)';
      hint.textContent = item.hint;
      R.annotate(hint, 'items[' + i + '].hint');
      row.appendChild(hint);
    }

    // Writing cells for the answer
    if (item.answer) {
      var letters = item.answer.split('');
      letters.forEach(function (ch) {
        var cell = R.writingCell(cellSize, 'answer', ch);
        row.appendChild(cell);
      });
    }

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
