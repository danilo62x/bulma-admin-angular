import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-login-page">
      <div class="tx-login-card">
        <div class="tx-login-header">
          <div style="width: 56px; height: 56px; border-radius: 14px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.8rem; font-weight: 900;">
            A
          </div>
          <h1 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem;">Admin Template</h1>
          <p style="opacity: 0.8; font-size: 0.875rem;">Faça login para continuar</p>
        </div>

        <div class="tx-login-body">
          <form (ngSubmit)="handleLogin()">
            <div class="field">
              <label class="label">E-mail</label>
              <div class="control has-icons-left">
                <input
                  class="input"
                  [class.is-danger]="errors().email"
                  type="email"
                  placeholder="seu@email.com"
                  name="email"
                  [(ngModel)]="form.email"
                  autocomplete="email"
                />
                <span class="icon is-small is-left"><i class="mdi mdi-email"></i></span>
              </div>
              <p *ngIf="errors().email" class="help is-danger">{{ errors().email }}</p>
            </div>

            <div class="field">
              <label class="label">Senha</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  class="input"
                  [class.is-danger]="errors().password || errors().global"
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="••••••••"
                  name="password"
                  [(ngModel)]="form.password"
                  autocomplete="current-password"
                />
                <span class="icon is-small is-left"><i class="mdi mdi-lock"></i></span>
                <span
                  class="icon is-small is-right is-clickable"
                  style="pointer-events: auto;"
                  (click)="showPassword.set(!showPassword())"
                >
                  <i class="mdi" [class]="showPassword() ? 'mdi-eye-off' : 'mdi-eye'"></i>
                </span>
              </div>
              <p *ngIf="errors().password || errors().global" class="help is-danger">
                {{ errors().password || errors().global }}
              </p>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
              <label class="checkbox is-size-7">
                <input type="checkbox" name="remember" [(ngModel)]="form.remember" />
                Lembrar-me
              </label>
              <a routerLink="/forgot-password" style="font-size: 0.8rem; color: var(--tx-primary);">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              class="button is-primary is-fullwidth"
              [class.is-loading]="loading()"
              [disabled]="loading()"
            >
              Entrar
            </button>
          </form>

          <p class="has-text-centered is-size-7 has-text-grey mt-5">
            Não tem uma conta?
            <a routerLink="/register" class="has-text-weight-medium">Criar conta</a>
          </p>

          <div style="margin-top: 1.5rem; padding: 0.75rem; background: #f0f4ff; border-radius: 6px; font-size: 0.78rem; color: #555;">
            <strong>Credenciais de demonstração:</strong><br />
            admin&#64;template.com / admin123<br />
            user&#64;template.com / user123
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal<boolean>(false);
  readonly showPassword = signal<boolean>(false);
  readonly errors = signal<{ email: string; password: string; global: string }>({ email: '', password: '', global: '' });

  form: LoginForm = { email: '', password: '', remember: false };

  validate(): boolean {
    const e = { email: '', password: '', global: '' };
    if (!this.form.email) e.email = 'E-mail é obrigatório';
    if (!this.form.password) e.password = 'Senha é obrigatória';
    this.errors.set(e);
    return !e.email && !e.password;
  }

  async handleLogin(): Promise<void> {
    if (!this.validate()) return;
    this.loading.set(true);
    try {
      const ok = await this.auth.login(this.form.email, this.form.password);
      if (!ok) {
        this.errors.update((e) => ({ ...e, global: 'E-mail ou senha inválidos' }));
        return;
      }
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/dashboard';
      this.router.navigateByUrl(redirect);
    } finally {
      this.loading.set(false);
    }
  }
}
