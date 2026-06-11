// src/sections/MonteCarlo.jsx
import { useEffect, useRef, useState } from 'react';
import { useSim } from '../state/SimContext.jsx';
import { runSimulation } from '../core/montecarlo.js';
import VplHistogram from '../components/charts/VplHistogram.jsx';
import TornadoChart from '../components/charts/TornadoChart.jsx';
import Metric from '../components/Metric.jsx';
import { fmtBRL, fmtPct } from '../util/format.js';
import { exportarCsv, exportarPng } from '../util/exportar.js';

const DEFAULT_VARS = {
  ticket: { label: 'Ticket', dist: 'triangular', min: 18, moda: 25, max: 32, media: 25, sigma: 4 },
  clientesDia: { label: 'Clientes/dia', dist: 'triangular', min: 45, moda: 80, max: 120, media: 80, sigma: 18 },
  custoFixoMensal: { label: 'Custo fixo', dist: 'triangular', min: 12000, moda: 14000, max: 18000, media: 14000, sigma: 2000 },
};
const DISTS = ['triangular', 'normal', 'uniforme'];
const N_MIN = 100, N_MAX = 200000; // worker fora da main thread libera N grande
const MC_KEY = 'cemevi.mc.v1';

function carregarMc() {
  try {
    const d = JSON.parse(localStorage.getItem(MC_KEY));
    if (d && typeof d === 'object') return d;
  } catch { /* sem storage */ }
  return null;
}

function validarVar(spec) {
  if (spec.dist === 'triangular' && !(spec.min <= spec.moda && spec.moda <= spec.max))
    return 'Triangular exige mín ≤ moda ≤ máx — corrija os valores.';
  if (spec.dist === 'uniforme' && !(spec.min < spec.max))
    return 'Uniforme exige mín < máx — corrija os valores.';
  if (spec.dist === 'normal' && !(spec.sigma > 0))
    return 'Normal exige desvio σ > 0.';
  return null;
}

export default function MonteCarlo() {
  const { cenarioAtivo } = useSim();
  const [n, setN] = useState(() => carregarMc()?.n ?? 5000);
  const [seed, setSeed] = useState(() => carregarMc()?.seed ?? 123);
  const [vars, setVars] = useState(() => {
    const salvo = carregarMc()?.vars;
    if (!salvo) return DEFAULT_VARS;
    const out = {};
    for (const k of Object.keys(DEFAULT_VARS)) out[k] = { ...DEFAULT_VARS[k], ...(salvo[k] ?? {}) };
    return out;
  });
  const [resultado, setResultado] = useState(null);
  const [erros, setErros] = useState({});
  const [rodando, setRodando] = useState(false);
  const refHist = useRef(null);
  const refTornado = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(MC_KEY, JSON.stringify({ n, seed, vars })); } catch { /* sem storage */ }
  }, [n, seed, vars]);

  function setVar(campo, patch) { setVars((v) => ({ ...v, [campo]: { ...v[campo], ...patch } })); }

  function restaurarPadroes() {
    setN(5000); setSeed(123); setVars(DEFAULT_VARS); setErros({}); setResultado(null);
    try { localStorage.removeItem(MC_KEY); } catch { /* sem storage */ }
  }

  function rodar() {
    const novosErros = {};
    for (const [campo, spec] of Object.entries(vars)) {
      const e = validarVar(spec);
      if (e) novosErros[campo] = e;
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    const nVal = Math.min(N_MAX, Math.max(N_MIN, Math.round(Number(n) || 0)));
    setN(nVal);
    const cfg = { base: cenarioAtivo, n: nVal, seed: Number(seed) || 1, vars };
    setRodando(true);
    const finalizar = (res) => { setResultado(res); setRodando(false); };
    const rodarSync = () => setTimeout(() => finalizar(runSimulation(cfg)), 30);
    try {
      const worker = new Worker(new URL('../workers/mc.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => {
        worker.terminate();
        if (e.data.ok) finalizar(e.data.resultado);
        else rodarSync();
      };
      worker.onerror = () => { worker.terminate(); rodarSync(); };
      worker.postMessage(cfg);
    } catch {
      rodarSync(); // navegador sem module worker — fallback síncrono
    }
  }

  function exportarIteracoes() {
    const linhas = [['iteracao', 'vpl']];
    resultado.vpl.valores.forEach((v, i) => linhas.push([i + 1, Math.round(v)]));
    exportarCsv('montecarlo-vpl.csv', linhas);
  }

  const labels = Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, v.label]));
  // IC 95% da proporção P(VPL>0): p ± 1,96·√(p(1−p)/n)
  const ic = resultado
    ? 1.96 * Math.sqrt((resultado.pVplPositivo * (1 - resultado.pVplPositivo)) / resultado.n)
    : 0;

  return (
    <div>
      <div className="card">
        <div className="chart-header">
          <h2 style={{ margin: 0 }}>Monte Carlo — base: {cenarioAtivo}</h2>
          <button className="btn-mini" onClick={restaurarPadroes}>Restaurar padrões</button>
        </div>
        <div className="grid2">
          <div>
            <label htmlFor="mc-n">Iterações (N)</label>
            <input id="mc-n" type="number" min={N_MIN} max={N_MAX} value={n} onChange={(e) => setN(e.target.value)} />
            <div className="campo-hint">Entre {N_MIN} e {N_MAX.toLocaleString('pt-BR')} — roda em segundo plano (Web Worker)</div>
          </div>
          <div>
            <label htmlFor="mc-seed">Semente</label>
            <input id="mc-seed" type="number" value={seed} onChange={(e) => setSeed(e.target.value)} />
            <div className="campo-hint">Mesma semente ⇒ mesmo resultado (reprodutível)</div>
          </div>
        </div>
        {Object.entries(vars).map(([campo, spec]) => (
          <div key={campo} style={{ borderTop: '1px solid var(--line)', paddingTop: 8, marginTop: 8 }}>
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
            {erros[campo] && <div className="campo-erro" role="alert">{erros[campo]}</div>}
          </div>
        ))}
        <button className="acao" style={{ marginTop: 12 }} onClick={rodar} disabled={rodando}>
          {rodando ? 'Simulando…' : 'Rodar simulação'}
        </button>
      </div>

      {resultado && (
        <>
          <div className="card">
            <div className="kpibar" style={{ flexWrap: 'wrap' }} aria-live="polite">
              <Metric label="P(VPL > 0)" valor={fmtPct(resultado.pVplPositivo)} hint="probabilidade de viabilidade" />
              <Metric label="IC 95%" valor={`${fmtPct(Math.max(0, resultado.pVplPositivo - ic))} – ${fmtPct(Math.min(1, resultado.pVplPositivo + ic))}`} hint="intervalo de confiança" />
              <Metric label="VPL P50" valor={fmtBRL(resultado.vpl.p50)} />
              <Metric label="VPL P5" valor={fmtBRL(resultado.vpl.p5)} />
              <Metric label="VPL P95" valor={fmtBRL(resultado.vpl.p95)} />
              <Metric label="VPL médio" valor={fmtBRL(resultado.vpl.media)} />
            </div>
          </div>
          <div className="card">
            <div className="chart-header">
              <h3>Distribuição do VPL ({resultado.n.toLocaleString('pt-BR')} iterações)</h3>
              <span>
                <button className="btn-mini" onClick={exportarIteracoes}>CSV</button>{' '}
                <button className="btn-mini" onClick={() => exportarPng(refHist.current, 'histograma-vpl.png')}>PNG</button>
              </span>
            </div>
            <div ref={refHist}><VplHistogram valores={resultado.vpl.valores} /></div>
          </div>
          <div className="card">
            <div className="chart-header">
              <h3>Sensibilidade (tornado) — amplitude do VPL</h3>
              <button className="btn-mini" onClick={() => exportarPng(refTornado.current, 'tornado-vpl.png')}>PNG</button>
            </div>
            <div ref={refTornado}><TornadoChart sensibilidade={resultado.sensibilidade} labels={labels} /></div>
          </div>
        </>
      )}
    </div>
  );
}
