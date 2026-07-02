import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UiService } from '../core/services/ui.service';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-login-page">
      <div class="tx-login-card">
        <div class="tx-login-header">
          <div class="tx-login-logo">A</div>
          <h1 class="title is-5 has-text-white mb-1">Criar conta</h1>
          <p class="is-size-7" style="opacity: 0.8;">Preencha os dados para começar</p>
        </div>

        <div class="tx-login-body">
          <form (ngSubmit)="onSubmit()">
            <div class="field">
              <label class="label">Nome completo</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().name" type="text" name="name" placeholder="Seu nome completo" [(ngModel)]="form.name" />
                <span class="icon is-left"><i class="mdi mdi-account"></i></span>
              </div>
              <p *ngIf="errors().name" class="help is-danger">{{ errors().name }}</p>
            </div>

            <div class="field">
              <label class="label">E-mail</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().email" type="email" name="email" placeholder="seu@email.com" [(ngModel)]="form.email" />
                <span class="icon is-left"><i class="mdi mdi-email"></i></span>
              </div>
              <p *ngIf="errors().email" class="help is-danger">{{ errors().email }}</p>
            </div>

            <div class="field">
              <label class="label">Senha</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().password" type="password" name="password" placeholder="••••••••" [(ngModel)]="form.password" />
                <span class="icon is-left"><i class="mdi mdi-lock"></i></span>
              </div>
              <p class="help" *ngIf="!errors().password">Mínimo de 8 caracteres</p>
              <p *ngIf="errors().password" class="help is-danger">{{ errors().password }}</p>
            </div>

            <div class="field">
              <label class="label">Confirmar senha</label>
              <div class="control has-icons-left">
                <input class="input" [class.is-danger]="errors().confirmPassword" type="password" name="confirmPassword" placeholder="••••••••" [(ngModel)]="form.confirmPassword" />
                <span class="icon is-left"><i class="mdi mdi-lock-check"></i></span>
              </div>
              <p *ngIf="errors().confirmPassword" class="help is-danger">{{ errors().confirmPassword }}</p>
            </div>

            <div class="field">
              <label class="checkbox is-size-7">
                <input type="checkbox" name="acceptTerms" [(ngModel)]="form.acceptTerms" />
                Li e aceito os termos de uso e a política de privacidade
              </label>
              <p *ngIf="errors().acceptTerms" class="help is-danger">{{ errors().acceptTerms }}</p>
            </div>

            <button type="submit" class="button is-primary is-fullwidth mt-4" [class.is-loading]="loading()" [disabled]="loading()">
              {{ loading() ? 'Criando conta...' : 'Criar conta' }}
            </button>
          </form>

          <p class="has-text-centered is-size-7 has-text-grey mt-5">
            Já tem uma conta?
            <a routerLink="/login" class="has-text-weight-medium">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);

  readonly loading = signal(false);
  readonly errors = signal<{ name: string; email: string; password: string; confirmPassword: string; acceptTerms: string }>({
    name: '', email: '', password: '', confirmPassword: '', acceptTerms: '',
  });

  form: RegisterForm = { name: '', email: '', password: '', confirmPassword: '', acceptTerms: false };

  validate(): boolean {
    const e = { name: '', email: '', password: '', confirmPassword: '', acceptTerms: '' };
    if (!this.form.name.trim()) e.name = 'Informe seu nome';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.form.email)) e.email = 'E-mail inválido';
    if (this.form.password.length < 8) e.password = 'A senha deve ter ao menos 8 caracteres';
    if (this.form.confirmPassword !== this.form.password) e.confirmPassword = 'As senhas não conferem';
    if (!this.form.acceptTerms) e.acceptTerms = 'Você precisa aceitar os termos';
    this.errors.set(e);
    return !e.name && !e.email && !e.password && !e.confirmPassword && !e.acceptTerms;
  }

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 700));
    this.loading.set(false);
    this.ui.notifySuccess('Conta criada com sucesso! Faça login para continuar.');
    this.router.navigateByUrl('/login');
  }
}
