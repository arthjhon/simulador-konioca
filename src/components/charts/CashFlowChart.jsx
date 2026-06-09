// src/components/charts/CashFlowChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function CashFlowChart({ fluxos }) {
  let acc = 0;
  const data = fluxos.map((cf, m) => { acc += cf; return { mes: m, acumulado: Math.round(acc) }; });
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#2a3550" />
        <XAxis dataKey="mes" stroke="#9fb0cc" /><YAxis stroke="#9fb0cc" />
        <Tooltip formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
        <ReferenceLine y={0} stroke="#dc2626" />
        <Line type="monotone" dataKey="acumulado" stroke="#2563eb" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
