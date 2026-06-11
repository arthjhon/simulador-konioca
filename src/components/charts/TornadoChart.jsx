// src/components/charts/TornadoChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CHART, TOOLTIP } from '../../util/chartTheme.js';

// labels: mapa opcional campo -> rótulo amigável (ex.: clientesDia -> "Clientes/dia")
export default function TornadoChart({ sensibilidade, labels = {} }) {
  const data = sensibilidade.map((s) => ({
    campo: labels[s.campo] ?? s.campo,
    baixo: Math.round(s.baixo),
    alto: Math.round(s.alto),
    amplitude: Math.round(s.amplitude),
  }));
  return (
    <>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid stroke={CHART.grid} />
          <XAxis type="number" stroke={CHART.muted} tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
          <YAxis type="category" dataKey="campo" stroke={CHART.muted} width={110} />
          <Tooltip {...TOOLTIP} cursor={{ fill: '#94a6c4', fillOpacity: 0.08 }} formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
          <Bar dataKey="amplitude" fill={CHART.accent} />
        </BarChart>
      </ResponsiveContainer>
      <details className="dados-tabela">
        <summary>Ver dados em tabela</summary>
        <table>
          <thead><tr><th>Variável</th><th>VPL no mínimo (R$)</th><th>VPL no máximo (R$)</th><th>Amplitude (R$)</th></tr></thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.campo}>
                <td>{d.campo}</td>
                <td>{d.baixo.toLocaleString('pt-BR')}</td>
                <td>{d.alto.toLocaleString('pt-BR')}</td>
                <td>{d.amplitude.toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  );
}
