/**
 * DE VIRTUAL LAB — BOOLEAN ALGEBRA ENGINE (boolean.js)
 * Boolean expression generator, canonical SOP/POS solver, and law lookup
 */

import { GateLogic } from './gates.js';

export const BooleanEngine = {
  /**
   * Get standard algebraic expression for primitive gates
   */
  getGateExpression(gateName) {
    const g = GateLogic.normalizeGateName(gateName);
    switch (g) {
      case 'NOT': return "Y = A'";
      case 'AND': return "Y = A · B";
      case 'OR': return "Y = A + B";
      case 'NAND': return "Y = (A · B)'";
      case 'NOR': return "Y = (A + B)'";
      case 'XOR': return "Y = A ⊕ B = A'B + AB'";
      case 'XNOR': return "Y = (A ⊕ B)' = AB + A'B'";
      case 'HALF_ADDER': return "SUM = A ⊕ B, CARRY = A · B";
      case 'FULL_ADDER': return "SUM = A ⊕ B ⊕ Cin, CARRY = AB + Cin(A ⊕ B)";
      default: return "Y = f(A, B)";
    }
  },

  /**
   * Canonical Sum of Products (SOP \sum m) derived from truth table minterms
   */
  getMintermsSOP(gateName, numInputs = 2) {
    const g = GateLogic.normalizeGateName(gateName);
    if (g === 'AND') return { sop: "Y = A · B", minterms: [3], notation: "Σm(3)" };
    if (g === 'OR') return { sop: "Y = A'B + AB' + AB", minterms: [1, 2, 3], notation: "Σm(1, 2, 3)" };
    if (g === 'NAND') return { sop: "Y = A'B' + A'B + AB'", minterms: [0, 1, 2], notation: "Σm(0, 1, 2)" };
    if (g === 'NOR') return { sop: "Y = A'B'", minterms: [0], notation: "Σm(0)" };
    if (g === 'XOR') return { sop: "Y = A'B + AB'", minterms: [1, 2], notation: "Σm(1, 2)" };
    if (g === 'XNOR') return { sop: "Y = A'B' + AB", minterms: [0, 3], notation: "Σm(0, 3)" };
    if (g === 'NOT') return { sop: "Y = A'", minterms: [0], notation: "Σm(0)" };
    return { sop: "Y = f(A, B)", minterms: [], notation: "Σm()" };
  },

  /**
   * Boolean Laws Reference Database
   */
  getLawsList() {
    return [
      { name: "Identity Law", law: "A · 1 = A, A + 0 = A" },
      { name: "Null / Dominance Law", law: "A · 0 = 0, A + 1 = 1" },
      { name: "Idempotent Law", law: "A · A = A, A + A = A" },
      { name: "Complement Law", law: "A · A' = 0, A + A' = 1" },
      { name: "Double Negation", law: "(A')' = A" },
      { name: "Commutative Law", law: "A · B = B · A, A + B = B + A" },
      { name: "Associative Law", law: "(A · B) · C = A · (B · C)" },
      { name: "Distributive Law", law: "A · (B + C) = AB + AC" },
      { name: "De Morgan's Theorem 1", law: "(A · B)' = A' + B'" },
      { name: "De Morgan's Theorem 2", law: "(A + B)' = A' · B'" }
    ];
  }
};
