// src/components/KpiBar.jsx
import { useSim } from '../state/SimContext.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';
import Metric from './Metric.jsx';

export default function KpiBar() {
  const { metrics, cenario } = useSim();
  const viavel = metrics.vpl > 0;
  return (
    <div className={`kpibar ${viavel ? 'ok' : 'bad'}`}>
      <span className="kpibar-cenario">{cenario.nome}</span>
      <Metric label="VPL (60m)" valor={fmtBRL(metrics.vpl)} />
      <Metric label="TIR a.a." valor={fmtPct(metrics.tirAnual)} />
      <Metric label="Payback desc." valor={fmtMeses(metrics.paybackDescontado)} />
      <Metric label="LTV/CAC" valor={fmtMult(metrics.ltvCac)} />
      <Metric label="Lucro mensal" valor={fmtBRL(metrics.lucroEstavel)} />
    </div>
  );
}
