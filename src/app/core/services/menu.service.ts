import { Injectable } from '@angular/core';

export interface MenuItem {
  label: string;
  icon: string;
  href?: string;
  action?: string;
  children?: MenuItem[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  readonly items: MenuItem[] = [
    { label: 'Dashboard', icon: 'mdi-view-dashboard', href: '/dashboard' },
    { label: 'Analytics', icon: 'mdi-chart-areaspline', href: '/charts' },
    {
      label: 'Aplicações',
      icon: 'mdi-apps',
      children: [
        { label: 'Caixa de entrada', icon: 'mdi-email-outline', href: '/inbox' },
        { label: 'Arquivos', icon: 'mdi-folder-outline', href: '/files' },
        { label: 'Galeria', icon: 'mdi-image-multiple-outline', href: '/gallery' },
        {
          label: 'Financeiro',
          icon: 'mdi-currency-usd',
          children: [
            { label: 'Faturas', icon: 'mdi-receipt-text-outline', href: '/invoice' },
            { label: 'Cobrança', icon: 'mdi-credit-card-outline', href: '/billing' },
          ],
        },
        { label: 'Documentação', icon: 'mdi-book-open-variant', href: '/docs' },
      ],
    },
    {
      label: 'Interface',
      icon: 'mdi-puzzle',
      children: [
        {
          label: 'Componentes',
          icon: 'mdi-widgets-outline',
          children: [
            { label: 'Geral', icon: 'mdi-view-grid-outline', href: '/components' },
            { label: 'Avançados', icon: 'mdi-star-four-points-outline', href: '/ui-advanced' },
            { label: 'Tipografia', icon: 'mdi-format-font', href: '/typography' },
          ],
        },
        {
          label: 'Dados',
          icon: 'mdi-database-outline',
          children: [
            { label: 'Formulários', icon: 'mdi-form-select', href: '/forms' },
            { label: 'Tabelas', icon: 'mdi-table', href: '/tables' },
          ],
        },
        { label: 'Integrações & Libs', icon: 'mdi-puzzle-plus-outline', href: '/integrations' },
      ],
    },
    {
      label: 'Páginas',
      icon: 'mdi-file-multiple-outline',
      children: [
        { label: 'Perfil', icon: 'mdi-account-circle', href: '/profile' },
        { label: 'Planos & Preços', icon: 'mdi-tag-multiple', href: '/pricing' },
        { label: 'Em breve', icon: 'mdi-rocket-launch-outline', href: '/coming-soon' },
        { label: 'Manutenção', icon: 'mdi-wrench-outline', href: '/maintenance' },
        { label: 'Erro 404', icon: 'mdi-alert-circle-outline', href: '/404' },
      ],
    },
    { label: 'Configurações', icon: 'mdi-cog', href: '/settings' },
  ];

  readonly footerItems: MenuItem[] = [
    { label: 'Sair', icon: 'mdi-logout', action: 'logout' },
  ];
}
