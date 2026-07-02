import { ChangeDetectionStrategy, Component, Input, computed, input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-stats-card">
      <div class="tx-stats-icon" [style.--icon-color]="iconColor()">
        <span class="mdi" [class]="icon()"></span>
      </div>
      <div class="tx-stats-info">
        <div class="tx-stats-value">{{ value() }}</div>
        <div class="tx-stats-label">{{ label() }}</div>
        <div *ngIf="trend()" class="tx-stats-trend" [style.color]="trendColor()">
          <span class="mdi" [class]="trendIcon()" style="font-size: 0.85rem;"></span>
          {{ trend() }}
        </div>
      </div>
    </div>
  `,
})
export class StatsCardComponent {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly color = input<string | undefined>(undefined);
  readonly trend = input<string | undefined>(undefined);
  readonly trendUp = input<boolean | undefined>(undefined);

  readonly iconColor = computed(() => this.color() ?? '#485fc7');

  readonly trendColor = computed(() => {
    const up = this.trendUp();
    if (up === undefined) return 'var(--tx-text-muted)';
    return up ? 'var(--tx-success)' : 'var(--tx-danger)';
  });

  readonly trendIcon = computed(() => {
    const up = this.trendUp();
    if (up === undefined) return 'mdi-minus';
    return up ? 'mdi-trending-up' : 'mdi-trending-down';
  });
}
