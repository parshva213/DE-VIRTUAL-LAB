/**
 * DE VIRTUAL LAB — LOGIC GATES ENGINE (gates.js)
 * Implements primitive logic gates: NOT, AND, OR, NAND, NOR, XOR, XNOR
 * Evaluates binary states (0/1 or boolean) for inputs A, B, C, D
 */

export const GateLogic = {
  /**
   * Helper: Normalize any gate name string to standard keyword:
   * 'NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'
   */
  normalizeGateName(gateName) {
    if (!gateName) return 'AND';
    const str = String(gateName).toUpperCase();
    if (str.includes('NAND')) return 'NAND';
    if (str.includes('XNOR')) return 'XNOR';
    if (str.includes('NOR')) return 'NOR';
    if (str.includes('XOR')) return 'XOR';
    if (str.includes('AND')) return 'AND';
    if (str.includes('OR')) return 'OR';
    if (str.includes('NOT')) return 'NOT';
    return 'AND';
  },

  /**
   * NOT Gate (Single input, uses input A or first argument)
   */
  NOT(a) {
    const bitA = Number(Boolean(a));
    return bitA === 0 ? 1 : 0;
  },

  /**
   * AND Gate (2 or more inputs)
   */
  AND(a, b, c = null, d = null) {
    let result = (Number(Boolean(a)) === 1 && Number(Boolean(b)) === 1) ? 1 : 0;
    if (c !== null && c !== undefined) result = (result === 1 && Number(Boolean(c)) === 1) ? 1 : 0;
    if (d !== null && d !== undefined) result = (result === 1 && Number(Boolean(d)) === 1) ? 1 : 0;
    return result;
  },

  /**
   * OR Gate (2 or more inputs)
   */
  OR(a, b, c = null, d = null) {
    let result = (Number(Boolean(a)) === 1 || Number(Boolean(b)) === 1) ? 1 : 0;
    if (c !== null && c !== undefined) result = (result === 1 || Number(Boolean(c)) === 1) ? 1 : 0;
    if (d !== null && d !== undefined) result = (result === 1 || Number(Boolean(d)) === 1) ? 1 : 0;
    return result;
  },

  /**
   * NAND Gate (Inverted AND)
   */
  NAND(a, b, c = null, d = null) {
    return this.NOT(this.AND(a, b, c, d));
  },

  /**
   * NOR Gate (Inverted OR)
   */
  NOR(a, b, c = null, d = null) {
    return this.NOT(this.OR(a, b, c, d));
  },

  /**
   * XOR Gate (Exclusive OR)
   */
  XOR(a, b, c = null, d = null) {
    let bitA = Number(Boolean(a));
    let bitB = Number(Boolean(b));
    let result = (bitA ^ bitB) & 1;
    if (c !== null && c !== undefined) result = (result ^ Number(Boolean(c))) & 1;
    if (d !== null && d !== undefined) result = (result ^ Number(Boolean(d))) & 1;
    return result;
  },

  /**
   * XNOR Gate (Inverted XOR / Equivalence)
   */
  XNOR(a, b, c = null, d = null) {
    return this.NOT(this.XOR(a, b, c, d));
  },

  /**
   * Generic gate evaluator by name string
   * @param {string} gateName
   * @param {Object} inputs - {A, B, C, D}
   * @param {number} numInputs - 1, 2, 3, or 4 (defaults to 2 for standard schematic)
   */
  evaluate(gateName, inputs = {}, numInputs = 2) {
    const A = inputs.A ? 1 : 0;
    const B = inputs.B ? 1 : 0;
    const C = inputs.C ? 1 : 0;
    const D = inputs.D ? 1 : 0;
    const g = this.normalizeGateName(gateName);

    if (g === 'NOT') {
      return this.NOT(A);
    }

    if (numInputs === 2) {
      switch (g) {
        case 'AND':  return this.AND(A, B);
        case 'OR':   return this.OR(A, B);
        case 'NAND': return this.NAND(A, B);
        case 'NOR':  return this.NOR(A, B);
        case 'XOR':  return this.XOR(A, B);
        case 'XNOR': return this.XNOR(A, B);
        default:     return this.AND(A, B);
      }
    } else if (numInputs === 3) {
      switch (g) {
        case 'AND':  return this.AND(A, B, C);
        case 'OR':   return this.OR(A, B, C);
        case 'NAND': return this.NAND(A, B, C);
        case 'NOR':  return this.NOR(A, B, C);
        case 'XOR':  return this.XOR(A, B, C);
        case 'XNOR': return this.XNOR(A, B, C);
        default:     return this.AND(A, B, C);
      }
    } else {
      switch (g) {
        case 'AND':  return this.AND(A, B, C, D);
        case 'OR':   return this.OR(A, B, C, D);
        case 'NAND': return this.NAND(A, B, C, D);
        case 'NOR':  return this.NOR(A, B, C, D);
        case 'XOR':  return this.XOR(A, B, C, D);
        case 'XNOR': return this.XNOR(A, B, C, D);
        default:     return this.AND(A, B, C, D);
      }
    }
  }
};
