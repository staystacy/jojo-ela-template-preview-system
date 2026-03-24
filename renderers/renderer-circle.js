/* T-CIRCLE — Circling Renderer */

window.JOJO_RENDERERS['T-CIRCLE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction, data.instruction_audio);
  R.annotate(inst, 'instruction');
  container.appendChild(inst);

  // v4: paragraph mode — circle words within text
  if (data.variant === 'v4' && data.paragraph) {
    renderParagraphMode(data, container, R);
    return;
  }

  // Grid mode (v1, v2, v3, v5)
  var options = data.options || [];

  // Determine grid columns based on option count
  var cols = 4;
  if (options.length <= 4) cols = 2;
  else if (options.length <= 6) cols = 3;

  var grid = document.createElement('div');
  grid.className = 'ws-layout-b';

  var gridArea = document.createElement('div');
  gridArea.className = 'ws-grid-area';
  gridArea.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
  gridArea.style.gap = '16px';
  gridArea.style.position = 'relative';

  options.forEach(function (opt, i) {
    var card = document.createElement('div');
    card.className = 'ws-option-card';
    card.style.width = '100%';
    card.style.minHeight = '80px';

    if (opt.type === 'image') {
      var img = R.imagePlaceholder(opt.content, 80, 60);
      card.appendChild(img);

      if (opt.label) {
        var label = document.createElement('span');
        label.className = 'ws-option-card-text';
        label.style.fontSize = '14px';
        label.style.marginTop = '4px';
        label.textContent = opt.label;
        card.appendChild(label);
      }

      if (opt.audio) {
        var audioBtn = R.audioButton(opt.audio);
        audioBtn.style.position = 'absolute';
        audioBtn.style.top = '4px';
        audioBtn.style.left = '4px';
        card.style.position = 'relative';
        card.appendChild(audioBtn);
      }
    } else {
      var text = document.createElement('span');
      text.className = 'ws-option-card-text';
      text.textContent = opt.content;
      card.appendChild(text);
    }

    card.id = 'circle-opt-' + i;
    card.dataset.correct = opt.correct ? 'true' : 'false';
    R.annotate(card, 'options[' + i + ']');
    gridArea.appendChild(card);
  });

  grid.appendChild(gridArea);
  container.appendChild(grid);

  // Draw hand-drawn circles on correct answers after layout
  requestAnimationFrame(function () {
    var svg = R.svgOverlay();
    gridArea.appendChild(svg);
    var gridRect = gridArea.getBoundingClientRect();

    options.forEach(function (opt, i) {
      if (!opt.correct) return;
      var el = document.getElementById('circle-opt-' + i);
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2 - gridRect.left;
      var cy = rect.top + rect.height / 2 - gridRect.top;
      var rx = rect.width / 2 + 6;
      var ry = rect.height / 2 + 6;
      svg.appendChild(R.createSvgCircle(cx, cy, rx, ry, i * 13));
    });
  });
};

function renderParagraphMode(data, container, R) {
  var para = document.createElement('div');
  para.className = 'ws-passage';
  para.style.position = 'relative';

  var text = data.paragraph;
  var targets = data.target_words || [];

  var escaped = targets.map(function (w) {
    return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  var regex = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

  var html = text.replace(regex, function (match) {
    return '<span class="ws-target-word" style="position:relative;display:inline-block;">' + match + '</span>';
  });
  para.innerHTML = html;

  R.annotate(para, 'paragraph');
  container.appendChild(para);

  requestAnimationFrame(function () {
    var svg = R.svgOverlay();
    para.appendChild(svg);
    var paraRect = para.getBoundingClientRect();

    var targetEls = para.querySelectorAll('.ws-target-word');
    targetEls.forEach(function (el, i) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2 - paraRect.left;
      var cy = rect.top + rect.height / 2 - paraRect.top;
      svg.appendChild(R.createSvgCircle(cx, cy, rect.width / 2 + 4, rect.height / 2 + 4, i * 17));
    });
  });
}
