/* T-SOUNDBOX — Sound Box Renderer */

window.JOJO_RENDERERS['T-SOUNDBOX'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // Horizontal rows layout - each row fills the width
  var list = document.createElement('div');
  list.className = 'ws-items-list';
  list.style.gap = '12px';

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

    // Audio button
    if (item.audio) {
      var audio = R.audioButton(item.audio);
      R.annotate(audio, 'items[' + i + '].audio');
      row.appendChild(audio);
    }

    // Sound boxes - connected group with shared background
    var boxes = item.boxes || 3;
    var prefill = item.prefill || [];
    var phonemes = item.phonemes || [];
    var boxGroup = document.createElement('div');
    boxGroup.className = 'ws-soundbox-group';

    for (var b = 0; b < boxes; b++) {
      var content = prefill[b] || '';
      var scaffold = prefill[b] ? 'trace' : (phonemes[b] ? 'answer' : 'blank');
      var displayContent = prefill[b] || phonemes[b] || '';
      var cell = R.writingCell(cellSize, scaffold, displayContent);
      R.annotate(cell, 'items[' + i + '].phonemes[' + b + ']');
      boxGroup.appendChild(cell);
    }

    row.appendChild(boxGroup);
    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
