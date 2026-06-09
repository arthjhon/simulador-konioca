// src/state/SimContext.jsx
import { createContext, useContext, useMemo, useState } from 'react';
import { CENARIOS } from '../core/scenarios.js';
import { computeMetrics } from '../core/finance.js';

const SimContext = createContext(null);

export function SimProvider({ children }) {
  const [cenarioAtivo, setCenarioAtivo] = useState('realista');
  // params editáveis: começam nulos (= usar o cenário). Edições sobrescrevem.
  const [overrides, setOverrides] = useState({});

  const cenario = useMemo(() => ({ ...CENARIOS[cenarioAtivo], ...overrides }), [cenarioAtivo, overrides]);
  const metrics = useMemo(() => computeMetrics(cenario), [cenario]);

  function setParam(campo, valor) {
    setOverrides((o) => ({ ...o, [campo]: valor }));
  }
  function resetParams() { setOverrides({}); }
  function trocarCenario(key) { setCenarioAtivo(key); setOverrides({}); }

  const value = { cenarioAtivo, cenario, metrics, setParam, resetParams, trocarCenario };
  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim deve estar dentro de SimProvider');
  return ctx;
}
