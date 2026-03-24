/* T-LADDER — Word Family Ladder Renderer */

window.JOJO_RENDERERS['T-LADDER'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cellSize = data.cell_size || 48;
  var ladders = data.ladders || [];
  var laddersRow = document.createElement('div');
  laddersRow.style.display = 'flex';
  laddersRow.style.gap = '40px';
  laddersRow.style.justifyContent = 'center';

  ladders.forEach(function (ladder, li) {
    var ladderEl = document.createElement('div');
    ladderEl.className = 'ws-ladder';

    // Word family label
    var familyLabel = document.createElement('div');
    familyLabel.style.textAlign = 'center';
    familyLabel.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    familyLabel.style.fontSize = '24px';
    familyLabel.style.fontWeight = '700';
    familyLabel.style.color = 'var(--jojo-teal)';
    familyLabel.style.marginBottom = '12px';
    familyLabel.textContent = ladder.word_family;
    R.annotate(familyLabel, 'ladders[' + li + '].word_family');
    ladderEl.appendChild(familyLabel);

    // Rungs (bottom to top visual, but we render top to bottom)
    var rungs = ladder.rungs || [];
    rungs.forEach(function (rung, ri) {
      var rungEl = document.createElement('div');
      rungEl.className = 'ws-ladder-rung';
      rungEl.style.paddingLeft = (ri * 16) + 'px';

      // Hint letter
      var hintEl = document.createElement('span');
      hintEl.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      hintEl.style.fontSize = '22px';
      hintEl.style.fontWeight = '700';
      hintEl.style.color = 'var(--jojo-teal)';
      hintEl.style.width = '24px';
      hintEl.textContent = rung.hint;
      R.annotate(hintEl, 'ladders[' + li + '].rungs[' + ri + '].hint');
      rungEl.appendChild(hintEl);

      // Writing cell for the full word
      var answer = rung.answer || '';
      answer.split('').forEach(function (ch, ci) {
        var scaffold = ci === 0 ? 'trace' : 'answer';
        rungEl.appendChild(R.writingCell(cellSize, scaffold, ch));
      });

      // Image
      if (rung.image) {
        var img = R.imagePlaceholder(rung.image, 44, 44);
        R.annotate(img, 'ladders[' + li + '].rungs[' + ri + '].image');
        rungEl.appendChild(img);
      }

      R.annotate(rungEl, 'ladders[' + li + '].rungs[' + ri + ']');
      ladderEl.appendChild(rungEl);
    });

    R.annotate(ladderEl, 'ladders[' + li + ']');
    laddersRow.appendChild(ladderEl);
  });

  container.appendChild(laddersRow);
};
