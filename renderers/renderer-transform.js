/* T-TRANSFORM — Word/Sentence Transformation Renderer */

window.JOJO_RENDERERS['T-TRANSFORM'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // Mode detection:
  //   type        → sentence transform (T-TRANSFORM v3, single column typing)
  //   handwrite + image  → word transform with picture (T-TRANSFORM v1, 2×2 grid + dual audio)
  //   handwrite (no image) → word transform text-only (T-TRANSFORM v2, 2-col grid)
  var isSentenceMode = items[0] && items[0].input_type === 'type';
  var isPictureMode  = !isSentenceMode && items.some(function (it) { return it && it.image; });

  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '14px';
  grid.style.gridTemplateColumns = isSentenceMode ? '1fr' : 'repeat(2, 1fr)';

  items.forEach(function (item, i) {
    if (isPictureMode) {
      grid.appendChild(renderPictureCell(R, item, i, cellSize));
    } else {
      grid.appendChild(renderTextRow(R, item, i, cellSize, isSentenceMode));
    }
  });

  container.appendChild(grid);
};

// ============ Picture variant (v1) — image + sourceWord label + dual audio + writing cells ============
function renderPictureCell(R, item, i, cellSize) {
  var cell = document.createElement('div');
  cell.className = 'ws-transform-pic-cell';
  cell.style.display = 'flex';
  cell.style.alignItems = 'center';
  cell.style.gap = '10px';
  cell.style.padding = '8px 10px';
  cell.style.background = 'var(--card-bg)';
  cell.style.border = '1px solid var(--card-border)';
  cell.style.borderRadius = '12px';

  // Item number
  cell.appendChild(R.itemNumber(i + 1));

  // Image
  if (item.image) {
    var img = R.imagePlaceholder(item.image, 48, 48);
    R.annotate(img, 'items[' + i + '].image');
    cell.appendChild(img);
  }

  // Source word label
  var label = document.createElement('span');
  label.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
  label.style.fontSize = '18px';
  label.style.fontWeight = '600';
  label.style.color = 'var(--text-primary)';
  label.style.minWidth = '52px';
  label.textContent = item.original || '';
  R.annotate(label, 'items[' + i + '].original');
  cell.appendChild(label);

  // Dual audio cluster: [source 🔊]  [🔊 new word]
  var audioCluster = document.createElement('span');
  audioCluster.style.display = 'inline-flex';
  audioCluster.style.alignItems = 'center';
  audioCluster.style.gap = '6px';

  if (item.audio) {
    var srcAudio = R.audioButton(item.audio);
    R.annotate(srcAudio, 'items[' + i + '].audio');
    audioCluster.appendChild(srcAudio);
  }

  if (item.target_audio) {
    var tgtAudio = R.audioButton(item.target_audio);
    R.annotate(tgtAudio, 'items[' + i + '].target_audio');
    audioCluster.appendChild(tgtAudio);

    var newWordLabel = document.createElement('span');
    newWordLabel.textContent = 'new word';
    newWordLabel.style.fontSize = '10px';
    newWordLabel.style.color = 'var(--text-secondary)';
    newWordLabel.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    audioCluster.appendChild(newWordLabel);
  }
  cell.appendChild(audioCluster);

  // Arrow
  cell.appendChild(R.arrow());

  // Writing cells (answer)
  var cellGroup = document.createElement('div');
  cellGroup.className = 'ws-soundbox-group';
  var answer = item.answer || '';
  answer.split('').forEach(function (ch) {
    cellGroup.appendChild(R.writingCell(cellSize, 'answer', ch));
  });
  cell.appendChild(cellGroup);

  R.annotate(cell, 'items[' + i + ']');
  return cell;
}

// ============ Text variant (v2 word / v3 sentence) — preserves original behaviour ============
function renderTextRow(R, item, i, cellSize, isSentenceMode) {
  var row = R.itemRow();
  row.style.flexWrap = 'nowrap';

  row.appendChild(R.itemNumber(i + 1));

  if (item.image) {
    var img = R.imagePlaceholder(item.image, 44, 44);
    R.annotate(img, 'items[' + i + '].image');
    row.appendChild(img);
  }

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

  if (item.rule) {
    var rule = document.createElement('span');
    rule.style.fontSize = '10px';
    rule.style.color = 'var(--text-hint)';
    rule.style.fontFamily = '"Fira Code", monospace';
    rule.textContent = item.rule;
    row.appendChild(rule);
  }

  row.appendChild(R.arrow());

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
  return row;
}
