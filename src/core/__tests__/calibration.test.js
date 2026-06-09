// src/core/__tests__/calibration.test.js
import { describe, it, expect } from 'vitest';
import { computeMetrics } from '../finance.js';
import { CENARIOS } from '../scenarios.js';

describe('calibração vs relatório', () => {
  for (const key of Object.keys(CENARIOS)) {
    const c = CENARIOS[key];
    describe(c.nome, () => {
      const m = computeMetrics(c);

      it('receita estável bate exatamente', () => {
        expect(m.receitaEstavel).toBeCloseTo(c.ref.receitaEstavel, 2);
      });
      it('lucro estável bate (±1%)', () => {
        const tol = Math.max(1, Math.abs(c.ref.lucroEstavel) * 0.01);
        expect(Math.abs(m.lucroEstavel - c.ref.lucroEstavel)).toBeLessThanOrEqual(tol);
      });
      it('burn rate bate (±1%)', () => {
        expect(Math.abs(m.burn - c.ref.burn)).toBeLessThanOrEqual(c.ref.burn * 0.01);
      });
      it('veredito (sinal do VPL) bate com o relatório', () => {
        if (c.ref.vpl < 0) expect(m.vpl).toBeLessThan(0);
        else expect(m.vpl).toBeGreaterThan(0);
      });
    });
  }

  it('realista (único reconciliável) reproduz ~payback do relatório', () => {
    const m = computeMetrics(CENARIOS.realista);
    expect(Math.abs(m.paybackSimples - 38)).toBeLessThanOrEqual(4);
    expect(Math.abs(m.paybackDescontado - 47)).toBeLessThanOrEqual(5);
    expect(m.tirAnual).toBeGreaterThan(0.18);
    expect(m.tirAnual).toBeLessThan(0.32);
  });
});
