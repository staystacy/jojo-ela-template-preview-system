/* T-PASSAGE — Reading Comprehension Renderer */

window.JOJO_RENDERERS['T-PASSAGE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  if (data.instruction_text) {
    var inst = R.instruction(data.instruction_text, data.instruction_audio);
    R.annotate(inst, 'instruction_text');
    container.appendChild(inst);
  }

  // v5: Two-passage comparison
  if (data.variant === 'v5' && data.passages) {
    renderDualPassage(data, container, R);
    return;
  }

  // Standard layout: left passage, right questions
  var twoCol = document.createElement('div');
  twoCol.className = 'ws-two-col';

  // Left: passage
  var leftCol = document.createElement('div');
  leftCol.className = 'ws-col';
  leftCol.style.flex = '1.2';

  if (data.passage) {
    // Title
    if (data.passage.title) {
      var title = document.createElement('div');
      title.className = 'ws-passage-title';
      title.textContent = data.passage.title;
      R.annotate(title, 'passage.title');
      leftCol.appendChild(title);
    }

    // Image
    if (data.passage.image) {
      var img = R.imagePlaceholder(data.passage.image, 200, 120);
      R.annotate(img, 'passage.image');
      leftCol.appendChild(img);
    }

    // Text
    var passageText = document.createElement('div');
    passageText.className = 'ws-passage';
    passageText.textContent = data.passage.text;
    R.annotate(passageText, 'passage.text');
    leftCol.appendChild(passageText);

    // Word count badge
    if (data.passage.word_count) {
      var badge = document.createElement('div');
      badge.style.fontSize = '11px';
      badge.style.color = 'var(--text-hint)';
      badge.style.marginTop = '8px';
      badge.textContent = data.passage.word_count + ' words \u00B7 ' + (data.passage.genre || 'fiction');
      leftCol.appendChild(badge);
    }

    // Chart (v6)
    if (data.chart) {
      renderChart(data.chart, leftCol, R);
    }
  }

  twoCol.appendChild(leftCol);

  // Right: questions
  var rightCol = document.createElement('div');
  rightCol.className = 'ws-col';
  rightCol.style.flex = '1';

  var qTitle = R.sectionTitle('Questions');
  rightCol.appendChild(qTitle);

  var questions = data.questions || [];
  questions.forEach(function (q, qi) {
    var qBlock = document.createElement('div');
    qBlock.className = 'ws-question';

    // Question number + text
    var qHeader = document.createElement('div');
    qHeader.className = 'ws-question-text';
    qHeader.style.display = 'flex';
    qHeader.style.alignItems = 'flex-start';
    qHeader.style.gap = '8px';
    qHeader.appendChild(R.itemNumber(qi + 1));
    var qText = document.createElement('span');
    qText.textContent = q.question;
    qHeader.appendChild(qText);
    R.annotate(qHeader, 'questions[' + qi + '].question');
    qBlock.appendChild(qHeader);

    // Response area
    if (q.response_type === 'circle' && q.options) {
      // Circle options
      var opts = document.createElement('div');
      opts.style.display = 'flex';
      opts.style.flexDirection = 'column';
      opts.style.gap = '6px';
      opts.style.marginLeft = '36px';
      opts.style.position = 'relative';

      q.options.forEach(function (opt, oi) {
        var optEl = document.createElement('div');
        optEl.style.fontFamily = '"Andika", "Comic Neue", sans-serif';
        optEl.style.fontSize = '15px';
        optEl.style.padding = '6px 12px';
        optEl.style.background = 'var(--card-bg)';
        optEl.style.border = '1px solid var(--card-border)';
        optEl.style.borderRadius = '8px';
        optEl.style.color = opt.correct ? 'var(--pencil-blue)' : 'var(--text-primary)';
        if (opt.correct) {
          optEl.style.border = '2px solid var(--pencil-blue)';
        }
        optEl.textContent = String.fromCharCode(65 + oi) + '. ' + opt.text;
        optEl.id = 'passage-q' + qi + '-opt-' + oi;
        opts.appendChild(optEl);
      });

      qBlock.appendChild(opts);
    } else if (q.response_type === 'type') {
      // Typing response
      var typing = R.typingArea(q.answer_lines || 2, 'Type your answer...', q.answer);
      typing.style.marginLeft = '36px';
      R.annotate(typing, 'questions[' + qi + '].answer');
      qBlock.appendChild(typing);
    }

    R.annotate(qBlock, 'questions[' + qi + ']');
    rightCol.appendChild(qBlock);
  });

  twoCol.appendChild(rightCol);
  container.appendChild(twoCol);
};

function renderDualPassage(data, container, R) {
  var passages = data.passages || [];

  passages.forEach(function (p, pi) {
    var section = document.createElement('div');
    section.style.marginBottom = '24px';
    section.style.padding = '16px';
    section.style.background = pi === 0 ? 'var(--demo-bg)' : 'var(--card-bg)';
    section.style.borderRadius = '12px';
    section.style.border = '1px solid var(--warm-divider)';

    if (p.title) {
      var title = document.createElement('div');
      title.className = 'ws-passage-title';
      title.textContent = 'Passage ' + (pi + 1) + ': ' + p.title;
      section.appendChild(title);
    }

    var text = document.createElement('div');
    text.className = 'ws-passage';
    text.textContent = p.text;
    section.appendChild(text);

    R.annotate(section, 'passages[' + pi + ']');
    container.appendChild(section);
  });

  // Questions
  var qTitle = R.sectionTitle('Questions');
  container.appendChild(qTitle);

  var questions = data.questions || [];
  questions.forEach(function (q, qi) {
    var qBlock = document.createElement('div');
    qBlock.className = 'ws-question';

    var qHeader = document.createElement('div');
    qHeader.className = 'ws-question-text';
    qHeader.style.display = 'flex';
    qHeader.style.alignItems = 'flex-start';
    qHeader.style.gap = '8px';
    qHeader.appendChild(R.itemNumber(qi + 1));
    var qText = document.createElement('span');
    qText.textContent = q.question;
    qHeader.appendChild(qText);
    qBlock.appendChild(qHeader);

    var typing = R.typingArea(q.answer_lines || 2, 'Type your answer...', q.answer);
    typing.style.marginLeft = '36px';
    qBlock.appendChild(typing);

    R.annotate(qBlock, 'questions[' + qi + ']');
    container.appendChild(qBlock);
  });
}

function renderChart(chart, parentEl, R) {
  var chartEl = document.createElement('div');
  chartEl.className = 'ws-chart';

  var title = document.createElement('div');
  title.className = 'ws-chart-title';
  title.textContent = chart.title || 'Chart';
  chartEl.appendChild(title);

  if (chart.type === 'bar_chart' && chart.data) {
    var maxVal = Math.max.apply(null, chart.data.map(function (d) { return d.value; }));
    var barArea = document.createElement('div');
    barArea.className = 'ws-chart-bar-container';

    chart.data.forEach(function (d) {
      var group = document.createElement('div');
      group.className = 'ws-chart-bar-group';

      var valLabel = document.createElement('span');
      valLabel.className = 'ws-chart-bar-value';
      valLabel.textContent = d.value;
      group.appendChild(valLabel);

      var bar = document.createElement('div');
      bar.className = 'ws-chart-bar';
      bar.style.height = Math.round((d.value / maxVal) * 100) + 'px';
      group.appendChild(bar);

      var label = document.createElement('span');
      label.className = 'ws-chart-bar-label';
      label.textContent = d.label;
      group.appendChild(label);

      barArea.appendChild(group);
    });

    chartEl.appendChild(barArea);
  }

  R.annotate(chartEl, 'chart');
  parentEl.appendChild(chartEl);
}
