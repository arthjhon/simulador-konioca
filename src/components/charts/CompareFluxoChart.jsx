// src/components/charts/CompareFluxoChart.jsx
// Fluxo de caixa acumulado dos 3 cenários sobreposto — comparação lado a lado.
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CHART } from '../../util/chartTheme.js';

const SERIES = [
  ['pessimista', 'Pessimista', '#ef4444'],
  ['realista', 'Realista', '#38bdf8'],
  ['otimista', 'Otimista', '#22c55e'],
];

export default function CompareFluxoChart({ fluxosPorCenario }) {
  const len = Math.max(...SERIES.map(([k]) => fluxosPorCenario[k]?.length ?? 0));
  const acc = {};
  const data = Array.from({ length: len }, (_, m) => {
    const row = { mes: m };
    for (const [k] of SERIES) {
      acc[k] = (acc[k] ?? 0) + (fluxosPorCenario[k]?.[m] ?? 0);
      row[k] = Math.round(acc[k]);
    }
    return row;
  });
  return (
    <>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid stroke={CHART.grid} />
          <XAxis dataKey="mes" stroke={CHART.muted} />
          <YAxis stroke={CHART.muted} tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
          <Tooltip formatter={(v, nome) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, nome]} />
          <Legend />
          <ReferenceLine y={0} stroke={CHART.bad} />
          {SERIES.map(([k, nome, cor]) => (
            <Line key={k} type="monotone" dataKey={k} name={nome} stroke={cor} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <details className="dados-tabela">
        <summary>Ver dados em tabela</summary>
        <div className="tabela-scroll">
          <table>
            <thead><tr><th>Mês</th>{SERIES.map(([k, nome]) => <th key={k}>{nome} (R$)</th>)}</tr></thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.mes}><td>{d.mes}</td>{SERIES.map(([k]) => <td key={k}>{d[k].toLocaleString('pt-BR')}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
