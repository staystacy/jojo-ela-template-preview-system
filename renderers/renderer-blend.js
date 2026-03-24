/* T-BLEND — Phoneme Blending Renderer */

window.JOJO_RENDERERS['T-BLEND'] = function (data, container) {
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

    // Image (if present)
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 56, 56);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Phoneme buttons
    var audios = item.phoneme_audios || [];
    var phonemeLabels = item.phoneme_labels || audios.map(function (a) {
      return '/' + a.replace('.mp3', '') + '/';
    });

    phonemeLabels.forEach(function (label, pi) {
      var btn = R.phonemeButton(label, audios[pi]);
      R.annotate(btn, 'items[' + i + '].phoneme_audios[' + pi + ']');
      row.appendChild(btn);
    });

    // Arrow
    row.appendChild(R.arrow());

    // Writing cell for blended word
    if (item.answer) {
      var letters = item.answer.split('');
      letters.forEach(function (ch) {
        row.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
    }

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
