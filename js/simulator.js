/**
 * DE VIRTUAL LAB — SIMULATOR CONTROLLER (simulator.js)
 * Connects UI hardware switches, gate selector dropdown, SVG rendering,
 * Truth table preview, Boolean expression, and Web Serial API
 */

import { GateLogic } from './gates.js';
import { SVGRenderer } from './svgRenderer.js';
import { TruthTableEngine } from './truthTable.js';
import { BooleanEngine } from './boolean.js';
import { StorageEngine } from './storage.js';
import { UIEngine } from './ui.js';

export const SimulatorController = {
  // State Object
  state: {
    inputs: { A: 0, B: 0, C: 0, D: 0 },
    selectedGate: 'AND',
    output: 0,
    serialConnected: false
  },

  /**
   * Initialize Simulator Controller
   */
  init() {
    // Restore session state if available
    const saved = StorageEngine.getSimulatorState();
    if (saved && saved.inputs) {
      this.state.inputs = { ...saved.inputs };
      this.state.selectedGate = GateLogic.normalizeGateName(saved.selectedGate || 'AND');
    }

    // Always recalculate output from inputs — never trust a stale stored output
    this.state.output = GateLogic.evaluate(this.state.selectedGate, this.state.inputs);

    this.bindEvents();
    this.updateUI();
    this.updateCircuit();
  },

  /**
   * Event Listeners Binding
   */
  bindEvents() {
    // Hardware Switches (A, B, C, D)
    ['A', 'B', 'C', 'D'].forEach(key => {
      const toggle = document.getElementById(`switch-${key.toLowerCase()}`);
      if (toggle) {
        toggle.checked = Boolean(this.state.inputs[key]);
        toggle.addEventListener('change', (e) => {
          this.state.inputs[key] = e.target.checked ? 1 : 0;
          this.onStateChange();
        });
      }
    });

    // Gate Select Dropdown
    const gateSelect = document.getElementById('gate-select');
    if (gateSelect) {
      gateSelect.value = this.state.selectedGate;
      gateSelect.addEventListener('change', (e) => {
        this.state.selectedGate = GateLogic.normalizeGateName(e.target.value);
        this.onStateChange();
      });
    }

    // Reset Button
    const btnReset = document.getElementById('btn-reset-simulator');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.state.inputs = { A: 0, B: 0, C: 0, D: 0 };
        ['A', 'B', 'C', 'D'].forEach(key => {
          const toggle = document.getElementById(`switch-${key.toLowerCase()}`);
          if (toggle) toggle.checked = false;
        });
        this.onStateChange();
        UIEngine.showToast('Simulator reset to 0/LOW', 'info');
      });
    }

    // Export CSV Button
    const btnExport = document.getElementById('btn-export-csv');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        TruthTableEngine.exportCSV(this.state.selectedGate, 2);
        UIEngine.showToast('Truth Table exported as CSV', 'success');
      });
    }

    // Web Serial Hardware Connect Button
    const btnSerial = document.getElementById('btn-connect-serial');
    if (btnSerial) {
      btnSerial.addEventListener('click', () => this.connectWebSerial());
    }

    // Keyboard Shortcuts (Key A, Key B, Key C, Key D)
    window.addEventListener('keydown', (e) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        this.state.inputs[key] = this.state.inputs[key] === 1 ? 0 : 1;
        const toggle = document.getElementById(`switch-${key.toLowerCase()}`);
        if (toggle) toggle.checked = Boolean(this.state.inputs[key]);
        this.onStateChange();
      }
    });
  },

  /**
   * Handle state change recalculation
   */
  onStateChange() {
    this.state.selectedGate = GateLogic.normalizeGateName(this.state.selectedGate);

    // 1. Calculate output logic
    this.state.output = GateLogic.evaluate(this.state.selectedGate, this.state.inputs);

    // 2. Save SessionStorage
    StorageEngine.saveSimulatorState(this.state);

    // 3. Refresh UI & SVG Stage
    this.updateUI();
    this.updateCircuit();
  },

  /**
   * Update visual elements (LEDs, Badges, Truth Table & Expressions)
   */
  updateUI() {
    // ── Input switch cards ───────────────────────────
    ['A', 'B', 'C', 'D'].forEach(key => {
      const val  = this.state.inputs[key];
      const k    = key.toLowerCase();

      // Circular LED badge
      const led = document.getElementById(`led-${k}`);
      if (led) {
        led.textContent = val;
        led.className   = `sw-led ${val ? 'active' : ''}`;
      }

      // Text status label
      const status = document.getElementById(`status-${k}`);
      if (status) {
        status.textContent = val ? 'HIGH (1)' : 'LOW (0)';
        status.className   = `sw-status ${val ? 'high' : ''}`;
      }

      // Card border highlight
      const card = document.getElementById(`swcard-${k}`);
      if (card) {
        card.className = `sw-card mb-2 ${val ? 'active' : ''}`;
        // Fix last card spacing
        if (key === 'D') card.className = `sw-card mb-3 ${val ? 'active' : ''}`;
      }

      // Keep toggle visually in sync when restored from storage
      const toggle = document.getElementById(`switch-${k}`);
      if (toggle && toggle.checked !== Boolean(val)) toggle.checked = Boolean(val);
    });

    // ── Output LED ───────────────────────────────────
    const outputLed  = document.getElementById('output-led');
    const outputText = document.getElementById('output-value-text');
    if (outputLed)  outputLed.className  = `output-led ${this.state.output ? 'active' : ''}`;
    if (outputText) outputText.textContent = this.state.output;

    // ── Voltage badge ────────────────────────────────
    const voltBadge = document.getElementById('voltage-badge');
    if (voltBadge) {
      voltBadge.textContent = this.state.output ? '5.0 V  |  HIGH' : '0.0 V  |  LOW';
      voltBadge.className   = `volt-badge ${this.state.output ? 'active' : ''}`;
    }

    // ── Boolean expression ───────────────────────────
    const boolEl = document.getElementById('boolean-expression-display');
    if (boolEl) boolEl.textContent = BooleanEngine.getGateExpression(this.state.selectedGate);

    // ── Truth table ──────────────────────────────────
    TruthTableEngine.renderTableHTML(
      'truth-table-mount',
      this.state.selectedGate,
      this.state.selectedGate === 'NOT' ? 1 : 2,
      this.state.inputs
    );
  },

  /**
   * Update SVG schematic
   */
  updateCircuit() {
    SVGRenderer.renderGateCircuit('circuit-svg-stage', this.state.selectedGate, this.state.inputs, this.state.output);
  },

  /**
   * Web Serial API Connection Handler
   */
  async connectWebSerial() {
    if (!('serial' in navigator)) {
      UIEngine.showToast('Web Serial API not supported in this browser. Use Chrome or Edge.', 'danger');
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      this.state.serialConnected = true;
      UIEngine.showToast('Connected to Physical Hardware (9600 Baud)!', 'success');

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      // Read serial stream loop
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          // Expecting CSV "1,0,0,1" or JSON
          const parts = value.trim().split(',');
          if (parts.length >= 2) {
            this.state.inputs.A = parseInt(parts[0], 10) || 0;
            this.state.inputs.B = parseInt(parts[1], 10) || 0;
            if (parts.length >= 3) this.state.inputs.C = parseInt(parts[2], 10) || 0;
            if (parts.length >= 4) this.state.inputs.D = parseInt(parts[3], 10) || 0;
            this.onStateChange();
          }
        }
      }
    } catch (err) {
      console.warn('Web Serial connection error:', err);
      UIEngine.showToast('Hardware Serial connection cancelled or failed.', 'warning');
    }
  }
};
