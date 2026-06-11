// src/sections/Simulador.jsx
import { useRef } from 'react';
import { useSim } from '../state/SimContext.jsx';
import CashFlowChart from '../components/charts/CashFlowChart.jsx';
import Metric from '../components/Metric.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';
import { exportarPng } from '../util/exportar.js';

// tipo 'pct': exibido em 0–100% (slider + número), armazenado como fração 0–1 no modelo.
const CAMPOS = [
  { campo: 'ticket', label: 'Ticket médio (R$)', tipo: 'numero' },
  { campo: 'clientesDia', label: 'Clientes/dia', tipo: 'numero' },
  { campo: 'custoFixoMensal', label: 'Custo fixo mensal (R$)', tipo: 'numero' },
  { campo: 'investimento', label: 'Investimento (R$)', tipo: 'numero' },
  { campo: 'taxaRetorno', label: 'Taxa de retorno (%)', tipo: 'pct',
    hint: 'Fidelização: % de clientes que voltam (afeta o LTV)' },
  { campo: 'despesasCalibracaoPct', label: 'Impostos + outras despesas (%)', tipo: 'pct',
    hint: '% da receita: Simples Nacional + marketing/outros (calibrado ao relatório)' },
  { campo: 'rampInicial', label: 'Penetração inicial (%)', tipo: 'pct',
    hint: '% da demanda madura já capturada no mês 1 de operação' },
  { campo: 'rampMeses', label: 'Meses até maturidade', tipo: 'numero', min: 1, max: 60,
    hint: 'Mês em que a penetração de mercado atinge 100%' },
];

function CampoPct({ id, valor, onChange }) {
  const pct = Math.round(valor * 100);
  const setPct = (v) => onChange(Math.min(100, Math.max(0, Math.round(Number(v) || 0))) / 100);
  return (
    <div className="campo-pct">
      <input type="range" min="0" max="100" step="1" value={pct} aria-hidden="true" tabIndex={-1}
        onChange={(e) => setPct(e.target.value)} />
      <input id={id} type="number" min="0" max="100" step="1" value={pct}
        onChange={(e) => setPct(e.target.value)} />
    </div>
  );
}

export default function Simulador() {
  const { cenario, metrics, setParam, resetParams, cenarioAtivo, sazonal, setSazonal } = useSim();
  const refFluxo = useRef(null);
  const ampSaz = Math.round(Math.abs(1 - (cenario.sazonalidade ?? 1)) * 100);
  return (
    <div className="grid2">
      <div className="card">
        <h2>Parâmetros — {cenario.nome}</h2>
        {CAMPOS.map(({ campo, label, tipo, hint, min = 0, max }) => (
          <div key={campo}>
            <label htmlFor={`p-${campo}`}>{label}</label>
            {tipo === 'pct' ? (
              <CampoPct id={`p-${campo}`} valor={cenario[campo]} onChange={(v) => setParam(campo, v)} />
            ) : (
              <input id={`p-${campo}`} type="number" min={min} {...(max ? { max } : {})}
                value={cenario[campo]}
                onChange={(e) => {
                  let v = Math.max(min, Number(e.target.value) || 0);
                  if (max) v = Math.min(max, v);
                  setParam(campo, v);
                }} />
            )}
            {hint && <div className="campo-hint">{hint}</div>}
          </div>
        ))}
        <button className="acao" style={{ marginTop: 14 }} onClick={resetParams}>Restaurar cenário {cenarioAtivo}</button>
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
        <label className="toggle">
          <input type="checkbox" checked={sazonal} onChange={(e) => setSazonal(e.target.checked)} />
          Sazonalidade mensal — alta dez–mar / baixa abr–jul, amplitude ±{ampSaz}%
          {ampSaz === 0 && ' (neutra neste cenário)'}
        </label>
        <div className="chart-header">
          <h3>Fluxo de caixa acumulado (60 meses)</h3>
          <button className="btn-mini" onClick={() => exportarPng(refFluxo.current, 'fluxo-caixa.png')}>PNG</button>
        </div>
        <div ref={refFluxo}><CashFlowChart fluxos={metrics.fluxos} /></div>
      </div>
    </div>
  );
}
