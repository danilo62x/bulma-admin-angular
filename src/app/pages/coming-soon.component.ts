import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [NgFor, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-state-page">
      <div class="tx-state-bg">
        <span class="tx-state-blob tx-state-blob--one"></span>
        <span class="tx-state-blob tx-state-blob--two"></span>
      </div>

      <div class="tx-state-content has-text-centered">
        <span class="tx-state-icon"><span class="mdi mdi-rocket-launch mdi-48px"></span></span>
        <h1 class="title is-2 has-text-white mt-5">Em breve</h1>
        <p class="subtitle is-6 tx-state-text mt-3">
          Estamos preparando algo incrível para você. Inscreva-se abaixo e seja o primeiro a
          saber quando lançarmos.
        </p>

        <div class="columns is-mobile is-variable is-2 tx-state-countdown mt-5">
          <div *ngFor="let unit of units()" class="column">
            <div class="box tx-state-unit">
              <span class="tx-state-unit-value">{{ pad(unit.value) }}</span>
              <span class="tx-state-unit-label">{{ unit.label }}</span>
            </div>
          </div>
        </div>

        <form class="tx-state-form mt-5" (ngSubmit)="handleSubscribe()">
          <div class="field has-addons">
            <p class="control has-icons-left is-expanded">
              <input class="input is-medium" type="email" required placeholder="seu@email.com" name="email" [(ngModel)]="email" />
              <span class="icon is-small is-left"><span class="mdi mdi-email"></span></span>
            </p>
            <p class="control">
              <button type="submit" class="button is-primary is-medium">
                <span class="icon"><span class="mdi mdi-bell"></span></span>
                <span>Avise-me</span>
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ComingSoonComponent implements OnInit, OnDestroy {
  private readonly ui = inject(UiService);
  private interval?: ReturnType<typeof setInterval>;
  private readonly target = Date.now() + 30 * 24 * 60 * 60 * 1000;

  readonly timeLeft = signal<TimeLeft>(getTimeLeft(this.target));
  email = '';

  readonly units = computed(() => {
    const t = this.timeLeft();
    return [
      { label: 'Dias', value: t.days },
      { label: 'Horas', value: t.hours },
      { label: 'Minutos', value: t.minutes },
      { label: 'Segundos', value: t.seconds },
    ];
  });

  pad(v: number): string {
    return String(v).padStart(2, '0');
  }

  handleSubscribe(): void {
    this.ui.notifySuccess('Você será avisado!');
    this.email = '';
  }

  ngOnInit(): void {
    this.interval = setInterval(() => this.timeLeft.set(getTimeLeft(this.target)), 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
