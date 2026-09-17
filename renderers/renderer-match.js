/* T-MATCH — Line Matching Renderer */

// Spec (ELA_Template_40-DrawLine.md): every T-MATCH variant is a two-ROW layout —
// "上下各 4 張卡片，上排順序固定，下排打亂". There is no left/right column variant.
// pairs[].left is always the top row, pairs[].right the bottom row; whether a card
// holds a picture or text comes from its own `type`, so picture-first variants
// (picture_to_rhyme, picture_to_letter) put the image on top while picture_to_word
// puts it on the bottom.
function renderMatchItem(spec, R) {
  var item = document.createElement('div');
  item.style.display = 'flex';
  item.style.alignItems = 'center';
  item.style.justifyContent = 'center';
  item.style.gap = '8px';
  item.style.minWidth = '0';

  if (spec.audio) {
    item.appendChild(R.audioButton(spec.audio));
  }

  if (spec.type === 'image') {
    item.appendChild(R.imagePlaceholder(spec.content, 96, 96));
  } else {
    var card = document.createElement('span');
    card.style.minWidth = '86px';
    card.style.padding = '11px 14px';
    card.style.boxSizing = 'border-box';
    card.style.textAlign = 'center';
    card.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
    card.style.fontSize = '22px';
    card.style.fontWeight = '600';
    card.style.background = 'var(--card-bg)';
    card.style.border = '2px solid var(--card-border)';
    card.style.borderRadius = '10px';
    card.textContent = spec.content;
    item.appendChild(card);
  }

  return item;
}

function matchRow(pairCount) {
  var row = document.createElement('div');
  row.style.position = 'relative';
  row.style.zIndex = '1';
  row.style.display = 'grid';
  row.style.gridTemplateColumns = 'repeat(' + pairCount + ', minmax(0, 1fr))';
  row.style.gap = '28px';
  return row;
}

function renderMatchTopBottom(data, container, R, pairs) {
  var matchArea = document.createElement('div');
  matchArea.className = 'ws-match-row-layout';
  matchArea.style.position = 'relative';
  matchArea.style.width = '100%';
  // Spec pages are always 4 pairs; demo data goes up to 6, so widen instead of squeezing.
  matchArea.style.maxWidth = (pairs.length > 4 ? 780 + (pairs.length - 4) * 100 : 780) + 'px';
  matchArea.style.minHeight = '330px';
  matchArea.style.margin = '10px auto 0';
  matchArea.style.padding = '18px 12px';
  matchArea.style.boxSizing = 'border-box';

  var topRow = matchRow(pairs.length);
  topRow.style.alignItems = 'start';

  // Top row keeps the authored order (spec: 上排順序固定).
  pairs.forEach(function (pair, i) {
    var topItem = renderMatchItem(pair.left, R);
    topItem.className = 'ws-match-top-item';
    topItem.id = 'match-top-' + i;
    R.annotate(topItem, 'pairs[' + i + '].left');
    topRow.appendChild(topItem);
  });

  var bottomRow = matchRow(pairs.length);
  bottomRow.style.alignItems = 'end';
  bottomRow.style.marginTop = '115px';

  // Bottom row order comes from the page itself whenever the caller supplies it
  // (spec: 下排打亂 — the shuffling is the page author's decision, recorded in
  // bottomItems, not the renderer's). Reshuffling here drew the identical
  // crossing pattern for every page with the same card count, whatever the JSON
  // said. Mock data in data-match.js carries no order, so it keeps the
  // fixed-seed shuffle that made those demo pages look matched-up.
  var bottomOrder = data.bottom_order;
  if (!Array.isArray(bottomOrder) || bottomOrder.length !== pairs.length) {
    bottomOrder = pairs.map(function (_, i) { return i; });
    var rng = R.seededRandom(42);
    for (var i = bottomOrder.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var temp = bottomOrder[i];
      bottomOrder[i] = bottomOrder[j];
      bottomOrder[j] = temp;
    }
  }

  bottomOrder.forEach(function (origIdx) {
    var bottomItem = renderMatchItem(pairs[origIdx].right, R);
    bottomItem.className = 'ws-match-bottom-item';
    bottomItem.id = 'match-bottom-' + origIdx;
    bottomItem.style.minHeight = '100px';
    R.annotate(bottomItem, 'pairs[' + origIdx + '].right');
    bottomRow.appendChild(bottomItem);
  });

  matchArea.appendChild(topRow);
  matchArea.appendChild(bottomRow);
  container.appendChild(matchArea);

  R.svgOverlayIn(matchArea, function (svg, areaRect) {
    pairs.forEach(function (_, i) {
      var topEl = document.getElementById('match-top-' + i);
      var bottomEl = document.getElementById('match-bottom-' + i);
      if (!topEl || !bottomEl) return;

      var topRect = topEl.getBoundingClientRect();
      var bottomRect = bottomEl.getBoundingClientRect();
      var x1 = topRect.left + topRect.width / 2 - areaRect.left;
      var y1 = topRect.bottom - areaRect.top;
      var x2 = bottomRect.left + bottomRect.width / 2 - areaRect.left;
      var y2 = bottomRect.top - areaRect.top;
      svg.appendChild(R.createSvgLine(x1, y1, x2, y2, i * 7));
    });
  });
}

window.JOJO_RENDERERS['T-MATCH'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  renderMatchTopBottom(data, container, R, data.pairs || []);
};
