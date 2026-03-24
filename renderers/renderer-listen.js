/* T-LISTEN — Listen & Respond Renderer */

window.JOJO_RENDERERS['T-LISTEN'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var items = data.items || [];

  // Items in a grid layout
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '16px';
  // Use 2 columns for circle mode with few items, 1 column for write/type
  var hasCircle = items[0] && items[0].response_type === 'circle';
  grid.style.gridTemplateColumns = (hasCircle && items.length >= 4) ? 'repeat(2, 1fr)' : '1fr';

  items.forEach(function (item, i) {
    // Listen item card: audio button left + response area right
    var card = document.createElement('div');
    card.className = 'ws-listen-item';

    // Left: item number + large audio button
    var audioCol = document.createElement('div');
    audioCol.className = 'ws-audio-col';
    audioCol.appendChild(R.itemNumber(i + 1));

    if (item.audio) {
      var audio = R.audioButton(item.audio);
      R.annotate(audio, 'items[' + i + '].audio');
      audioCol.appendChild(audio);
    }

    card.appendChild(audioCol);

    // Right: response area
    var responseCol = document.createElement('div');
    responseCol.className = 'ws-response-col';

    if (item.response_type === 'circle' && item.options) {
      // 2×2 grid of options
      var opts = document.createElement('div');
      opts.style.display = 'grid';
      opts.style.gridTemplateColumns = 'repeat(2, 1fr)';
      opts.style.gap = '8px';
      opts.style.position = 'relative';

      item.options.forEach(function (opt, oi) {
        var optCard;
        if (opt.content && opt.content.indexOf('.png') !== -1) {
          optCard = document.createElement('div');
          optCard.className = 'ws-option-card';
          optCard.style.width = '100%';
          optCard.appendChild(R.imagePlaceholder(opt.content, 48, 40));
        } else {
          optCard = document.createElement('div');
          optCard.className = 'ws-option-card';
          optCard.style.width = '100%';
          optCard.style.minHeight = '40px';
          var t = document.createElement('span');
          t.className = 'ws-option-card-text';
          t.textContent = opt.content;
          optCard.appendChild(t);
        }
        optCard.id = 'listen-' + i + '-opt-' + oi;
        optCard.dataset.correct = opt.correct ? 'true' : 'false';
        opts.appendChild(optCard);
      });

      responseCol.appendChild(opts);

      // Draw circle on correct after layout
      (function (itemIdx, optionsEl, optsList) {
        requestAnimationFrame(function () {
          var svg = R.svgOverlay();
          optionsEl.appendChild(svg);
          var pRect = optionsEl.getBoundingClientRect();
          optsList.forEach(function (opt, oi) {
            if (!opt.correct) return;
            var el = document.getElementById('listen-' + itemIdx + '-opt-' + oi);
            if (!el) return;
            var r = el.getBoundingClientRect();
            svg.appendChild(R.createSvgCircle(
              r.left + r.width / 2 - pRect.left,
              r.top + r.height / 2 - pRect.top,
              r.width / 2 + 4, r.height / 2 + 4, itemIdx * 11 + oi
            ));
          });
        });
      })(i, opts, item.options);

    } else if (item.response_type === 'write') {
      var cellGroup = document.createElement('div');
      cellGroup.className = 'ws-soundbox-group';
      var answer = item.answer || '';
      answer.split('').forEach(function (ch) {
        cellGroup.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
      responseCol.appendChild(cellGroup);

    } else if (item.response_type === 'type') {
      var typing = R.typingArea(2, 'Type what you hear...', item.answer);
      responseCol.appendChild(typing);
    }

    card.appendChild(responseCol);
    R.annotate(card, 'items[' + i + ']');
    grid.appendChild(card);
  });

  container.appendChild(grid);
};
