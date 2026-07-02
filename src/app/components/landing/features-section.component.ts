import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="features" class="section tx-lp-section">
      <div class="container">
        <div class="tx-lp-head">
          <span class="tx-lp-eyebrow">Recursos</span>
          <h2 class="title tx-lp-head-title">Tudo que você precisa para construir</h2>
          <p class="subtitle tx-lp-head-sub">
            Uma base sólida e moderna para o seu próximo painel administrativo ou SaaS.
          </p>
        </div>

        <div class="columns is-multiline is-variable is-5 tx-lp-grid">
          <div *ngFor="let f of FEATURES" class="column is-4">
            <div class="card tx-lp-feature">
              <div class="tx-lp-feature-icon" [style.background]="'color-mix(in srgb, ' + f.color + ' 14%, transparent)'" [style.color]="f.color">
                <span class="mdi" [class]="f.icon"></span>
              </div>
              <h3 class="tx-lp-feature-title">{{ f.title }}</h3>
              <p class="tx-lp-feature-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tx-lp-feature { height: 100%; background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 16px; padding: 1.5rem; box-shadow: none; transition: transform var(--tx-transition), box-shadow var(--tx-transition); }
      .tx-lp-feature:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12); }
      .tx-lp-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 3rem; height: 3rem; border-radius: 12px; font-size: 1.5rem; transition: transform var(--tx-transition); }
      .tx-lp-feature:hover .tx-lp-feature-icon { transform: scale(1.1); }
      .tx-lp-feature-title { margin-top: 1.25rem; font-size: 1.1rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-feature-desc { margin-top: 0.5rem; font-size: 0.9rem; line-height: 1.6; color: var(--tx-text-muted); }
    `,
  ],
})
export class FeaturesSectionComponent {
  readonly FEATURES = [
    { icon: 'mdi-rocket-launch', color: '#485fc7', title: 'Performance de ponta', desc: 'Build com Angular CLI e Vite. Code-splitting automático e carregamento instantâneo.' },
    { icon: 'mdi-view-grid', color: '#3273dc', title: 'Componentes prontos', desc: 'Dezenas de componentes acessíveis e reutilizáveis para montar telas em minutos.' },
    { icon: 'mdi-web', color: '#48c774', title: 'Internacionalização', desc: 'Suporte a múltiplos idiomas com Transloco. Troque a língua sem recarregar a página.' },
    { icon: 'mdi-weather-night', color: '#7c3aed', title: 'Dark mode nativo', desc: 'Tema claro e escuro com tokens de design consistentes em toda a interface.' },
    { icon: 'mdi-shield-check', color: '#f59e0b', title: 'Segurança em primeiro lugar', desc: 'Autenticação, rotas protegidas e boas práticas de segurança já configuradas.' },
    { icon: 'mdi-package-variant-closed', color: '#f14668', title: 'PWA pronto', desc: 'Instalável, com suporte offline e cache inteligente para uma experiência de app.' },
  ];
}
