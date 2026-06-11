// src/sections/Simulador.jsx
import { useRef } from 'react';
import { useSim } from '../state/SimContext.jsx';
import { CENARIOS, ORDEM_CENARIOS, PREMISSAS } from '../core/scenarios.js';
import CashFlowChart from '../components/charts/CashFlowChart.jsx';
import Metric from '../components/Metric.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';
import { exportarPng } from '../util/exportar.js';

const ampSazonalDe = (c) => c.ampSazonal ?? Math.abs(1 - (c.sazonalidade ?? 1));

// tipo 'pct': exibido em 0–100% (slider + número), armazenado como fração 0–1 no modelo.
// `get` resolve o valor quando o campo tem default derivado (royalties, amplitude sazonal).
const CAMPOS = [
  { campo: 'ticket', label: 'Ticket médio (R$)', tipo: 'numero' },
  { campo: 'clientesDia', label: 'Clientes/dia', tipo: 'numero' },
  { campo: 'custoFixoMensal', label: 'Custo fixo mensal (R$)', tipo: 'numero' },
  { campo: 'investimento', label: 'Investimento (R$)', tipo: 'numero' },
  { campo: 'taxaRetorno', label: 'Taxa de retorno (%)', tipo: 'pct',
    hint: 'Fidelização: % de clientes que voltam (afeta o LTV)' },
  { campo: 'royaltiesPct', label: 'Royalties Konioca (%)', tipo: 'pct',
    get: (c) => c.royaltiesPct ?? PREMISSAS.royaltiesPct,
    hint: '% da receita bruta paga à franqueadora (COF 2026: 6%)' },
  { campo: 'despesasCalibracaoPct', label: 'Impostos + outras despesas (%)', tipo: 'pct',
    hint: '% da receita: Simples Nacional + marketing/outros (calibrado ao relatório)' },
  { campo: 'rampInicial', label: 'Penetração inicial (%)', tipo: 'pct',
    hint: '% da demanda madura já capturada no mês 1 de operação' },
  { campo: 'rampMeses', label: 'Meses até maturidade', tipo: 'numero', min: 1, max: 60,
    hint: 'Mês em que a penetração de mercado atinge 100%' },
  { campo: 'ampSazonal', label: 'Amplitude sazonal (%)', tipo: 'pct',
    get: ampSazonalDe,
    hint: 'Intensidade da variação mensal (aplicada com o toggle de sazonalidade ligado)' },
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
  const { cenario, metrics, setParam, resetParams, cenarioAtivo, trocarCenario, sazonal, setSazonal } = useSim();
  const refFluxo = useRef(null);
  const ampSaz = Math.round(ampSazonalDe(cenario) * 100);
  return (
    <div className="grid2">
      <div className="card">
        <h2>Parâmetros — {cenario.nome}</h2>
        <div className="nav" style={{ marginTop: 0, marginBottom: 6 }} aria-label="Cenários pré-configurados">
          {ORDEM_CENARIOS.map((k) => (
            <button key={k} className={`nav-btn ${cenarioAtivo === k ? 'ativo' : ''}`} onClick={() => trocarCenario(k)}>
              {CENARIOS[k].nome}
            </button>
          ))}
        </div>
        {CAMPOS.map(({ campo, label, tipo, hint, get, min = 0, max }) => (
          <div key={campo}>
            <label htmlFor={`p-${campo}`}>{label}</label>
            {tipo === 'pct' ? (
              <CampoPct id={`p-${campo}`} valor={get ? get(cenario) : cenario[campo]} onChange={(v) => setParam(campo, v)} />
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
        <div className="kpibar" style={{ flexWrap: 'wrap' }} aria-live="polite">
          <Metric label="VPL (60m)" valor={fmtBRL(metrics.vpl)} />
          <Metric label="TIR a.a." valor={fmtPct(metrics.tirAnual)} />
          <Metric label="Payback simples" valor={fmtMeses(metrics.paybackSimples)} />
          <Metric label="Payback desc." valor={fmtMeses(metrics.paybackDescontado)} />
          <Metric label="Lucro mensal" valor={fmtBRL(metrics.lucroEstavel)} />
          <Metric label="Burn rate" valor={fmtBRL(metrics.burn)} hint="custos totais/mês" />
          <Metric label="LTV" valor={fmtBRL(metrics.ltv)} hint="por cliente recorrente" />
          <Metric label="LTV/CAC" valor={fmtMult(metrics.ltvCac)} />
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
