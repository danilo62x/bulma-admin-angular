import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UiService } from '../core/services/ui.service';

const STRENGTH = [
  { label: 'Muito fraca', color: 'is-danger', text: 'has-text-danger' },
  { label: 'Fraca', color: 'is-danger', text: 'has-text-danger' },
  { label: 'Razoável', color: 'is-warning', text: 'has-text-warning-dark' },
  { label: 'Boa', color: 'is-success', text: 'has-text-success' },
  { label: 'Forte', color: 'is-success', text: 'has-text-success' },
];

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-login-page">
      <div class="tx-login-card">
        <div class="tx-login-header">
          <div class="tx-login-logo"><span class="mdi mdi-lock"></span></div>
          <h1 class="title is-5 has-text-white mb-1">Redefinir senha</h1>
          <p class="is-size-7" style="opacity: 0.8;">Defina uma nova senha para sua conta.</p>
        </div>

        <div class="tx-login-body">
          <div *ngIf="!token" class="notification is-warning is-light has-text-centered is-size-7">
            Link inválido ou expirado. Solicite um novo link de redefinição.
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="field">
              <label class="label">Nova senha</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().password" type="password" name="password" placeholder="••••••••" [(ngModel)]="password" (ngModelChange)="password = $event" />
                <span class="icon is-left"><i class="mdi mdi-lock"></i></span>
              </div>
              <p class="help" *ngIf="!errors().password">Use 8+ caracteres, com letras, números e símbolos</p>
              <p *ngIf="errors().password" class="help is-danger">{{ errors().password }}</p>
            </div>

            <div *ngIf="password" class="mb-4">
              <div class="tx-strength-bars">
                <span *ngFor="let i of [0,1,2,3]" class="tx-strength-bar" [class]="i < score() ? strength().color : ''"></span>
              </div>
              <p class="is-size-7 has-text-weight-medium" [class]="strength().text">
                Força da senha: {{ strength().label }}
              </p>
            </div>

            <div class="field">
              <label class="label">Confirmar senha</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().confirmPassword" type="password" name="confirmPassword" placeholder="••••••••" [(ngModel)]="confirmPassword" />
                <span class="icon is-left"><i class="mdi mdi-lock-check"></i></span>
              </div>
              <p *ngIf="errors().confirmPassword" class="help is-danger">{{ errors().confirmPassword }}</p>
            </div>

            <button type="submit" class="button is-primary is-fullwidth mt-2" [class.is-loading]="loading()" [disabled]="loading()">
              {{ loading() ? 'Salvando...' : 'Redefinir senha' }}
            </button>
          </form>

          <p class="has-text-centered is-size-7 has-text-grey mt-5">
            <a routerLink="/login" class="has-text-weight-medium">Voltar — Entrar</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly ui = inject(UiService);

  readonly loading = signal(false);
  readonly errors = signal<{ password: string; confirmPassword: string }>({ password: '', confirmPassword: '' });
  password = '';
  confirmPassword = '';

  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';

  readonly score = computed(() => {
    const pw = this.password;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  });
  readonly strength = computed(() => STRENGTH[this.score()]);

  async onSubmit(): Promise<void> {
    const e = { password: '', confirmPassword: '' };
    if (this.password.length < 8) e.password = 'A senha deve ter ao menos 8 caracteres';
    if (this.confirmPassword !== this.password) e.confirmPassword = 'As senhas não conferem';
    this.errors.set(e);
    if (e.password || e.confirmPassword) return;

    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 700));
    this.loading.set(false);
    void this.token;
    this.ui.notifySuccess('Senha redefinida com sucesso! Faça login com a nova senha.');
    this.router.navigateByUrl('/login');
  }
}
