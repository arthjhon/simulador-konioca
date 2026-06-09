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
      it('sinal do VPL bate com o relatório', () => {
        expect(Math.sign(m.vpl)).toBe(Math.sign(c.ref.vpl));
      });
    });
  }
});
