/* T-SORT — Drag-to-Classify Renderer */

window.JOJO_RENDERERS['T-SORT'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cards = data.cards || [];
  var buckets = data.buckets || [];

  // Cards area (scattered look)
  var cardsArea = document.createElement('div');
  cardsArea.style.display = 'flex';
  cardsArea.style.flexWrap = 'wrap';
  cardsArea.style.gap = '10px';
  cardsArea.style.justifyContent = 'center';
  cardsArea.style.marginBottom = '24px';

  cards.forEach(function (card, i) {
    var cardEl = document.createElement('div');
    cardEl.className = 'ws-option-card';
    cardEl.style.width = 'auto';
    cardEl.style.minWidth = '80px';
    cardEl.style.padding = '8px 16px';

    if (card.type === 'image') {
      cardEl.appendChild(R.imagePlaceholder(card.content, 60, 50));
    } else {
      var text = document.createElement('span');
      text.className = 'ws-option-card-text';
      text.style.fontSize = card.type === 'sentence' ? '14px' : '18px';
      text.textContent = card.content;
      cardEl.appendChild(text);
    }

    // Show which bucket it belongs to with a subtle indicator
    cardEl.style.borderColor = 'var(--jojo-teal)';
    R.annotate(cardEl, 'cards[' + i + ']');
    cardsArea.appendChild(cardEl);
  });

  container.appendChild(cardsArea);

  // Arrow down indicator
  var arrowDown = document.createElement('div');
  arrowDown.style.textAlign = 'center';
  arrowDown.style.fontSize = '20px';
  arrowDown.style.color = 'var(--text-hint)';
  arrowDown.style.marginBottom = '16px';
  arrowDown.textContent = '\u25BC';
  container.appendChild(arrowDown);

  // Buckets
  var bucketsRow = document.createElement('div');
  bucketsRow.style.display = 'flex';
  bucketsRow.style.gap = '16px';
  bucketsRow.style.justifyContent = 'center';

  buckets.forEach(function (bucket, bi) {
    var bucketEl = document.createElement('div');
    bucketEl.className = 'ws-bucket';
    bucketEl.style.flex = '1';
    bucketEl.style.maxWidth = '280px';

    var label = document.createElement('div');
    label.className = 'ws-bucket-label';
    label.textContent = bucket.label;
    R.annotate(label, 'buckets[' + bi + '].label');
    bucketEl.appendChild(label);

    // Show sorted cards inside buckets
    var sortedCards = cards.filter(function (c) { return c.correct_bucket === bucket.id; });
    sortedCards.forEach(function (card) {
      var mini = document.createElement('div');
      mini.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      mini.style.fontSize = '15px';
      mini.style.padding = '4px 10px';
      mini.style.background = 'var(--demo-bg)';
      mini.style.borderRadius = '6px';
      mini.style.marginBottom = '4px';
      mini.style.color = 'var(--text-primary)';
      mini.textContent = card.content;
      bucketEl.appendChild(mini);
    });

    R.annotate(bucketEl, 'buckets[' + bi + ']');
    bucketsRow.appendChild(bucketEl);
  });

  container.appendChild(bucketsRow);
};
