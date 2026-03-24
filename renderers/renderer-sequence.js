/* T-SEQUENCE — Ordering Renderer */

window.JOJO_RENDERERS['T-SEQUENCE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  var items = data.items || [];
  var displayOrder = data.display_order || items.map(function (_, i) { return i; });

  // Show items in scrambled order at top
  var scrambledTitle = R.sectionTitle('Arrange in order:');
  container.appendChild(scrambledTitle);

  var scrambled = document.createElement('div');
  scrambled.style.display = 'flex';
  scrambled.style.flexWrap = 'wrap';
  scrambled.style.gap = '10px';
  scrambled.style.marginBottom = '24px';
  scrambled.style.justifyContent = 'center';

  displayOrder.forEach(function (origIdx) {
    var item = items[origIdx] || items[0];
    var card = document.createElement('div');
    card.className = 'ws-option-card';
    card.style.width = 'auto';
    card.style.maxWidth = '200px';
    card.style.padding = '10px 16px';

    if (item.type === 'image') {
      card.appendChild(R.imagePlaceholder(item.content, 80, 60));
    } else {
      var text = document.createElement('span');
      text.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
      text.style.fontSize = '15px';
      text.style.color = 'var(--text-primary)';
      text.textContent = item.content;
      card.appendChild(text);
    }

    scrambled.appendChild(card);
  });

  container.appendChild(scrambled);

  // Arrow
  var arrowDown = document.createElement('div');
  arrowDown.style.textAlign = 'center';
  arrowDown.style.fontSize = '20px';
  arrowDown.style.color = 'var(--text-hint)';
  arrowDown.style.marginBottom = '16px';
  arrowDown.textContent = '\u25BC';
  container.appendChild(arrowDown);

  // Correct order slots
  var correctTitle = R.sectionTitle('Correct order:');
  container.appendChild(correctTitle);

  var slots = document.createElement('div');
  slots.style.display = 'flex';
  slots.style.flexDirection = 'column';
  slots.style.gap = '8px';
  slots.style.maxWidth = '500px';
  slots.style.margin = '0 auto';

  // Sort by order
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
      text.style.fontSize = '15px';
      text.style.color = 'var(--text-primary)';
      text.textContent = item.content;
      slot.appendChild(text);
    }

    R.annotate(slot, 'items[' + i + ']');
    slots.appendChild(slot);
  });

  container.appendChild(slots);
};
