// src/sections/Franquia.jsx
import { TEXTO } from '../content/texto.js';
export default function Franquia() {
  const t = TEXTO.franquia;
  return <div className="card"><h2>{t.titulo}</h2>{t.paragrafos.map((p, i) => <p key={i}>{p}</p>)}</div>;
}
