// src/components/charts/VplHistogram.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function VplHistogram({ valores, bins = 30 }) {
  if (!valores?.length) return null;
  const min = Math.min(...valores), max = Math.max(...valores);
  const w = (max - min) / bins || 1;
  const hist = Array.from({ length: bins }, (_, i) => ({ x: Math.round(min + i * w + w / 2), n: 0 }));
  valores.forEach((v) => { const idx = Math.min(bins - 1, Math.floor((v - min) / w)); hist[idx].n++; });
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={hist}>
        <CartesianGrid stroke="#2a3550" />
        <XAxis dataKey="x" stroke="#9fb0cc" tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
        <YAxis stroke="#9fb0cc" />
        <Tooltip formatter={(v) => `${v} iterações`} labelFormatter={(v) => `VPL ~ R$ ${Number(v).toLocaleString('pt-BR')}`} />
        <ReferenceLine x={0} stroke="#dc2626" />
        <Bar dataKey="n" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}
