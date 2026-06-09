// src/sections/MonteCarlo.jsx
import { useState } from 'react';
import { useSim } from '../state/SimContext.jsx';
import { runSimulation } from '../core/montecarlo.js';
import VplHistogram from '../components/charts/VplHistogram.jsx';
import TornadoChart from '../components/charts/TornadoChart.jsx';
import Metric from '../components/Metric.jsx';
import { fmtBRL, fmtPct } from '../util/format.js';

const DEFAULT_VARS = {
  ticket: { label: 'Ticket', dist: 'triangular', min: 18, moda: 25, max: 32, media: 25, sigma: 4 },
  clientesDia: { label: 'Clientes/dia', dist: 'triangular', min: 45, moda: 80, max: 120, media: 80, sigma: 18 },
  custoFixoMensal: { label: 'Custo fixo', dist: 'triangular', min: 12000, moda: 14000, max: 18000, media: 14000, sigma: 2000 },
};
const DISTS = ['triangular', 'normal', 'uniforme'];

export default function MonteCarlo() {
  const { cenarioAtivo } = useSim();
  const [n, setN] = useState(5000);
  const [seed, setSeed] = useState(123);
  const [vars, setVars] = useState(DEFAULT_VARS);
  const [resultado, setResultado] = useState(null);

  function setVar(campo, patch) { setVars((v) => ({ ...v, [campo]: { ...v[campo], ...patch } })); }
  function rodar() {
    const cfg = { base: cenarioAtivo, n: Number(n), seed: Number(seed), vars };
    setResultado(runSimulation(cfg));
  }

  return (
    <div>
      <div className="card">
        <h2>Monte Carlo — base: {cenarioAtivo}</h2>
        <div className="grid2">
          <div><label>Iterações (N)</label><input type="number" value={n} onChange={(e) => setN(e.target.value)} /></div>
          <div><label>Semente</label><input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} /></div>
        </div>
        {Object.entries(vars).map(([campo, spec]) => (
          <div key={campo} style={{ borderTop: '1px solid #2a3550', paddingTop: 8, marginTop: 8 }}>
            <strong>{spec.label}</strong>
            <label>Distribuição</label>
            <select value={spec.dist} onChange={(e) => setVar(campo, { dist: e.target.value })}>
              {DISTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {spec.dist === 'triangular' && (
              <div className="grid2">
                <div><label>mín</label><input type="number" value={spec.min} onChange={(e) => setVar(campo, { min: Number(e.target.value) })} /></div>
                <div><label>moda</label><input type="number" value={spec.moda} onChange={(e) => setVar(campo, { moda: Number(e.target.value) })} /></div>
                <div><label>máx</label><input type="number" value={spec.max} onChange={(e) => setVar(campo, { max: Number(e.target.value) })} /></div>
              </div>
            )}
            {spec.dist === 'normal' && (
              <div className="grid2">
                <div><label>média</label><input type="number" value={spec.media} onChange={(e) => setVar(campo, { media: Number(e.target.value) })} /></div>
                <div><label>σ</label><input type="number" value={spec.sigma} onChange={(e) => setVar(campo, { sigma: Number(e.target.value) })} /></div>
              </div>
            )}
            {spec.dist === 'uniforme' && (
              <div className="grid2">
                <div><label>mín</label><input type="number" value={spec.min} onChange={(e) => setVar(campo, { min: Number(e.target.value) })} /></div>
                <div><label>máx</label><input type="number" value={spec.max} onChange={(e) => setVar(campo, { max: Number(e.target.value) })} /></div>
              </div>
            )}
          </div>
        ))}
        <button className="acao" style={{ marginTop: 12 }} onClick={rodar}>Rodar simulação</button>
      </div>

      {resultado && (
        <>
          <div className="card">
            <div className="kpibar" style={{ flexWrap: 'wrap' }}>
              <Metric label="P(VPL > 0)" valor={fmtPct(resultado.pVplPositivo)} hint="probabilidade de viabilidade" />
              <Metric label="VPL P50" valor={fmtBRL(resultado.vpl.p50)} />
              <Metric label="VPL P5" valor={fmtBRL(resultado.vpl.p5)} />
              <Metric label="VPL P95" valor={fmtBRL(resultado.vpl.p95)} />
              <Metric label="VPL médio" valor={fmtBRL(resultado.vpl.media)} />
            </div>
          </div>
          <div className="card"><h3>Distribuição do VPL ({resultado.n} iterações)</h3><VplHistogram valores={resultado.vpl.valores} /></div>
          <div className="card"><h3>Sensibilidade (tornado) — amplitude do VPL</h3><TornadoChart sensibilidade={resultado.sensibilidade} /></div>
        </>
      )}
    </div>
  );
}
