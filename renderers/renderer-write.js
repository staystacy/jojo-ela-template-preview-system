/* T-WRITE — Independent Writing Renderer */

window.JOJO_RENDERERS['T-WRITE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // 2-column grid layout for items
  var grid = document.createElement('div');
  grid.className = 'ws-content-grid-2col';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  grid.style.gap = '16px';

  // For fewer items or longer answers, use single column
  if (items.length <= 3 || (items[0] && items[0].answer && items[0].answer.length > 5)) {
    grid.style.gridTemplateColumns = '1fr';
  }

  items.forEach(function (item, i) {
    var row = R.itemRow();
    row.style.flexWrap = 'nowrap';

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image prompt (left side, prominent)
    if (item.prompt_image) {
      var img = R.imagePlaceholder(item.prompt_image, 56, 56);
      R.annotate(img, 'items[' + i + '].prompt_image');
      row.appendChild(img);
    }

    // Audio button
    if (item.prompt_audio) {
      var audio = R.audioButton(item.prompt_audio);
      R.annotate(audio, 'items[' + i + '].prompt_audio');
      row.appendChild(audio);
    }

    // Hint text (e.g., "_all" for v1 first-letter mode)
    if (item.hint) {
      var hint = document.createElement('span');
      hint.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      hint.style.fontSize = '20px';
      hint.style.color = 'var(--text-hint)';
      hint.textContent = item.hint;
      R.annotate(hint, 'items[' + i + '].hint');
      row.appendChild(hint);
    }

    // Writing cells for the answer (largest, most prominent element).
    // Optional item.prefill[] gives N-1 already-filled cells (e.g. Initial Sound
    // Spelling: answer is the first letter, rest of the word is shown as a
    // light-gray trace). Same prefill convention as T-SOUNDBOX renderer.
    if (item.answer) {
      var cellGroup = document.createElement('div');
      cellGroup.className = 'ws-soundbox-group';
      var letters = item.answer.split('');
      var prefill = item.prefill || [];
      letters.forEach(function (ch, ci) {
        var pre = prefill[ci];
        var scaffold = pre ? 'trace' : 'answer';
        var content  = pre || ch;
        var cell = R.writingCell(cellSize, scaffold, content);
        cellGroup.appendChild(cell);
      });
      row.appendChild(cellGroup);
    }

    R.annotate(row, 'items[' + i + ']');
    grid.appendChild(row);
  });

  container.appendChild(grid);
};
