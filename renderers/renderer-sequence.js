/* T-SEQUENCE — Ordering Renderer */

window.JOJO_RENDERERS['T-SEQUENCE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var items = data.items || [];
  var displayOrder = data.display_order || items.map(function (_, i) { return i; });
  var isTextMode = items[0] && items[0].type !== 'image';

  // Pattern D layout
  var layout = document.createElement('div');
  layout.className = 'ws-layout-d';

  // Top: scrambled cards area
  var cardsArea = document.createElement('div');
  cardsArea.className = 'ws-cards-area';

  displayOrder.forEach(function (origIdx) {
    var item = items[origIdx] || items[0];
    var card = document.createElement('div');
    card.className = 'ws-draggable-card';

    if (isTextMode) {
      card.style.maxWidth = '100%';
      card.style.flex = '1 1 45%';
    }

    if (item.type === 'image') {
      card.classList.add('ws-card-image');
      card.appendChild(R.imagePlaceholder(item.content, 80, 60));
    } else {
      var text = document.createElement('span');
      text.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      text.style.fontSize = '14px';
      text.style.color = 'var(--text-primary)';
      text.textContent = item.content;
      card.appendChild(text);
    }

    cardsArea.appendChild(card);
  });

  layout.appendChild(cardsArea);

  // Drag hint
  var dragHint = document.createElement('div');
  dragHint.className = 'ws-drag-hint';
  dragHint.innerHTML = '<span class="ws-drag-arrow">\u25BC</span> Drag to arrange in order <span class="ws-drag-arrow">\u25BC</span>';
  layout.appendChild(dragHint);

  // Bottom: numbered slots
  var slotsArea = document.createElement('div');
  slotsArea.className = 'ws-slots-area';
  if (!isTextMode && items.length <= 4) {
    slotsArea.classList.add('ws-slots-area-2col');
  }

  var sorted = items.slice().sort(function (a, b) { return a.order - b.order; });

  sorted.forEach(function (item, i) {
    var slot = document.createElement('div');
    slot.className = 'ws-slot';

    var num = document.createElement('span');
    num.className = 'ws-slot-number';
    num.textContent = (i + 1);
    slot.appendChild(num);

    if (item.type === 'image') {
      slot.appendChild(R.imagePlaceholder(item.content, 60, 44));
    } else {
      var text = document.createElement('span');
      text.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      text.style.fontSize = '14px';
      text.style.color = 'var(--text-primary)';
      text.textContent = item.content;
      slot.appendChild(text);
    }

    R.annotate(slot, 'items[' + i + ']');
    slotsArea.appendChild(slot);
  });

  layout.appendChild(slotsArea);
  container.appendChild(layout);
};
