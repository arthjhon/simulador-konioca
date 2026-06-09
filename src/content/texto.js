// src/content/texto.js
export const TEXTO = {
  mercado: {
    titulo: 'Mercado de Maceió/AL',
    paragrafos: [
      'Maceió é a capital de Alagoas e principal polo econômico do estado... (~1.025.000 hab, Censo IBGE 2022).',
      'Renda domiciliar per capita ~R$ 1.420/mês (PNAD-C 2023), abaixo da média nacional...',
      'Sazonalidade: 2,8 mi visitantes/ano (SETUR-AL 2023); dez–mar concentram ~40% do fluxo (+20–30% em vendas).',
    ],
    concorrentes: [
      { nome: 'Tapioca informal', produto: 'Tapioca tradicional', ticket: 'R$ 8–15', local: 'Orla/feiras' },
      { nome: "McDonald's / Bob's", produto: 'Lanche rápido', ticket: 'R$ 25–40', local: 'Shoppings' },
      { nome: 'Açaí Koreano', produto: 'Açaí em cone', ticket: 'R$ 22–30', local: 'Ponta Verde' },
    ],
  },
  franquia: {
    titulo: 'Franquia Konioca',
    paragrafos: [
      'A Konioca é uma franquia brasileira fundada no Ceará, especializada em tapioca e cuscuz servidos em cone — combinação de ingredientes culturalmente enraizados no Nordeste com apresentação inovadora e fotogênica, que favorece o compartilhamento em redes sociais. Oferece opções salgadas e doces.',
      'O processo é altamente padronizado: a franqueadora fornece máquina proprietária que molda o cone de tapioca, eliminando a necessidade de habilidade técnica avançada e garantindo consistência — diferencial crítico frente à concorrência informal.',
      'Quatro formatos de franquia: quiosque (~R$ 135k), loja compacta (~R$ 155k), loja completa (~R$ 190k) e modelo máquina. Royalties de 6% sobre o faturamento bruto e taxa de publicidade de 1,5%–2%. Suporte inclui treinamento de 5 dias, manual operacional e apoio remoto.',
      'Riscos específicos para Alagoas: renda per capita abaixo da média nacional (pressão sobre o ticket), forte concorrência informal de tapioca (cultura de banca, custo 50–70% menor), sazonalidade turística acentuada (variância alta no faturamento) e mercado de franquias pouco desenvolvido (menor densidade de pontos âncora premium).',
    ],
  },
  fomento: {
    titulo: 'Fomento e Mitigação de Risco',
    instrumentos: [
      { nome: 'SEBRAE', desc: 'Consultoria gratuita, Sebraetec (até 70%), microcrédito a partir de 0,64% a.m.' },
      { nome: 'BNB / FNE Giro', desc: 'Crédito 4–6% a.a., até R$ 80.000, carência 6 meses (ME formalizada).' },
      { nome: 'FAPEAL', desc: 'Editais de inovação em processo/gestão (PIBITI, PDPG).' },
    ],
    mitigacoes: [
      'Modelo quiosque (R$135k) em vez de loja completa: −30% no payback.',
      'Localizar em shopping/ponto âncora: reduz sazonalidade.',
      'Reserva de capital de giro de 3 meses (~R$42k) antes de abrir.',
      'Critério de saída: faturamento < R$45.000 após 6 meses.',
    ],
  },
  veredito: {
    titulo: 'Recomendação Final',
    selo: 'Investimento CONDICIONAL',
    condicionais: [
      'Modelo quiosque (R$135k), não loja completa.',
      'Ponto âncora com fluxo mínimo 600 pessoas/dia.',
      'Capital de giro reservado ≥ R$40.000.',
      'Critério de saída predefinido (VPL negativo persistente após 12 meses).',
      'TMA 12% a.a. (Selic 2025–26).',
    ],
    texto: 'No cenário realista o projeto gera VPL positivo e TIR ~2x a TMA... principal risco: concorrência informal de tapioca.',
  },
};
