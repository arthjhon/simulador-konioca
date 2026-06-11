// src/sections/Cenarios.jsx
import { useRef } from 'react';
import { CENARIOS, ORDEM_CENARIOS } from '../core/scenarios.js';
import { computeMetrics } from '../core/finance.js';
import { useSim } from '../state/SimContext.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';
import { exportarCsv, exportarPng } from '../util/exportar.js';
import CompareFluxoChart from '../components/charts/CompareFluxoChart.jsx';

export default function Cenarios() {
  const { trocarCenario, cenarioAtivo } = useSim();
  const refCompare = useRef(null);
  const dados = ORDEM_CENARIOS.map((k) => ({ k, c: CENARIOS[k], m: computeMetrics(CENARIOS[k]) }));
  const cell = (calc, ref) => <span>{calc}<br /><small style={{ color: 'var(--muted)' }}>ref. {ref}</small></span>;

  function exportarCenarios() {
    const linhas = [
      ['Métrica', ...dados.map((d) => d.c.nome)],
      ['VPL (R$)', ...dados.map((d) => Math.round(d.m.vpl))],
      ['TIR a.a. (%)', ...dados.map((d) => (d.m.tirAnual == null ? 'n/d' : +(d.m.tirAnual * 100).toFixed(1)))],
      ['Payback simples (meses)', ...dados.map((d) => d.m.paybackSimples ?? 'não atingido')],
      ['Payback descontado (meses)', ...dados.map((d) => d.m.paybackDescontado ?? 'não atingido')],
      ['Receita mensal estável (R$)', ...dados.map((d) => Math.round(d.m.receitaEstavel))],
      ['Lucro mensal estável (R$)', ...dados.map((d) => Math.round(d.m.lucroEstavel))],
      ['LTV/CAC (x)', ...dados.map((d) => +d.m.ltvCac.toFixed(1))],
      ['Burn rate (R$)', ...dados.map((d) => Math.round(d.m.burn))],
    ];
    exportarCsv('cenarios-cemevi.csv', linhas);
  }

  const fluxosPorCenario = Object.fromEntries(dados.map(({ k, m }) => [k, m.fluxos]));

  return (
    <>
      <div className="card">
        <div className="chart-header">
          <h2 style={{ margin: 0 }}>Comparativo dos 3 cenários</h2>
          <button className="btn-mini" onClick={exportarCenarios}>Exportar CSV</button>
        </div>
        <p style={{ color: 'var(--muted)' }}>Valores computados pelo simulador; "ref." = relatório. Clique no cabeçalho para tornar o cenário ativo.</p>
        <table>
          <thead><tr><th>Métrica</th>
            {dados.map(({ k, c }) => (
              <th key={k}><button className={`nav-btn ${cenarioAtivo === k ? 'ativo' : ''}`} onClick={() => trocarCenario(k)}>{c.nome}</button></th>
            ))}
          </tr></thead>
          <tbody>
            <tr><td>VPL (60m)</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtBRL(m.vpl), fmtBRL(c.ref.vpl))}</td>)}</tr>
            <tr><td>TIR a.a.</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtPct(m.tirAnual), fmtPct(c.ref.tirAnual))}</td>)}</tr>
            <tr><td>Payback descontado</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtMeses(m.paybackDescontado), fmtMeses(c.ref.paybackDescontado))}</td>)}</tr>
            <tr><td>Receita mensal estável</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtBRL(m.receitaEstavel), fmtBRL(c.ref.receitaEstavel))}</td>)}</tr>
            <tr><td>Lucro mensal estável</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtBRL(m.lucroEstavel), fmtBRL(c.ref.lucroEstavel))}</td>)}</tr>
            <tr><td>LTV/CAC</td>{dados.map(({ k, m }) => <td key={k}>{fmtMult(m.ltvCac)}</td>)}</tr>
            <tr><td>Burn rate</td>{dados.map(({ k, m, c }) => <td key={k}>{cell(fmtBRL(m.burn), fmtBRL(c.ref.burn))}</td>)}</tr>
          </tbody>
        </table>
        <p style={{ color: 'var(--muted)', fontSize: 12 }}>Nota: pessimista usa 60 clientes/dia (tabela do relatório indica 45, mas a receita declarada R$ 32.400 implica 60).</p>
      </div>

      <div className="card">
        <div className="chart-header">
          <h3>Fluxo de caixa acumulado — comparação dos cenários</h3>
          <button className="btn-mini" onClick={() => exportarPng(refCompare.current, 'comparacao-cenarios.png')}>PNG</button>
        </div>
        <div ref={refCompare}><CompareFluxoChart fluxosPorCenario={fluxosPorCenario} /></div>
      </div>
    </>
  );
}
