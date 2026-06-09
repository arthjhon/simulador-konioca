// src/App.jsx
import { useState } from 'react';
import { SimProvider } from './state/SimContext.jsx';
import KpiBar from './components/KpiBar.jsx';
import Nav from './components/Nav.jsx';
import Mercado from './sections/Mercado.jsx';
import Franquia from './sections/Franquia.jsx';
import Cenarios from './sections/Cenarios.jsx';
import Simulador from './sections/Simulador.jsx';
import MonteCarlo from './sections/MonteCarlo.jsx';
import Fomento from './sections/Fomento.jsx';
import Veredito from './sections/Veredito.jsx';
import './App.css';

const MAP = { mercado: Mercado, franquia: Franquia, cenarios: Cenarios, simulador: Simulador, montecarlo: MonteCarlo, fomento: Fomento, veredito: Veredito };

export default function App() {
  const [secao, setSecao] = useState('cenarios');
  const Secao = MAP[secao];
  return (
    <SimProvider>
      <header className="topo">
        <h1>Simulador CeMeVi <small>— Viabilidade Konioca / Maceió-AL</small></h1>
        <KpiBar />
        <Nav atual={secao} onChange={setSecao} />
      </header>
      <main className="conteudo"><Secao /></main>
    </SimProvider>
  );
}
