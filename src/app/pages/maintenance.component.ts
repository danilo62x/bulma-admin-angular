import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-maintenance',
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
        <span class="tx-state-icon"><span class="mdi mdi-cog mdi-48px"></span></span>
        <h1 class="title is-2 has-text-white mt-5">Estamos em manutenção</h1>
        <p class="subtitle is-6 tx-state-text mt-3">
          Nosso sistema está passando por uma atualização programada para melhorar sua
          experiência. Voltaremos em instantes. Agradecemos a sua paciência.
        </p>
        <div class="tag is-medium tx-state-badge mt-4">
          <span class="tx-state-pulse"></span>
          Tempo estimado: aproximadamente 2 horas
        </div>
        <div class="mt-5">
          <a routerLink="/" class="button is-primary is-medium">
            <span class="icon"><span class="mdi mdi-arrow-left"></span></span>
            <span>Voltar ao início</span>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class MaintenanceComponent {}
