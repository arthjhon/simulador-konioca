// src/util/format.js
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

export const fmtBRL = (v) => (v == null || Number.isNaN(v) ? 'n/d' : brl.format(v));
export const fmtPct = (v) => (v == null || Number.isNaN(v) ? 'n/d' : pct.format(v));
export const fmtNum = (v) => (v == null || Number.isNaN(v) ? 'n/d' : num.format(v));
export const fmtMeses = (v) => (v == null ? 'Não atingido' : `${v} meses`);
export const fmtMult = (v) => (v == null || Number.isNaN(v) ? 'n/d' : `${v.toFixed(1)}x`);
