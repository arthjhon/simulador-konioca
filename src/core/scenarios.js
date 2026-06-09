// src/core/scenarios.js
// Fonte única da verdade. Valores extraídos de Docs/av2_konioca_estudo_viabilidade.docx.

export const PREMISSAS = {
  horizonteMeses: 60,
  tmaAnual: 0.12,
  diasPorMes: 30,
  cmvPct: 0.35,        // % do ticket/receita
  royaltiesPct: 0.06,  // % da receita bruta
  publicidadePct: 0.02,
  rampUpMeses: 3,
  rampUpFator: 0.90,   // -10% nos meses 1..3
  cac: 180,            // R$ por cliente adquirido
};

// despesasCalibracaoPct: impostos (Simples) + marketing/outros, calibrado para
// reproduzir lucro/burn estável do relatório. Ver plano, "Decisões de modelagem".
export const CENARIOS = {
  pessimista: {
    nome: 'Pessimista',
    ticket: 18,
    clientesDia: 60,       // tabela do relatório diz 45; receita R$32.400 implica 60 (ver nota)
    clientesDiaRelatorio: 45,
    taxaRetorno: 0.25,
    custoFixoMensal: 18000,
    sazonalidade: 0.75,
    investimento: 190000,
    despesasCalibracaoPct: 0.0978,
    // referência do relatório (para exibição "ref.")
    ref: { vpl: -42300, tirAnual: 0.041, paybackSimples: null, paybackDescontado: null,
           receitaEstavel: 32400, lucroEstavel: -2700, ltv: 270, burn: 35100 },
  },
  realista: {
    nome: 'Realista',
    ticket: 25,
    clientesDia: 80,
    clientesDiaRelatorio: 80,
    taxaRetorno: 0.40,
    custoFixoMensal: 14000,
    sazonalidade: 1.0,
    investimento: 162500,
    despesasCalibracaoPct: 0.2327,
    ref: { vpl: 87600, tirAnual: 0.237, paybackSimples: 38, paybackDescontado: 47,
           receitaEstavel: 60000, lucroEstavel: 6240, ltv: 600, burn: 53760 },
  },
  otimista: {
    nome: 'Otimista',
    ticket: 32,
    clientesDia: 120,
    clientesDiaRelatorio: 120,
    taxaRetorno: 0.55,
    custoFixoMensal: 12000,
    sazonalidade: 1.2,
    investimento: 135000,
    despesasCalibracaoPct: 0.1811,
    ref: { vpl: 198400, tirAnual: 0.412, paybackSimples: 22, paybackDescontado: 28,
           receitaEstavel: 115200, lucroEstavel: 32800, ltv: 1056, burn: 82400 },
  },
};

export const ORDEM_CENARIOS = ['pessimista', 'realista', 'otimista'];
