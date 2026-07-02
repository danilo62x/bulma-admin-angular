import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-section',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="pricing" class="section tx-lp-section tx-lp-section-alt">
      <div class="container">
        <div class="tx-lp-head">
          <span class="tx-lp-eyebrow">Preços</span>
          <h2 class="title tx-lp-head-title">Planos para cada estágio</h2>
          <p class="subtitle tx-lp-head-sub">Sem taxas ocultas. Cancele quando quiser.</p>

          <div class="tx-lp-toggle">
            <button type="button" class="tx-lp-toggle-btn" [class.is-active]="!annual()" (click)="annual.set(false)">Mensal</button>
            <button type="button" class="tx-lp-toggle-btn" [class.is-active]="annual()" (click)="annual.set(true)">
              Anual <span class="tag is-success is-light tx-lp-toggle-badge">-20%</span>
            </button>
          </div>
        </div>

        <div class="columns is-multiline is-centered is-variable is-5 tx-lp-grid">
          <div *ngFor="let plan of PLANS" class="column is-4">
            <div class="card tx-lp-plan" [class.is-featured]="plan.featured">
              <div *ngIf="plan.featured" class="tx-lp-plan-badge">Popular</div>
              <div class="tx-lp-plan-icon" [style.background]="'color-mix(in srgb, ' + plan.color + ' 14%, transparent)'" [style.color]="plan.color">
                <span class="mdi" [class]="plan.icon"></span>
              </div>
              <h3 class="tx-lp-plan-name">{{ plan.name }}</h3>
              <p class="tx-lp-plan-desc">{{ plan.desc }}</p>
              <div class="tx-lp-plan-price">
                <span class="tx-lp-plan-cur">R$</span>
                <span class="tx-lp-plan-amount">{{ annual() ? plan.priceAnnual : plan.priceMonthly }}</span>
                <span class="tx-lp-plan-period">/mês</span>
              </div>
              <p class="tx-lp-plan-note">
                {{ annual() ? 'Cobrado anualmente (R$ ' + plan.priceAnnual * 12 + '/ano)' : 'Pagamento mensal' }}
              </p>
              <a routerLink="/register" class="button is-fullwidth tx-lp-plan-cta" [class]="plan.featured ? 'is-primary' : 'is-light'">
                {{ plan.cta }}
              </a>
              <ul class="tx-lp-plan-features">
                <li *ngFor="let feat of plan.features" class="tx-lp-plan-feat">
                  <span class="mdi mdi-check tx-lp-plan-check"></span><span>{{ feat }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tx-lp-toggle { display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; padding: 0.35rem; border-radius: 999px; border: 1px solid var(--tx-border); background: var(--tx-card-bg); }
      .tx-lp-toggle-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; padding: 0.45rem 1rem; border-radius: 999px; font-size: 0.9rem; font-weight: 600; color: var(--tx-text-muted); transition: background-color var(--tx-transition), color var(--tx-transition); }
      .tx-lp-toggle-btn.is-active { background: var(--tx-primary); color: #fff; }
      .tx-lp-toggle-badge { font-size: 0.62rem !important; font-weight: 700; }
      .tx-lp-plan { position: relative; height: 100%; display: flex; flex-direction: column; background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 16px; padding: 1.75rem 1.5rem; box-shadow: none; transition: transform var(--tx-transition), box-shadow var(--tx-transition); }
      .tx-lp-plan.is-featured { border: 2px solid var(--tx-primary); box-shadow: 0 12px 34px color-mix(in srgb, var(--tx-primary) 22%, transparent); }
      @media screen and (min-width: 1024px) { .tx-lp-plan.is-featured { transform: translateY(-0.75rem); } }
      .tx-lp-plan-badge { position: absolute; top: -0.85rem; left: 50%; transform: translateX(-50%); background: var(--tx-primary); color: #fff; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.25rem 0.85rem; border-radius: 999px; }
      .tx-lp-plan-icon { display: inline-flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; border-radius: 12px; font-size: 1.4rem; }
      .tx-lp-plan-name { margin-top: 1rem; font-size: 1.25rem; font-weight: 800; color: var(--tx-text-heading); }
      .tx-lp-plan-desc { margin-top: 0.25rem; font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-plan-price { display: flex; align-items: baseline; gap: 0.25rem; margin-top: 1.25rem; }
      .tx-lp-plan-cur { font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-plan-amount { font-size: 2.5rem; font-weight: 800; line-height: 1; color: var(--tx-text-heading); }
      .tx-lp-plan-period { font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-plan-note { margin-top: 0.35rem; font-size: 0.75rem; color: var(--tx-text-muted); }
      .tx-lp-plan-cta { margin-top: 1.25rem; font-weight: 600; }
      .tx-lp-plan-features { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--tx-border); display: flex; flex-direction: column; gap: 0.7rem; flex: 1; }
      .tx-lp-plan-feat { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9rem; color: var(--tx-text); }
      .tx-lp-plan-check { color: var(--tx-success); font-size: 1.05rem; flex-shrink: 0; }
    `,
  ],
})
export class PricingSectionComponent {
  readonly annual = signal(false);
  readonly PLANS = [
    { key: 'starter', name: 'Starter', desc: 'Ideal para começar com o pé direito', icon: 'mdi-rocket-launch', color: '#3273dc', priceMonthly: 49, priceAnnual: 39, cta: 'Começar grátis', featured: false, features: ['Até 3 usuários', '5 GB de armazenamento', 'Suporte por email', 'Relatórios básicos'] },
    { key: 'pro', name: 'Pro', desc: 'Para times em crescimento', icon: 'mdi-rocket-launch', color: '#485fc7', priceMonthly: 129, priceAnnual: 103, cta: 'Assinar Pro', featured: true, features: ['Até 15 usuários', '100 GB de armazenamento', 'Suporte prioritário 24/5', 'Relatórios avançados', 'API access completo'] },
    { key: 'enterprise', name: 'Enterprise', desc: 'Para grandes organizações', icon: 'mdi-shield-check', color: '#7c3aed', priceMonthly: 399, priceAnnual: 319, cta: 'Falar com vendas', featured: false, features: ['Usuários ilimitados', 'Armazenamento ilimitado', 'Suporte dedicado 24/7', 'SSO e audit logs', 'SLA 99,99%'] },
  ];
}
