import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { UiService } from '../../core/services/ui.service';

/**
 * Theme-aware ng-apexcharts wrapper. Merges brand-palette + dark-mode defaults
 * with the caller's options so charts match the template.
 */
@Component({
  selector: 'app-apex-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <apx-chart
      [series]="$any(merged().series)"
      [chart]="$any(merged().chart)"
      [colors]="$any(merged().colors)"
      [grid]="$any(merged().grid)"
      [tooltip]="$any(merged().tooltip)"
      [legend]="$any(merged().legend)"
      [dataLabels]="$any(merged().dataLabels)"
      [stroke]="$any(merged().stroke)"
      [xaxis]="$any(merged().xaxis)"
      [yaxis]="$any(merged().yaxis)"
      [labels]="$any(merged().labels)"
      [fill]="$any(merged().fill)"
      [plotOptions]="$any(merged().plotOptions)"
      [responsive]="$any(merged().responsive)"
    />
  `,
})
export class ApexChartComponent {
  private ui = inject(UiService);

  readonly type = input.required<string>();
  readonly series = input.required<ApexOptions['series']>();
  readonly options = input<ApexOptions>({});
  readonly height = input<number | string>(300);

  readonly merged = computed<ApexOptions>(() => {
    const o = this.options();
    const dark = this.ui.darkMode();
    const fg = dark ? '#98a2b3' : '#667085';
    const grid = dark ? '#1f2937' : '#e4e7ec';
    return {
      series: this.series(),
      chart: {
        type: this.type() as any,
        height: this.height(),
        fontFamily: 'inherit',
        foreColor: fg,
        toolbar: { show: false },
        zoom: { enabled: false },
        ...o.chart,
      },
      colors: o.colors ?? ['#485fc7', '#48c774', '#ffdd57', '#f14668', '#3e8ed0'],
      grid: { borderColor: grid, strokeDashArray: 4, ...o.grid },
      tooltip: { theme: dark ? 'dark' : 'light', ...o.tooltip },
      legend: { labels: { colors: fg }, ...o.legend },
      dataLabels: { enabled: false, ...o.dataLabels },
      stroke: { curve: 'smooth', width: 2, ...o.stroke },
      xaxis: o.xaxis ?? {},
      yaxis: o.yaxis ?? {},
      labels: o.labels ?? [],
      fill: o.fill ?? {},
      plotOptions: o.plotOptions ?? {},
      responsive: o.responsive ?? [],
    };
  });
}
