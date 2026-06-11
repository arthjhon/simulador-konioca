// src/util/chartTheme.js
// Tokens de cor dos gráficos — espelham as CSS vars de App.css (Recharts exige valores concretos).
export const CHART = {
  accent: '#22c55e',
  bad: '#ef4444',
  grid: '#243049',
  muted: '#94a6c4',
};

// Props de estilo do <Tooltip> — o default do Recharts é fundo branco com rótulo cinza (ilegível no tema escuro).
export const TOOLTIP = {
  contentStyle: { background: '#0b1220', border: '1px solid #243049', borderRadius: 8, color: '#f1f5f9' },
  labelStyle: { color: '#f1f5f9', fontWeight: 600 },
  cursor: { stroke: '#94a6c4', strokeOpacity: 0.4 },
};
