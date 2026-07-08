# Bulma Admin / Angular

[Leia em português](./README.pt-BR.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Bulma Admin / Angular is the Angular version of the Bulma admin layout: the same visual identity and the same 25 pages as the Vue and React templates, built with Angular 19 standalone components. Every route is lazy loaded with `loadComponent`, application state (auth, menu, ui) is held in services backed by signals, and route access is controlled by `authGuard` and `guestGuard`. Authentication is mocked, so the whole app runs without a backend. A light and dark theme, three languages via Transloco and a service worker for PWA support are included.

Live preview: https://template.dev.br/preview/bulma-admin-angular/

## Pages included

25 standalone page components in `src/app/pages/`:

- landing: public marketing page with hero, feature and pricing sections
- login: sign-in form with validation and mock credentials
- register: account creation form
- forgot-password: request form for a reset link
- reset-password: form to set a new password
- dashboard: KPI stat cards with sparklines, charts and recent activity
- charts: analytics page with bar, area and donut charts (ApexCharts)
- forms: inputs, selects, date picker (flatpickr), file upload and inline validation
- tables: data table with sorting, filtering, pagination and row selection (TanStack Table)
- components-page: catalog of the base UI components
- ui-advanced: modals, tabs, toasts and other composite widgets
- typography: type scale, headings and text helpers
- integrations: third-party service cards with toggles
- profile: user page with personal data and activity
- pricing: plan comparison
- settings: application preferences, theme and language
- inbox: mail-style app screen with folders and message list
- file-manager: file listing with folders and file actions
- gallery: image grid
- invoice: printable invoice detail
- billing: payment methods and invoice history
- documentation: in-app reference page for the template
- maintenance: standalone downtime page
- coming-soon: standalone pre-launch page
- not-found: 404 error page

## Tech stack

- Angular 19 (standalone components, signals, lazy `loadComponent` routes)
- TypeScript 5.6 and RxJS 7.8
- Bulma 1.0.4
- Transloco 8.3 for i18n (en, es, pt-BR)
- ApexCharts 5 via ng-apexcharts 1.15
- TanStack Angular Table 8.21
- ngx-quill 27 + Quill 2 rich text editor
- flatpickr 4.6 date picker
- @angular/service-worker 19.2 with `ngsw-config.json` (PWA)
- Material Design Icons (@mdi/font 7.4)
- Sass 1.83

## Requirements

- Node.js 18 or newer
- npm (the Angular CLI is a local dev dependency, no global install needed)

## Getting started

```bash
npm install
npm run dev
```

`ng serve` starts on `http://localhost:4200`. Authentication is simulated in `auth.service.ts`, no backend needed. Demo credentials:

- `admin@template.com` / `admin123`
- `user@template.com` / `user123`

## Build for production

```bash
npm run build
```

`ng build` outputs the production bundle to `dist/`. `npm run watch` rebuilds on change with the development configuration.

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── landing/   sections of the public landing page
│   │   ├── layout/    header, sidebar, footer, app layout shell
│   │   └── ui/        shared UI components
│   ├── core/
│   │   ├── guards/    auth.guard.ts (authGuard, guestGuard)
│   │   └── services/  auth.service.ts, menu.service.ts, ui.service.ts (signals)
│   ├── pages/         25 standalone page components
│   ├── app.config.ts  providers (router, Transloco, service worker)
│   └── app.routes.ts  lazy route table
├── assets/styles/     variables.css, dark.css
└── styles.scss        Bulma customization entry point
public/assets/i18n/    en.json, es.json, pt-BR.json
```

## Theming and customization

Bulma Sass variables are set at the top of `src/styles.scss`, before `@use 'bulma/bulma'`: `$primary` (#485fc7), `$family-sans-serif` (Inter) and `$radius`. Runtime tokens are CSS custom properties with the `--tx-` prefix in `src/assets/styles/variables.css`: semantic colors, sidebar and header dimensions, and a spacing scale. `dark.css` overrides those tokens for the dark theme, which `ui.service.ts` toggles through a signal. Change `--tx-primary` and `$primary` together to rebrand the template. Quill and flatpickr stylesheets are registered in `angular.json`.

## Internationalization

Transloco loads JSON dictionaries from `public/assets/i18n/` (English, Spanish, Brazilian Portuguese) through the loader in `src/app/core/transloco-loader.ts`. The header switcher changes the active language at runtime.

## The same layout in other stacks

This repo is one of five implementations of the same Bulma admin layout. Each one has the same 25 views and the same visual identity:

- Vue 3 + Buefy: https://github.com/danilo62x/bulma-admin-buefy
- React 19: https://github.com/danilo62x/bulma-admin-react
- Laravel 11 + Blade: https://github.com/danilo62x/bulma-admin-laravel
- Static HTML: https://github.com/danilo62x/bulma-admin-html

The full catalog of free and paid templates is at https://template.dev.br

## Support this project

This template is free and MIT licensed. If it saves you time, you can support the work with a donation at https://template.dev.br/doar?template=bulma-admin-angular

## License

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
