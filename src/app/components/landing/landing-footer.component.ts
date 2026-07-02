import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="tx-lp-footer">
      <div class="container">
        <div class="columns is-variable is-6">
          <div class="column is-4">
            <div class="tx-lp-footer-brand">
              <span class="tx-lp-footer-logo">A</span>
              <span class="tx-lp-footer-name">Admin Template</span>
            </div>
            <p class="tx-lp-footer-about">
              O template admin moderno para acelerar o desenvolvimento do seu próximo produto.
            </p>
            <div class="tx-lp-footer-social">
              <a *ngFor="let s of SOCIAL" href="#" [attr.aria-label]="s.label" class="tx-lp-social-link">
                <span class="mdi" [class]="s.icon"></span>
              </a>
            </div>
          </div>

          <div *ngFor="let col of COLUMNS" class="column">
            <h3 class="tx-lp-footer-col-title">{{ col.title }}</h3>
            <ul class="tx-lp-footer-links">
              <li *ngFor="let link of col.links"><a href="#" class="tx-lp-footer-link">{{ link }}</a></li>
            </ul>
          </div>
        </div>

        <div class="tx-lp-footer-bottom">
          <p>© 2026 Admin Template. Todos os direitos reservados.</p>
          <p class="tx-lp-footer-made">
            Feito com <span class="mdi mdi-rocket-launch"></span> em Angular 19 + Bulma
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .tx-lp-footer { border-top: 1px solid var(--tx-border); background: var(--tx-card-bg); padding: 3.5rem 0; }
      .tx-lp-footer-brand { display: flex; align-items: center; gap: 0.65rem; }
      .tx-lp-footer-logo { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: 12px; background: var(--tx-primary); color: #fff; font-weight: 800; font-size: 1.1rem; }
      .tx-lp-footer-name { font-size: 1.1rem; font-weight: 800; color: var(--tx-text-heading); }
      .tx-lp-footer-about { margin-top: 1rem; max-width: 20rem; font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-footer-social { display: flex; gap: 0.5rem; margin-top: 1.25rem; }
      .tx-lp-social-link { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid var(--tx-border); color: var(--tx-text-muted); transition: background-color var(--tx-transition), color var(--tx-transition); }
      .tx-lp-social-link:hover { background: var(--tx-body-bg); color: var(--tx-primary); }
      .tx-lp-footer-col-title { font-size: 0.9rem; font-weight: 700; color: var(--tx-text-heading); }
      .tx-lp-footer-links { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.7rem; }
      .tx-lp-footer-link { font-size: 0.9rem; color: var(--tx-text-muted); transition: color var(--tx-transition); }
      .tx-lp-footer-link:hover { color: var(--tx-primary); }
      .tx-lp-footer-bottom { display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--tx-border); font-size: 0.9rem; color: var(--tx-text-muted); }
      .tx-lp-footer-made { display: flex; align-items: center; gap: 0.4rem; }
      .tx-lp-footer-made .mdi { color: var(--tx-primary); }
      @media screen and (min-width: 769px) { .tx-lp-footer-bottom { flex-direction: row; justify-content: space-between; } }
    `,
  ],
})
export class LandingFooterComponent {
  readonly COLUMNS = [
    { title: 'Produto', links: ['Recursos', 'Preços', 'Integrações', 'Changelog'] },
    { title: 'Empresa', links: ['Sobre', 'Blog', 'Carreiras', 'Contato'] },
    { title: 'Legal', links: ['Privacidade', 'Termos', 'Cookies', 'Licença'] },
  ];
  readonly SOCIAL = [
    { icon: 'mdi-web', label: 'Site' },
    { icon: 'mdi-email', label: 'Email' },
    { icon: 'mdi-account-group', label: 'Comunidade' },
    { icon: 'mdi-star', label: 'Avaliações' },
  ];
}
