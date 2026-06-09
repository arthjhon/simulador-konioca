// src/components/Metric.jsx
export default function Metric({ label, valor, hint }) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{valor}</div>
      {hint && <div className="metric-hint">{hint}</div>}
    </div>
  );
}
