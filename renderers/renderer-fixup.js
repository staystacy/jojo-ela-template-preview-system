/* T-FIXUP — Error Correction Renderer */

window.JOJO_RENDERERS['T-FIXUP'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var items = data.items || [];
  var list = document.createElement('div');
  list.className = 'ws-items-list';
  list.style.gap = '24px';

  items.forEach(function (item, i) {
    var block = document.createElement('div');
    block.style.padding = '16px';
    block.style.background = 'var(--card-bg)';
    block.style.borderRadius = '12px';
    block.style.border = '1px solid var(--card-border)';

    // Item number header
    var header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '10px';
    header.appendChild(R.itemNumber(i + 1));

    var headerLabel = document.createElement('span');
    headerLabel.style.fontSize = '12px';
    headerLabel.style.color = 'var(--text-secondary)';
    headerLabel.style.fontWeight = '600';
    headerLabel.textContent = 'Find and fix the error(s):';
    header.appendChild(headerLabel);
    block.appendChild(header);

    // Error sentence with SVG circle overlay on errors
    var sentenceWrap = document.createElement('div');
    sentenceWrap.style.position = 'relative';

    var sentence = document.createElement('div');
    sentence.className = 'ws-error-sentence';

    var words = item.incorrect_sentence.split(/(\s+)/);
    var errors = item.errors || [];
    var errorMap = {};
    var errorByIndex = {};
    errors.forEach(function (err) {
      if (Number.isInteger(err.word_index) && err.word_index >= 0) {
        errorByIndex[err.word_index] = err;
      } else {
        errorMap[err.incorrect.toLowerCase()] = err;
      }
    });

    var wordIndex = 0;
    words.forEach(function (word) {
      var clean = word.replace(/[.,!?;:]/g, '').toLowerCase();
      var err = null;
      if (/\S/.test(word)) {
        err = errorByIndex[wordIndex] || errorMap[clean] || null;
        wordIndex += 1;
      }
      if (err) {
        var errSpan = document.createElement('span');
        errSpan.className = 'ws-error-word';
        errSpan.textContent = word;
        errSpan.title = err.type + ': should be "' + err.correct + '"';
        errSpan.style.position = 'relative';
        errSpan.style.display = 'inline-block';
        sentence.appendChild(errSpan);
      } else {
        sentence.appendChild(document.createTextNode(word));
      }
    });

    R.annotate(sentence, 'items[' + i + '].incorrect_sentence');
    sentenceWrap.appendChild(sentence);

    // Draw hand-drawn circles on error words
    (function (idx, wrap) {
      R.svgOverlayIn(wrap, function (svg, wrapRect) {
        var errorEls = wrap.querySelectorAll('.ws-error-word');
        errorEls.forEach(function (el, ei) {
          var r = el.getBoundingClientRect();
          svg.appendChild(R.createSvgCircle(
            r.left + r.width / 2 - wrapRect.left,
            r.top + r.height / 2 - wrapRect.top,
            r.width / 2 + 6, r.height / 2 + 6, idx * 7 + ei
          ));
        });
      });
    })(i, sentenceWrap);

    block.appendChild(sentenceWrap);

    // Corrected version typing area
    var typing = R.typingArea(1, 'Type the correct sentence...', item.correct_sentence);
    typing.style.marginTop = '10px';
    R.annotate(typing, 'items[' + i + '].correct_sentence');
    block.appendChild(typing);

    R.annotate(block, 'items[' + i + ']');
    list.appendChild(block);
  });

  container.appendChild(list);
};
