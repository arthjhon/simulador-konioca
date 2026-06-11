// src/components/charts/CashFlowChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CHART } from '../../util/chartTheme.js';

export default function CashFlowChart({ fluxos }) {
  let acc = 0;
  const data = fluxos.map((cf, m) => { acc += cf; return { mes: m, acumulado: Math.round(acc) }; });
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke={CHART.grid} />
        <XAxis dataKey="mes" stroke={CHART.muted} /><YAxis stroke={CHART.muted} />
        <Tooltip formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
        <ReferenceLine y={0} stroke={CHART.bad} />
        <Line type="monotone" dataKey="acumulado" stroke={CHART.accent} dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
