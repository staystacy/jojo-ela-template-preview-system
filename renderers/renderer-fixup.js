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

  items.forEach(function (item, i) {
    var block = document.createElement('div');
    block.style.marginBottom = '20px';

    // Item number
    var header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.gap = '8px';
    header.style.marginBottom = '8px';
    header.appendChild(R.itemNumber(i + 1));

    // Error sentence
    var sentence = document.createElement('div');
    sentence.className = 'ws-error-sentence';

    // Split sentence into words and highlight errors
    var words = item.incorrect_sentence.split(/(\s+)/);
    var errors = item.errors || [];
    var errorMap = {};
    errors.forEach(function (err) {
      errorMap[err.incorrect.toLowerCase()] = err;
    });

    words.forEach(function (word) {
      var clean = word.replace(/[.,!?;:]/g, '').toLowerCase();
      if (errorMap[clean]) {
        var errSpan = document.createElement('span');
        errSpan.className = 'ws-error-word';
        errSpan.textContent = word;
        errSpan.title = errorMap[clean].type + ': should be "' + errorMap[clean].correct + '"';
        sentence.appendChild(errSpan);
      } else {
        sentence.appendChild(document.createTextNode(word));
      }
    });

    R.annotate(sentence, 'items[' + i + '].incorrect_sentence');
    header.appendChild(sentence);
    block.appendChild(header);

    // Corrected version typing area
    var corrLabel = document.createElement('div');
    corrLabel.style.fontSize = '12px';
    corrLabel.style.color = 'var(--text-secondary)';
    corrLabel.style.marginBottom = '4px';
    corrLabel.style.marginLeft = '36px';
    corrLabel.textContent = 'Write the correct sentence:';
    block.appendChild(corrLabel);

    var typing = R.typingArea(1, 'Type the corrected sentence...', item.correct_sentence);
    typing.style.marginLeft = '36px';
    R.annotate(typing, 'items[' + i + '].correct_sentence');
    block.appendChild(typing);

    R.annotate(block, 'items[' + i + ']');
    list.appendChild(block);
  });

  container.appendChild(list);
};
