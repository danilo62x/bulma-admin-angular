import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ApexOptions } from 'apexcharts';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { ApexChartComponent } from '../components/ui/apex-chart.component';
import { DataTableComponent, type DataColumn } from '../components/ui/data-table.component';
import { RichTextEditorComponent } from '../components/ui/rich-text-editor.component';
import { DatePickerComponent } from '../components/ui/date-picker.component';
import { FileDropzoneComponent } from '../components/ui/file-dropzone.component';

interface UserRow {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  valor: number;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const currencyFmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function statusTagClass(status: UserRow['status']): string {
  if (status === 'Ativo') return 'tag is-success is-light';
  if (status === 'Pendente') return 'tag is-warning is-light';
  return 'tag is-danger is-light';
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CardComponent,
    ApexChartComponent,
    DataTableComponent,
    RichTextEditorComponent,
    DatePickerComponent,
    FileDropzoneComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="integrations">
      <div class="tx-section-head">
        <h2 class="title is-5" style="margin: 0;">Gráficos</h2>
        <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>ApexCharts</span></span>
        <p class="tx-section-desc">Gráficos interativos e responsivos com tema claro/escuro automático.</p>
      </div>

      <app-card title="Receita x Despesas" icon="mdi-chart-areaspline">
        <app-apex-chart type="area" [series]="areaSeries" [options]="areaOptions" [height]="320"></app-apex-chart>
      </app-card>

      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-7">
          <app-card title="Vendas por produto" icon="mdi-chart-bar">
            <app-apex-chart type="bar" [series]="barSeries" [options]="barOptions" [height]="300"></app-apex-chart>
          </app-card>
        </div>
        <div class="column is-5">
          <app-card title="Fontes de tráfego" icon="mdi-chart-donut">
            <app-apex-chart type="donut" [series]="donutSeries" [options]="donutOptions" [height]="300"></app-apex-chart>
          </app-card>
        </div>
      </div>

      <div class="tx-section-head" style="margin-top: 2rem;">
        <h2 class="title is-5" style="margin: 0;">Tabela de dados</h2>
        <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>TanStack Table</span></span>
        <p class="tx-section-desc">Ordenação, busca global e paginação no cliente.</p>
      </div>

      <app-card title="Usuários" icon="mdi-account-group">
        <app-data-table [columns]="userColumns" [data]="users" [pageSize]="5" [searchable]="true"></app-data-table>
      </app-card>

      <div class="columns" style="margin-top: 2rem;">
        <div class="column is-6">
          <div class="tx-section-head">
            <h2 class="title is-5" style="margin: 0;">Formulário validado</h2>
            <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>Angular Forms</span></span>
          </div>
          <app-card title="Cadastro" icon="mdi-form-select">
            <form (ngSubmit)="onSubmit()">
              <div class="field">
                <label class="label">Nome completo</label>
                <div class="control has-icons-left">
                  <input class="input" [class.is-danger]="errors().nome" type="text" name="nome" placeholder="Seu nome" [(ngModel)]="form.nome" />
                  <span class="icon is-left"><i class="mdi mdi-account"></i></span>
                </div>
                <p *ngIf="errors().nome" class="help is-danger">{{ errors().nome }}</p>
              </div>
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control has-icons-left">
                  <input class="input" [class.is-danger]="errors().email" type="email" name="email" placeholder="voce@empresa.com" [(ngModel)]="form.email" />
                  <span class="icon is-left"><i class="mdi mdi-email"></i></span>
                </div>
                <p *ngIf="errors().email" class="help is-danger">{{ errors().email }}</p>
              </div>
              <div class="field">
                <label class="label">Plano</label>
                <div class="control">
                  <span class="select is-fullwidth">
                    <select name="plano" [(ngModel)]="form.plano">
                      <option value="">Selecione...</option>
                      <option value="start">Start</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </span>
                </div>
                <p *ngIf="errors().plano" class="help is-danger">{{ errors().plano }}</p>
              </div>
              <div class="field">
                <label class="checkbox">
                  <input type="checkbox" name="termos" [(ngModel)]="form.termos" />
                  Aceito os termos de uso
                </label>
                <p *ngIf="errors().termos" class="help is-danger">{{ errors().termos }}</p>
              </div>
              <button type="submit" class="button is-primary" style="margin-top: 0.5rem;">
                <span class="icon"><i class="mdi mdi-check"></i></span><span>Enviar</span>
              </button>
            </form>
          </app-card>
        </div>

        <div class="column is-6">
          <div class="tx-section-head">
            <h2 class="title is-5" style="margin: 0;">Editor de texto rico</h2>
            <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>Quill</span></span>
          </div>
          <app-card title="Conteúdo" icon="mdi-format-text">
            <app-rich-text-editor [(ngModel)]="content" placeholder="Comece a escrever o seu conteúdo aqui..."></app-rich-text-editor>
          </app-card>
        </div>
      </div>

      <div class="columns" style="margin-top: 2rem;">
        <div class="column is-6">
          <div class="tx-section-head">
            <h2 class="title is-5" style="margin: 0;">Seletor de data</h2>
            <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>flatpickr</span></span>
          </div>
          <app-card title="Datas" icon="mdi-calendar">
            <app-date-picker label="Data" placeholder="Selecione a data"></app-date-picker>
            <app-date-picker label="Data e hora" [showTime]="true" placeholder="Selecione data e hora"></app-date-picker>
          </app-card>
        </div>

        <div class="column is-6">
          <div class="tx-section-head">
            <h2 class="title is-5" style="margin: 0;">Upload de arquivos</h2>
            <span class="tag is-primary is-light"><span class="icon is-small"><i class="mdi mdi-flash"></i></span><span>Dropzone</span></span>
          </div>
          <app-card title="Enviar arquivos" icon="mdi-cloud-upload">
            <app-file-dropzone [maxFiles]="5" accept="image/*,application/pdf" (filesChange)="onFiles($event)"></app-file-dropzone>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .tx-section-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
      .tx-section-desc { font-size: 0.875rem; color: var(--tx-text-muted); margin: 0; }
    `,
  ],
})
export class IntegrationsComponent {
  private readonly ui = inject(UiService);

  readonly areaSeries: ApexOptions['series'] = [
    { name: 'Receita', data: [31, 40, 28, 51, 42, 62, 58, 70, 65, 82, 78, 95] },
    { name: 'Despesas', data: [22, 28, 25, 33, 30, 38, 36, 44, 41, 50, 47, 55] },
  ];
  readonly areaOptions: ApexOptions = {
    chart: { type: 'area' },
    xaxis: { categories: MONTHS },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
    legend: { show: true, position: 'top' },
  };

  readonly barSeries: ApexOptions['series'] = [{ name: 'Vendas', data: [44, 55, 41, 67, 22, 43, 36, 52] }];
  readonly barOptions: ApexOptions = {
    chart: { type: 'bar' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    xaxis: { categories: ['Pro', 'Start', 'Storage', 'Ent.', 'Treino', 'API', 'SMS', 'Extra'] },
  };

  readonly donutSeries: ApexOptions['series'] = [42, 24, 18, 10, 6];
  readonly donutOptions: ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Google', 'Direto', 'Social', 'Email', 'Outros'],
    legend: { show: true, position: 'bottom' },
    plotOptions: { pie: { donut: { size: '65%' } } },
  };

  readonly users: UserRow[] = [
    { id: 1, nome: 'Marina Costa', email: 'marina@empresa.com', funcao: 'Administradora', status: 'Ativo', valor: 1299.9 },
    { id: 2, nome: 'Lucas Pereira', email: 'lucas@empresa.com', funcao: 'Editor', status: 'Pendente', valor: 349.5 },
    { id: 3, nome: 'Aline Souza', email: 'aline@empresa.com', funcao: 'Visualizador', status: 'Ativo', valor: 89.0 },
    { id: 4, nome: 'Rafael Lima', email: 'rafael@empresa.com', funcao: 'Editor', status: 'Inativo', valor: 0 },
    { id: 5, nome: 'Bianca Rocha', email: 'bianca@empresa.com', funcao: 'Administradora', status: 'Ativo', valor: 2499.0 },
    { id: 6, nome: 'Diego Martins', email: 'diego@empresa.com', funcao: 'Visualizador', status: 'Pendente', valor: 159.9 },
  ];

  readonly userColumns: DataColumn<UserRow>[] = [
    { key: 'nome', header: 'Nome', html: (row) => `<span class="has-text-weight-medium">${row.nome}</span>` },
    { key: 'email', header: 'E-mail' },
    { key: 'funcao', header: 'Função' },
    { key: 'status', header: 'Status', html: (row) => `<span class="${statusTagClass(row.status)}">${row.status}</span>` },
    { key: 'valor', header: 'Valor', format: (v) => currencyFmt.format(v as number) },
  ];

  form = { nome: '', email: '', plano: '', termos: false };
  readonly errors = signal<{ nome: string; email: string; plano: string; termos: string }>({ nome: '', email: '', plano: '', termos: '' });
  content = '<p>Edite este <strong>conteúdo</strong> com a barra de ferramentas acima.</p>';

  onSubmit(): void {
    const e = { nome: '', email: '', plano: '', termos: '' };
    if (this.form.nome.trim().length < 3) e.nome = 'Mínimo de 3 caracteres';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.form.email)) e.email = 'E-mail inválido';
    if (!this.form.plano) e.plano = 'Selecione um plano';
    if (!this.form.termos) e.termos = 'É preciso aceitar os termos';
    this.errors.set(e);
    if (e.nome || e.email || e.plano || e.termos) return;
    this.ui.notifySuccess(`Formulário enviado com sucesso para ${this.form.nome}!`);
    this.form = { nome: '', email: '', plano: '', termos: false };
  }

  onFiles(files: File[]): void {
    if (files.length) this.ui.notifySuccess(`${files.length} arquivo(s) selecionado(s).`);
  }
}
