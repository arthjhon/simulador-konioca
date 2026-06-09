// src/components/Nav.jsx
const SECOES = [
  ['mercado', 'Mercado'], ['franquia', 'Franquia'], ['cenarios', 'Cenários'],
  ['simulador', 'Simulador'], ['montecarlo', 'Monte Carlo'], ['fomento', 'Fomento'], ['veredito', 'Veredito'],
];
export default function Nav({ atual, onChange }) {
  return (
    <nav className="nav">
      {SECOES.map(([k, label]) => (
        <button key={k} className={atual === k ? 'nav-btn ativo' : 'nav-btn'} onClick={() => onChange(k)}>
          {label}
        </button>
      ))}
    </nav>
  );
}
