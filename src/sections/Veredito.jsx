// src/sections/Veredito.jsx
import { TEXTO } from '../content/texto.js';
export default function Veredito() {
  const t = TEXTO.veredito;
  return (
    <div className="card">
      <h2>{t.titulo}</h2>
      <p><span className="selo cond">{t.selo}</span></p>
      <p>{t.texto}</p>
      <h3>Condicionais</h3>
      <ul>{t.condicionais.map((c, i) => <li key={i}>{c}</li>)}</ul>
    </div>
  );
}
