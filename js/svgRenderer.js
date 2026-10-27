/**
 * DE VIRTUAL LAB — SVG RENDERER (svgRenderer.js)
 * Dynamically draws logic gate schematics, animated wires, and LED indicators.
 * Signal HIGH (1) → Ultra-bright Neon Green glow (#00ff66 / #39ff14). Signal LOW (0) → Muted slate wire (#475569).
 */

import { GateLogic } from './gates.js';

export const SVGRenderer = {
  /**
   * Render a named gate circuit into the target SVG element.
   * @param {string} containerSvgId - ID of the <svg> element.
   * @param {string} gateName - 'NOT' | 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'
   * @param {Object} inputs - {A, B, C, D}
   * @param {number} output - 0 or 1
   */
  renderGateCircuit(containerSvgId, gateName, inputs = {}, output = 0) {
    const svg = document.getElementById(containerSvgId);
    if (!svg) return;

    const gName = GateLogic.normalizeGateName(gateName);
    const bitA = inputs.A ? 1 : 0;
    const bitB = inputs.B ? 1 : 0;
    const bitOut = output ? 1 : 0;
    const isSingle = gName === 'NOT';

    svg.setAttribute('viewBox', '0 0 600 260');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Color helpers for terminals
    const ledFill   = (bit) => bit ? '#00c853' : '#1e293b';
    const ledStroke = (bit) => bit ? '#86efac' : '#475569';
    const ledText   = (bit) => bit ? '#0f172a' : '#ffffff';

    svg.innerHTML = `
      <defs>
        <!-- Neon Green Glow Filter (userSpaceOnUse prevents 0-height clipping on horizontal wires) -->
        <filter id="neonGlowGreen" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="260">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <!-- Cyan Gate Outer Shadow -->
        <filter id="gateShadow" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="260">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00e5ff" flood-opacity="0.6"/>
        </filter>

        <!-- Dark Metallic Body Gradient -->
        <linearGradient id="gateBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      ${isSingle
        ? this._buildNotGate(bitA, bitOut, ledFill, ledStroke, ledText)
        : this._buildDualGate(gName, bitA, bitB, bitOut, ledFill, ledStroke, ledText)}
    `;
  },

  /** Helper method to render a line/wire with guaranteed high visibility when HIGH */
  _drawWire(x1, y1, x2, y2, bit) {
    if (bit) {
      return `
        <!-- High Signal: Outer Neon Glow -->
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="#00ff66" stroke-width="7" stroke-linecap="round"
              filter="url(#neonGlowGreen)" opacity="0.85"/>
        <!-- High Signal: Inner Intense Core -->
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="#39ff14" stroke-width="4" stroke-linecap="round"/>
      `;
    }
    return `
      <!-- Low Signal: Slate Grey Line -->
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
            stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>
    `;
  },

  /** Build a NOT gate schematic (single input) */
  _buildNotGate(bitA, bitOut, lf, ls, lt) {
    return `
      <!-- Input A Wire -->
      ${this._drawWire(60, 130, 220, 130, bitA)}

      <!-- NOT triangle body -->
      <polygon points="220,65 340,130 220,195"
               fill="url(#gateBodyGrad)" stroke="#00e5ff" stroke-width="2.5"
               filter="url(#gateShadow)"/>
      <!-- NOT bubble -->
      <circle cx="352" cy="130" r="12"
              fill="url(#gateBodyGrad)" stroke="#00e5ff" stroke-width="2.5"/>
      <!-- Gate label -->
      <text x="268" y="135" fill="#ffffff"
            font-family="'JetBrains Mono',monospace" font-weight="800" font-size="16"
            text-anchor="middle" dominant-baseline="central">NOT</text>

      <!-- Output Wire -->
      ${this._drawWire(364, 130, 510, 130, bitOut)}

      <!-- Input A terminal circle -->
      ${this._terminal(60, 130, bitA, 'A', lf, ls, lt)}

      <!-- Output terminal circle -->
      ${this._outputTerminal(510, 130, bitOut, lf, ls, lt)}
    `;
  },

  /** Build a dual-input gate schematic (AND, OR, NAND, NOR, XOR, XNOR) */
  _buildDualGate(gName, bitA, bitB, bitOut, lf, ls, lt) {
    const hasBubble = gName === 'NAND' || gName === 'NOR' || gName === 'XNOR';
    const isXOR = gName === 'XOR' || gName === 'XNOR';
    const isAND = gName === 'AND' || gName === 'NAND';
    const isOR  = gName === 'OR'  || gName === 'NOR' || isXOR;

    const gateStartX = 235;

    let gateShape = '';
    let outX = 375;

    if (isAND) {
      gateShape = `
        <path d="M 235,65 L 305,65 Q 375,65 375,130 Q 375,195 305,195 L 235,195 Z"
              fill="url(#gateBodyGrad)" stroke="#00e5ff" stroke-width="2.5"
              filter="url(#gateShadow)"/>
        <text x="305" y="135" fill="#ffffff"
              font-family="'JetBrains Mono',monospace" font-weight="800" font-size="17"
              text-anchor="middle" dominant-baseline="central">${gName}</text>
      `;
      outX = hasBubble ? 387 : 375;
    } else if (isOR) {
      const xorExtra = isXOR ? `<path d="M 225,65 Q 248,130 225,195" fill="none" stroke="#00e5ff" stroke-width="2.5"/>` : '';
      gateShape = `
        ${xorExtra}
        <path d="M 235,65 Q 258,130 235,195 Q 305,195 365,130 Q 305,65 235,65 Z"
              fill="url(#gateBodyGrad)" stroke="#00e5ff" stroke-width="2.5"
              filter="url(#gateShadow)"/>
        <text x="295" y="135" fill="#ffffff"
              font-family="'JetBrains Mono',monospace" font-weight="800" font-size="17"
              text-anchor="middle" dominant-baseline="central">${gName}</text>
      `;
      outX = hasBubble ? 377 : 365;
    }

    const bubbleHtml = hasBubble
      ? `<circle cx="${outX + 12}" cy="130" r="11"
                 fill="url(#gateBodyGrad)" stroke="#00e5ff" stroke-width="2.5"/>`
      : '';
    const outputWireStartX = hasBubble ? outX + 23 : outX;

    return `
      <!-- Input A wire (Straight from circle A at x=60,y=90 into Gate pin at x=235,y=90) -->
      ${this._drawWire(60, 90, gateStartX, 90, bitA)}

      <!-- Input B wire (Straight from circle B at x=60,y=170 into Gate pin at x=235,y=170) -->
      ${this._drawWire(60, 170, gateStartX, 170, bitB)}

      ${gateShape}
      ${bubbleHtml}

      <!-- Output wire (From Gate output pin x=${outputWireStartX},y=130 into Output terminal x=510,y=130) -->
      ${this._drawWire(outputWireStartX, 130, 510, 130, bitOut)}

      <!-- Input A terminal circle -->
      ${this._terminal(60, 90, bitA, 'A', lf, ls, lt)}

      <!-- Input B terminal circle -->
      ${this._terminal(60, 170, bitB, 'B', lf, ls, lt)}

      <!-- Output terminal circle -->
      ${this._outputTerminal(510, 130, bitOut, lf, ls, lt)}
    `;
  },

  /** Input terminal circle badge */
  _terminal(cx, cy, bit, label, lf, ls, lt) {
    const glow = bit ? 'filter="url(#neonGlowGreen)"' : '';
    return `
      <circle cx="${cx}" cy="${cy}" r="26"
              fill="${lf(bit)}" stroke="${ls(bit)}" stroke-width="2.5"
              ${glow}/>
      <text x="${cx}" y="${cy - 6}" fill="${lt(bit)}"
            font-family="'JetBrains Mono',monospace" font-weight="800" font-size="12"
            text-anchor="middle" dominant-baseline="central">${label}:${bit}</text>
      <text x="${cx}" y="${cy + 9}" fill="${bit ? '#0f172a' : '#cbd5e1'}"
            font-family="'JetBrains Mono',monospace" font-weight="700" font-size="10"
            text-anchor="middle" dominant-baseline="central">${bit ? 'HIGH' : 'LOW'}</text>
    `;
  },

  /** Output LED terminal circle */
  _outputTerminal(cx, cy, bit, lf, ls, lt) {
    const glow = bit ? 'filter="url(#neonGlowGreen)"' : '';
    return `
      <circle cx="${cx}" cy="${cy}" r="30"
              fill="${lf(bit)}" stroke="${ls(bit)}" stroke-width="3"
              ${glow}/>
      <text x="${cx}" y="${cy - 7}" fill="${lt(bit)}"
            font-family="'JetBrains Mono',monospace" font-weight="800" font-size="16"
            text-anchor="middle" dominant-baseline="central">${bit}</text>
      <text x="${cx}" y="${cy + 10}" fill="${bit ? '#0f172a' : '#cbd5e1'}"
            font-family="'JetBrains Mono',monospace" font-weight="700" font-size="10"
            text-anchor="middle" dominant-baseline="central">OUT</text>
      <text x="${cx}" y="${cy + 50}" fill="#cbd5e1"
            font-family="'Inter',sans-serif" font-weight="700" font-size="11"
            text-anchor="middle">OUTPUT</text>
    `;
  }
};
