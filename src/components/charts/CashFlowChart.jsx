// src/components/charts/CashFlowChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CHART, TOOLTIP } from '../../util/chartTheme.js';

export default function CashFlowChart({ fluxos }) {
  let acc = 0;
  const data = fluxos.map((cf, m) => {
    acc += cf;
    return { mes: m, fluxo: Math.round(cf), acumulado: Math.round(acc) };
  });
  return (
    <>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke={CHART.grid} />
          <XAxis dataKey="mes" stroke={CHART.muted} /><YAxis stroke={CHART.muted} />
          <Tooltip {...TOOLTIP} formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} labelFormatter={(m) => `Mês ${m}`} />
          <ReferenceLine y={0} stroke={CHART.bad} />
          <Line type="monotone" dataKey="acumulado" stroke={CHART.accent} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <details className="dados-tabela">
        <summary>Ver dados em tabela</summary>
        <div className="tabela-scroll">
          <table>
            <thead><tr><th>Mês</th><th>Fluxo (R$)</th><th>Acumulado (R$)</th></tr></thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.mes}>
                  <td>{d.mes}</td>
                  <td>{d.fluxo.toLocaleString('pt-BR')}</td>
                  <td>{d.acumulado.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
