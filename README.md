# Simulador CeMeVi

Estudo de viabilidade econômica da franquia **Konioca** em Maceió/AL — AV2 da disciplina de Modelagem e Simulação (Engenharia da Computação, 9º período).

App web (React + Vite) que reúne o estudo qualitativo e um **simulador financeiro interativo**: 3 cenários (pessimista, realista, otimista), métricas de viabilidade (VPL, TIR, payback simples e descontado, LTV, CAC, LTV/CAC, burn rate) e uma camada de **simulação de Monte Carlo** com probabilidade de viabilidade P(VPL > 0).

## Rodar

```bash
npm install
npm run dev        # app em http://localhost:5173
npm test           # testes (inclui calibração vs relatório)
npm run build      # build de produção
```

## Estrutura

- `src/core/` — núcleo financeiro + Monte Carlo (JS puro, testável, sem React)
  - `scenarios.js` — premissas + 3 cenários (fonte única da verdade)
  - `finance.js` — VPL, TIR, payback, fluxo de caixa com ramp de penetração, LTV, `computeMetrics`
  - `montecarlo.js` — PRNG semeado, distribuições (triangular/normal/uniforme), `runSimulation`, sensibilidade
- `src/sections/` — Mercado, Franquia, Cenários, Simulador, Monte Carlo, Fomento, Veredito
- `src/components/` — KPI bar, navegação, gráficos (Recharts)
- `src/state/SimContext.jsx` — cenário ativo + parâmetros editáveis
- `Docs/` — spec de design, plano de implementação e relatório original

## Notas de modelagem

O motor é a **fonte de verdade**: VPL/TIR/payback são saída honesta do fluxo de caixa, não valores
forçados. Os números do relatório aparecem como referência ("ref.") na tabela de cenários.

⚠️ **Importante:** os VPL/TIR do relatório original são internamente inconsistentes com a própria
operação (ver `Docs/2026-06-09-simulador-cemevi-design.md`, §3.6). O modelo usa um **ramp de
penetração de mercado gradual** por cenário; os vereditos (pessimista inviável, realista viável,
otimista altamente rentável) são preservados, e o realista — único reconciliável — reproduz
aproximadamente o payback do relatório.

## Recursos extras

- **Monte Carlo em Web Worker** — N até 200.000 sem travar a UI, com IC 95% para P(VPL>0).
- **Sazonalidade mensal opcional** — curva alta dez–mar / baixa abr–jul (média anual = 1,0), amplitude por cenário.
- **Comparação de cenários** — fluxo de caixa acumulado dos 3 cenários sobreposto.
- **Export** — CSV (tabela de cenários e iterações do MC) e PNG dos gráficos.
- **Persistência local** — parâmetros editados e config do MC sobrevivem ao reload (localStorage).
- **Acessibilidade** — tabela de dados alternativa sob cada gráfico, `aria-live` nos KPIs, navegação com ícones e numeração.
- **Performance** — seções com gráficos em lazy-load (bundle inicial ~207 kB).
