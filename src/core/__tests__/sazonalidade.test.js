// src/core/__tests__/sazonalidade.test.js
import { describe, it, expect } from 'vitest';
import { buildCashFlow, sazonalidadeFator } from '../finance.js';
import { CENARIOS } from '../scenarios.js';

describe('sazonalidade mensal', () => {
  it('média anual do fator é 1,0 (não altera a receita média)', () => {
    const c = CENARIOS.pessimista; // amplitude 0,25
    const soma = Array.from({ length: 12 }, (_, i) => sazonalidadeFator(c, i + 1)).reduce((a, b) => a + b, 0);
    expect(soma / 12).toBeCloseTo(1.0, 10);
  });

  it('realista é neutro (fator 1 em todos os meses)', () => {
    const c = CENARIOS.realista; // sazonalidade 1,0 -> amplitude 0
    for (let m = 1; m <= 12; m++) expect(sazonalidadeFator(c, m)).toBe(1);
  });

  it('não altera o lucro total de um ano cheio pós-ramp', () => {
    const c = CENARIOS.pessimista; // ramp 18 meses; meses 25..36 = jan..dez maduros
    const flat = buildCashFlow(c);
    const saz = buildCashFlow(c, undefined, { sazonal: true });
    const anoFlat = flat.slice(25, 37).reduce((a, b) => a + b, 0);
    const anoSaz = saz.slice(25, 37).reduce((a, b) => a + b, 0);
    expect(anoSaz).toBeCloseTo(anoFlat, 6);
  });

  it('alta temporada (jan) > baixa (mai) quando ativada', () => {
    const c = CENARIOS.otimista;
    expect(sazonalidadeFator(c, 1)).toBeGreaterThan(sazonalidadeFator(c, 5));
  });
});
