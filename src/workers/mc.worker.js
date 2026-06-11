// src/workers/mc.worker.js
// Roda o Monte Carlo fora da main thread: N grande (100k+) não congela a UI.
import { runSimulation } from '../core/montecarlo.js';

self.onmessage = (e) => {
  try {
    self.postMessage({ ok: true, resultado: runSimulation(e.data) });
  } catch (err) {
    self.postMessage({ ok: false, erro: String(err?.message ?? err) });
  }
};
