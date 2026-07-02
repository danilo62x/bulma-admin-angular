import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { AuthService } from '../core/services/auth.service';
import { CardComponent } from '../components/ui/card.component';
import { ProgressComponent } from '../components/ui/progress.component';

interface ProfileStat { label: string; value: string; trend: string; up: boolean; }
interface ContactInfo { value: string; icon: string; }
interface Skill { name: string; pct: number; type: 'is-primary' | 'is-info' | 'is-success' | 'is-warning'; }
interface TimelineEvent { title: string; desc?: string; time: string; icon: string; color: string; }
interface TeamMember { initials: string; color: string; }
interface Project { name: string; desc: string; pct: number; status: string; statusClass: string; icon: string; color: string; team: TeamMember[]; }

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CardComponent, ProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="tx-profile-hero">
        <div class="tx-profile-cover"></div>
        <div class="tx-profile-identity">
          <div class="tx-avatar-lg">
            <span>{{ initial() }}</span>
            <button class="tx-avatar-edit" (click)="ui.notify('Upload de foto', 'is-info')">
              <span class="mdi mdi-camera"></span>
            </button>
          </div>
          <div class="tx-profile-meta">
            <h2 class="tx-profile-name">{{ auth.user()?.name ?? 'Administrador' }}</h2>
            <p class="tx-profile-role">
              <span class="tag is-primary is-light">Administrador</span>
            </p>
            <p class="tx-profile-since">Membro desde Janeiro de 2024</p>
          </div>
          <div class="tx-profile-actions">
            <button class="button is-primary" (click)="editing.set(!editing())">
              <span class="mdi mdi-pencil" style="margin-right: 0.25rem;"></span>
              {{ editing() ? 'Cancelar' : 'Editar Perfil' }}
            </button>
            <button class="button is-light" (click)="ui.notifySuccess('Link copiado!')">
              <span class="mdi mdi-share-variant" style="margin-right: 0.25rem;"></span>
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      <div class="columns is-multiline tx-profile-stats">
        <div *ngFor="let s of profileStats" class="column is-3-desktop is-6-tablet">
          <div class="tx-pstat">
            <div class="tx-pstat-val">{{ s.value }}</div>
            <div class="tx-pstat-label">{{ s.label }}</div>
            <div class="tx-pstat-trend" [class]="s.up ? 'has-text-success' : 'has-text-warning'">
              <span class="mdi" [class]="s.up ? 'mdi-arrow-up-thin' : 'mdi-arrow-down-thin'"></span>{{ s.trend }}
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-4">
          <app-card title="Sobre" icon="mdi-account-circle">
            <ng-container *ngIf="!editing(); else editingTpl">
              <p style="font-size:0.875rem;color:var(--tx-text-muted);line-height:1.65;">
                Administrador sênior com foco em operações, relatórios e gestão de equipes. Mais de 8 anos de experiência em sistemas de gestão empresarial.
              </p>
              <div class="tx-info-list">
                <div *ngFor="let info of contactInfo" class="tx-info-row">
                  <span class="mdi tx-info-icon" [class]="info.icon"></span>
                  <span>{{ info.value }}</span>
                </div>
              </div>
            </ng-container>
            <ng-template #editingTpl>
              <div class="field">
                <label class="label">Nome completo</label>
                <div class="control has-icons-left">
                  <input class="input" [(ngModel)]="editForm.name" name="name" />
                  <span class="icon is-small is-left"><i class="mdi mdi-account"></i></span>
                </div>
              </div>
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control has-icons-left">
                  <input class="input" type="email" [(ngModel)]="editForm.email" name="email" />
                  <span class="icon is-small is-left"><i class="mdi mdi-email"></i></span>
                </div>
              </div>
              <div class="field">
                <label class="label">Telefone</label>
                <div class="control has-icons-left">
                  <input class="input" [(ngModel)]="editForm.phone" name="phone" />
                  <span class="icon is-small is-left"><i class="mdi mdi-phone"></i></span>
                </div>
              </div>
              <div class="field">
                <label class="label">Departamento</label>
                <div class="select is-fullwidth">
                  <select [(ngModel)]="editForm.dept" name="dept">
                    <option>Tecnologia</option>
                    <option>Comercial</option>
                    <option>Operações</option>
                    <option>Financeiro</option>
                  </select>
                </div>
              </div>
              <div class="field">
                <label class="label">Bio</label>
                <textarea class="textarea" rows="3" maxlength="240" [(ngModel)]="editForm.bio" name="bio"></textarea>
              </div>
              <div class="tx-form-actions">
                <button class="button is-primary" (click)="saveProfile()">
                  <span class="mdi mdi-content-save" style="margin-right: 0.25rem;"></span>
                  Salvar
                </button>
                <button class="button is-light" (click)="editing.set(false)">Cancelar</button>
              </div>
            </ng-template>
          </app-card>

          <app-card title="Habilidades" icon="mdi-star-outline" style="margin-top:1rem; display: block;">
            <div class="tx-skills">
              <div *ngFor="let skill of skills" class="tx-skill-row">
                <div class="tx-skill-header">
                  <span class="tx-skill-name">{{ skill.name }}</span>
                  <span class="tx-skill-pct">{{ skill.pct }}%</span>
                </div>
                <app-progress [value]="skill.pct" [type]="skill.type" size="is-small"></app-progress>
              </div>
            </div>
          </app-card>

          <app-card title="Interesses" icon="mdi-tag-multiple" style="margin-top:1rem; display: block;">
            <div class="tx-tags-showcase">
              <span *ngFor="let tag of interests" class="tag is-primary is-light">{{ tag }}</span>
            </div>
          </app-card>
        </div>

        <div class="column is-8">
          <app-card title="Atividade Recente" icon="mdi-history">
            <ng-template #toolbar>
              <button class="button is-small is-ghost" (click)="ui.notify('Atualizado!', 'is-info')">
                <span class="mdi mdi-refresh" style="margin-right: 0.25rem;"></span>
                Atualizar
              </button>
            </ng-template>
            <div class="tx-timeline">
              <div *ngFor="let evt of timeline" class="tx-tl-item">
                <div class="tx-tl-line"></div>
                <div class="tx-tl-dot" [style.background]="evt.color">
                  <span class="mdi" [class]="evt.icon"></span>
                </div>
                <div class="tx-tl-content">
                  <div class="tx-tl-title">{{ evt.title }}</div>
                  <div class="tx-tl-desc" *ngIf="evt.desc">{{ evt.desc }}</div>
                  <div class="tx-tl-time">{{ evt.time }}</div>
                </div>
              </div>
            </div>
          </app-card>

          <app-card title="Projetos Recentes" icon="mdi-folder-multiple" style="margin-top:1rem; display: block;">
            <div class="columns is-multiline">
              <div *ngFor="let proj of projects" class="column is-6">
                <div class="tx-project-card">
                  <div class="tx-project-header">
                    <div class="tx-project-icon" [style.background]="'color-mix(in srgb, ' + proj.color + ' 15%, transparent)'" [style.color]="proj.color">
                      <span class="mdi" [class]="proj.icon"></span>
                    </div>
                    <span class="tag is-small" [class]="proj.statusClass">{{ proj.status }}</span>
                  </div>
                  <div class="tx-project-name">{{ proj.name }}</div>
                  <div class="tx-project-desc">{{ proj.desc }}</div>
                  <div class="tx-project-footer">
                    <div class="tx-project-progress">
                      <app-progress [value]="proj.pct" [type]="proj.color === '#48c774' ? 'is-success' : 'is-primary'" size="is-small"></app-progress>
                      <span class="tx-project-pct">{{ proj.pct }}%</span>
                    </div>
                    <div class="tx-project-team">
                      <div
                        *ngFor="let member of proj.team; let mi = index"
                        class="tx-team-avatar"
                        [style.background]="member.color"
                        [style.margin-left]="mi > 0 ? '-6px' : '0'"
                        [style.z-index]="proj.team.length - mi"
                      >
                        {{ member.initials }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  readonly ui = inject(UiService);
  readonly auth = inject(AuthService);

  readonly editing = signal<boolean>(false);

  readonly initial = computed(() => this.auth.user()?.name?.[0] ?? 'A');

  editForm = {
    name: this.auth.user()?.name ?? 'Administrador',
    email: this.auth.user()?.email ?? 'admin@empresa.com',
    phone: '(11) 99999-9999',
    dept: 'Tecnologia',
    bio: 'Administrador sênior focado em operações e gestão.',
  };

  saveProfile(): void {
    this.editing.set(false);
    this.ui.notifySuccess('Perfil atualizado com sucesso!');
  }

  readonly profileStats: ProfileStat[] = [
    { label: 'Tarefas concluídas', value: '248', trend: '+12 este mês', up: true },
    { label: 'Relatórios emitidos', value: '64', trend: '+5 este mês', up: true },
    { label: 'Projetos ativos', value: '7', trend: '+2 novos', up: true },
    { label: 'Avaliação da equipe', value: '4.8★', trend: '+0.2 no trimestre', up: true },
  ];

  readonly contactInfo: ContactInfo[] = [
    { value: 'admin@empresa.com', icon: 'mdi-email-outline' },
    { value: '(11) 99999-9999', icon: 'mdi-phone-outline' },
    { value: 'São Paulo, SP', icon: 'mdi-map-marker-outline' },
    { value: 'Tecnologia', icon: 'mdi-domain' },
    { value: 'Administrador Sênior', icon: 'mdi-badge-account' },
  ];

  readonly skills: Skill[] = [
    { name: 'Gestão de Projetos', pct: 92, type: 'is-primary' },
    { name: 'Análise de Dados', pct: 85, type: 'is-info' },
    { name: 'Liderança de Equipe', pct: 88, type: 'is-success' },
    { name: 'Desenvolvimento Angular', pct: 78, type: 'is-warning' },
    { name: 'Comunicação', pct: 95, type: 'is-primary' },
  ];

  readonly interests = ['Angular', 'TypeScript', 'Bulma', 'UX Design', 'Analytics', 'Agile', 'Node.js', 'Docker'];

  readonly timeline: TimelineEvent[] = [
    { title: 'Relatório mensal publicado', desc: 'Análise de KPIs de Abril 2025 disponível no painel.', time: 'Há 2 horas', icon: 'mdi-file-chart', color: '#485fc7' },
    { title: 'Novo membro adicionado à equipe', desc: 'Fernanda Ramos entrou no projeto Alpha.', time: 'Há 5 horas', icon: 'mdi-account-plus', color: '#48c774' },
    { title: 'Meta de vendas atingida', desc: 'Superamos a meta de R$ 50k em Abril.', time: 'Ontem', icon: 'mdi-trophy', color: '#f59e0b' },
    { title: 'Atualização de sistema aplicada', desc: 'Versão 2.4.1 implantada em produção.', time: '2 dias atrás', icon: 'mdi-update', color: '#3273dc' },
    { title: 'Reunião com stakeholders', desc: 'Apresentação do roadmap Q2 aprovada.', time: '3 dias atrás', icon: 'mdi-presentation', color: '#9b59b6' },
    { title: 'Backup automático concluído', desc: 'Snapshot de banco de dados salvo com sucesso.', time: '1 semana atrás', icon: 'mdi-database-check', color: '#1abc9c' },
  ];

  readonly projects: Project[] = [
    { name: 'Dashboard Analytics', desc: 'Painel de BI com métricas em tempo real.', pct: 78, status: 'Ativo', statusClass: 'is-primary is-light', icon: 'mdi-chart-line', color: '#485fc7',
      team: [{ initials: 'J', color: '#485fc7' }, { initials: 'M', color: '#48c774' }, { initials: 'C', color: '#f59e0b' }] },
    { name: 'App Mobile', desc: 'Aplicativo React Native para gestão em campo.', pct: 42, status: 'Em andamento', statusClass: 'is-warning is-light', icon: 'mdi-cellphone', color: '#f59e0b',
      team: [{ initials: 'A', color: '#3273dc' }, { initials: 'R', color: '#9b59b6' }] },
    { name: 'Portal do Cliente', desc: 'Self-service para clientes visualizarem pedidos.', pct: 95, status: 'Revisão', statusClass: 'is-info is-light', icon: 'mdi-web', color: '#3273dc',
      team: [{ initials: 'F', color: '#1abc9c' }, { initials: 'T', color: '#e67e22' }, { initials: 'B', color: '#485fc7' }] },
    { name: 'Migração de Dados', desc: 'Migração do legado para novo banco PostgreSQL.', pct: 60, status: 'Ativo', statusClass: 'is-success is-light', icon: 'mdi-database-arrow-right', color: '#48c774',
      team: [{ initials: 'D', color: '#f14668' }, { initials: 'L', color: '#485fc7' }] },
  ];
}
