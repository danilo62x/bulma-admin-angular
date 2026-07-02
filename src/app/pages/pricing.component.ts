import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { SwitchComponent } from '../components/ui/switch.component';
import { TooltipDirective } from '../components/ui/tooltip.directive';

interface Feature { text: string; included: boolean; tip?: string; }
interface Plan { key: 'basic' | 'pro' | 'enterprise'; name: string; desc: string; priceMonthly: number; priceAnnual: number; cta: string; featured: boolean; color: string; icon: string; features: Feature[]; }
interface CompareRow { feature: string; tip?: string; basic: boolean | string; pro: boolean | string; enterprise: boolean | string; }
interface CompareSection { section: string; rows: CompareRow[]; }
interface Faq { q: string; a: string; }

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [NgFor, NgIf, CardComponent, SwitchComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="tx-pricing-header">
        <h2 class="tx-pricing-title">Planos & Preços</h2>
        <p class="tx-pricing-subtitle">
          Escolha o plano ideal para sua empresa. Sem taxas ocultas. Cancele quando quiser.
        </p>
        <div class="tx-billing-toggle">
          <span [class.tx-toggle-active]="!annual()">Mensal</span>
          <app-switch type="is-primary" [value]="annual()" (valueChange)="annual.set($event)"></app-switch>
          <span [class.tx-toggle-active]="annual()">Anual</span>
          <span *ngIf="annual()" class="tag is-success is-light tx-save-badge">Economize 20%</span>
        </div>
      </div>

      <div class="columns is-centered" style="margin-top:1.5rem;">
        <div *ngFor="let plan of plans" class="column is-4-desktop is-6-tablet">
          <div class="tx-plan-card" [class.tx-plan-featured]="plan.featured">
            <div *ngIf="plan.featured" class="tx-plan-badge">Mais Popular</div>
            <div class="tx-plan-header">
              <div class="tx-plan-icon" [style.background]="'color-mix(in srgb, ' + plan.color + ' 15%, transparent)'" [style.color]="plan.color">
                <span class="mdi" [class]="plan.icon"></span>
              </div>
              <div class="tx-plan-name">{{ plan.name }}</div>
              <div class="tx-plan-desc">{{ plan.desc }}</div>
            </div>
            <div class="tx-plan-price">
              <span class="tx-price-currency">R$</span>
              <span class="tx-price-amount">{{ annual() ? plan.priceAnnual : plan.priceMonthly }}</span>
              <span class="tx-price-period">/mês</span>
            </div>
            <div *ngIf="annual()" class="tx-price-note">
              Cobrado anualmente (R$ {{ plan.priceAnnual * 12 }}/ano)
            </div>
            <button
              class="button tx-plan-cta is-fullwidth"
              [class]="plan.featured ? 'is-primary' : 'is-light'"
              (click)="ui.notifySuccess('Plano ' + plan.name + ' selecionado!')"
            >
              {{ plan.cta }}
            </button>
            <ul class="tx-plan-features">
              <li *ngFor="let feat of plan.features" class="tx-feat-item">
                <span class="mdi tx-feat-icon"
                  [class]="feat.included ? 'mdi-check-circle' : 'mdi-close-circle'"
                  [style.color]="feat.included ? '#48c774' : 'var(--tx-border)'"
                ></span>
                <span [class.tx-feat-disabled]="!feat.included">{{ feat.text }}</span>
                <span *ngIf="feat.tip" class="mdi mdi-information-outline tx-feat-tip" [appTooltip]="feat.tip"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <app-card title="Comparação Completa de Recursos" icon="mdi-view-list" style="margin-top:1rem; display: block;">
        <ng-template #toolbar>
          <button class="button is-small is-ghost" (click)="ui.notify('Dúvidas? Fale com nosso time comercial.', 'is-info')">
            <span class="mdi mdi-help-circle" style="margin-right: 0.25rem;"></span>
            Preciso de ajuda
          </button>
        </ng-template>
        <div class="tx-compare-wrap">
          <table class="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>Recurso</th>
                <th *ngFor="let plan of plans" class="has-text-centered">
                  <span [style.color]="plan.color">{{ plan.name }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngFor="let section of compareTable">
                <tr class="tx-compare-section">
                  <td colspan="4"><strong>{{ section.section }}</strong></td>
                </tr>
                <tr *ngFor="let row of section.rows">
                  <td>
                    {{ row.feature }}
                    <span *ngIf="row.tip" class="mdi mdi-information-outline" style="color:var(--tx-text-muted);font-size:0.85rem;margin-left:4px;" [appTooltip]="row.tip"></span>
                  </td>
                  <td *ngFor="let plan of plans" class="has-text-centered">
                    <ng-container *ngIf="isBool(row, plan.key); else stringCell">
                      <span class="mdi" [class]="row[plan.key] ? 'mdi-check-circle has-text-success' : 'mdi-minus has-text-grey-light'"></span>
                    </ng-container>
                    <ng-template #stringCell>
                      <span style="font-size:0.85rem;">{{ row[plan.key] }}</span>
                    </ng-template>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>
      </app-card>

      <app-card title="Perguntas Frequentes" icon="mdi-frequently-asked-questions" style="margin-top:1rem; display: block;">
        <div class="tx-collapse-list">
          <div *ngFor="let faq of faqs; let i = index" class="tx-collapse-item">
            <div class="tx-collapse-trigger" (click)="toggleFaq(i)">
              <span class="tx-collapse-label">{{ faq.q }}</span>
              <span class="mdi tx-collapse-chevron" [class]="openFaq() === i ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
            </div>
            <div *ngIf="openFaq() === i" class="tx-collapse-body" style="padding-left: 1rem;">{{ faq.a }}</div>
          </div>
        </div>
      </app-card>
    </div>
  `,
})
export class PricingComponent {
  readonly ui = inject(UiService);
  readonly annual = signal<boolean>(false);
  readonly openFaq = signal<number | null>(0);

  toggleFaq(i: number): void {
    this.openFaq.update((cur) => (cur === i ? null : i));
  }

  isBool(row: CompareRow, key: 'basic' | 'pro' | 'enterprise'): boolean {
    return typeof row[key] === 'boolean';
  }

  readonly plans: Plan[] = [
    { key: 'basic', name: 'Básico', desc: 'Ideal para pequenas equipes iniciando sua jornada.', priceMonthly: 99, priceAnnual: 79, cta: 'Começar grátis', featured: false, color: '#48c774', icon: 'mdi-leaf',
      features: [
        { text: 'Até 3 usuários', included: true },
        { text: '5 GB de armazenamento', included: true },
        { text: 'Relatórios básicos', included: true },
        { text: 'Suporte por e-mail', included: true },
        { text: 'API de integração', included: false },
        { text: 'White-label', included: false },
        { text: 'Suporte prioritário', included: false },
        { text: 'SLA garantido', included: false },
      ],
    },
    { key: 'pro', name: 'Profissional', desc: 'Para equipes em crescimento que precisam de mais poder.', priceMonthly: 249, priceAnnual: 199, cta: 'Assinar agora', featured: true, color: '#485fc7', icon: 'mdi-rocket-launch',
      features: [
        { text: 'Até 15 usuários', included: true },
        { text: '50 GB de armazenamento', included: true },
        { text: 'Relatórios avançados + gráficos', included: true, tip: 'Inclui exportação para PDF e Excel' },
        { text: 'Suporte por chat 8h-18h', included: true },
        { text: 'API de integração completa', included: true },
        { text: 'White-label (parcial)', included: true },
        { text: 'Suporte prioritário', included: false },
        { text: 'SLA garantido', included: false },
      ],
    },
    { key: 'enterprise', name: 'Empresarial', desc: 'Solução completa para grandes organizações.', priceMonthly: 699, priceAnnual: 559, cta: 'Falar com vendas', featured: false, color: '#f59e0b', icon: 'mdi-office-building',
      features: [
        { text: 'Usuários ilimitados', included: true },
        { text: 'Armazenamento ilimitado', included: true },
        { text: 'Analytics em tempo real', included: true, tip: 'Dashboard dedicado com alertas automáticos' },
        { text: 'Suporte 24/7 dedicado', included: true },
        { text: 'API + Webhooks avançados', included: true },
        { text: 'White-label completo', included: true },
        { text: 'Gerente de conta exclusivo', included: true },
        { text: 'SLA 99.9% garantido', included: true },
      ],
    },
  ];

  readonly compareTable: CompareSection[] = [
    { section: 'Usuários & Capacidade', rows: [
      { feature: 'Usuários', basic: '3', pro: '15', enterprise: 'Ilimitados' },
      { feature: 'Armazenamento', basic: '5 GB', pro: '50 GB', enterprise: 'Ilimitado' },
      { feature: 'Projetos ativos', basic: '5', pro: '30', enterprise: 'Ilimitados' },
    ]},
    { section: 'Relatórios & Analytics', rows: [
      { feature: 'Relatórios básicos', basic: true, pro: true, enterprise: true },
      { feature: 'Dashboards customizáveis', basic: false, pro: true, enterprise: true },
      { feature: 'Analytics em tempo real', tip: 'Dados atualizados a cada 30 segundos', basic: false, pro: false, enterprise: true },
      { feature: 'Exportação PDF/Excel', basic: false, pro: true, enterprise: true },
    ]},
    { section: 'Integrações', rows: [
      { feature: 'API REST', basic: false, pro: true, enterprise: true },
      { feature: 'Webhooks', basic: false, pro: true, enterprise: true },
      { feature: 'SSO / SAML', basic: false, pro: false, enterprise: true },
      { feature: 'Integrações nativas (Slack, Jira...)', basic: false, pro: '3 apps', enterprise: 'Ilimitadas' },
    ]},
    { section: 'Suporte', rows: [
      { feature: 'Suporte por e-mail', basic: true, pro: true, enterprise: true },
      { feature: 'Chat em tempo real', basic: false, pro: true, enterprise: true },
      { feature: 'Suporte 24/7', basic: false, pro: false, enterprise: true },
      { feature: 'Gerente de conta', basic: false, pro: false, enterprise: true },
      { feature: 'SLA garantido', basic: false, pro: false, enterprise: true },
    ]},
  ];

  readonly faqs: Faq[] = [
    { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. No upgrade, o valor é calculado pro-rata. No downgrade, o crédito é aplicado no próximo ciclo.' },
    { q: 'Como funciona o período de teste?', a: 'Todos os planos possuem 14 dias de teste gratuito, sem necessidade de cartão de crédito. Você só paga quando decidir continuar.' },
    { q: 'Vocês oferecem desconto para startups ou ONGs?', a: 'Sim, oferecemos 40% de desconto para startups com menos de 2 anos e 60% para ONGs devidamente registradas. Entre em contato com nosso time comercial.' },
    { q: 'Os dados ficam seguros?', a: 'Seus dados são criptografados em trânsito (TLS 1.3) e em repouso (AES-256). Fazemos backups diários automáticos e oferecemos conformidade com LGPD e GDPR.' },
    { q: 'Posso cancelar sem multa?', a: 'Nos planos mensais, você pode cancelar a qualquer momento sem cobrança futura. Nos planos anuais, o cancelamento encerra o acesso no fim do período pago.' },
  ];
}
