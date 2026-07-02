import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [NgFor, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="section tx-lp-section tx-lp-section-alt">
      <div class="container">
        <div class="tx-lp-head">
          <span class="tx-lp-eyebrow">Contato</span>
          <h2 class="title tx-lp-head-title">Fale com a gente</h2>
          <p class="subtitle tx-lp-head-sub">Tem dúvidas? Envie uma mensagem e nossa equipe responde rapidinho.</p>
        </div>

        <div class="columns is-variable is-6 tx-lp-grid">
          <div class="column is-5 tx-lp-contact-info">
            <div *ngFor="let item of INFO" class="tx-lp-info-item">
              <span class="tx-lp-info-icon"><span class="mdi" [class]="item.icon"></span></span>
              <div>
                <p class="tx-lp-info-label">{{ item.label }}</p>
                <p class="tx-lp-info-value">{{ item.value }}</p>
              </div>
            </div>

            <div class="card tx-lp-info-card">
              <div class="tx-lp-info-card-head">
                <span class="mdi mdi-check"></span>
                <p>Resposta em até 24h</p>
              </div>
              <p class="tx-lp-info-card-text">Atendimento de segunda a sexta, das 9h às 18h (horário de Brasília).</p>
            </div>
          </div>

          <div class="column is-7">
            <form class="card tx-lp-form" (ngSubmit)="handleSubmit()">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control"><input class="input" type="text" placeholder="Seu nome" required name="nome" [(ngModel)]="nome" /></div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control"><input class="input" type="email" placeholder="seu@email.com" required name="email" [(ngModel)]="email" /></div>
              </div>
              <div class="field">
                <label class="label">Mensagem</label>
                <div class="control"><textarea class="textarea" rows="4" placeholder="Como podemos ajudar?" required name="mensagem" [(ngModel)]="mensagem"></textarea></div>
              </div>
              <button type="submit" class="button is-primary is-fullwidth">
                <span class="icon"><i class="mdi mdi-email"></i></span><span>Enviar mensagem</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tx-lp-contact-info { display: flex; flex-direction: column; justify-content: center; gap: 1.5rem; }
      .tx-lp-info-item { display: flex; align-items: flex-start; gap: 1rem; }
      .tx-lp-info-icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 3rem; height: 3rem; border-radius: 12px; background: color-mix(in srgb, var(--tx-primary) 12%, transparent); color: var(--tx-primary); font-size: 1.35rem; }
      .tx-lp-info-label { font-size: 0.9rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-info-value { margin-top: 0.15rem; font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-info-card { background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 16px; padding: 1.25rem; box-shadow: none; }
      .tx-lp-info-card-head { display: flex; align-items: center; gap: 0.5rem; color: var(--tx-success); }
      .tx-lp-info-card-head .mdi { font-size: 1.15rem; }
      .tx-lp-info-card-head p { font-size: 0.9rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-info-card-text { margin-top: 0.5rem; font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-form { background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 16px; padding: 2rem; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05); }
      .tx-lp-form .field:not(:last-child) { margin-bottom: 1.25rem; }
    `,
  ],
})
export class ContactSectionComponent {
  private readonly ui = inject(UiService);
  readonly INFO = [
    { icon: 'mdi-email', label: 'Email', value: 'contato@template.com' },
    { icon: 'mdi-phone', label: 'Telefone', value: '+55 (11) 4002-8922' },
    { icon: 'mdi-map-marker', label: 'Endereço', value: 'Av. Paulista, 1000 — São Paulo, SP' },
  ];
  nome = '';
  email = '';
  mensagem = '';

  handleSubmit(): void {
    this.ui.notifySuccess('Mensagem enviada!');
    this.nome = '';
    this.email = '';
    this.mensagem = '';
  }
}
