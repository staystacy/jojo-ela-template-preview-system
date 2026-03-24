/* T-FINDWORD — Word Search Renderer */

window.JOJO_RENDERERS['T-FINDWORD'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  // Target words display (pill-shaped, highlighted)
  var targets = data.target_words || [];
  if (targets.length > 0) {
    var targetBar = document.createElement('div');
    targetBar.style.display = 'flex';
    targetBar.style.gap = '12px';
    targetBar.style.marginBottom = '20px';
    targetBar.style.justifyContent = 'center';
    targetBar.style.flexWrap = 'wrap';

    targets.forEach(function (word, i) {
      var tag = document.createElement('span');
      tag.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      tag.style.fontSize = '20px';
      tag.style.fontWeight = '700';
      tag.style.padding = '6px 20px';
      tag.style.background = 'var(--demo-bg)';
      tag.style.border = '2px solid var(--jojo-teal)';
      tag.style.borderRadius = '20px';
      tag.style.color = 'var(--jojo-teal)';
      tag.textContent = word;
      R.annotate(tag, 'target_words[' + i + ']');
      targetBar.appendChild(tag);
    });

    container.appendChild(targetBar);
  }

  // Grid mode (v1, v2)
  if (data.grid) {
    renderGrid(data, container, R);
    return;
  }

  // Paragraph mode (v3)
  if (data.paragraph) {
    renderParagraph(data, container, R);
  }
};

function renderGrid(data, container, R) {
  var grid = data.grid;
  var rows = grid.length;
  var cols = grid[0] ? grid[0].length : 5;
  var targets = (data.target_words || []).map(function (w) { return w.toLowerCase(); });

  // Center the grid
  var gridWrapper = document.createElement('div');
  gridWrapper.style.display = 'flex';
  gridWrapper.style.justifyContent = 'center';

  var gridEl = document.createElement('div');
  gridEl.className = 'ws-word-grid';
  gridEl.style.gridTemplateColumns = 'repeat(' + cols + ', 44px)';

  grid.forEach(function (row, ri) {
    row.forEach(function (cell, ci) {
      var cellEl = document.createElement('div');
      cellEl.className = 'ws-word-grid-cell';
      cellEl.style.width = '44px';
      cellEl.style.height = '44px';
      cellEl.textContent = cell;

      if (targets.indexOf(cell.toLowerCase()) !== -1) {
        cellEl.style.background = 'var(--demo-bg)';
        cellEl.style.fontWeight = '800';
      }

      gridEl.appendChild(cellEl);
    });
  });

  R.annotate(gridEl, 'grid');
  gridWrapper.appendChild(gridEl);
  container.appendChild(gridWrapper);
}

function renderParagraph(data, container, R) {
  var para = document.createElement('div');
  para.className = 'ws-passage';
  para.style.position = 'relative';
  para.style.maxWidth = '700px';
  para.style.margin = '0 auto';

  var text = data.paragraph;
  var targets = data.target_words || [];

  var escaped = targets.map(function (w) {
    return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  var regex = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

  var html = text.replace(regex, function (match) {
    return '<span class="ws-target-word" style="position:relative;display:inline-block;font-weight:700;color:var(--jojo-teal);">' + match + '</span>';
  });
  para.innerHTML = html;

  R.annotate(para, 'paragraph');
  container.appendChild(para);

  requestAnimationFrame(function () {
    var svg = R.svgOverlay();
    para.appendChild(svg);
    var pRect = para.getBoundingClientRect();
    var wordEls = para.querySelectorAll('.ws-target-word');
    wordEls.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      svg.appendChild(R.createSvgCircle(
        r.left + r.width / 2 - pRect.left,
        r.top + r.height / 2 - pRect.top,
        r.width / 2 + 4, r.height / 2 + 3, i * 23
      ));
    });
  });
}
