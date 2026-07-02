import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './components/layout/app-layout.component';

export const routes: Routes = [
  // ── Public / standalone (blank layout) ──────────────────────
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'maintenance',
    loadComponent: () => import('./pages/maintenance.component').then((m) => m.MaintenanceComponent),
  },
  {
    path: 'coming-soon',
    loadComponent: () => import('./pages/coming-soon.component').then((m) => m.ComingSoonComponent),
  },

  // ── Authenticated admin ─────────────────────────────────────
  {
    path: '',
    component: AppLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', data: { title: 'Dashboard' }, loadComponent: () => import('./pages/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'charts', data: { title: 'Gráficos & Analytics' }, loadComponent: () => import('./pages/charts.component').then((m) => m.ChartsComponent) },
      { path: 'forms', data: { title: 'Formulários' }, loadComponent: () => import('./pages/forms.component').then((m) => m.FormsComponent) },
      { path: 'tables', data: { title: 'Tabelas' }, loadComponent: () => import('./pages/tables.component').then((m) => m.TablesComponent) },
      { path: 'components', data: { title: 'Componentes' }, loadComponent: () => import('./pages/components-page.component').then((m) => m.ComponentsPageComponent) },
      { path: 'ui-advanced', data: { title: 'Componentes avançados' }, loadComponent: () => import('./pages/ui-advanced.component').then((m) => m.UiAdvancedComponent) },
      { path: 'typography', data: { title: 'Tipografia' }, loadComponent: () => import('./pages/typography.component').then((m) => m.TypographyComponent) },
      { path: 'integrations', data: { title: 'Integrações & Bibliotecas' }, loadComponent: () => import('./pages/integrations.component').then((m) => m.IntegrationsComponent) },
      { path: 'inbox', data: { title: 'Caixa de entrada' }, loadComponent: () => import('./pages/inbox.component').then((m) => m.InboxComponent) },
      { path: 'files', data: { title: 'Arquivos' }, loadComponent: () => import('./pages/file-manager.component').then((m) => m.FileManagerComponent) },
      { path: 'gallery', data: { title: 'Galeria' }, loadComponent: () => import('./pages/gallery.component').then((m) => m.GalleryComponent) },
      { path: 'invoice', data: { title: 'Fatura' }, loadComponent: () => import('./pages/invoice.component').then((m) => m.InvoiceComponent) },
      { path: 'billing', data: { title: 'Cobrança' }, loadComponent: () => import('./pages/billing.component').then((m) => m.BillingComponent) },
      { path: 'docs', data: { title: 'Documentação' }, loadComponent: () => import('./pages/documentation.component').then((m) => m.DocumentationComponent) },
      { path: 'profile', data: { title: 'Meu Perfil' }, loadComponent: () => import('./pages/profile.component').then((m) => m.ProfileComponent) },
      { path: 'pricing', data: { title: 'Planos & Preços' }, loadComponent: () => import('./pages/pricing.component').then((m) => m.PricingComponent) },
      { path: 'settings', data: { title: 'Configurações' }, loadComponent: () => import('./pages/settings.component').then((m) => m.SettingsComponent) },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.component').then((m) => m.NotFoundComponent),
  },
];
