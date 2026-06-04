/* T-DICTATION -- Sentence Dictation Renderer */

window.JOJO_RENDERERS['T-DICTATION'] = function (data, container) {
  var R = window.JOJO_RENDER;

  if (data.instruction_text) {
    var inst = R.instruction(data.instruction_text, data.instruction_audio);
    R.annotate(inst, 'instruction_text');
    container.appendChild(inst);
  }

  var items = data.items || [];

  var list = document.createElement('div');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '24px';
  list.style.maxWidth = '720px';
  list.style.margin = '0 auto';

  items.forEach(function (item, i) {
    var row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'flex-start';
    row.style.gap = '12px';

    row.appendChild(R.itemNumber(i + 1));

    if (item.audio) {
      var btn = R.audioButton(item.audio);
      R.annotate(btn, 'items[' + i + '].audio');
      row.appendChild(btn);
    }

    var typing = R.typingArea(2, 'Type the sentence here', item.answer);
    typing.style.flex = '1';
    R.annotate(typing, 'items[' + i + '].answer');
    row.appendChild(typing);

    R.annotate(row, 'items[' + i + ']');
    list.appendChild(row);
  });

  container.appendChild(list);
};
