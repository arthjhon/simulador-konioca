// src/core/finance.js
import { PREMISSAS } from './scenarios.js';

export function monthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function npv(cashflows, rate) {
  return cashflows.reduce((acc, cf, m) => acc + cf / Math.pow(1 + rate, m), 0);
}

// TIR mensal por bisseção. Retorna null se não convergir / sem troca de sinal.
export function irr(cashflows, lo = -0.9999, hi = 1.0, tol = 1e-7, maxIter = 200) {
  const f = (r) => npv(cashflows, r);
  let flo = f(lo), fhi = f(hi);
  if (Number.isNaN(flo) || Number.isNaN(fhi)) return null;
  if (flo * fhi > 0) return null; // sem troca de sinal no intervalo
  for (let i = 0; i < maxIter; i++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < tol) return mid;
    if (flo * fmid < 0) { hi = mid; fhi = fmid; } else { lo = mid; flo = fmid; }
  }
  return (lo + hi) / 2;
}

// Primeiro índice (mês) em que o acumulado >= 0. null se nunca.
export function payback(cashflows) {
  let acc = 0;
  for (let m = 0; m < cashflows.length; m++) {
    acc += cashflows[m];
    if (m > 0 && acc >= 0) return m;
  }
  return null;
}

export function paybackDescontado(cashflows, rate) {
  const descontados = cashflows.map((cf, m) => cf / Math.pow(1 + rate, m));
  return payback(descontados);
}

// Receita-base mensal a 100% de penetração (sem sazonalidade flat — ver plano).
function receitaBase(c) {
  return c.ticket * c.clientesDia * PREMISSAS.diasPorMes;
}

// Penetração de mercado no mês m: sobe linear de rampInicial até 1,0 em rampMeses.
export function penetracao(c, m) {
  if (m >= c.rampMeses) return 1.0;
  return c.rampInicial + (1 - c.rampInicial) * (m - 1) / (c.rampMeses - 1);
}

// Curva de sazonalidade mensal (Maceió, jan..dez): alta dez–mar, baixa abr–jul, neutra ago–nov.
// O shape soma zero no ano ⇒ média anual do fator = 1,0 (muda o timing do caixa, não a receita média).
// Amplitude por cenário = |1 − sazonalidade| (pessimista ±25%, realista 0, otimista ±20%).
const SHAPE_SAZONAL = [1, 1, 1, -1, -1, -1, -1, 0, 0, 0, 0, 1];
export function sazonalidadeFator(c, m) {
  const amp = Math.abs(1 - (c.sazonalidade ?? 1));
  return 1 + amp * SHAPE_SAZONAL[(m - 1) % 12];
}

// Lucro de um mês dada a penetração (0..1). Custos variáveis escalam com a receita; custo fixo não.
function lucroMes(c, pen) {
  const receita = receitaBase(c) * pen;
  const cmv = receita * PREMISSAS.cmvPct;
  const royalties = receita * PREMISSAS.royaltiesPct;
  const pub = receita * PREMISSAS.publicidadePct;
  const calib = receita * c.despesasCalibracaoPct;
  const fixo = c.custoFixoMensal;
  const custos = cmv + royalties + pub + calib + fixo;
  return { receita, custos, lucro: receita - custos };
}

// Fluxo de 0..horizonte. Mês 0 = -investimento. Meses 1..N com ramp de penetração.
// opts.sazonal: aplica a curva mensal de sazonalidade sobre a receita (default off).
export function buildCashFlow(c, premissas = PREMISSAS, opts = {}) {
  const fluxos = [-c.investimento];
  for (let m = 1; m <= premissas.horizonteMeses; m++) {
    const fator = penetracao(c, m) * (opts.sazonal ? sazonalidadeFator(c, m) : 1);
    fluxos.push(lucroMes(c, fator).lucro);
  }
  return fluxos;
}

// LTV: ticket × margem × visitas/ano × vida(anos). Calibrável; default coerente com o relatório.
export function ltv(c) {
  const margem = 1 - PREMISSAS.cmvPct - PREMISSAS.royaltiesPct - PREMISSAS.publicidadePct; // 0,57
  const vidaPeriodos = 1 / (1 - c.taxaRetorno); // retenção -> vida média
  const visitasAno = 12;
  return c.ticket * margem * visitasAno * vidaPeriodos;
}

export function computeMetrics(c, premissas = PREMISSAS, opts = {}) {
  const i = monthlyRate(premissas.tmaAnual);
  const fluxos = buildCashFlow(c, premissas, opts);
  const estavel = lucroMes(c, 1.0);
  const tirMensal = irr(fluxos);
  return {
    fluxos,
    vpl: npv(fluxos, i),
    tirMensal,
    tirAnual: tirMensal == null ? null : Math.pow(1 + tirMensal, 12) - 1,
    paybackSimples: payback(fluxos),
    paybackDescontado: paybackDescontado(fluxos, i),
    receitaEstavel: estavel.receita,
    lucroEstavel: estavel.lucro,
    burn: estavel.custos,
    ltv: ltv(c),
    cac: premissas.cac,
    ltvCac: ltv(c) / premissas.cac,
  };
}
