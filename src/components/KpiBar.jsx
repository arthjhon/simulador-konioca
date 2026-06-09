// src/components/KpiBar.jsx
import { useSim } from '../state/SimContext.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';
import Metric from './Metric.jsx';

// Veredito visual: inviável (VPL<=0), atenção (viável mas payback no limite/ausente), viável.
function classificar(metrics) {
  if (metrics.vpl <= 0) return { estado: 'bad', rotulo: 'Inviável' };
  const pb = metrics.paybackDescontado;
  if (pb == null || pb > 48) return { estado: 'warn', rotulo: 'Viável com atenção' };
  return { estado: 'ok', rotulo: 'Viável' };
}

export default function KpiBar() {
  const { metrics, cenario } = useSim();
  const { estado, rotulo } = classificar(metrics);
  return (
    <div className={`kpibar ${estado}`}>
      <span className="kpibar-cenario">{cenario.nome}</span>
      <Metric label="VPL (60m)" valor={fmtBRL(metrics.vpl)} />
      <Metric label="TIR a.a." valor={fmtPct(metrics.tirAnual)} />
      <Metric label="Payback desc." valor={fmtMeses(metrics.paybackDescontado)} />
      <Metric label="LTV/CAC" valor={fmtMult(metrics.ltvCac)} />
      <Metric label="Lucro mensal" valor={fmtBRL(metrics.lucroEstavel)} />
      <span className={`veredito-pill ${estado}`}>{rotulo}</span>
    </div>
  );
}
