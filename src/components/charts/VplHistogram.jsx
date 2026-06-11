// src/components/charts/VplHistogram.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CHART, TOOLTIP } from '../../util/chartTheme.js';

export default function VplHistogram({ valores, bins = 30 }) {
  if (!valores?.length) return null;
  // min/max por laço — spread (Math.min(...arr)) estoura a pilha com N >= ~100k
  let min = Infinity, max = -Infinity;
  for (const v of valores) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const w = (max - min) / bins || 1;
  const hist = Array.from({ length: bins }, (_, i) => ({ x: Math.round(min + i * w + w / 2), n: 0 }));
  valores.forEach((v) => { const idx = Math.min(bins - 1, Math.floor((v - min) / w)); hist[idx].n++; });
  return (
    <>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={hist}>
          <CartesianGrid stroke={CHART.grid} />
          <XAxis dataKey="x" stroke={CHART.muted} tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
          <YAxis stroke={CHART.muted} />
          <Tooltip {...TOOLTIP} cursor={{ fill: '#94a6c4', fillOpacity: 0.08 }} formatter={(v) => `${v.toLocaleString('pt-BR')} iterações`} labelFormatter={(v) => `VPL ~ R$ ${Number(v).toLocaleString('pt-BR')}`} />
          <ReferenceLine x={0} stroke={CHART.bad} />
          <Bar dataKey="n" fill={CHART.accent} />
        </BarChart>
      </ResponsiveContainer>
      <details className="dados-tabela">
        <summary>Ver dados em tabela</summary>
        <div className="tabela-scroll">
          <table>
            <thead><tr><th>Centro da faixa (R$)</th><th>Iterações</th></tr></thead>
            <tbody>
              {hist.map((h) => (
                <tr key={h.x}><td>{h.x.toLocaleString('pt-BR')}</td><td>{h.n.toLocaleString('pt-BR')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
