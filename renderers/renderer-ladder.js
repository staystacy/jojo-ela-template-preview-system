/* T-LADDER — Word Family Ladder Renderer */

window.JOJO_RENDERERS['T-LADDER'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var ladders = data.ladders || [];

  // Side-by-side ladders
  var laddersRow = document.createElement('div');
  laddersRow.style.display = 'flex';
  laddersRow.style.gap = '40px';
  laddersRow.style.justifyContent = 'center';
  laddersRow.style.flex = '1';

  ladders.forEach(function (ladder, li) {
    var ladderEl = document.createElement('div');
    ladderEl.className = 'ws-ladder';
    ladderEl.style.flex = '1';
    ladderEl.style.maxWidth = '400px';
    ladderEl.style.background = 'var(--card-bg)';
    ladderEl.style.borderRadius = '12px';
    ladderEl.style.padding = '16px';
    ladderEl.style.border = '1px solid var(--card-border)';

    // Word family title
    var familyLabel = document.createElement('div');
    familyLabel.style.textAlign = 'center';
    familyLabel.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    familyLabel.style.fontSize = '24px';
    familyLabel.style.fontWeight = '700';
    familyLabel.style.color = 'var(--jojo-teal)';
    familyLabel.style.marginBottom = '16px';
    familyLabel.style.padding = '8px';
    familyLabel.style.background = 'var(--demo-bg)';
    familyLabel.style.borderRadius = '8px';
    familyLabel.textContent = ladder.word_family;
    R.annotate(familyLabel, 'ladders[' + li + '].word_family');
    ladderEl.appendChild(familyLabel);

    // Rungs - bottom to top (reverse the array for display)
    var rungs = ladder.rungs || [];
    var displayRungs = rungs.slice().reverse();

    displayRungs.forEach(function (rung, ri) {
      var actualIndex = rungs.length - 1 - ri;
      var rungEl = document.createElement('div');
      rungEl.className = 'ws-ladder-rung';
      rungEl.style.paddingLeft = ((rungs.length - 1 - ri) * 12) + 'px';
      rungEl.style.borderBottom = '2px solid var(--warm-divider)';
      rungEl.style.paddingBottom = '6px';
      rungEl.style.marginBottom = '6px';

      // Step number
      var stepNum = document.createElement('span');
      stepNum.style.fontSize = '11px';
      stepNum.style.color = 'var(--text-hint)';
      stepNum.style.width = '20px';
      stepNum.style.textAlign = 'center';
      stepNum.textContent = (actualIndex + 1);
      rungEl.appendChild(stepNum);

      // Hint letter
      var hintEl = document.createElement('span');
      hintEl.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      hintEl.style.fontSize = '22px';
      hintEl.style.fontWeight = '700';
      hintEl.style.color = 'var(--jojo-teal)';
      hintEl.style.width = '24px';
      hintEl.textContent = rung.hint;
      R.annotate(hintEl, 'ladders[' + li + '].rungs[' + actualIndex + '].hint');
      rungEl.appendChild(hintEl);

      // Writing cells for the full word
      var cellGroup = document.createElement('div');
      cellGroup.className = 'ws-soundbox-group';
      var answer = rung.answer || '';
      answer.split('').forEach(function (ch, ci) {
        var scaffold = ci === 0 ? 'trace' : 'answer';
        cellGroup.appendChild(R.writingCell(cellSize, scaffold, ch));
      });
      rungEl.appendChild(cellGroup);

      // Image
      if (rung.image) {
        var img = R.imagePlaceholder(rung.image, 40, 40);
        R.annotate(img, 'ladders[' + li + '].rungs[' + actualIndex + '].image');
        rungEl.appendChild(img);
      }

      R.annotate(rungEl, 'ladders[' + li + '].rungs[' + actualIndex + ']');
      ladderEl.appendChild(rungEl);
    });

    R.annotate(ladderEl, 'ladders[' + li + ']');
    laddersRow.appendChild(ladderEl);
  });

  container.appendChild(laddersRow);
};
