/* T-BLEND — Phoneme Blending Renderer */

window.JOJO_RENDERERS['T-BLEND'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // Rows layout utilizing full width
  var list = document.createElement('div');
  list.className = 'ws-items-list';
  list.style.gap = '14px';

  items.forEach(function (item, i) {
    var row = R.itemRow();
    row.style.flexWrap = 'nowrap';

    // Item number
    row.appendChild(R.itemNumber(i + 1));

    // Image (if present)
    if (item.image) {
      var img = R.imagePlaceholder(item.image, 56, 56);
      R.annotate(img, 'items[' + i + '].image');
      row.appendChild(img);
    }

    // Phoneme buttons as distinct "sound cards"
    var audios = item.phoneme_audios || [];
    var phonemeLabels = item.phoneme_labels || audios.map(function (a) {
      return '/' + a.replace('.mp3', '') + '/';
    });

    var phonemeGroup = document.createElement('div');
    phonemeGroup.style.display = 'flex';
    phonemeGroup.style.gap = '6px';
    phonemeGroup.style.alignItems = 'center';

    phonemeLabels.forEach(function (label, pi) {
      var btn = R.phonemeButton(label, audios[pi]);
      R.annotate(btn, 'items[' + i + '].phoneme_audios[' + pi + ']');
      phonemeGroup.appendChild(btn);
    });

    row.appendChild(phonemeGroup);

    // Arrow → indicating "blend together"
    row.appendChild(R.arrow());

    // Writing cells for blended word (connected group)
    if (item.answer) {
      var cellGroup = document.createElement('div');
      cellGroup.className = 'ws-soundbox-group';
      var letters = item.answer.split('');
      letters.forEach(function (ch) {
        cellGroup.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
      row.appendChild(cellGroup);
    }

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
