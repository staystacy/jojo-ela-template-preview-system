/* T-SENTENCE — Sentence Writing Renderer */

window.JOJO_RENDERERS['T-SENTENCE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  if (data.instruction_text) {
    var inst = R.instruction(data.instruction_text, data.instruction_audio);
    R.annotate(inst, 'instruction_text');
    container.appendChild(inst);
  }

  var prompts = data.prompts || [data.prompt].filter(Boolean);

  prompts.forEach(function (prompt, pi) {
    var block = document.createElement('div');
    block.style.marginBottom = '28px';

    // Prompt image
    if (prompt.image) {
      var img = R.imagePlaceholder(prompt.image, 200, 120);
      img.style.marginBottom = '12px';
      R.annotate(img, 'prompts[' + pi + '].image');
      block.appendChild(img);
    }

    // Prompt instruction
    if (prompt.instruction) {
      var pInst = document.createElement('div');
      pInst.style.fontSize = '15px';
      pInst.style.fontWeight = '600';
      pInst.style.color = 'var(--text-primary)';
      pInst.style.marginBottom = '10px';
      pInst.textContent = prompt.instruction;

      if (prompt.instruction_audio) {
        var row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        row.style.marginBottom = '10px';
        row.appendChild(R.audioButton(prompt.instruction_audio));
        row.appendChild(pInst);
        block.appendChild(row);
      } else {
        block.appendChild(pInst);
      }
    }

    // Word bank
    if (prompt.word_bank && prompt.word_bank.length > 0) {
      var wb = R.wordBank(prompt.word_bank);
      R.annotate(wb, 'prompts[' + pi + '].word_bank');
      block.appendChild(wb);
    }

    // Typing area(s)
    var sentences = prompt.expected_sentences || 1;
    for (var s = 0; s < sentences; s++) {
      var typing = R.typingArea(1, 'Write a sentence...');
      typing.style.marginBottom = '8px';
      block.appendChild(typing);
    }

    R.annotate(block, 'prompts[' + pi + ']');
    container.appendChild(block);
  });
};
