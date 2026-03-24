/* JOJO ELA — Shared Rendering Utilities */

window.JOJO_RENDER = (function () {
  'use strict';

  // ========== Item Number Circle ==========
  function itemNumber(n) {
    var el = document.createElement('span');
    el.className = 'ws-item-number';
    el.textContent = n;
    return el;
  }

  // ========== Audio Button ==========
  function audioButton(audioFile) {
    var btn = document.createElement('button');
    btn.className = 'ws-audio-btn';
    btn.title = audioFile ? 'Audio: ' + audioFile : 'Play audio';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    return btn;
  }

  // ========== Writing Cell ==========
  function writingCell(size, scaffold, content) {
    var el = document.createElement('div');
    el.className = 'ws-cell';
    var px = size || 48;
    el.style.width = px + 'px';
    el.style.height = px + 'px';
    el.style.fontSize = Math.round(px * 0.55) + 'px';
    el.style.lineHeight = px + 'px';

    if (scaffold === 'trace') {
      el.classList.add('ws-cell-trace');
      el.textContent = content || '';
    } else if (scaffold === 'faded') {
      el.classList.add('ws-cell-faded');
      el.textContent = content || '';
    } else if (scaffold === 'answer') {
      el.classList.add('ws-cell-answer');
      el.textContent = content || '';
    } else {
      el.classList.add('ws-cell-blank');
      el.textContent = content || '';
    }
    return el;
  }

  // ========== Demo Area ==========
  function demoArea(content, audioFile) {
    var el = document.createElement('div');
    el.className = 'ws-demo';

    if (typeof content === 'string') {
      var letter = document.createElement('span');
      letter.className = 'ws-demo-letter';
      letter.textContent = content;
      el.appendChild(letter);
    } else if (content instanceof HTMLElement) {
      el.appendChild(content);
    }

    if (audioFile) {
      el.appendChild(audioButton(audioFile));
    }

    return el;
  }

  // ========== Image Placeholder ==========
  function imagePlaceholder(filename, width, height) {
    var el = document.createElement('div');
    el.className = 'ws-image-placeholder';
    el.style.width = (width || 80) + 'px';
    el.style.height = (height || 80) + 'px';
    el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
    var label = document.createElement('span');
    label.textContent = filename || 'image';
    el.appendChild(label);
    return el;
  }

  // ========== Typing Area ==========
  function typingArea(lines, placeholder, value) {
    var el = document.createElement('div');
    el.className = 'ws-typing-area';
    var lineHeight = 28;
    el.style.minHeight = ((lines || 1) * lineHeight + 20) + 'px';
    if (value) {
      el.textContent = value;
    } else if (placeholder) {
      el.textContent = placeholder;
      el.style.color = 'var(--text-hint)';
    }
    return el;
  }

  // ========== Instruction ==========
  function instruction(text, audioFile) {
    var row = document.createElement('div');
    row.className = 'ws-instruction';

    if (audioFile) {
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '10px';
      row.appendChild(audioButton(audioFile));
    }

    var span = document.createElement('span');
    span.textContent = text;
    row.appendChild(span);
    return row;
  }

  // ========== Hand-Drawn Circle (SVG path) ==========
  function handDrawnCirclePath(cx, cy, rx, ry, seed) {
    var rng = seededRandom(seed || 0);
    var segments = 10;
    var points = [];
    for (var i = 0; i < segments; i++) {
      var angle = (i / segments) * Math.PI * 2;
      var jitterX = (rng() - 0.5) * 4;
      var jitterY = (rng() - 0.5) * 4;
      points.push({
        x: cx + Math.cos(angle) * rx + jitterX,
        y: cy + Math.sin(angle) * ry + jitterY
      });
    }

    // Build smooth closed path using cubic bezier
    var d = 'M ' + points[0].x.toFixed(1) + ' ' + points[0].y.toFixed(1);
    for (var i = 0; i < segments; i++) {
      var p0 = points[i];
      var p1 = points[(i + 1) % segments];
      var cpx = (p0.x + p1.x) / 2 + (rng() - 0.5) * 3;
      var cpy = (p0.y + p1.y) / 2 + (rng() - 0.5) * 3;
      d += ' Q ' + cpx.toFixed(1) + ' ' + cpy.toFixed(1) + ' ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1);
    }
    d += ' Z';
    return d;
  }

  function createSvgCircle(cx, cy, rx, ry, seed) {
    var ns = 'http://www.w3.org/2000/svg';
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', handDrawnCirclePath(cx, cy, rx, ry, seed));
    path.setAttribute('class', 'ws-circle-gesture');
    return path;
  }

  // ========== Hand-Drawn Line (SVG path) ==========
  function createSvgLine(x1, y1, x2, y2, seed) {
    var ns = 'http://www.w3.org/2000/svg';
    var rng = seededRandom(seed || 0);
    var midX = (x1 + x2) / 2 + (rng() - 0.5) * 12;
    var midY = (y1 + y2) / 2 + (rng() - 0.5) * 12;
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + midX + ' ' + midY + ' ' + x2 + ' ' + y2);
    path.setAttribute('class', 'ws-line-gesture');
    return path;
  }

  // ========== SVG Overlay ==========
  function svgOverlay() {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'ws-svg-overlay');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';
    return svg;
  }

  // ========== Arrow ==========
  function arrow() {
    var el = document.createElement('span');
    el.className = 'ws-arrow';
    el.textContent = '\u2192';
    return el;
  }

  // ========== Phoneme Button ==========
  function phonemeButton(label, audioFile) {
    var btn = document.createElement('button');
    btn.className = 'ws-phoneme-btn';
    btn.textContent = label;
    if (audioFile) {
      btn.title = 'Audio: ' + audioFile;
    }
    return btn;
  }

  // ========== Item Row ==========
  function itemRow() {
    var el = document.createElement('div');
    el.className = 'ws-item-row';
    return el;
  }

  // ========== Option Card ==========
  function optionCard(content, type, width, height) {
    var card = document.createElement('div');
    card.className = 'ws-option-card';
    card.style.width = (width || 120) + 'px';

    if (type === 'image') {
      card.appendChild(imagePlaceholder(content, width ? width - 24 : 80, height || 60));
    } else {
      var text = document.createElement('span');
      text.className = 'ws-option-card-text';
      text.textContent = content;
      card.appendChild(text);
    }
    return card;
  }

  // ========== Seeded Random ==========
  function seededRandom(seed) {
    var s = seed + 1;
    return function () {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // ========== Word Bank ==========
  function wordBank(words) {
    var el = document.createElement('div');
    el.className = 'ws-word-bank';
    words.forEach(function (w) {
      var item = document.createElement('span');
      item.className = 'ws-word-bank-item';
      item.textContent = w;
      el.appendChild(item);
    });
    return el;
  }

  // ========== Section Title ==========
  function sectionTitle(text) {
    var el = document.createElement('div');
    el.className = 'ws-section-title';
    el.textContent = text;
    return el;
  }

  // ========== Wrap with data-field for annotations ==========
  function annotate(el, fieldName) {
    el.setAttribute('data-field', fieldName);
    return el;
  }

  // ========== Public API ==========
  return {
    itemNumber: itemNumber,
    audioButton: audioButton,
    writingCell: writingCell,
    demoArea: demoArea,
    imagePlaceholder: imagePlaceholder,
    typingArea: typingArea,
    instruction: instruction,
    handDrawnCirclePath: handDrawnCirclePath,
    createSvgCircle: createSvgCircle,
    createSvgLine: createSvgLine,
    svgOverlay: svgOverlay,
    arrow: arrow,
    phonemeButton: phonemeButton,
    itemRow: itemRow,
    optionCard: optionCard,
    seededRandom: seededRandom,
    wordBank: wordBank,
    sectionTitle: sectionTitle,
    annotate: annotate
  };
})();
