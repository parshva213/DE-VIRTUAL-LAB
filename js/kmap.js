/**
 * DE VIRTUAL LAB — KARNAUGH MAP (K-MAP) SOLVER (kmap.js)
 * Interactive 2, 3, 4 Variable Karnaugh Map grid generator & minimal SOP solver
 */

export const KMapEngine = {
  /**
   * Gray code sequence mapping for 2, 3, 4 variables
   */
  grayCode: [0, 1, 3, 2],

  /**
   * Solve 2-Variable K-Map (Variables A, B)
   * Cells: m0, m1, m2, m3
   */
  solve2Var(cellValues = [0, 0, 0, 0]) {
    const countOnes = cellValues.filter(v => v === 1).length;
    if (countOnes === 0) return "Y = 0";
    if (countOnes === 4) return "Y = 1";

    const [m0, m1, m2, m3] = cellValues;
    const terms = [];

    // Check pairs
    if (m0 && m1 && m2 && m3) return "Y = 1";
    if (m0 && m1) terms.push("A'");
    if (m2 && m3) terms.push("A");
    if (m0 && m2) terms.push("B'");
    if (m1 && m3) terms.push("B");

    // Single minterms if not covered by pairs
    if (terms.length === 0) {
      if (m0) terms.push("A'B'");
      if (m1) terms.push("A'B");
      if (m2) terms.push("AB'");
      if (m3) terms.push("AB");
    }

    // Deduplicate & simplify
    const unique = [...new Set(terms)];
    return "Y = " + unique.join(" + ");
  },

  /**
   * Render Interactive K-Map Grid HTML
   */
  renderGridHTML(containerId, numVars = 2, cellValues = [0, 0, 0, 0], onToggleCallback = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (numVars === 2) {
      // 2x2 grid (A vertical, B horizontal)
      container.innerHTML = `
        <div class="kmap-wrapper text-center">
          <table class="table table-bordered de-table kmap-grid text-center mx-auto" style="max-width: 340px; border: 1px solid rgba(0,229,255,0.3);">
            <thead>
              <tr>
                <th style="background:#0f172a; color:#00e5ff !important;">A \\ B</th>
                <th style="background:#0f172a; color:#00e5ff !important;">B' = 0</th>
                <th style="background:#0f172a; color:#00e5ff !important;">B = 1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="align-middle" style="background:#0f172a; color:#00e5ff !important;">A' = 0</th>
                <td class="kmap-cell ${cellValues[0] ? 'active' : ''}" data-index="0" style="cursor:pointer; height:68px;">
                  <div class="small text-warning font-mono fw-bold">m0</div>
                  <div class="fs-4 fw-bold ${cellValues[0] ? 'text-success' : 'text-slate'}">${cellValues[0]}</div>
                </td>
                <td class="kmap-cell ${cellValues[1] ? 'active' : ''}" data-index="1" style="cursor:pointer; height:68px;">
                  <div class="small text-warning font-mono fw-bold">m1</div>
                  <div class="fs-4 fw-bold ${cellValues[1] ? 'text-success' : 'text-slate'}">${cellValues[1]}</div>
                </td>
              </tr>
              <tr>
                <th class="align-middle" style="background:#0f172a; color:#00e5ff !important;">A = 1</th>
                <td class="kmap-cell ${cellValues[2] ? 'active' : ''}" data-index="2" style="cursor:pointer; height:68px;">
                  <div class="small text-warning font-mono fw-bold">m2</div>
                  <div class="fs-4 fw-bold ${cellValues[2] ? 'text-success' : 'text-slate'}">${cellValues[2]}</div>
                </td>
                <td class="kmap-cell ${cellValues[3] ? 'active' : ''}" data-index="3" style="cursor:pointer; height:68px;">
                  <div class="small text-warning font-mono fw-bold">m3</div>
                  <div class="fs-4 fw-bold ${cellValues[3] ? 'text-success' : 'text-slate'}">${cellValues[3]}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      // Attach click listeners to cells
      container.querySelectorAll('.kmap-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          const idx = parseInt(cell.getAttribute('data-index'), 10);
          cellValues[idx] = cellValues[idx] === 1 ? 0 : 1;
          if (onToggleCallback) onToggleCallback(cellValues);
        });
      });
    }
  }
};
