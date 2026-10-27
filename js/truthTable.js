/**
 * DE VIRTUAL LAB — TRUTH TABLE ENGINE (truthTable.js)
 * Generates 2^n row truth tables for logic gates and circuits
 * Renders HTML tables, highlights current active input state, and exports CSV
 */

import { GateLogic } from './gates.js';

export const TruthTableEngine = {
  /**
   * Generate truth table rows array for a given gate or circuit
   */
  generateGateTable(gateName, numInputs = 2, currentInputs = { A: 0, B: 0 }) {
    const rows = [];
    const gName = GateLogic.normalizeGateName(gateName);
    const isSingleInput = gName === 'NOT' || numInputs === 1;
    const count = isSingleInput ? 2 : (numInputs === 3 ? 8 : (numInputs === 4 ? 16 : 4));

    for (let i = 0; i < count; i++) {
      let a, b, c, d, out;

      if (isSingleInput) {
        a = i;
        out = GateLogic.NOT(a);
        const isActive = Number(currentInputs.A) === a;
        rows.push({ A: a, OUT: out, isActive });
      } else if (numInputs === 2) {
        a = (i >> 1) & 1;
        b = i & 1;
        out = GateLogic.evaluate(gName, { A: a, B: b });
        const isActive = Number(currentInputs.A) === a && Number(currentInputs.B) === b;
        rows.push({ A: a, B: b, OUT: out, isActive });
      } else if (numInputs === 3) {
        a = (i >> 2) & 1;
        b = (i >> 1) & 1;
        c = i & 1;
        out = GateLogic.evaluate(gName, { A: a, B: b, C: c });
        const isActive = Number(currentInputs.A) === a && Number(currentInputs.B) === b && Number(currentInputs.C) === c;
        rows.push({ A: a, B: b, C: c, OUT: out, isActive });
      } else if (numInputs === 4) {
        a = (i >> 3) & 1;
        b = (i >> 2) & 1;
        c = (i >> 1) & 1;
        d = i & 1;
        out = GateLogic.evaluate(gName, { A: a, B: b, C: c, D: d });
        const isActive = Number(currentInputs.A) === a && Number(currentInputs.B) === b && Number(currentInputs.C) === c && Number(currentInputs.D) === d;
        rows.push({ A: a, B: b, C: c, D: d, OUT: out, isActive });
      }
    }

    return rows;
  },

  /**
   * Render HTML Table element inside target container
   */
  renderTableHTML(containerId, gateName, numInputs = 2, currentInputs = { A: 0, B: 0 }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const rows = this.generateGateTable(gateName, numInputs, currentInputs);
    const gName = GateLogic.normalizeGateName(gateName);
    const isSingleInput = gName === 'NOT' || numInputs === 1;

    let headersHtml = isSingleInput
      ? `<th>A</th><th>OUTPUT (${gName})</th>`
      : (numInputs === 3
        ? `<th>A</th><th>B</th><th>C</th><th>OUTPUT (${gName})</th>`
        : (numInputs === 4
          ? `<th>A</th><th>B</th><th>C</th><th>D</th><th>OUTPUT (${gName})</th>`
          : `<th>A</th><th>B</th><th>OUTPUT (${gName})</th>`));

    let bodyHtml = rows.map(r => {
      const activeClass = r.isActive ? 'active-row' : '';
      if (isSingleInput) {
        return `<tr class="${activeClass}"><td>${r.A}</td><td class="fw-bold ${r.OUT ? 'text-success' : 'text-secondary'}">${r.OUT}</td></tr>`;
      } else if (numInputs === 3) {
        return `<tr class="${activeClass}"><td>${r.A}</td><td>${r.B}</td><td>${r.C}</td><td class="fw-bold ${r.OUT ? 'text-success' : 'text-secondary'}">${r.OUT}</td></tr>`;
      } else if (numInputs === 4) {
        return `<tr class="${activeClass}"><td>${r.A}</td><td>${r.B}</td><td>${r.C}</td><td>${r.D}</td><td class="fw-bold ${r.OUT ? 'text-success' : 'text-secondary'}">${r.OUT}</td></tr>`;
      } else {
        return `<tr class="${activeClass}"><td>${r.A}</td><td>${r.B}</td><td class="fw-bold ${r.OUT ? 'text-success' : 'text-secondary'}">${r.OUT}</td></tr>`;
      }
    }).join('');

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-dark table-hover de-table text-center mb-0">
          <thead>
            <tr>${headersHtml}</tr>
          </thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>
    `;
  },

  /**
   * Export truth table as downloadable CSV file
   */
  exportCSV(gateName, numInputs = 2) {
    const rows = this.generateGateTable(gateName, numInputs);
    const gName = GateLogic.normalizeGateName(gateName);
    const isSingle = numInputs === 1 || gName === 'NOT';
    let csvContent = "data:text/csv;charset=utf-8,";

    if (isSingle) {
      csvContent += "A,OUT\n";
      rows.forEach(r => csvContent += `${r.A},${r.OUT}\n`);
    } else if (numInputs === 3) {
      csvContent += "A,B,C,OUT\n";
      rows.forEach(r => csvContent += `${r.A},${r.B},${r.C},${r.OUT}\n`);
    } else if (numInputs === 4) {
      csvContent += "A,B,C,D,OUT\n";
      rows.forEach(r => csvContent += `${r.A},${r.B},${r.C},${r.D},${r.OUT}\n`);
    } else {
      csvContent += "A,B,OUT\n";
      rows.forEach(r => csvContent += `${r.A},${r.B},${r.OUT}\n`);
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${gName}_Truth_Table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
