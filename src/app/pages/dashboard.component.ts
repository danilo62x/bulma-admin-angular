import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { StatsCardComponent } from '../components/ui/stats-card.component';
import { ProgressComponent } from '../components/ui/progress.component';

interface Stat { value: string; label: string; icon: string; color: string; trend: string; trendUp: boolean; }
interface Activity { id: number; title: string; user: string; time: string; icon: string; color: string; type: string; }
interface Goal { label: string; value: number; type: 'is-primary' | 'is-success' | 'is-info' | 'is-warning' | 'is-danger'; }
interface QuickAction { label: string; icon: string; color: string; }
interface Order { id: number; customer: string; product: string; value: number; status: string; date: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, RouterLink, CardComponent, StatsCardComponent, ProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="columns is-multiline" style="margin-bottom: 0.5rem;">
        <div *ngFor="let stat of stats" class="column is-3-desktop is-6-tablet is-12-mobile">
          <app-stats-card
            [value]="stat.value"
            [label]="stat.label"
            [icon]="stat.icon"
            [color]="stat.color"
            [trend]="stat.trend"
            [trendUp]="stat.trendUp"
          ></app-stats-card>
        </div>
      </div>

      <div class="columns">
        <div class="column is-7">
          <app-card title="Atividades Recentes" icon="mdi-history">
            <ng-template #toolbar>
              <button class="button is-small is-ghost">
                <span class="mdi mdi-refresh" style="margin-right: 0.25rem;"></span>
                Atualizar
              </button>
            </ng-template>
            <div>
              <div *ngFor="let activity of recentActivities" class="tx-activity-item">
                <div class="tx-activity-icon" [style.--icon-color]="activity.color">
                  <span class="mdi" [class]="activity.icon"></span>
                </div>
                <div class="tx-activity-content">
                  <div class="tx-activity-title">{{ activity.title }}</div>
                  <div class="tx-activity-meta">{{ activity.user }} · {{ activity.time }}</div>
                </div>
                <span class="tx-activity-tag" [style.--tag-color]="activity.color">
                  {{ activity.type }}
                </span>
              </div>
            </div>
          </app-card>
        </div>

        <div class="column is-5">
          <app-card title="Metas do Mês" icon="mdi-target">
            <div>
              <div *ngFor="let goal of goals" class="tx-goal-item">
                <div class="tx-goal-row">
                  <span class="tx-goal-label">{{ goal.label }}</span>
                  <span class="tx-goal-value">{{ goal.value }}%</span>
                </div>
                <app-progress [value]="goal.value" [type]="goal.type" size="is-small"></app-progress>
              </div>
            </div>
          </app-card>

          <app-card title="Ações Rápidas" icon="mdi-lightning-bolt" style="margin-top: 1rem; display: block;">
            <div class="tx-quick-actions-grid">
              <button
                *ngFor="let action of quickActions"
                class="tx-quick-action"
                [style.--action-color]="action.color"
                (click)="ui.notify(action.label + ' clicado!', 'is-info')"
              >
                <span class="mdi tx-quick-action-icon" [class]="action.icon"></span>
                <span class="tx-quick-action-label">{{ action.label }}</span>
              </button>
            </div>
          </app-card>
        </div>
      </div>

      <app-card title="Últimos Pedidos" icon="mdi-cart">
        <ng-template #toolbar>
          <a routerLink="/tables">
            <button class="button is-small is-primary is-outlined">Ver todos</button>
          </a>
        </ng-template>
        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td><strong>#{{ order.id }}</strong></td>
                <td>{{ order.customer }}</td>
                <td>{{ order.product }}</td>
                <td>R$ {{ order.value.toFixed(2) }}</td>
                <td><span class="tag" [class]="statusClass(order.status)">{{ order.status }}</span></td>
                <td>{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `,
})
export class DashboardComponent {
  readonly ui = inject(UiService);

  readonly stats: Stat[] = [
    { value: '2.841', label: 'Usuários', icon: 'mdi-account-group', color: '#485fc7', trend: '+12% este mês', trendUp: true },
    { value: '184', label: 'Pedidos', icon: 'mdi-cart', color: '#48c774', trend: '+5% este mês', trendUp: true },
    { value: 'R$ 48.2k', label: 'Receita', icon: 'mdi-currency-brl', color: '#3273dc', trend: '+18% este mês', trendUp: true },
    { value: '23', label: 'Pendentes', icon: 'mdi-clock-alert', color: '#f59e0b', trend: '-3 hoje', trendUp: false },
  ];

  readonly recentActivities: Activity[] = [
    { id: 1, title: 'Novo pedido realizado', user: 'João Silva', time: '2 min', icon: 'mdi-cart-plus', color: '#48c774', type: 'Pedido' },
    { id: 2, title: 'Usuário cadastrado', user: 'Maria Santos', time: '15 min', icon: 'mdi-account-plus', color: '#3273dc', type: 'Usuário' },
    { id: 3, title: 'Pagamento aprovado', user: 'Sistema', time: '1h', icon: 'mdi-check-circle', color: '#48c774', type: 'Pagamento' },
    { id: 4, title: 'Relatório exportado', user: 'Carlos Lima', time: '2h', icon: 'mdi-file-export', color: '#485fc7', type: 'Relatório' },
    { id: 5, title: 'Estoque atualizado', user: 'Ana Costa', time: '3h', icon: 'mdi-package-variant', color: '#f59e0b', type: 'Estoque' },
  ];

  readonly goals: Goal[] = [
    { label: 'Vendas mensais', value: 72, type: 'is-success' },
    { label: 'Novos clientes', value: 58, type: 'is-info' },
    { label: 'Satisfação', value: 91, type: 'is-primary' },
    { label: 'Metas de equipe', value: 44, type: 'is-warning' },
  ];

  readonly quickActions: QuickAction[] = [
    { label: 'Novo Pedido', icon: 'mdi-plus-circle', color: '#485fc7' },
    { label: 'Relatório', icon: 'mdi-file-chart', color: '#3273dc' },
    { label: 'Usuários', icon: 'mdi-account-group', color: '#48c774' },
    { label: 'Configurar', icon: 'mdi-cog', color: '#f59e0b' },
  ];

  readonly recentOrders: Order[] = [
    { id: 1001, customer: 'João Silva', product: 'Plano Pro', value: 299.90, status: 'Aprovado', date: '25/05/2026' },
    { id: 1002, customer: 'Maria Santos', product: 'Plano Basic', value: 99.90, status: 'Pendente', date: '25/05/2026' },
    { id: 1003, customer: 'Carlos Lima', product: 'Plano Enterprise', value: 899.90, status: 'Aprovado', date: '24/05/2026' },
    { id: 1004, customer: 'Ana Costa', product: 'Plano Pro', value: 299.90, status: 'Cancelado', date: '24/05/2026' },
    { id: 1005, customer: 'Pedro Oliveira', product: 'Plano Basic', value: 99.90, status: 'Aprovado', date: '23/05/2026' },
  ];

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Aprovado': 'is-success is-light',
      'Pendente': 'is-warning is-light',
      'Cancelado': 'is-danger is-light',
    };
    return map[status] ?? 'is-light';
  }
}
