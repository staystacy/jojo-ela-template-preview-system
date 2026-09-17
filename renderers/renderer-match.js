/* T-MATCH — Line Matching Renderer */

window.JOJO_RENDERERS['T-MATCH'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var pairs = data.pairs || [];

  // Three-zone layout: left 25% | center 50% (SVG lines) | right 25%
  var matchArea = document.createElement('div');
  matchArea.style.position = 'relative';
  matchArea.style.display = 'flex';
  matchArea.style.justifyContent = 'space-between';
  matchArea.style.alignItems = 'stretch';
  matchArea.style.minHeight = (pairs.length * 80 + 40) + 'px';
  matchArea.style.padding = '16px 0';

  // Left column (25%)
  var leftCol = document.createElement('div');
  leftCol.className = 'ws-col';
  leftCol.style.flex = '0 0 25%';
  leftCol.style.alignItems = 'flex-end';
  leftCol.style.justifyContent = 'space-around';
  leftCol.style.gap = '20px';

  // Right column (25%)
  var rightCol = document.createElement('div');
  rightCol.className = 'ws-col';
  rightCol.style.flex = '0 0 25%';
  rightCol.style.alignItems = 'flex-start';
  rightCol.style.justifyContent = 'space-around';
  rightCol.style.gap = '20px';

  // Shuffle right side for display
  var rightOrder = pairs.map(function (_, i) { return i; });
  var rng = R.seededRandom(42);
  for (var i = rightOrder.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var temp = rightOrder[i];
    rightOrder[i] = rightOrder[j];
    rightOrder[j] = temp;
  }

  pairs.forEach(function (pair, i) {
    var leftItem = document.createElement('div');
    leftItem.style.display = 'flex';
    leftItem.style.alignItems = 'center';
    leftItem.style.gap = '8px';
    leftItem.id = 'match-left-' + i;

    if (pair.left.audio) {
      leftItem.appendChild(R.audioButton(pair.left.audio));
    }

    if (pair.left.type === 'image') {
      leftItem.appendChild(R.imagePlaceholder(pair.left.content, 56, 56));
    } else {
      var lText = document.createElement('span');
      lText.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      lText.style.fontSize = '22px';
      lText.style.padding = '8px 16px';
      lText.style.background = 'var(--card-bg)';
      lText.style.border = '2px solid var(--card-border)';
      lText.style.borderRadius = '10px';
      lText.textContent = pair.left.content;
      leftItem.appendChild(lText);
    }

    R.annotate(leftItem, 'pairs[' + i + '].left');
    leftCol.appendChild(leftItem);
  });

  rightOrder.forEach(function (origIdx) {
    var pair = pairs[origIdx];
    var rightItem = document.createElement('div');
    rightItem.style.display = 'flex';
    rightItem.style.alignItems = 'center';
    rightItem.style.gap = '8px';
    rightItem.id = 'match-right-' + origIdx;

    if (pair.right.type === 'image') {
      rightItem.appendChild(R.imagePlaceholder(pair.right.content, 56, 56));
    } else {
      var rText = document.createElement('span');
      rText.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      rText.style.fontSize = '22px';
      rText.style.padding = '8px 16px';
      rText.style.background = 'var(--card-bg)';
      rText.style.border = '2px solid var(--card-border)';
      rText.style.borderRadius = '10px';
      rText.textContent = pair.right.content;
      rightItem.appendChild(rText);
    }

    R.annotate(rightItem, 'pairs[' + origIdx + '].right');
    rightCol.appendChild(rightItem);
  });

  matchArea.appendChild(leftCol);
  matchArea.appendChild(rightCol);
  container.appendChild(matchArea);

  // Draw SVG lines connecting matched pairs after layout
  requestAnimationFrame(function () {
    var svg = R.svgOverlay();
    matchArea.appendChild(svg);
    var areaRect = matchArea.getBoundingClientRect();

    pairs.forEach(function (pair, i) {
      var leftEl = document.getElementById('match-left-' + i);
      var rightEl = document.getElementById('match-right-' + i);
      if (!leftEl || !rightEl) return;

      var lRect = leftEl.getBoundingClientRect();
      var rRect = rightEl.getBoundingClientRect();

      var x1 = lRect.right - areaRect.left;
      var y1 = lRect.top + lRect.height / 2 - areaRect.top;
      var x2 = rRect.left - areaRect.left;
      var y2 = rRect.top + rRect.height / 2 - areaRect.top;

      svg.appendChild(R.createSvgLine(x1, y1, x2, y2, i * 7));
    });
  });
};
