import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { AuthService } from '../core/services/auth.service';
import { CardComponent } from '../components/ui/card.component';
import { SwitchComponent } from '../components/ui/switch.component';

interface Palette { name: string; vars: Record<string, string>; }
interface ThemeVarDef { key: string; label: string; group: string; }

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgFor, NgIf, KeyValuePipe, FormsModule, CardComponent, SwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="columns">
        <div class="column is-8">
          <app-card title="Aparência" icon="mdi-palette">
            <div class="field">
              <label class="label">Tema</label>
              <div style="display: flex; gap: 0.75rem; align-items: center; padding-top: 0.25rem;">
                <button class="button" [class]="!ui.darkMode() ? 'is-primary' : 'is-light'" (click)="ui.setDarkMode(false)">
                  <span class="mdi mdi-weather-sunny" style="margin-right: 0.25rem;"></span>
                  Claro
                </button>
                <button class="button" [class]="ui.darkMode() ? 'is-primary' : 'is-light'" (click)="ui.setDarkMode(true)">
                  <span class="mdi mdi-weather-night" style="margin-right: 0.25rem;"></span>
                  Escuro
                </button>
              </div>
            </div>
            <hr />
            <div class="field">
              <label class="label">Tamanho da fonte</label>
              <div class="select">
                <select [(ngModel)]="fontSize" (change)="applyFontSize()">
                  <option value="13px">Pequena (13px)</option>
                  <option value="14px">Normal (14px)</option>
                  <option value="15px">Grande (15px)</option>
                  <option value="16px">Extra grande (16px)</option>
                </select>
              </div>
            </div>
          </app-card>

          <app-card title="Paletas de Cores" icon="mdi-palette-swatch" style="margin-top: 1rem; display: block;">
            <p style="font-size: 0.85rem; color: var(--tx-text-muted); margin-bottom: 1rem;">
              Aplique um conjunto de cores ao layout com um clique. Você pode ajustar individualmente depois.
            </p>
            <div class="tx-palette-grid">
              <div
                *ngFor="let p of PALETTES; let idx = index"
                class="tx-palette-card"
                [class.is-active]="activePaletteIdx() === idx"
                (click)="applyPalette(idx)"
              >
                <div class="tx-palette-preview">
                  <div class="tx-palette-body" [style.background]="p.vars['--tx-primary']">
                    <span *ngIf="activePaletteIdx() === idx" class="tx-palette-check">✓</span>
                  </div>
                  <div class="tx-palette-sidebar-strip" [style.background]="p.vars['--tx-sidebar-bg']">
                    <span class="tx-palette-line"></span>
                    <span class="tx-palette-line"></span>
                    <span class="tx-palette-line"></span>
                  </div>
                </div>
                <div class="tx-palette-name">{{ p.name }}</div>
              </div>
            </div>
          </app-card>

          <app-card title="Personalização Avançada" icon="mdi-tune" style="margin-top: 1rem; display: block;">
            <p style="font-size: 0.85rem; color: var(--tx-text-muted); margin-bottom: 0.5rem;">
              Ajuste cada variável de cor individualmente para criar seu tema exclusivo.
            </p>
            <div *ngFor="let groupEntry of themeGroups | keyvalue" class="tx-color-group">
              <div class="tx-color-group-label">{{ groupEntry.key }}</div>
              <div *ngFor="let def of groupEntry.value" class="tx-color-row">
                <span class="tx-color-label">{{ def.label }}</span>
                <div class="tx-color-swatch" [style.background]="getThemeVar(def.key)"></div>
                <input
                  type="color"
                  [value]="getThemeVar(def.key)"
                  class="tx-color-picker"
                  (input)="onColorChange(def.key, $event)"
                />
                <code class="tx-color-hex">{{ getThemeVar(def.key) }}</code>
              </div>
            </div>
            <div class="tx-reset-bar">
              <button class="button is-light is-small" (click)="resetTheme()">
                <span class="mdi mdi-restore" style="margin-right: 0.25rem;"></span>
                Restaurar padrões
              </button>
              <span class="tx-reset-hint">Remove todas as customizações e restaura as cores originais</span>
            </div>
          </app-card>

          <app-card title="Layout" icon="mdi-view-dashboard-edit" style="margin-top: 1rem; display: block;">
            <div class="field">
              <label class="label">Largura do menu lateral</label>
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: var(--tx-text-muted);">
                  <span>160px</span>
                  <span style="font-weight: 600; color: var(--tx-text);">{{ ui.sidebarWidth() }}px</span>
                  <span>400px</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="400"
                  step="5"
                  [value]="ui.sidebarWidth()"
                  style="width: 100%; accent-color: var(--tx-primary);"
                  (input)="onSidebarWidth($event)"
                />
                <div style="font-size: 0.78rem; color: var(--tx-text-muted); margin-top: 0.5rem;">
                  O ajuste é aplicado em tempo real no menu lateral.
                </div>
              </div>
            </div>
            <hr />
            <div class="field">
              <label class="label">Menu lateral</label>
              <app-switch
                type="is-primary"
                [value]="ui.sidebarCollapsed()"
                (valueChange)="ui.sidebarCollapsed.set($event)"
              >
                {{ ui.sidebarCollapsed() ? 'Compactado (apenas ícones)' : 'Expandido' }}
              </app-switch>
            </div>
          </app-card>

          <app-card title="Conta" icon="mdi-account-cog" style="margin-top: 1rem; display: block;">
            <form (ngSubmit)="saveAccount()">
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Nome</label>
                    <div class="control has-icons-left">
                      <input class="input" name="name" [(ngModel)]="accountForm.name" />
                      <span class="icon is-small is-left"><i class="mdi mdi-account"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">E-mail</label>
                    <div class="control has-icons-left">
                      <input class="input" type="email" name="email" [(ngModel)]="accountForm.email" />
                      <span class="icon is-small is-left"><i class="mdi mdi-email"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Nova senha</label>
                    <div class="control has-icons-left">
                      <input class="input" type="password" name="newPassword" placeholder="Deixe em branco para manter" [(ngModel)]="accountForm.newPassword" />
                      <span class="icon is-small is-left"><i class="mdi mdi-lock"></i></span>
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Confirmar senha</label>
                    <div class="control has-icons-left">
                      <input class="input" type="password" name="confirmPassword" placeholder="Confirme a nova senha" [(ngModel)]="accountForm.confirmPassword" />
                      <span class="icon is-small is-left"><i class="mdi mdi-lock"></i></span>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" class="button is-primary" [class.is-loading]="saving()" [disabled]="saving()">
                <span class="mdi mdi-content-save" style="margin-right: 0.25rem;"></span>
                Salvar configurações
              </button>
            </form>
          </app-card>
        </div>

        <div class="column is-4">
          <app-card title="Perfil" icon="mdi-account">
            <div style="text-align: center; padding: 1rem 0;">
              <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--tx-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; font-weight: 700; color: white;">
                {{ userInitials() }}
              </div>
              <div style="font-size: 1.1rem; font-weight: 600; color: var(--tx-text);">{{ auth.user()?.name }}</div>
              <div style="font-size: 0.85rem; color: var(--tx-text-muted); margin-top: 0.25rem;">{{ auth.user()?.email }}</div>
              <span class="tag is-primary is-light" style="margin-top: 0.5rem;">{{ auth.user()?.role }}</span>
            </div>
          </app-card>

          <app-card title="Preview do Tema" icon="mdi-eye" style="margin-top: 1rem; display: block;">
            <div class="tx-theme-preview">
              <div class="tx-theme-preview-sidebar" [style.background]="getThemeVar('--tx-sidebar-bg')">
                <div class="tx-theme-preview-dot" [style.background]="getThemeVar('--tx-primary')"></div>
                <div class="tx-theme-preview-dot" style="background: rgba(255,255,255,0.2);"></div>
                <div class="tx-theme-preview-dot" style="background: rgba(255,255,255,0.2);"></div>
                <div class="tx-theme-preview-dot" style="background: rgba(255,255,255,0.2);"></div>
              </div>
              <div class="tx-theme-preview-body" [style.background]="getThemeVar('--tx-body-bg')">
                <div class="tx-theme-preview-header" [style.background]="getThemeVar('--tx-header-bg')" [style.border-bottom-color]="getThemeVar('--tx-header-border')"></div>
                <div class="tx-theme-preview-content">
                  <div class="tx-theme-preview-card" [style.background]="getThemeVar('--tx-card-bg')"></div>
                  <div class="tx-theme-preview-card" [style.background]="getThemeVar('--tx-card-bg')"></div>
                  <div class="tx-theme-preview-btn" [style.background]="getThemeVar('--tx-primary')"></div>
                </div>
              </div>
            </div>
            <div style="font-size: 0.82rem; color: var(--tx-text); line-height: 1.8; margin-top: 0.75rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--tx-text-muted);">Largura do menu:</span>
                <strong>{{ ui.sidebarWidth() }}px</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--tx-text-muted);">Estado:</span>
                <strong>{{ ui.sidebarCollapsed() ? 'Compactado' : 'Expandido' }}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--tx-text-muted);">Tema:</span>
                <strong>{{ ui.darkMode() ? 'Escuro' : 'Claro' }}</strong>
              </div>
            </div>
          </app-card>

          <app-card title="Sobre o Template" icon="mdi-information" style="margin-top: 1rem; display: block;">
            <div style="font-size: 0.8rem; color: var(--tx-text-muted); line-height: 1.8;">
              <div><strong style="color: var(--tx-text);">Angular 19</strong> + Standalone Components</div>
              <div><strong style="color: var(--tx-text);">Bulma 1.0</strong> + MDI Icons</div>
              <div><strong style="color: var(--tx-text);">Signals</strong> + Router</div>
              <div><strong style="color: var(--tx-text);">esbuild</strong> + TypeScript 5</div>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  readonly ui = inject(UiService);
  readonly auth = inject(AuthService);

  readonly saving = signal<boolean>(false);
  readonly activePaletteIdx = signal<number>(-1);
  fontSize = '14px';

  readonly PALETTES: Palette[] = [
    { name: 'Azul Clássico',     vars: { '--tx-primary': '#485fc7', '--tx-sidebar-bg': '#2c3e50' } },
    { name: 'Verde Esmeralda',   vars: { '--tx-primary': '#00a878', '--tx-sidebar-bg': '#1a3a2a' } },
    { name: 'Roxo Profissional', vars: { '--tx-primary': '#7c3aed', '--tx-sidebar-bg': '#1e1b4b' } },
    { name: 'Laranja Vibrante',  vars: { '--tx-primary': '#ea580c', '--tx-sidebar-bg': '#1c1917' } },
    { name: 'Rosa Elegante',     vars: { '--tx-primary': '#db2777', '--tx-sidebar-bg': '#2d1b35' } },
    { name: 'Teal Moderno',      vars: { '--tx-primary': '#0d9488', '--tx-sidebar-bg': '#134e4a' } },
  ];

  readonly THEME_VAR_DEFS: ThemeVarDef[] = [
    { key: '--tx-primary',            label: 'Cor Principal',   group: 'Cores Principais' },
    { key: '--tx-success',            label: 'Sucesso',          group: 'Cores Principais' },
    { key: '--tx-warning',            label: 'Aviso',            group: 'Cores Principais' },
    { key: '--tx-danger',             label: 'Perigo',           group: 'Cores Principais' },
    { key: '--tx-info',               label: 'Informação',       group: 'Cores Principais' },
    { key: '--tx-sidebar-bg',         label: 'Fundo',            group: 'Sidebar' },
    { key: '--tx-sidebar-text',       label: 'Texto',            group: 'Sidebar' },
    { key: '--tx-sidebar-text-muted', label: 'Texto Secundário', group: 'Sidebar' },
    { key: '--tx-body-bg',            label: 'Fundo da Página',  group: 'Layout' },
    { key: '--tx-header-bg',          label: 'Header',           group: 'Layout' },
    { key: '--tx-card-bg',            label: 'Cards',            group: 'Layout' },
    { key: '--tx-header-border',      label: 'Borda do Header',  group: 'Layout' },
    { key: '--tx-border',             label: 'Bordas',           group: 'Layout' },
    { key: '--tx-text-heading',       label: 'Títulos',          group: 'Tipografia' },
    { key: '--tx-text',               label: 'Texto Principal',  group: 'Tipografia' },
    { key: '--tx-text-muted',         label: 'Texto Secundário', group: 'Tipografia' },
  ];

  readonly THEME_DEFAULTS: Record<string, string> = {
    '--tx-primary': '#485fc7', '--tx-success': '#48c774', '--tx-warning': '#f59e0b',
    '--tx-danger': '#f14668', '--tx-info': '#3273dc',
    '--tx-sidebar-bg': '#2c3e50', '--tx-sidebar-text': '#ecf0f1', '--tx-sidebar-text-muted': '#95a5a6',
    '--tx-body-bg': '#f5f5f5', '--tx-header-bg': '#ffffff', '--tx-card-bg': '#ffffff',
    '--tx-header-border': '#e0e0e0', '--tx-border': '#dbdbdb',
    '--tx-text-heading': '#1a1a2a', '--tx-text': '#363636', '--tx-text-muted': '#7a7a7a',
  };

  readonly themeGroups: Record<string, ThemeVarDef[]> = (() => {
    const g: Record<string, ThemeVarDef[]> = {};
    for (const def of this.THEME_VAR_DEFS) {
      if (!g[def.group]) g[def.group] = [];
      g[def.group].push(def);
    }
    return g;
  })();

  readonly userInitials = computed(() => {
    const name = this.auth.user()?.name;
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  });

  accountForm = {
    name: this.auth.user()?.name ?? '',
    email: this.auth.user()?.email ?? '',
    newPassword: '',
    confirmPassword: '',
  };

  applyPalette(idx: number): void {
    this.activePaletteIdx.set(idx);
    for (const [key, val] of Object.entries(this.PALETTES[idx].vars)) {
      this.ui.setThemeVar(key, val);
    }
  }

  getThemeVar(key: string): string {
    return this.ui.customTheme()[key] ?? this.THEME_DEFAULTS[key] ?? '#000000';
  }

  onColorChange(key: string, e: Event): void {
    this.activePaletteIdx.set(-1);
    this.ui.setThemeVar(key, (e.target as HTMLInputElement).value);
  }

  resetTheme(): void {
    this.ui.resetThemeVars();
    this.activePaletteIdx.set(-1);
  }

  applyFontSize(): void {
    document.documentElement.style.fontSize = this.fontSize;
  }

  onSidebarWidth(e: Event): void {
    this.ui.setSidebarWidth(Number((e.target as HTMLInputElement).value));
  }

  async saveAccount(): Promise<void> {
    if (this.accountForm.newPassword && this.accountForm.newPassword !== this.accountForm.confirmPassword) {
      this.ui.notifyError('As senhas não coincidem!');
      return;
    }
    this.saving.set(true);
    await new Promise((r) => setTimeout(r, 600));
    this.auth.updateProfile({ name: this.accountForm.name, email: this.accountForm.email });
    this.saving.set(false);
    this.accountForm.newPassword = '';
    this.accountForm.confirmPassword = '';
    this.ui.notifySuccess('Configurações salvas com sucesso!');
  }
}
