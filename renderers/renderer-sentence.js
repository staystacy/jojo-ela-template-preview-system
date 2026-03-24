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
    block.style.marginBottom = '24px';

    var hasImage = !!prompt.image;
    var hasWordBank = prompt.word_bank && prompt.word_bank.length > 0;

    if (hasImage) {
      // Layout: image left + content right
      var row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '20px';
      row.style.alignItems = 'flex-start';

      // Left: image
      var img = R.imagePlaceholder(prompt.image, 180, 120);
      R.annotate(img, 'prompts[' + pi + '].image');
      row.appendChild(img);

      // Right: instruction + word bank + typing
      var rightCol = document.createElement('div');
      rightCol.style.flex = '1';

      // Prompt instruction
      if (prompt.instruction) {
        var pInst = document.createElement('div');
        pInst.style.fontSize = '15px';
        pInst.style.fontWeight = '600';
        pInst.style.color = 'var(--text-primary)';
        pInst.style.marginBottom = '10px';

        if (prompt.instruction_audio) {
          var audioRow = document.createElement('div');
          audioRow.style.display = 'flex';
          audioRow.style.alignItems = 'center';
          audioRow.style.gap = '8px';
          audioRow.style.marginBottom = '10px';
          audioRow.appendChild(R.audioButton(prompt.instruction_audio));
          pInst.textContent = prompt.instruction;
          audioRow.appendChild(pInst);
          rightCol.appendChild(audioRow);
        } else {
          pInst.textContent = prompt.instruction;
          rightCol.appendChild(pInst);
        }
      }

      // Word bank
      if (hasWordBank) {
        var wb = R.wordBank(prompt.word_bank);
        R.annotate(wb, 'prompts[' + pi + '].word_bank');
        rightCol.appendChild(wb);
      }

      // Typing areas
      var sentences = prompt.expected_sentences || 1;
      for (var s = 0; s < sentences; s++) {
        var typing = R.typingArea(2, 'Write a sentence...');
        typing.style.marginBottom = '8px';
        rightCol.appendChild(typing);
      }

      row.appendChild(rightCol);
      block.appendChild(row);
    } else {
      // No image: vertical layout with prompt number

      // Prompt instruction
      if (prompt.instruction) {
        var pInst2 = document.createElement('div');
        pInst2.style.display = 'flex';
        pInst2.style.alignItems = 'center';
        pInst2.style.gap = '8px';
        pInst2.style.marginBottom = '10px';

        if (prompts.length > 1) {
          pInst2.appendChild(R.itemNumber(pi + 1));
        }

        if (prompt.instruction_audio) {
          pInst2.appendChild(R.audioButton(prompt.instruction_audio));
        }

        var instText = document.createElement('span');
        instText.style.fontSize = '15px';
        instText.style.fontWeight = '600';
        instText.style.color = 'var(--text-primary)';
        instText.textContent = prompt.instruction;
        pInst2.appendChild(instText);
        block.appendChild(pInst2);
      }

      // Word bank
      if (hasWordBank) {
        var wb2 = R.wordBank(prompt.word_bank);
        R.annotate(wb2, 'prompts[' + pi + '].word_bank');
        block.appendChild(wb2);
      }

      // Typing areas
      var sentences2 = prompt.expected_sentences || 1;
      for (var s2 = 0; s2 < sentences2; s2++) {
        var typing2 = R.typingArea(3, 'Write a sentence...');
        typing2.style.marginBottom = '8px';
        block.appendChild(typing2);
      }
    }

    R.annotate(block, 'prompts[' + pi + ']');
    container.appendChild(block);
  });
};
