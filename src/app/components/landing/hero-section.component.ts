import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [NgFor, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="hero" class="hero tx-lp-hero">
      <div class="tx-lp-hero-blob tx-lp-blob-1"></div>
      <div class="tx-lp-hero-blob tx-lp-blob-2"></div>

      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-variable is-8">
            <div class="column is-6 tx-lp-hero-copy">
              <span class="tag is-primary is-light tx-lp-badge">
                <span class="mdi mdi-rocket-launch"></span>
                Angular 19 + Bulma
              </span>

              <h1 class="title tx-lp-hero-title">O template admin que acelera seu próximo produto</h1>
              <p class="subtitle tx-lp-hero-sub">
                Componentes prontos, dark mode, internacionalização e performance de primeira.
                Lance sua aplicação em dias, não meses.
              </p>

              <div class="tx-lp-hero-actions">
                <a routerLink="/register" class="button is-primary is-medium tx-lp-cta">
                  <span class="mdi mdi-rocket-launch"></span><span>Começar grátis</span>
                </a>
                <a routerLink="/dashboard" class="button is-medium tx-lp-cta tx-lp-cta-ghost">
                  <span>Ver demo</span><span class="mdi mdi-chevron-right"></span>
                </a>
              </div>

              <div class="tx-lp-social-proof">
                <div class="tx-lp-avatars">
                  <span *ngFor="let c of AVATARS" class="tx-lp-avatar" [style.background]="c"><span class="mdi mdi-account"></span></span>
                </div>
                <span class="tx-lp-proof-text"><strong>+2.000 equipes</strong> já constroem com a gente</span>
              </div>
            </div>

            <div class="column is-6">
              <div class="tx-lp-mockup-wrap">
                <div class="box tx-lp-mockup">
                  <div class="tx-lp-mockup-bar">
                    <span class="tx-lp-dot" style="background:#f14668"></span>
                    <span class="tx-lp-dot" style="background:#f59e0b"></span>
                    <span class="tx-lp-dot" style="background:#48c774"></span>
                    <span class="tx-lp-mockup-url">app.template.com</span>
                  </div>

                  <div class="columns is-mobile is-variable is-2 tx-lp-stats">
                    <div *ngFor="let s of STATS" class="column">
                      <div class="tx-lp-stat">
                        <p class="tx-lp-stat-label">{{ s.label }}</p>
                        <p class="tx-lp-stat-value">{{ s.value }}</p>
                        <span class="tx-lp-stat-trend" [class]="'is-' + s.accent"><span class="mdi mdi-trending-up"></span> +12%</span>
                      </div>
                    </div>
                  </div>

                  <div class="tx-lp-chart-card">
                    <div class="tx-lp-chart-head">
                      <p class="tx-lp-chart-title">Visão geral</p>
                      <span class="tag is-primary is-light tx-lp-chart-tag">7 dias</span>
                    </div>
                    <div class="tx-lp-bars">
                      <div *ngFor="let h of BARS" class="tx-lp-bar" [style.height.%]="h"></div>
                    </div>
                  </div>
                </div>

                <div class="tx-lp-float-card is-hidden-mobile">
                  <span class="tx-lp-float-icon"><span class="mdi mdi-check"></span></span>
                  <div>
                    <p class="tx-lp-float-title">Deploy pronto</p>
                    <p class="tx-lp-float-sub">build otimizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tx-lp-hero { position: relative; overflow: hidden; scroll-margin-top: 5rem; background: linear-gradient(135deg, color-mix(in srgb, var(--tx-primary) 12%, var(--tx-body-bg)) 0%, var(--tx-body-bg) 45%, color-mix(in srgb, var(--tx-primary) 8%, var(--tx-body-bg)) 100%); }
      .tx-lp-hero-blob { position: absolute; border-radius: 50%; filter: blur(80px); z-index: 0; pointer-events: none; }
      .tx-lp-blob-1 { top: -10rem; right: -8rem; width: 24rem; height: 24rem; background: color-mix(in srgb, var(--tx-primary) 35%, transparent); }
      .tx-lp-blob-2 { top: 10rem; left: -10rem; width: 24rem; height: 24rem; background: color-mix(in srgb, var(--tx-warning) 30%, transparent); }
      .hero-body { position: relative; z-index: 1; padding-top: 5rem; padding-bottom: 5rem; }
      .tx-lp-hero-copy { text-align: center; }
      .tx-lp-badge { gap: 0.4rem; font-weight: 600; }
      .tx-lp-hero-title { margin-top: 1.25rem; font-size: 2.4rem; font-weight: 800; line-height: 1.15; color: var(--tx-text-heading); }
      .tx-lp-hero-sub { margin-top: 1.25rem; font-size: 1.1rem; color: var(--tx-text-muted); }
      .tx-lp-hero-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }
      .tx-lp-cta { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; }
      .tx-lp-cta-ghost { background: var(--tx-card-bg); border: 1px solid var(--tx-border); color: var(--tx-text); }
      .tx-lp-social-proof { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-top: 2rem; font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-avatars { display: flex; }
      .tx-lp-avatar { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 50%; border: 2px solid var(--tx-card-bg); color: #fff; margin-left: -0.5rem; }
      .tx-lp-avatar:first-child { margin-left: 0; }
      .tx-lp-proof-text strong { color: var(--tx-text-heading); }
      .tx-lp-mockup-wrap { position: relative; }
      .tx-lp-mockup { background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 18px; padding: 1.25rem; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18); }
      .tx-lp-mockup-bar { display: flex; align-items: center; gap: 0.4rem; padding-bottom: 1rem; border-bottom: 1px solid var(--tx-border); }
      .tx-lp-dot { width: 0.75rem; height: 0.75rem; border-radius: 50%; }
      .tx-lp-mockup-url { margin-left: 0.75rem; font-size: 0.72rem; color: var(--tx-text-muted); }
      .tx-lp-stats { margin-top: 1rem; }
      .tx-lp-stat { border: 1px solid var(--tx-border); border-radius: 12px; padding: 0.75rem; background: var(--tx-body-bg); }
      .tx-lp-stat-label { font-size: 0.72rem; color: var(--tx-text-muted); }
      .tx-lp-stat-value { margin-top: 0.2rem; font-size: 1.1rem; font-weight: 800; color: var(--tx-text-heading); }
      .tx-lp-stat-trend { display: inline-flex; align-items: center; gap: 0.2rem; margin-top: 0.2rem; font-size: 0.68rem; font-weight: 600; }
      .tx-lp-stat-trend.is-primary { color: var(--tx-primary); }
      .tx-lp-stat-trend.is-success { color: var(--tx-success); }
      .tx-lp-stat-trend.is-warning { color: var(--tx-warning); }
      .tx-lp-chart-card { margin-top: 1rem; border: 1px solid var(--tx-border); border-radius: 12px; padding: 1rem; }
      .tx-lp-chart-head { display: flex; align-items: center; justify-content: space-between; }
      .tx-lp-chart-title { font-size: 0.9rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-chart-tag { font-size: 0.68rem; }
      .tx-lp-bars { display: flex; align-items: flex-end; gap: 0.5rem; height: 8rem; margin-top: 1rem; }
      .tx-lp-bar { flex: 1; border-radius: 6px 6px 0 0; background: linear-gradient(to top, color-mix(in srgb, var(--tx-primary) 30%, transparent), var(--tx-primary)); }
      .tx-lp-float-card { position: absolute; bottom: -1rem; left: -1rem; display: flex; align-items: center; gap: 0.5rem; background: var(--tx-card-bg); border: 1px solid var(--tx-border); border-radius: 12px; padding: 0.7rem 0.9rem; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15); }
      .tx-lp-float-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 10px; background: color-mix(in srgb, var(--tx-success) 18%, transparent); color: var(--tx-success); font-size: 1.1rem; }
      .tx-lp-float-title { font-size: 0.75rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-float-sub { font-size: 0.68rem; color: var(--tx-text-muted); }
      @media screen and (min-width: 769px) {
        .tx-lp-hero-copy { text-align: left; }
        .tx-lp-hero-title { font-size: 3rem; }
        .tx-lp-hero-actions { flex-direction: row; }
        .tx-lp-social-proof { flex-direction: row; align-items: center; }
      }
    `,
  ],
})
export class HeroSectionComponent {
  readonly STATS = [
    { label: 'Receita', value: 'R$ 84.2k', accent: 'primary' },
    { label: 'Usuários', value: '12.480', accent: 'success' },
    { label: 'Conversão', value: '4,8%', accent: 'warning' },
  ];
  readonly BARS = [42, 68, 55, 80, 62, 95, 74];
  readonly AVATARS = ['#485fc7', '#48c774', '#f59e0b', '#3273dc'];
}
