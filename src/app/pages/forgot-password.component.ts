import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-login-page">
      <div class="tx-login-card">
        <div class="tx-login-header">
          <div class="tx-login-logo"><span class="mdi mdi-lock"></span></div>
          <h1 class="title is-5 has-text-white mb-1">Esqueci a senha</h1>
          <p class="is-size-7" style="opacity: 0.8;">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <div class="tx-login-body">
          <div *ngIf="sentTo()" class="has-text-centered">
            <span class="icon is-large has-text-success">
              <span class="mdi mdi-check-circle mdi-48px"></span>
            </span>
            <h2 class="title is-6 mt-3">Link enviado para seu e-mail</h2>
            <p class="is-size-7 has-text-grey">
              Enviamos um link de redefinição para
              <span class="has-text-weight-medium has-text-dark">{{ sentTo() }}</span>. Verifique sua
              caixa de entrada e o spam.
            </p>
            <div class="notification is-light mt-4 is-size-7">
              Não recebeu?
              <a class="has-text-weight-medium" (click)="sentTo.set(null)">Tentar outro e-mail</a>
            </div>
          </div>

          <form *ngIf="!sentTo()" (ngSubmit)="onSubmit()">
            <div class="field">
              <label class="label">E-mail</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="error()" type="email" name="email" placeholder="seu@email.com" [(ngModel)]="email" />
                <span class="icon is-left"><i class="mdi mdi-email"></i></span>
              </div>
              <p *ngIf="error()" class="help is-danger">{{ error() }}</p>
            </div>

            <button type="submit" class="button is-primary is-fullwidth mt-2" [class.is-loading]="loading()" [disabled]="loading()">
              {{ loading() ? 'Enviando...' : 'Enviar link de redefinição' }}
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
export class ForgotPasswordComponent {
  readonly loading = signal(false);
  readonly sentTo = signal<string | null>(null);
  readonly error = signal('');
  email = '';

  async onSubmit(): Promise<void> {
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.email)) {
      this.error.set('E-mail inválido');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 700));
    this.loading.set(false);
    this.sentTo.set(this.email);
  }
}
