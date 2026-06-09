// src/sections/Simulador.jsx
import { useSim } from '../state/SimContext.jsx';
import CashFlowChart from '../components/charts/CashFlowChart.jsx';
import Metric from '../components/Metric.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';

const CAMPOS = [
  ['ticket', 'Ticket médio (R$)'], ['clientesDia', 'Clientes/dia'],
  ['custoFixoMensal', 'Custo fixo mensal (R$)'], ['investimento', 'Investimento (R$)'],
  ['taxaRetorno', 'Taxa de retorno (0–1)'], ['despesasCalibracaoPct', 'Impostos+outros (0–1)'],
];

export default function Simulador() {
  const { cenario, metrics, setParam, resetParams, cenarioAtivo } = useSim();
  return (
    <div className="grid2">
      <div className="card">
        <h2>Parâmetros — {cenario.nome}</h2>
        {CAMPOS.map(([campo, label]) => (
          <div key={campo}>
            <label>{label}</label>
            <input type="number" value={cenario[campo]}
              onChange={(e) => setParam(campo, e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))} />
          </div>
        ))}
        <button className="acao" style={{ marginTop: 12 }} onClick={resetParams}>Restaurar cenário {cenarioAtivo}</button>
      </div>
      <div className="card">
        <h2>Resultados</h2>
        <div className="kpibar" style={{ flexWrap: 'wrap' }}>
          <Metric label="VPL (60m)" valor={fmtBRL(metrics.vpl)} />
          <Metric label="TIR a.a." valor={fmtPct(metrics.tirAnual)} />
          <Metric label="Payback simples" valor={fmtMeses(metrics.paybackSimples)} />
          <Metric label="Payback desc." valor={fmtMeses(metrics.paybackDescontado)} />
          <Metric label="LTV/CAC" valor={fmtMult(metrics.ltvCac)} />
          <Metric label="Lucro mensal" valor={fmtBRL(metrics.lucroEstavel)} />
        </div>
        <h3 style={{ marginTop: 16 }}>Fluxo de caixa acumulado (60 meses)</h3>
        <CashFlowChart fluxos={metrics.fluxos} />
      </div>
    </div>
  );
}
