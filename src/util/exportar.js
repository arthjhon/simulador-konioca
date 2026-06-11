// src/util/exportar.js
// Downloads gerados no cliente: CSV (padrão Excel pt-BR) e PNG de gráficos SVG (Recharts).

function baixarBlob(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const numBR = (v) => (typeof v === 'number' ? String(v).replace('.', ',') : v ?? '');

// linhas: array de arrays. Separador ';' e BOM — abre certo no Excel pt-BR.
export function exportarCsv(nome, linhas) {
  const csv = '\uFEFF' + linhas.map((l) => l.map(numBR).join(';')).join('\r\n');
  baixarBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), nome);
}

// Converte o primeiro <svg> dentro de `el` em PNG 2x (com fundo do tema).
export function exportarPng(el, nome, fundo = '#111a2e') {
  const svg = el?.querySelector('svg');
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const { width, height } = svg.getBoundingClientRect();
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => blob && baixarBlob(blob, nome), 'image/png');
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
}
