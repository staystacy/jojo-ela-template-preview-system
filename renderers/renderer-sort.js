/* T-SORT — Drag-to-Classify Renderer */

window.JOJO_RENDERERS['T-SORT'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var cards = data.cards || [];
  var buckets = data.buckets || [];

  // Pattern D layout
  var layout = document.createElement('div');
  layout.className = 'ws-layout-d';

  // Cards area (top, flex-wrapped)
  var cardsArea = document.createElement('div');
  cardsArea.className = 'ws-cards-area';

  cards.forEach(function (card, i) {
    var cardEl = document.createElement('div');
    cardEl.className = 'ws-draggable-card';

    if (card.type === 'image') {
      cardEl.classList.add('ws-card-image');
      cardEl.appendChild(R.imagePlaceholder(card.content, 60, 50));
    } else {
      var text = document.createElement('span');
      text.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      text.style.fontSize = card.type === 'sentence' ? '14px' : '18px';
      text.textContent = card.content;
      cardEl.appendChild(text);
    }

    R.annotate(cardEl, 'cards[' + i + ']');
    cardsArea.appendChild(cardEl);
  });

  layout.appendChild(cardsArea);

  // Drag hint
  var dragHint = document.createElement('div');
  dragHint.className = 'ws-drag-hint';
  dragHint.innerHTML = '<span class="ws-drag-arrow">\u25BC</span> Drag to sort <span class="ws-drag-arrow">\u25BC</span>';
  layout.appendChild(dragHint);

  // Buckets area (bottom, equal-width columns)
  var bucketsArea = document.createElement('div');
  bucketsArea.className = 'ws-buckets-area';

  buckets.forEach(function (bucket, bi) {
    var bucketEl = document.createElement('div');
    bucketEl.className = 'ws-bucket';

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
      mini.style.fontSize = '14px';
      mini.style.padding = '4px 10px';
      mini.style.background = 'var(--demo-bg)';
      mini.style.borderRadius = '6px';
      mini.style.marginBottom = '4px';
      mini.style.color = 'var(--text-primary)';
      mini.style.textAlign = 'center';
      mini.textContent = card.content;
      bucketEl.appendChild(mini);
    });

    R.annotate(bucketEl, 'buckets[' + bi + ']');
    bucketsArea.appendChild(bucketEl);
  });

  layout.appendChild(bucketsArea);
  container.appendChild(layout);
};
