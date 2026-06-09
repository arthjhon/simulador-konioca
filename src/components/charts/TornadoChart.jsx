// src/components/charts/TornadoChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function TornadoChart({ sensibilidade }) {
  const data = sensibilidade.map((s) => ({ campo: s.campo, amplitude: Math.round(s.amplitude) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart layout="vertical" data={data}>
        <CartesianGrid stroke="#2a3550" />
        <XAxis type="number" stroke="#9fb0cc" tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
        <YAxis type="category" dataKey="campo" stroke="#9fb0cc" width={100} />
        <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
        <Bar dataKey="amplitude" fill="#16a34a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
