// src/core/montecarlo.js
import { CENARIOS } from './scenarios.js';
import { buildCashFlow, npv, irr, monthlyRate } from './finance.js';
import { PREMISSAS } from './scenarios.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function sample(spec, rng) {
  const u = rng();
  switch (spec.dist) {
    case 'uniforme':
      return spec.min + u * (spec.max - spec.min);
    case 'normal': {
      // Box-Muller; clamp em >=0 para grandezas físicas
      const u1 = Math.max(u, 1e-9), u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.max(0, spec.media + z * spec.sigma);
    }
    case 'triangular': {
      const { min, moda, max } = spec;
      const fc = (moda - min) / (max - min);
      if (u < fc) return min + Math.sqrt(u * (max - min) * (moda - min));
      return max - Math.sqrt((1 - u) * (max - min) * (max - moda));
    }
    default:
      throw new Error(`distribuição desconhecida: ${spec.dist}`);
  }
}

function percentil(sortedArr, p) {
  const idx = (sortedArr.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

function stats(arr) {
  const s = [...arr].sort((x, y) => x - y);
  const media = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variancia = arr.reduce((a, b) => a + (b - media) ** 2, 0) / arr.length;
  return {
    media, desvio: Math.sqrt(variancia),
    p5: percentil(s, 0.05), p50: percentil(s, 0.50), p95: percentil(s, 0.95),
    min: s[0], max: s[s.length - 1], valores: arr,
  };
}

// config: { base, n, seed, vars: { campo: spec } }
export function runSimulation(config, premissas = PREMISSAS) {
  const baseCenario = CENARIOS[config.base];
  const rng = mulberry32(config.seed ?? 1);
  const i = monthlyRate(premissas.tmaAnual);
  const vpls = [], tirs = [];
  let positivos = 0;
  const campos = Object.keys(config.vars);

  for (let it = 0; it < config.n; it++) {
    const c = { ...baseCenario };
    for (const campo of campos) c[campo] = sample(config.vars[campo], rng);
    const fluxos = buildCashFlow(c, premissas);
    const v = npv(fluxos, i);
    vpls.push(v);
    if (v > 0) positivos++;
    const tm = irr(fluxos);
    tirs.push(tm == null ? NaN : Math.pow(1 + tm, 12) - 1);
  }

  return {
    n: config.n,
    pVplPositivo: positivos / config.n,
    vpl: stats(vpls),
    tirAnual: stats(tirs.filter((x) => !Number.isNaN(x))),
    sensibilidade: sensibilidade(config, premissas),
  };
}

// Sensibilidade (tornado): varia cada campo do mínimo ao máximo mantendo os outros na moda/base.
export function sensibilidade(config, premissas = PREMISSAS) {
  const baseCenario = CENARIOS[config.base];
  const i = monthlyRate(premissas.tmaAnual);
  const valorCentral = (spec) =>
    spec.dist === 'normal' ? spec.media : (spec.dist === 'triangular' ? spec.moda : (spec.min + spec.max) / 2);
  const vplCom = (overrides) => npv(buildCashFlow({ ...baseCenario, ...overrides }, premissas), i);
  const central = {};
  for (const campo of Object.keys(config.vars)) central[campo] = valorCentral(config.vars[campo]);

  return Object.keys(config.vars).map((campo) => {
    const spec = config.vars[campo];
    const lo = spec.min ?? spec.media - spec.sigma;
    const hi = spec.max ?? spec.media + spec.sigma;
    const vLo = vplCom({ ...central, [campo]: lo });
    const vHi = vplCom({ ...central, [campo]: hi });
    return { campo, baixo: vLo, alto: vHi, amplitude: Math.abs(vHi - vLo) };
  }).sort((a, b) => b.amplitude - a.amplitude);
}
