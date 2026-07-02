import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiService } from '../../core/services/ui.service';
import { LanguageSwitcherComponent } from '../ui/language-switcher.component';

@Component({
  selector: 'app-landing-nav',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, LanguageSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="tx-lp-nav" [class.is-scrolled]="scrolled()">
      <div class="container tx-lp-nav-inner">
        <button type="button" class="tx-lp-brand" (click)="scrollTo('hero')">
          <span class="tx-lp-brand-logo">A</span>
          <span class="tx-lp-brand-name">Admin Template</span>
        </button>

        <nav class="tx-lp-nav-links is-hidden-touch">
          <button *ngFor="let link of LINKS" type="button" class="tx-lp-nav-link" (click)="scrollTo(link.id)">
            {{ link.label }}
          </button>
        </nav>

        <div class="tx-lp-nav-actions">
          <button type="button" class="button is-ghost tx-lp-icon-btn" aria-label="Alternar tema" (click)="ui.toggleDarkMode()">
            <span class="mdi" [class]="ui.darkMode() ? 'mdi-weather-sunny' : 'mdi-weather-night'"></span>
          </button>

          <app-language-switcher></app-language-switcher>

          <a routerLink="/login" class="button is-ghost is-hidden-mobile tx-lp-login">Entrar</a>
          <a routerLink="/register" class="button is-primary is-hidden-mobile">Começar agora</a>

          <button type="button" class="button is-ghost tx-lp-icon-btn is-hidden-desktop" aria-label="Abrir menu" (click)="open.set(!open())">
            <span class="mdi" [class]="open() ? 'mdi-close' : 'mdi-menu'"></span>
          </button>
        </div>
      </div>

      <div *ngIf="open()" class="tx-lp-mobile-menu is-hidden-desktop">
        <div class="container">
          <button *ngFor="let link of LINKS" type="button" class="tx-lp-mobile-link" (click)="scrollTo(link.id)">
            {{ link.label }}
          </button>
          <div class="tx-lp-mobile-cta">
            <a routerLink="/login" class="button is-light is-fullwidth" (click)="open.set(false)">Entrar</a>
            <a routerLink="/register" class="button is-primary is-fullwidth" (click)="open.set(false)">Começar agora</a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .tx-lp-nav { position: sticky; top: 0; z-index: 50; width: 100%; border-bottom: 1px solid transparent; transition: background-color var(--tx-transition), border-color var(--tx-transition), box-shadow var(--tx-transition); }
      .tx-lp-nav.is-scrolled { background: color-mix(in srgb, var(--tx-card-bg) 85%, transparent); backdrop-filter: blur(10px); border-bottom-color: var(--tx-border); box-shadow: var(--tx-header-shadow); }
      .tx-lp-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 4rem; padding-left: 1rem; padding-right: 1rem; }
      .tx-lp-brand { display: inline-flex; align-items: center; gap: 0.65rem; background: none; border: none; cursor: pointer; padding: 0; }
      .tx-lp-brand-logo { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 12px; background: var(--tx-primary); color: #fff; font-weight: 800; font-size: 1.1rem; box-shadow: 0 4px 12px color-mix(in srgb, var(--tx-primary) 35%, transparent); }
      .tx-lp-brand-name { font-size: 1.1rem; font-weight: 800; color: var(--tx-text-heading); }
      .tx-lp-nav-links { display: flex; align-items: center; gap: 0.25rem; }
      .tx-lp-nav-link { background: none; border: none; cursor: pointer; padding: 0.5rem 0.85rem; border-radius: var(--tx-radius); font-size: 0.9rem; font-weight: 500; color: var(--tx-text); transition: background-color var(--tx-transition), color var(--tx-transition); }
      .tx-lp-nav-link:hover { background: var(--tx-border-subtle); color: var(--tx-text-heading); }
      .tx-lp-nav-actions { display: flex; align-items: center; gap: 0.5rem; }
      .tx-lp-icon-btn { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid var(--tx-border); padding: 0; }
      .tx-lp-icon-btn .mdi { font-size: 1.2rem; }
      .tx-lp-login { color: var(--tx-text); }
      .tx-lp-mobile-menu { background: var(--tx-card-bg); border-top: 1px solid var(--tx-border); padding: 1rem 0; }
      .tx-lp-mobile-link { display: block; width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0.7rem 1rem; border-radius: var(--tx-radius); font-size: 0.9rem; font-weight: 500; color: var(--tx-text); }
      .tx-lp-mobile-link:hover { background: var(--tx-border-subtle); }
      .tx-lp-mobile-cta { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; padding: 0.75rem 1rem 0; border-top: 1px solid var(--tx-border); }
    `,
  ],
})
export class LandingNavComponent {
  readonly ui = inject(UiService);
  readonly LINKS = [
    { id: 'features', label: 'Recursos' },
    { id: 'pricing', label: 'Preços' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contato' },
  ];
  readonly open = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  scrollTo(id: string): void {
    this.open.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
