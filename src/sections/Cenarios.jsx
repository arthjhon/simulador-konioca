// src/sections/Cenarios.jsx
import { CENARIOS, ORDEM_CENARIOS } from '../core/scenarios.js';
import { computeMetrics } from '../core/finance.js';
import { useSim } from '../state/SimContext.jsx';
import { fmtBRL, fmtPct, fmtMeses, fmtMult } from '../util/format.js';

export default function Cenarios() {
  const { trocarCenario, cenarioAtivo } = useSim();
  const dados = ORDEM_CENARIOS.map((k) => ({ k, c: CENARIOS[k], m: computeMetrics(CENARIOS[k]) }));
  const cell = (calc, ref) => <span>{calc}<br /><small style={{ color: '#9fb0cc' }}>ref. {ref}</small></span>;

  return (
    <div className="card">
      <h2>Comparativo dos 3 cenários</h2>
      <p style={{ color: '#9fb0cc' }}>Valores computados pelo simulador; "ref." = relatório. Clique no cabeçalho para tornar o cenário ativo.</p>
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
      <p style={{ color: '#9fb0cc', fontSize: 12 }}>Nota: pessimista usa 60 clientes/dia (tabela do relatório indica 45, mas a receita declarada R$ 32.400 implica 60).</p>
    </div>
  );
}
