// src/components/Nav.jsx
import { Store, Building2, Table2, SlidersHorizontal, Dices, Landmark, Gavel } from 'lucide-react';

// Ordem numerada (1–7) segue a narrativa do estudo: mercado -> franquia -> análise -> decisão.
const SECOES = [
  ['mercado', 'Mercado', Store],
  ['franquia', 'Franquia', Building2],
  ['cenarios', 'Cenários', Table2],
  ['simulador', 'Simulador', SlidersHorizontal],
  ['montecarlo', 'Monte Carlo', Dices],
  ['fomento', 'Fomento', Landmark],
  ['veredito', 'Veredito', Gavel],
];

export default function Nav({ atual, onChange }) {
  return (
    <nav className="nav" aria-label="Seções do estudo">
      {SECOES.map(([k, label, Icone], i) => (
        <button key={k} className={atual === k ? 'nav-btn ativo' : 'nav-btn'}
          onClick={() => onChange(k)} aria-current={atual === k ? 'page' : undefined}>
          <Icone size={15} aria-hidden="true" />
          <span className="nav-num">{i + 1}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
