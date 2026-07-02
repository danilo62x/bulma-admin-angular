import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { UiService } from '../../core/services/ui.service';
import { AuthService } from '../../core/services/auth.service';
import { ModalComponent } from '../ui/modal.component';
import { LanguageSwitcherComponent } from '../ui/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, ModalComponent, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="tx-header">
      <div class="tx-header-left">
        <button class="button is-ghost tx-icon-btn is-hidden-desktop" (click)="ui.toggleSidebarMobile()">
          <span class="mdi mdi-menu"></span>
        </button>
        <button class="button is-ghost tx-icon-btn is-hidden-touch" (click)="ui.toggleSidebar()">
          <span class="mdi" [class]="ui.sidebarCollapsed() ? 'mdi-menu-open' : 'mdi-menu'"></span>
        </button>
        <span class="tx-page-title">{{ ui.pageTitle() }}</span>
      </div>

      <div class="tx-header-right">
        <app-language-switcher></app-language-switcher>

        <button
          class="button is-ghost tx-icon-btn"
          [title]="ui.darkMode() ? 'Modo claro' : 'Modo escuro'"
          (click)="ui.toggleDarkMode()"
        >
          <span class="mdi" [class]="ui.darkMode() ? 'mdi-weather-sunny' : 'mdi-weather-night'"></span>
        </button>

        <!-- Notifications dropdown -->
        <div class="tx-dropdown is-left" [class.is-active]="notifOpen()" (click)="$event.stopPropagation()">
          <button class="button is-ghost tx-icon-btn tx-icon-btn-notif" (click)="notifOpen.set(!notifOpen())">
            <span class="mdi mdi-bell"></span>
            <span *ngIf="unreadCount > 0" class="tag is-danger is-rounded tx-notif-badge">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <div class="tx-dropdown-menu" style="min-width: 300px;">
            <div class="tx-dropdown-header">Notificações</div>
            <div *ngFor="let n of mockNotifications" class="dropdown-item">
              <div class="tx-notif-item">
                <span class="mdi tx-notif-icon" [class]="n.icon" [style.color]="n.color"></span>
                <div>
                  <div class="tx-notif-title">{{ n.title }}</div>
                  <div class="tx-notif-time">{{ n.time }}</div>
                </div>
              </div>
            </div>
            <div class="tx-dropdown-footer">
              <a>Ver todas as notificações</a>
            </div>
          </div>
        </div>

        <!-- User dropdown -->
        <div class="tx-dropdown is-left" [class.is-active]="userOpen()" (click)="$event.stopPropagation()">
          <button class="button is-ghost tx-user-trigger" (click)="userOpen.set(!userOpen())">
            <div class="tx-user-avatar">{{ userInitials() }}</div>
            <span class="tx-user-name-text is-hidden-touch">{{ auth.user()?.name }}</span>
            <span class="mdi mdi-chevron-down is-hidden-touch" style="font-size: 1rem; color: var(--tx-text-muted);"></span>
          </button>
          <div class="tx-dropdown-menu" style="min-width: 220px;">
            <div class="tx-user-info">
              <div class="tx-user-name">{{ auth.user()?.name }}</div>
              <div class="tx-user-email">{{ auth.user()?.email }}</div>
              <span class="tag is-light is-small tx-user-role">{{ auth.user()?.role }}</span>
            </div>
            <a class="dropdown-item" (click)="closeMenus(); router.navigateByUrl('/settings')">
              <span class="mdi mdi-cog" style="margin-right: 0.5rem;"></span>
              Configurações
            </a>
            <a class="dropdown-item" (click)="closeMenus(); ui.openCookieBanner()">
              <span class="mdi mdi-cookie" style="margin-right: 0.5rem;"></span>
              Política de Cookies
            </a>
            <a class="dropdown-item" (click)="closeMenus(); showClearDataModal.set(true)">
              <span class="mdi mdi-broom" style="margin-right: 0.5rem;"></span>
              Limpar dados do navegador
            </a>
            <hr class="dropdown-divider" />
            <a class="dropdown-item has-text-danger" (click)="handleLogout()">
              <span class="mdi mdi-logout" style="margin-right: 0.5rem;"></span>
              Sair
            </a>
          </div>
        </div>
      </div>

      <app-modal [open]="showClearDataModal()" (openChange)="showClearDataModal.set($event)" width="440px">
        <header class="modal-card-head">
          <p class="modal-card-title">Limpar dados do navegador</p>
        </header>
        <section class="modal-card-body">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <span class="mdi mdi-alert-circle" style="font-size: 2rem; color: var(--tx-warning); flex-shrink: 0;"></span>
            <div>
              <p style="font-size: 0.9rem; font-weight: 600; color: var(--tx-text-heading);">
                Esta ação não pode ser desfeita.
              </p>
              <p style="font-size: 0.875rem; color: var(--tx-text-muted); margin-top: 0.5rem;">
                Todos os dados salvos localmente serão removidos: sessão, tema, preferências de
                layout, paletas customizadas e aceite de cookies. Você será desconectado e a
                página será recarregada.
              </p>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot tx-modal-foot">
          <button class="button" (click)="showClearDataModal.set(false)">Cancelar</button>
          <button class="button is-danger" (click)="handleClearData()">
            <span class="mdi mdi-broom" style="margin-right: 0.25rem;"></span>
            Limpar tudo
          </button>
        </footer>
      </app-modal>
    </header>
  `,
})
export class AppHeaderComponent {
  readonly ui = inject(UiService);
  readonly auth = inject(AuthService);
  readonly router = inject(Router);

  readonly notifOpen = signal<boolean>(false);
  readonly userOpen = signal<boolean>(false);
  readonly showClearDataModal = signal<boolean>(false);

  readonly userInitials = computed(() => {
    const name = this.auth.user()?.name;
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  });

  readonly unreadCount = 3;
  readonly mockNotifications = [
    { id: 1, title: 'Novo usuário cadastrado', icon: 'mdi-account-plus', color: '#48c774', time: '2 min atrás' },
    { id: 2, title: 'Relatório mensal disponível', icon: 'mdi-file-chart', color: '#3273dc', time: '1 hora atrás' },
    { id: 3, title: 'Atualização do sistema', icon: 'mdi-update', color: '#f59e0b', time: '3 horas atrás' },
  ];

  @HostListener('document:click')
  onDocClick(): void {
    this.notifOpen.set(false);
    this.userOpen.set(false);
  }

  closeMenus(): void {
    this.notifOpen.set(false);
    this.userOpen.set(false);
  }

  handleLogout(): void {
    this.closeMenus();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  handleClearData(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    this.showClearDataModal.set(false);
    window.location.href = '/login';
  }
}
