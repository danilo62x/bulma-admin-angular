import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CardComponent } from '../components/ui/card.component';

interface ChartStat { key: string; label: string; value: string; trend: string; trendUp: boolean; icon: string; color: string; vals: number[]; sparkLine: string; sparkArea: string; }
interface DonutSeg { label: string; pct: number; color: string; dash: number; rot: number; }
interface TopProduct { name: string; revenue: string; units: number; pct: number; icon: string; color: string; }
interface FunnelStage { label: string; count: number; pct: number; color: string; rate: string; }

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [NgFor, NgIf, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="columns is-multiline" style="margin-bottom: 0.5rem;">
        <div *ngFor="let stat of chartStats()" class="column is-3-desktop is-6-tablet is-12-mobile">
          <div class="tx-stats-card">
            <div class="tx-stats-icon" [style.--icon-color]="stat.color">
              <span class="mdi" [class]="stat.icon"></span>
            </div>
            <div class="tx-stats-info">
              <div class="tx-stats-value">{{ stat.value }}</div>
              <div class="tx-stats-label">{{ stat.label }}</div>
              <div class="tx-stats-trend" [class]="stat.trendUp ? 'has-text-success' : 'has-text-danger'">
                <span class="mdi" [class]="stat.trendUp ? 'mdi-trending-up' : 'mdi-trending-down'"></span>
                {{ stat.trend }}
              </div>
            </div>
            <div class="tx-sparkline">
              <svg width="60" height="30" viewBox="0 0 60 30">
                <defs>
                  <linearGradient [attr.id]="'sg-' + stat.key" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" [attr.stop-color]="stat.color" stop-opacity="0.45" />
                    <stop offset="100%" [attr.stop-color]="stat.color" stop-opacity="0" />
                  </linearGradient>
                </defs>
                <path [attr.d]="stat.sparkArea" [attr.fill]="'url(#sg-' + stat.key + ')'" />
                <path [attr.d]="stat.sparkLine" fill="none" [attr.stroke]="stat.color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-8">
          <app-card title="Receita Mensal 2025" icon="mdi-chart-bar">
            <ng-template #toolbar>
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <div class="tx-legend-row">
                  <span class="tx-legend-dot" style="background:#485fc7"></span>
                  <span>R$ (mil)</span>
                </div>
              </div>
            </ng-template>
            <div class="tx-chart-wrap">
              <svg width="100%" viewBox="0 0 700 260" class="tx-chart-svg">
                <g *ngFor="let g of barChart.grid">
                  <line [attr.x1]="barChart.pl" [attr.y1]="g.y" x2="690" [attr.y2]="g.y"
                    stroke="var(--tx-border)" stroke-width="1" stroke-dasharray="4 4" />
                  <text [attr.x]="barChart.pl - 6" [attr.y]="g.y + 4" text-anchor="end"
                    font-size="9.5" fill="var(--tx-text-muted)">{{ g.label }}</text>
                </g>
                <g *ngFor="let b of barChart.bars; let i = index">
                  <rect [attr.x]="b.x" [attr.y]="b.y" [attr.width]="b.w" [attr.height]="b.h"
                    fill="#485fc7" rx="4" ry="4"
                    [attr.opacity]="barHover() === -1 || barHover() === i ? 0.85 : 0.3"
                    class="tx-bar-rect"
                    (mouseenter)="barHover.set(i)" (mouseleave)="barHover.set(-1)"
                  />
                  <text *ngIf="barHover() === i" [attr.x]="b.x + b.w / 2" [attr.y]="b.y - 6"
                    text-anchor="middle" font-size="10" font-weight="600" fill="#485fc7">{{ b.value }}k</text>
                  <text [attr.x]="b.x + b.w / 2" y="255" text-anchor="middle"
                    font-size="9" fill="var(--tx-text-muted)">{{ b.month }}</text>
                </g>
              </svg>
            </div>
          </app-card>
        </div>

        <div class="column is-4">
          <app-card title="Fontes de Tráfego" icon="mdi-chart-donut">
            <div class="tx-donut-wrap">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="65" fill="none" stroke="var(--tx-border)" stroke-width="24" />
                <circle *ngFor="let seg of donut.segments" cx="90" cy="90" r="65" fill="none"
                  [attr.stroke]="seg.color" stroke-width="24"
                  [attr.stroke-dasharray]="seg.dash + ' ' + (donut.C - seg.dash)"
                  [attr.transform]="'rotate(' + seg.rot + ', 90, 90)'"
                  stroke-linecap="butt" />
                <text x="90" y="86" text-anchor="middle" font-size="20" font-weight="700" fill="var(--tx-text-heading)">{{ donut.total }}k</text>
                <text x="90" y="103" text-anchor="middle" font-size="10" fill="var(--tx-text-muted)">Visitantes</text>
              </svg>
              <div class="tx-donut-legend">
                <div *ngFor="let seg of donut.segments" class="tx-donut-leg-item">
                  <span class="tx-legend-dot" [style.background]="seg.color"></span>
                  <span class="tx-leg-label">{{ seg.label }}</span>
                  <span class="tx-leg-val">{{ seg.pct }}%</span>
                </div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <app-card title="Usuários Ativos — Últimas 24 Semanas" icon="mdi-chart-areaspline">
        <ng-template #toolbar>
          <div class="tx-tab-switcher">
            <button *ngFor="let t of areaTabs" class="tx-tab-btn"
              [class.is-active]="areaTab() === t" (click)="areaTab.set(t)">{{ t }}</button>
          </div>
        </ng-template>
        <div class="tx-chart-wrap">
          <svg width="100%" [attr.viewBox]="'0 0 ' + area.W + ' ' + area.H" class="tx-chart-svg">
            <defs>
              <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#485fc7" stop-opacity="0.28" />
                <stop offset="100%" stop-color="#485fc7" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#48c774" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#48c774" stop-opacity="0" />
              </linearGradient>
            </defs>
            <g *ngFor="let g of area.grid">
              <line [attr.x1]="area.pl" [attr.y1]="g.y" [attr.x2]="area.W - 10" [attr.y2]="g.y"
                stroke="var(--tx-border)" stroke-width="1" stroke-dasharray="4 4" />
              <text [attr.x]="area.pl - 6" [attr.y]="g.y + 4" text-anchor="end" font-size="9" fill="var(--tx-text-muted)">{{ g.label }}</text>
            </g>
            <text *ngFor="let lbl of area.xLabels" [attr.x]="lbl.x" [attr.y]="area.H - 4" text-anchor="middle" font-size="9" fill="var(--tx-text-muted)">{{ lbl.text }}</text>
            <path [attr.d]="area.area2" fill="url(#ag2)" />
            <path [attr.d]="area.area1" fill="url(#ag1)" />
            <path [attr.d]="area.line2" fill="none" stroke="#48c774" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path [attr.d]="area.line1" fill="none" stroke="#485fc7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="tx-area-legend">
          <span class="tx-legend-dot" style="background:#485fc7"></span>
          <span style="font-size:0.8rem;color:var(--tx-text-muted);margin-right:1rem;">Novos usuários</span>
          <span class="tx-legend-dot" style="background:#48c774"></span>
          <span style="font-size:0.8rem;color:var(--tx-text-muted);">Recorrentes</span>
        </div>
      </app-card>

      <div class="columns" style="margin-top:1rem;">
        <div class="column is-7">
          <app-card title="Produtos Mais Vendidos" icon="mdi-package-variant">
            <div>
              <div *ngFor="let p of topProducts; let i = index" class="tx-top-row">
                <div class="tx-top-rank">{{ i + 1 }}</div>
                <div class="tx-top-icon" [style.background]="'color-mix(in srgb, ' + p.color + ' 13%, transparent)'" [style.color]="p.color">
                  <span class="mdi" [class]="p.icon"></span>
                </div>
                <div class="tx-top-info">
                  <div class="tx-top-name">{{ p.name }}</div>
                  <div class="tx-bar-track">
                    <div class="tx-bar-fill" [style.width]="p.pct + '%'" [style.background]="p.color"></div>
                  </div>
                </div>
                <div class="tx-top-vals">
                  <div class="tx-top-revenue">{{ p.revenue }}</div>
                  <div class="tx-top-units">{{ p.units }} un.</div>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <div class="column is-5">
          <app-card title="Funil de Conversão" icon="mdi-filter-variant">
            <div class="tx-funnel">
              <div *ngFor="let stage of funnel" class="tx-funnel-step">
                <div class="tx-funnel-header">
                  <span class="tx-funnel-label">{{ stage.label }}</span>
                  <span class="tx-funnel-count">{{ stage.count.toLocaleString('pt-BR') }}</span>
                </div>
                <div class="tx-funnel-track">
                  <div class="tx-funnel-fill" [style.width]="stage.pct + '%'" [style.background]="stage.color"></div>
                </div>
                <div *ngIf="stage.rate" class="tx-funnel-rate">↳ {{ stage.rate }} conversão</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class ChartsComponent {
  readonly barHover = signal<number>(-1);
  readonly areaTab = signal<string>('Novos');
  readonly areaTabs = ['Novos', 'Recorrentes', 'Total'];

  private spark(vals: number[]) {
    const W = 60, H = 30, p = 2;
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    const pts = vals.map((v, i) => ({
      x: p + (i / (vals.length - 1)) * (W - 2 * p),
      y: H - p - ((v - mn) / rng) * (H - 2 * p - 3),
    }));
    const line = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`).join(' ');
    return { line, area: `${line} L${W - p},${H} L${p},${H} Z` };
  }

  readonly chartStats = computed<ChartStat[]>(() => {
    const rows = [
      { key: 'rev', label: 'Receita Total', value: 'R$ 665k', trend: '+23.4% no ano', trendUp: true, icon: 'mdi-currency-brl', color: '#485fc7', vals: [42, 38, 51, 45, 67, 58, 72, 65, 78, 83, 71, 95] },
      { key: 'ord', label: 'Pedidos', value: '1.284', trend: '+8.2% no mês', trendUp: true, icon: 'mdi-cart', color: '#48c774', vals: [120, 135, 128, 142, 158, 165, 172, 168, 180, 192, 185, 198] },
      { key: 'cus', label: 'Clientes', value: '1.480', trend: '+31.2% no ano', trendUp: true, icon: 'mdi-account-group', color: '#3273dc', vals: [820, 910, 880, 950, 1020, 1150, 1230, 1290, 1310, 1380, 1420, 1480] },
      { key: 'cvr', label: 'Conversão', value: '6.2%', trend: '+0.8pp no mês', trendUp: true, icon: 'mdi-percent', color: '#f59e0b', vals: [3.2, 3.8, 3.5, 4.1, 4.4, 4.2, 4.8, 5.1, 4.9, 5.4, 5.8, 6.2] },
    ];
    return rows.map((r) => {
      const s = this.spark(r.vals);
      return { ...r, sparkLine: s.line, sparkArea: s.area };
    });
  });

  readonly barChart = (() => {
    const W = 700, H = 260, pl = 46, pr = 10, pt = 20, pb = 28;
    const cW = W - pl - pr, cH = H - pt - pb;
    const months = [
      { month: 'Jan', value: 42 }, { month: 'Fev', value: 38 }, { month: 'Mar', value: 51 },
      { month: 'Abr', value: 45 }, { month: 'Mai', value: 67 }, { month: 'Jun', value: 58 },
      { month: 'Jul', value: 72 }, { month: 'Ago', value: 65 }, { month: 'Set', value: 78 },
      { month: 'Out', value: 83 }, { month: 'Nov', value: 71 }, { month: 'Dez', value: 95 },
    ];
    const max = 100, slot = cW / months.length;
    const bw = Math.max(slot * 0.58, 18), bp = (slot - bw) / 2;
    const bars = months.map((d, i) => {
      const h = (d.value / max) * cH;
      return { x: pl + i * slot + bp, y: pt + cH - h, w: bw, h, ...d };
    });
    const gridVals = [0, 20, 40, 60, 80, 100];
    const grid = gridVals.map((v) => ({ y: pt + cH - (v / max) * cH, label: v === 0 ? '0' : `${v}k` }));
    return { pl, bars, grid };
  })();

  readonly donut = (() => {
    const r = 65, C = 2 * Math.PI * r;
    const raw = [
      { label: 'Orgânico', pct: 38, color: '#485fc7' },
      { label: 'Social', pct: 27, color: '#48c774' },
      { label: 'Direto', pct: 20, color: '#3273dc' },
      { label: 'E-mail', pct: 15, color: '#f59e0b' },
    ];
    let cum = 0;
    const segments: DonutSeg[] = raw.map((d) => {
      const dash = (d.pct / 100) * C;
      const rot = -90 + cum * 3.6;
      cum += d.pct;
      return { ...d, dash, rot };
    });
    return { segments, C, total: '24.8' };
  })();

  readonly area = (() => {
    const W = 860, H = 220, pl = 48, pr = 15, pt = 14, pb = 26;
    const cW = W - pl - pr, cH = H - pt - pb;
    const d1 = [820, 940, 880, 1020, 1150, 1080, 1230, 1180, 1350, 1290, 1420, 1380, 1510, 1460, 1620, 1580, 1740, 1690, 1820, 1760, 1950, 1880, 2040, 2120];
    const d2 = [510, 590, 540, 620, 700, 660, 730, 720, 810, 790, 850, 830, 910, 880, 960, 940, 1010, 990, 1060, 1030, 1120, 1080, 1150, 1200];
    const mx = 2200, n = d1.length;

    const pts = (data: number[]) =>
      data.map((v, i) => ({ x: pl + (i / (n - 1)) * cW, y: pt + cH - (v / mx) * cH }));

    const smooth = (p: { x: number; y: number }[], closed = false): string => {
      let d = `M${p[0].x},${p[0].y}`;
      for (let i = 0; i < p.length - 1; i++) {
        const dx = (p[i + 1].x - p[i].x) * 0.38;
        d += ` C${p[i].x + dx},${p[i].y} ${p[i + 1].x - dx},${p[i + 1].y} ${p[i + 1].x},${p[i + 1].y}`;
      }
      if (closed) d += ` L${p[p.length - 1].x},${pt + cH} L${p[0].x},${pt + cH} Z`;
      return d;
    };

    const p1 = pts(d1), p2 = pts(d2);
    const grid = [0, 500, 1000, 1500, 2000].map((v) => ({ y: pt + cH - (v / mx) * cH, label: v === 0 ? '0' : `${v / 1000}k` }));
    const xLabels = [0, 4, 8, 12, 16, 20, 23].map((i) => ({ x: pl + (i / (n - 1)) * cW, text: `S${i + 1}` }));
    return { W, H, pl, line1: smooth(p1), area1: smooth(p1, true), line2: smooth(p2), area2: smooth(p2, true), grid, xLabels };
  })();

  readonly topProducts: TopProduct[] = [
    { name: 'Monitor 27" 4K', revenue: 'R$ 147.2k', units: 67, pct: 100, icon: 'mdi-monitor', color: '#3273dc' },
    { name: 'Licença Office 365', revenue: 'R$ 121.8k', units: 445, pct: 83, icon: 'mdi-microsoft-office', color: '#e67e22' },
    { name: 'Teclado Mecânico', revenue: 'R$ 65.3k', units: 142, pct: 44, icon: 'mdi-keyboard', color: '#485fc7' },
    { name: 'Hub USB-C 7 em 1', revenue: 'R$ 58.8k', units: 327, pct: 40, icon: 'mdi-usb-port', color: '#1abc9c' },
    { name: 'SSD NVMe 1TB', revenue: 'R$ 54.2k', units: 198, pct: 37, icon: 'mdi-harddisk', color: '#f59e0b' },
  ];

  readonly funnel: FunnelStage[] = [
    { label: 'Visitantes', count: 24800, pct: 100, color: '#485fc7', rate: '' },
    { label: 'Leads', count: 8920, pct: 36, color: '#3273dc', rate: '36.0%' },
    { label: 'Prospects', count: 3140, pct: 12.7, color: '#48c774', rate: '35.2%' },
    { label: 'Oportunidades', count: 1290, pct: 5.2, color: '#f59e0b', rate: '41.1%' },
    { label: 'Clientes', count: 312, pct: 1.3, color: '#48c774', rate: '24.2%' },
  ];
}
