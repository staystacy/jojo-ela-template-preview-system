/* T-TRACE — Tracing Progression Renderer */

window.JOJO_RENDERERS['T-TRACE'] = function (data, container) {
  var R = window.JOJO_RENDER;

  // Instruction
  var inst = R.instruction(data.instruction_text, data.instruction_audio);
  R.annotate(inst, 'instruction_text');
  container.appendChild(inst);

  // Demo area
  if (data.demo_area) {
    var demo = R.demoArea(data.demo_area.content, data.demo_area.audio);
    R.annotate(demo, 'demo_area');
    container.appendChild(demo);
  }

  // Writing cells grid
  var cellSize = data.cell_size || 48;
  var cells = data.cells || [];

  var grid = document.createElement('div');
  grid.style.display = 'flex';
  grid.style.flexWrap = 'wrap';
  grid.style.gap = '10px';
  grid.style.justifyContent = 'center';

  cells.forEach(function (cellData, i) {
    var cell = R.writingCell(cellSize, cellData.scaffold, cellData.content || data.demo_area.content);
    R.annotate(cell, 'cells[' + i + ']');
    grid.appendChild(cell);
  });

  container.appendChild(grid);
};
