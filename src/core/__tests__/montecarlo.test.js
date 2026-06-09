// src/core/__tests__/montecarlo.test.js
import { describe, it, expect } from 'vitest';
import { mulberry32, sample, runSimulation } from '../montecarlo.js';

describe('mulberry32', () => {
  it('é determinístico para a mesma semente', () => {
    const a = mulberry32(42), b = mulberry32(42);
    expect(a()).toBe(b());
  });
});

describe('sample', () => {
  it('uniforme respeita os limites', () => {
    const r = mulberry32(1);
    const v = sample({ dist: 'uniforme', min: 10, max: 20 }, r);
    expect(v).toBeGreaterThanOrEqual(10);
    expect(v).toBeLessThanOrEqual(20);
  });
  it('triangular respeita os limites', () => {
    const r = mulberry32(2);
    const v = sample({ dist: 'triangular', min: 5, moda: 8, max: 12 }, r);
    expect(v).toBeGreaterThanOrEqual(5);
    expect(v).toBeLessThanOrEqual(12);
  });
});

describe('runSimulation', () => {
  it('é reprodutível com semente fixa e calcula P(VPL>0)', () => {
    const config = {
      base: 'realista',
      n: 2000,
      seed: 123,
      vars: {
        ticket: { dist: 'triangular', min: 18, moda: 25, max: 32 },
        clientesDia: { dist: 'triangular', min: 45, moda: 80, max: 120 },
      },
    };
    const r1 = runSimulation(config);
    const r2 = runSimulation(config);
    expect(r1.pVplPositivo).toBe(r2.pVplPositivo);
    expect(r1.pVplPositivo).toBeGreaterThan(0);
    expect(r1.pVplPositivo).toBeLessThanOrEqual(1);
    expect(r1.vpl.p50).toBeTypeOf('number');
  });
});
