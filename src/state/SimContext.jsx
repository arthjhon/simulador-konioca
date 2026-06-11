// src/state/SimContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CENARIOS } from '../core/scenarios.js';
import { computeMetrics } from '../core/finance.js';

const SimContext = createContext(null);
const STORAGE_KEY = 'cemevi.sim.v1';

function carregarSalvo() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d && typeof d === 'object') return d;
  } catch { /* storage indisponível ou corrompido — segue com defaults */ }
  return null;
}

export function SimProvider({ children }) {
  const salvo = useMemo(carregarSalvo, []);
  const [cenarioAtivo, setCenarioAtivo] = useState(
    salvo?.cenarioAtivo in CENARIOS ? salvo.cenarioAtivo : 'realista'
  );
  // overrides guardados POR cenário: trocar de cenário não descarta edições.
  const [overridesPorCenario, setOverridesPorCenario] = useState(salvo?.overridesPorCenario ?? {});
  const [sazonal, setSazonal] = useState(Boolean(salvo?.sazonal));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cenarioAtivo, overridesPorCenario, sazonal }));
    } catch { /* sem storage */ }
  }, [cenarioAtivo, overridesPorCenario, sazonal]);

  const overrides = overridesPorCenario[cenarioAtivo] ?? {};
  const cenario = useMemo(
    () => ({ ...CENARIOS[cenarioAtivo], ...overrides }),
    [cenarioAtivo, overrides]
  );
  const metrics = useMemo(() => computeMetrics(cenario, undefined, { sazonal }), [cenario, sazonal]);

  function setParam(campo, valor) {
    setOverridesPorCenario((o) => ({
      ...o,
      [cenarioAtivo]: { ...(o[cenarioAtivo] ?? {}), [campo]: valor },
    }));
  }
  // Limpa as edições do cenário ativo (e o que estava salvo dele).
  function resetParams() {
    setOverridesPorCenario((o) => {
      const novo = { ...o };
      delete novo[cenarioAtivo];
      return novo;
    });
  }
  function trocarCenario(key) { setCenarioAtivo(key); }

  const value = { cenarioAtivo, cenario, metrics, setParam, resetParams, trocarCenario, sazonal, setSazonal };
  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim deve estar dentro de SimProvider');
  return ctx;
}
