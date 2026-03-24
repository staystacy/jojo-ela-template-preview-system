/* T-LISTEN — Listen & Respond Renderer */

window.JOJO_RENDERERS['T-LISTEN'] = function (data, container) {
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

    // Audio button
    if (item.audio) {
      var audio = R.audioButton(item.audio);
      R.annotate(audio, 'items[' + i + '].audio');
      row.appendChild(audio);
    }

    // Response area depends on response_type
    if (item.response_type === 'circle' && item.options) {
      // Circle from options
      var opts = document.createElement('div');
      opts.style.display = 'flex';
      opts.style.gap = '10px';
      opts.style.position = 'relative';

      item.options.forEach(function (opt, oi) {
        var card;
        if (opt.content && opt.content.indexOf('.png') !== -1) {
          card = document.createElement('div');
          card.className = 'ws-option-card';
          card.style.width = '80px';
          card.appendChild(R.imagePlaceholder(opt.content, 56, 50));
        } else {
          card = document.createElement('div');
          card.className = 'ws-option-card';
          card.style.width = '60px';
          card.style.minHeight = '44px';
          var t = document.createElement('span');
          t.className = 'ws-option-card-text';
          t.textContent = opt.content;
          card.appendChild(t);
        }
        card.id = 'listen-' + i + '-opt-' + oi;
        card.dataset.correct = opt.correct ? 'true' : 'false';
        opts.appendChild(card);
      });

      row.appendChild(opts);

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
      // Handwriting cells
      var answer = item.answer || '';
      answer.split('').forEach(function (ch) {
        row.appendChild(R.writingCell(cellSize, 'answer', ch));
      });
    } else if (item.response_type === 'type') {
      // Typing area
      var typing = R.typingArea(1, 'Type what you hear...', item.answer);
      typing.style.flex = '1';
      row.appendChild(typing);
    }

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
