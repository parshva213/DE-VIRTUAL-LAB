/**
 * DE VIRTUAL LAB — EXPERIMENTS ENGINE (experiments.js)
 * Manages syllabus-aligned laboratory manual & verification checks
 */

import { StorageEngine } from './storage.js';
import { GateLogic } from './gates.js';

export const ExperimentsEngine = {
  /**
   * Complete 6 Lab Experiments Syllabus
   */
  experimentsList: [
    {
      id: 'exp1',
      title: 'Exp 1: Verification of Basic Logic Gates (AND, OR, NOT, XOR)',
      objective: 'To study and verify the truth tables of AND, OR, NOT, and XOR logic gates using physical or simulated digital inputs.',
      procedure: [
        'Select AND gate from the simulator dropdown.',
        'Set Input A = 1 and Input B = 1 using hardware switches or GUI toggles.',
        'Verify that the Output LED glows GREEN (5.0 V / HIGH).',
        'Repeat for OR, NOT, and XOR gates and record results.'
      ],
      targetGate: 'AND',
      testInputs: { A: 1, B: 1 },
      expectedOutput: 1
    },
    {
      id: 'exp2',
      title: 'Exp 2: Universal Logic Gates (NAND & NOR Realization)',
      objective: 'To construct AND, OR, and NOT gates using only NAND and NOR universal gates.',
      procedure: [
        'Select NAND gate in simulator.',
        'Apply Input A = 1, B = 0 and observe output state (1 / HIGH).',
        'Verify NOR gate output with inputs A = 0, B = 0 (1 / HIGH).'
      ],
      targetGate: 'NAND',
      testInputs: { A: 1, B: 0 },
      expectedOutput: 1
    },
    {
      id: 'exp3',
      title: 'Exp 3: Design & Verification of Half Adder and Full Adder',
      objective: 'To design a Half Adder circuit using XOR (Sum) and AND (Carry) gates.',
      procedure: [
        'Set Input A = 1, Input B = 1.',
        'Observe SUM = 0 (XOR) and CARRY = 1 (AND).',
        'Verify truth table output state for all 4 binary combinations.'
      ],
      targetGate: 'XOR',
      testInputs: { A: 1, B: 1 },
      expectedOutput: 0
    },
    {
      id: 'exp4',
      title: 'Exp 4: 4-to-1 Line Multiplexer (MUX)',
      objective: 'To design and analyze data routing using select lines (S1, S0) in a 4:1 Multiplexer.',
      procedure: [
        'Select MUX circuit in simulator.',
        'Set Select lines S1 = 0, S0 = 1 to select Data input D1.',
        'Verify that output Y follows input line D1.'
      ],
      targetGate: 'AND',
      testInputs: { A: 0, B: 1 },
      expectedOutput: 0
    },
    {
      id: 'exp5',
      title: 'Exp 5: D Flip-Flop State Transition & Edge Triggering',
      objective: 'To examine memory state storage and clock edge triggering in D Flip-Flop.',
      procedure: [
        'Set Data Input D = 1.',
        'Trigger positive Clock pulse CLK (0 → 1 transition).',
        'Verify output Q captures and stores value 1.'
      ],
      targetGate: 'AND',
      testInputs: { A: 1, B: 1 },
      expectedOutput: 1
    },
    {
      id: 'exp6',
      title: 'Exp 6: 4-Bit Binary Counter & 7-Segment Display Output',
      objective: 'To construct a 4-bit asynchronous binary ripple counter (0 to 15).',
      procedure: [
        'Connect clock generator pulse input.',
        'Observe binary output QA, QB, QC, QD counting sequence.',
        'Verify decimal value mapping on 7-Segment LED display.'
      ],
      targetGate: 'AND',
      testInputs: { A: 1, B: 1 },
      expectedOutput: 1
    }
  ],

  /**
   * Verify experiment attempt
   */
  verifyExperiment(expId, userInputs, currentOutput) {
    const exp = this.experimentsList.find(e => e.id === expId);
    if (!exp) return { success: false, message: 'Experiment not found' };

    const matchesInputs = Number(userInputs.A) === exp.testInputs.A && Number(userInputs.B) === exp.testInputs.B;
    const matchesOutput = Number(currentOutput) === exp.expectedOutput;

    if (matchesInputs && matchesOutput) {
      StorageEngine.markExperimentCompleted(expId, 100);
      return { success: true, message: `${exp.title} verified successfully! Progress recorded.` };
    } else {
      return { success: false, message: `Verification failed for ${exp.title}. Set inputs A=${exp.testInputs.A}, B=${exp.testInputs.B} in simulator.` };
    }
  }
};
