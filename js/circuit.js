/**
 * DE VIRTUAL LAB — CIRCUIT ENGINE (circuit.js)
 * Evaluates combinational and sequential circuit modules built from logic gates
 */

import { GateLogic } from './gates.js';

export const CircuitEngine = {
  /**
   * Half Adder
   * Inputs: A, B
   * Outputs: { SUM: A XOR B, CARRY: A AND B }
   */
  halfAdder(a, b) {
    return {
      SUM: GateLogic.XOR(a, b),
      CARRY: GateLogic.AND(a, b)
    };
  },

  /**
   * Full Adder
   * Inputs: A, B, Cin (mapped to C)
   * Outputs: { SUM, CARRY }
   */
  fullAdder(a, b, cin = 0) {
    const sum1 = GateLogic.XOR(a, b);
    const carry1 = GateLogic.AND(a, b);
    const finalSum = GateLogic.XOR(sum1, cin);
    const carry2 = GateLogic.AND(sum1, cin);
    const finalCarry = GateLogic.OR(carry1, carry2);

    return {
      SUM: finalSum,
      CARRY: finalCarry
    };
  },

  /**
   * 4:1 Multiplexer
   * Inputs: I0, I1, I2, I3 (inputs A, B, C, D) and Select lines S1, S0
   */
  mux4to1(i0, i1, i2, i3, s1 = 0, s0 = 0) {
    const notS1 = GateLogic.NOT(s1);
    const notS0 = GateLogic.NOT(s0);

    const term0 = GateLogic.AND(i0, notS1, notS0);
    const term1 = GateLogic.AND(i1, notS1, s0);
    const term2 = GateLogic.AND(i2, s1, notS0);
    const term3 = GateLogic.AND(i3, s1, s0);

    return GateLogic.OR(term0, term1, term2, term3);
  },

  /**
   * D Flip-Flop
   * Inputs: D (data), CLK (clock signal bit)
   */
  dFlipFlop(d, clk, currentState = 0) {
    if (clk === 1) {
      return { Q: d, Q_NOT: GateLogic.NOT(d) };
    }
    return { Q: currentState, Q_NOT: GateLogic.NOT(currentState) };
  }
};
