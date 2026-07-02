import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="ui.showCookieBanner()" class="tx-cookie-banner">
      <div class="tx-cookie-icon">
        <span class="mdi mdi-cookie"></span>
      </div>
      <div class="tx-cookie-content">
        <div class="tx-cookie-title">Aviso de Cookies</div>
        <p class="tx-cookie-text">
          Este site utiliza cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego.
          Ao continuar navegando, você concorda com a nossa
          <a href="#" (click)="$event.preventDefault(); ui.notify('Abrindo política de privacidade...', 'is-info')">
            Política de Privacidade
          </a>.
        </p>
      </div>
      <div class="tx-cookie-actions">
        <button class="button is-light is-small" (click)="ui.declineCookies()">Recusar</button>
        <button class="button is-primary is-small" (click)="ui.acceptCookies()">
          <span class="mdi mdi-check" style="margin-right: 0.25rem;"></span>
          Aceitar
        </button>
        <button class="tx-cookie-close" aria-label="Fechar" (click)="ui.closeCookieBanner()">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </div>
  `,
})
export class CookieBannerComponent implements OnInit {
  readonly ui = inject(UiService);

  ngOnInit(): void {
    if (!this.ui.cookiesAccepted()) {
      this.ui.openCookieBanner();
    }
  }
}
