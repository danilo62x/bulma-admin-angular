import { Injectable, computed, signal, effect } from '@angular/core';

export type NotificationType = 'is-success' | 'is-danger' | 'is-warning' | 'is-info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

const STORAGE_KEY = 'app.ui';
let notifId = 0;

interface PersistedUi {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  customTheme: Record<string, string>;
  cookiesAccepted: boolean;
}

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly darkMode = signal<boolean>(false);
  readonly sidebarCollapsed = signal<boolean>(false);
  readonly sidebarWidth = signal<number>(260);
  readonly sidebarMobileOpen = signal<boolean>(false);
  readonly pageTitle = signal<string>('Dashboard');
  readonly notifications = signal<Notification[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly customTheme = signal<Record<string, string>>({});
  readonly cookiesAccepted = signal<boolean>(false);
  readonly showCookieBanner = signal<boolean>(false);

  readonly sidebarStyle = computed(() => ({
    width: this.sidebarCollapsed()
      ? 'var(--tx-sidebar-collapsed)'
      : `${this.sidebarWidth()}px`,
  }));

  constructor() {
    this.restore();
    this.applyTheme();

    // Auto persist on changes
    effect(() => {
      this.persist();
    });

    // Apply theme when darkMode or customTheme changes
    effect(() => {
      this.darkMode();
      this.customTheme();
      this.applyTheme();
    });
  }

  // ─── Cookie banner ────────────────────────────────────────
  acceptCookies(): void {
    this.cookiesAccepted.set(true);
    this.showCookieBanner.set(false);
  }
  declineCookies(): void {
    this.cookiesAccepted.set(false);
    this.showCookieBanner.set(false);
  }
  openCookieBanner(): void { this.showCookieBanner.set(true); }
  closeCookieBanner(): void { this.showCookieBanner.set(false); }

  // ─── Theme ────────────────────────────────────────────────
  toggleDarkMode(): void { this.darkMode.update((v) => !v); }
  setDarkMode(val: boolean): void { this.darkMode.set(val); }

  applyTheme(): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', this.darkMode() ? 'dark' : 'light');
    Object.entries(this.customTheme()).forEach(([key, val]) => {
      document.documentElement.style.setProperty(key, val);
    });
  }

  setThemeVar(key: string, val: string): void {
    this.customTheme.update((m) => ({ ...m, [key]: val }));
    document.documentElement.style.setProperty(key, val);
  }

  resetThemeVars(): void {
    Object.keys(this.customTheme()).forEach((key) => {
      document.documentElement.style.removeProperty(key);
    });
    this.customTheme.set({});
  }

  // ─── Sidebar ──────────────────────────────────────────────
  toggleSidebar(): void { this.sidebarCollapsed.update((v) => !v); }
  setSidebarWidth(w: number): void {
    this.sidebarWidth.set(Math.min(400, Math.max(160, w)));
  }
  toggleSidebarMobile(val?: boolean): void {
    this.sidebarMobileOpen.update((v) => (val !== undefined ? val : !v));
  }

  // ─── Page title ───────────────────────────────────────────
  setPageTitle(title: string): void {
    this.pageTitle.set(title);
    if (typeof document !== 'undefined') {
      document.title = title ? `${title} — Admin Template` : 'Admin Template';
    }
  }

  // ─── Notifications ────────────────────────────────────────
  notify(message: string, type: NotificationType = 'is-info', duration = 4000): void {
    const id = ++notifId;
    this.notifications.update((arr) => [...arr, { id, message, type, duration }]);
    setTimeout(() => this.dismissNotification(id), duration);
  }
  notifySuccess(message: string): void { this.notify(message, 'is-success'); }
  notifyError(message: string): void { this.notify(message, 'is-danger'); }
  notifyWarning(message: string): void { this.notify(message, 'is-warning'); }

  dismissNotification(id: number): void {
    this.notifications.update((arr) => arr.filter((n) => n.id !== id));
  }

  // ─── Persistence ──────────────────────────────────────────
  private persist(): void {
    try {
      const data: PersistedUi = {
        darkMode: this.darkMode(),
        sidebarCollapsed: this.sidebarCollapsed(),
        sidebarWidth: this.sidebarWidth(),
        customTheme: this.customTheme(),
        cookiesAccepted: this.cookiesAccepted(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<PersistedUi>;
      if (typeof data.darkMode === 'boolean') this.darkMode.set(data.darkMode);
      if (typeof data.sidebarCollapsed === 'boolean') this.sidebarCollapsed.set(data.sidebarCollapsed);
      if (typeof data.sidebarWidth === 'number') this.sidebarWidth.set(data.sidebarWidth);
      if (data.customTheme && typeof data.customTheme === 'object') this.customTheme.set(data.customTheme);
      if (typeof data.cookiesAccepted === 'boolean') this.cookiesAccepted.set(data.cookiesAccepted);
    } catch {
      // ignore
    }
  }
}
