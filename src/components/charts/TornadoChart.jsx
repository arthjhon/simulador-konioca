// src/components/charts/TornadoChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CHART } from '../../util/chartTheme.js';

// labels: mapa opcional campo -> rótulo amigável (ex.: clientesDia -> "Clientes/dia")
export default function TornadoChart({ sensibilidade, labels = {} }) {
  const data = sensibilidade.map((s) => ({ campo: labels[s.campo] ?? s.campo, amplitude: Math.round(s.amplitude) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart layout="vertical" data={data}>
        <CartesianGrid stroke={CHART.grid} />
        <XAxis type="number" stroke={CHART.muted} tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
        <YAxis type="category" dataKey="campo" stroke={CHART.muted} width={110} />
        <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
        <Bar dataKey="amplitude" fill={CHART.accent} />
      </BarChart>
    </ResponsiveContainer>
  );
}
