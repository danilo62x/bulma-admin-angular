import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-state-page">
      <div class="tx-state-bg">
        <span class="tx-state-blob tx-state-blob--one"></span>
        <span class="tx-state-blob tx-state-blob--two"></span>
      </div>

      <div class="tx-state-content has-text-centered">
        <span class="tx-state-404">404</span>
        <h1 class="title is-2 has-text-white mt-4">Página não encontrada</h1>
        <p class="subtitle is-6 tx-state-text mt-3">
          A página que você está procurando não existe, foi removida ou mudou de endereço.
          Verifique o link ou volte para um lugar seguro.
        </p>
        <div class="buttons is-centered mt-5">
          <a routerLink="/" class="button is-primary is-medium">
            <span class="icon"><span class="mdi mdi-arrow-left"></span></span>
            <span>Voltar ao início</span>
          </a>
          <a routerLink="/dashboard" class="button is-light is-medium">
            <span class="icon"><span class="mdi mdi-view-dashboard"></span></span>
            <span>Ir para o dashboard</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
