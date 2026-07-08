# Bulma Admin / Angular

[Read in English](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Bulma Admin / Angular é a versão Angular do layout admin em Bulma: a mesma identidade visual e as mesmas 25 páginas dos templates Vue e React, construída com componentes standalone do Angular 19. Toda rota é carregada de forma lazy com `loadComponent`, o estado da aplicação (auth, menu, ui) fica em services baseados em signals, e o acesso às rotas é controlado por `authGuard` e `guestGuard`. A autenticação é simulada, então o app inteiro roda sem backend. Inclui tema claro e escuro, três idiomas via Transloco e service worker para suporte a PWA.

Preview ao vivo: https://template.dev.br/preview/bulma-admin-angular/

## Páginas incluídas

25 componentes standalone de página em `src/app/pages/`:

- landing: página pública de marketing com hero, seções de recursos e preços
- login: formulário de acesso com validação e credenciais de demonstração
- register: formulário de criação de conta
- forgot-password: solicitação de link de redefinição de senha
- reset-password: definição de nova senha
- dashboard: cards de KPI com sparklines, gráficos e atividade recente
- charts: página de analytics com gráficos de barra, área e rosca (ApexCharts)
- forms: inputs, selects, date picker (flatpickr), upload de arquivos e validação inline
- tables: tabela de dados com ordenação, filtros, paginação e seleção de linhas (TanStack Table)
- components-page: catálogo dos componentes base de UI
- ui-advanced: modais, abas, toasts e outros widgets compostos
- typography: escala tipográfica, títulos e utilitários de texto
- integrations: cards de serviços de terceiros com toggles
- profile: página do usuário com dados pessoais e atividade
- pricing: comparação de planos
- settings: preferências da aplicação, tema e idioma
- inbox: tela estilo cliente de e-mail com pastas e lista de mensagens
- file-manager: listagem de arquivos com pastas e ações
- gallery: grade de imagens
- invoice: detalhe de fatura pronto para impressão
- billing: formas de pagamento e histórico de faturas
- documentation: página de referência do template dentro do app
- maintenance: página avulsa de manutenção
- coming-soon: página avulsa de pré-lançamento
- not-found: página de erro 404

## Stack

- Angular 19 (componentes standalone, signals, rotas lazy com `loadComponent`)
- TypeScript 5.6 e RxJS 7.8
- Bulma 1.0.4
- Transloco 8.3 para i18n (en, es, pt-BR)
- ApexCharts 5 via ng-apexcharts 1.15
- TanStack Angular Table 8.21
- Editor de texto rico ngx-quill 27 + Quill 2
- Date picker flatpickr 4.6
- @angular/service-worker 19.2 com `ngsw-config.json` (PWA)
- Material Design Icons (@mdi/font 7.4)
- Sass 1.83

## Requisitos

- Node.js 18 ou mais novo
- npm (o Angular CLI é dependência local de desenvolvimento, não precisa de instalação global)

## Como rodar

```bash
npm install
npm run dev
```

O `ng serve` sobe em `http://localhost:4200`. A autenticação é simulada em `auth.service.ts`, sem backend. Credenciais de demonstração:

- `admin@template.com` / `admin123`
- `user@template.com` / `user123`

## Build de produção

```bash
npm run build
```

O `ng build` gera o bundle de produção em `dist/`. O `npm run watch` recompila a cada mudança com a configuração de desenvolvimento.

## Estrutura do projeto

```
src/
├── app/
│   ├── components/
│   │   ├── landing/   seções da landing page pública
│   │   ├── layout/    header, sidebar, footer, shell de layout do app
│   │   └── ui/        componentes de UI compartilhados
│   ├── core/
│   │   ├── guards/    auth.guard.ts (authGuard, guestGuard)
│   │   └── services/  auth.service.ts, menu.service.ts, ui.service.ts (signals)
│   ├── pages/         25 componentes standalone de página
│   ├── app.config.ts  providers (router, Transloco, service worker)
│   └── app.routes.ts  tabela de rotas lazy
├── assets/styles/     variables.css, dark.css
└── styles.scss        ponto de entrada da customização do Bulma
public/assets/i18n/    en.json, es.json, pt-BR.json
```

## Tema e customização

As variáveis Sass do Bulma ficam no topo de `src/styles.scss`, antes do `@use 'bulma/bulma'`: `$primary` (#485fc7), `$family-sans-serif` (Inter) e `$radius`. Os tokens de runtime são custom properties CSS com prefixo `--tx-` em `src/assets/styles/variables.css`: cores semânticas, dimensões de sidebar e header e uma escala de espaçamento. O `dark.css` sobrescreve esses tokens para o tema escuro, que o `ui.service.ts` alterna por meio de um signal. Para trocar a marca, ajuste `--tx-primary` e `$primary` juntos. As folhas de estilo do Quill e do flatpickr estão registradas no `angular.json`.

## Internacionalização

O Transloco carrega dicionários JSON de `public/assets/i18n/` (inglês, espanhol e português do Brasil) pelo loader em `src/app/core/transloco-loader.ts`. O seletor no header troca o idioma ativo em tempo de execução.

## O mesmo layout em outras stacks

Este repositório é uma das cinco implementações do mesmo layout admin em Bulma. Todas têm as mesmas 25 views e a mesma identidade visual:

- Vue 3 + Buefy: https://github.com/danilo62x/bulma-admin-buefy
- React 19: https://github.com/danilo62x/bulma-admin-react
- Laravel 11 + Blade: https://github.com/danilo62x/bulma-admin-laravel
- HTML estático: https://github.com/danilo62x/bulma-admin-html

O catálogo completo de templates gratuitos e pagos está em https://template.dev.br

## Apoie o projeto

Este template é gratuito e licenciado sob MIT. Se ele economizou seu tempo, você pode apoiar o trabalho com uma doação em https://template.dev.br/doar?template=bulma-admin-angular

## Licença

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
