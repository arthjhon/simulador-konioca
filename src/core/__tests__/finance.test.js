// src/core/__tests__/finance.test.js
import { describe, it, expect } from 'vitest';
import { monthlyRate, npv, irr, payback } from '../finance.js';

describe('monthlyRate', () => {
  it('converte 12% a.a. em taxa mensal equivalente', () => {
    expect(monthlyRate(0.12)).toBeCloseTo(0.009488, 5);
  });
});

describe('npv', () => {
  it('VPL de fluxo só com investimento é o próprio investimento', () => {
    expect(npv([-1000], 0.01)).toBe(-1000);
  });
  it('desconta fluxos futuros', () => {
    // -100 hoje, +110 no mês 1, taxa 10% => VPL = -100 + 110/1.1 = 0
    expect(npv([-100, 110], 0.10)).toBeCloseTo(0, 6);
  });
});

describe('irr', () => {
  it('acha a taxa que zera o VPL', () => {
    // -100, +110 => TIR mensal = 10%
    expect(irr([-100, 110])).toBeCloseTo(0.10, 4);
  });
  it('retorna null quando não há raiz (todos positivos)', () => {
    expect(irr([100, 110])).toBeNull();
  });
});

describe('payback', () => {
  it('acha o primeiro mês com acumulado >= 0', () => {
    expect(payback([-100, 40, 40, 40])).toBe(3);
  });
  it('retorna null se nunca recupera', () => {
    expect(payback([-100, 10, 10])).toBeNull();
  });
});
