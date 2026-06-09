// src/sections/Mercado.jsx
import { TEXTO } from '../content/texto.js';
export default function Mercado() {
  const t = TEXTO.mercado;
  return (
    <div className="card">
      <h2>{t.titulo}</h2>
      {t.paragrafos.map((p, i) => <p key={i}>{p}</p>)}
      <h3>Concorrência direta</h3>
      <table><thead><tr><th>Concorrente</th><th>Produto</th><th>Ticket</th><th>Local</th></tr></thead>
        <tbody>{t.concorrentes.map((c, i) => <tr key={i}><td>{c.nome}</td><td>{c.produto}</td><td>{c.ticket}</td><td>{c.local}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
