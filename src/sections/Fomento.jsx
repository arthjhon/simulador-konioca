// src/sections/Fomento.jsx
import { TEXTO } from '../content/texto.js';
export default function Fomento() {
  const t = TEXTO.fomento;
  return (
    <div className="card">
      <h2>{t.titulo}</h2>
      <h3>Instrumentos</h3>
      <ul>{t.instrumentos.map((x, i) => <li key={i}><strong>{x.nome}:</strong> {x.desc}</li>)}</ul>
      <h3>Mitigação de risco</h3>
      <ul>{t.mitigacoes.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>
  );
}
