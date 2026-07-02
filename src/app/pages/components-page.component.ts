import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiService } from '../core/services/ui.service';
import { CardComponent } from '../components/ui/card.component';
import { ProgressComponent } from '../components/ui/progress.component';
import { ModalComponent } from '../components/ui/modal.component';
import { TooltipDirective } from '../components/ui/tooltip.directive';

interface ProgressBar { label: string; value: number; type: 'is-primary' | 'is-success' | 'is-info' | 'is-warning' | 'is-danger'; }
interface CarouselSlide { id: number; title: string; desc: string; icon: string; color: string; }
interface CollapsePanel { title: string; icon: string; content: string; }

@Component({
  selector: 'app-components-page',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CardComponent, ProgressComponent, ModalComponent, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <!-- Notifications & Toasts -->
      <app-card title="Notificações & Toasts" icon="mdi-bell">
        <div class="tx-btn-group">
          <button class="button is-success" (click)="ui.notifySuccess('Operação realizada com sucesso!')">
            <span class="mdi mdi-check-circle" style="margin-right:0.25rem;"></span>Sucesso
          </button>
          <button class="button is-danger" (click)="ui.notifyError('Ocorreu um erro. Tente novamente.')">
            <span class="mdi mdi-close-circle" style="margin-right:0.25rem;"></span>Erro
          </button>
          <button class="button is-warning" (click)="ui.notifyWarning('Atenção: verifique os dados.')">
            <span class="mdi mdi-alert" style="margin-right:0.25rem;"></span>Aviso
          </button>
          <button class="button is-info" (click)="ui.notify('Informação importante.', 'is-info')">
            <span class="mdi mdi-information" style="margin-right:0.25rem;"></span>Info
          </button>
        </div>
      </app-card>

      <!-- Modals -->
      <app-card title="Modais" icon="mdi-window-restore" style="margin-top: 1rem; display: block;">
        <div class="tx-btn-group">
          <button class="button is-primary" (click)="showModal.set(true)">Abrir Modal</button>
          <button class="button is-warning" (click)="showConfirm.set(true)">Confirmar Ação</button>
        </div>

        <app-modal [open]="showModal()" (openChange)="showModal.set($event)" width="500px">
          <header class="modal-card-head">
            <p class="modal-card-title">Exemplo de Modal</p>
            <button class="delete" (click)="showModal.set(false)"></button>
          </header>
          <section class="modal-card-body">
            <div class="field">
              <label class="label">Campo de exemplo</label>
              <div class="control"><input class="input" [(ngModel)]="modalInput" name="modalInput" placeholder="Digite algo..." /></div>
            </div>
            <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--tx-text-muted);">
              Exemplo de modal usando <code>app-modal</code>.
            </p>
          </section>
          <footer class="modal-card-foot tx-modal-foot">
            <button class="button" (click)="showModal.set(false)">Cancelar</button>
            <button class="button is-primary" (click)="handleModalSave()">Salvar</button>
          </footer>
        </app-modal>

        <app-modal [open]="showConfirm()" (openChange)="showConfirm.set($event)" width="400px">
          <header class="modal-card-head">
            <p class="modal-card-title">Confirmar ação</p>
          </header>
          <section class="modal-card-body">
            <p style="font-size: 0.875rem;">Você tem certeza que deseja executar esta ação? Ela não pode ser desfeita.</p>
          </section>
          <footer class="modal-card-foot tx-modal-foot">
            <button class="button" (click)="showConfirm.set(false)">Cancelar</button>
            <button class="button is-danger" (click)="handleConfirm()">
              <span class="mdi mdi-alert" style="margin-right:0.25rem;"></span>
              Confirmar
            </button>
          </footer>
        </app-modal>
      </app-card>

      <!-- Cards -->
      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-4">
          <app-card title="Card Simples" icon="mdi-card-outline">
            <p style="font-size: 0.875rem; color: var(--tx-text-muted);">
              Card básico com título, ícone e conteúdo. Use slots para personalizar cabeçalho, corpo e rodapé.
            </p>
          </app-card>
        </div>
        <div class="column is-4">
          <app-card title="Card com Footer" icon="mdi-card-text">
            <p style="font-size: 0.875rem; color: var(--tx-text-muted);">
              Este card tem um slot <code>#footer</code> com botões de ação.
            </p>
            <ng-template #footer>
              <div class="tx-card-footer-actions">
                <button class="button is-small is-primary">Ação primária</button>
                <button class="button is-small is-light">Cancelar</button>
              </div>
            </ng-template>
          </app-card>
        </div>
        <div class="column is-4">
          <app-card title="Card com Toolbar" icon="mdi-card-bulleted">
            <ng-template #toolbar>
              <div class="tx-dropdown is-left" [class.is-active]="cardDropdown()" (click)="$event.stopPropagation()">
                <button class="button is-small is-ghost" (click)="cardDropdown.set(!cardDropdown())">
                  <span class="mdi mdi-dots-vertical"></span>
                </button>
                <div class="tx-dropdown-menu">
                  <a class="dropdown-item">Editar</a>
                  <a class="dropdown-item">Duplicar</a>
                  <a class="dropdown-item has-text-danger">Excluir</a>
                </div>
              </div>
            </ng-template>
            <p style="font-size: 0.875rem; color: var(--tx-text-muted);">
              Card com slot <code>#toolbar</code> — dropdown de ações no cabeçalho.
            </p>
          </app-card>
        </div>
      </div>

      <!-- Tags & Badges -->
      <app-card title="Tags & Badges" icon="mdi-tag" style="margin-top: 1rem; display: block;">
        <div class="tx-tags-showcase">
          <span class="tag is-primary">Primary</span>
          <span class="tag is-success">Sucesso</span>
          <span class="tag is-warning">Aviso</span>
          <span class="tag is-danger">Erro</span>
          <span class="tag is-info">Info</span>
          <span class="tag is-dark">Dark</span>
          <span class="tag is-light">Light</span>
          <span class="tag is-primary is-light">Primary light</span>
          <span class="tag is-success is-light">Success light</span>
          <span class="tag is-danger is-light">Danger light</span>
          <span class="tag is-rounded is-primary">Rounded</span>
          <span class="tag is-medium is-info">Medium</span>
          <span class="tag is-large is-warning">Large</span>
        </div>
      </app-card>

      <!-- Progress -->
      <app-card title="Barras de Progresso" icon="mdi-chart-bar" style="margin-top: 1rem; display: block;">
        <div class="tx-progress-list">
          <div *ngFor="let bar of progressBars">
            <div class="tx-progress-row">
              <span>{{ bar.label }}</span>
              <span>{{ bar.value }}%</span>
            </div>
            <app-progress [value]="bar.value" [type]="bar.type"></app-progress>
          </div>
          <div>
            <div class="tx-progress-row">
              <span>Indeterminado</span>
              <span class="tag is-light is-small">Carregando</span>
            </div>
            <app-progress type="is-primary"></app-progress>
          </div>
        </div>
      </app-card>

      <!-- Tooltips & Dropdown -->
      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-6">
          <app-card title="Tooltips" icon="mdi-tooltip">
            <div class="tx-btn-group">
              <button class="button is-light" appTooltip="Tooltip padrão" tooltipType="is-dark">Dark</button>
              <button class="button is-success is-outlined" appTooltip="Tooltip de sucesso" tooltipType="is-success" tooltipPosition="is-top">Top</button>
              <button class="button is-warning is-outlined" appTooltip="Tooltip de aviso" tooltipType="is-warning" tooltipPosition="is-right">Right</button>
              <button class="button is-danger is-outlined" appTooltip="Tooltip de erro" tooltipType="is-danger" tooltipPosition="is-bottom">Bottom</button>
            </div>
          </app-card>
        </div>
        <div class="column is-6">
          <app-card title="Dropdown" icon="mdi-chevron-down">
            <div class="tx-btn-group">
              <div class="tx-dropdown" [class.is-active]="dd1()" (click)="$event.stopPropagation()">
                <button class="button is-primary" (click)="dd1.set(!dd1())">
                  Ações
                  <span class="mdi" style="margin-left:0.25rem;" [class]="dd1() ? 'mdi-menu-up' : 'mdi-menu-down'"></span>
                </button>
                <div class="tx-dropdown-menu">
                  <a class="dropdown-item"><span class="mdi mdi-pencil" style="margin-right:0.5rem;"></span>Editar</a>
                  <a class="dropdown-item"><span class="mdi mdi-content-copy" style="margin-right:0.5rem;"></span>Duplicar</a>
                  <hr class="dropdown-divider" />
                  <a class="dropdown-item has-text-danger"><span class="mdi mdi-delete" style="margin-right:0.5rem;"></span>Excluir</a>
                </div>
              </div>

              <div class="tx-dropdown is-left" [class.is-active]="dd2()" (click)="$event.stopPropagation()">
                <button class="button is-light" (click)="dd2.set(!dd2())">
                  Menu
                  <span class="mdi mdi-dots-vertical" style="margin-left:0.25rem;"></span>
                </button>
                <div class="tx-dropdown-menu">
                  <a class="dropdown-item">Item 1</a>
                  <a class="dropdown-item">Item 2</a>
                  <a class="dropdown-item" style="opacity:0.5;pointer-events:none;">Desabilitado</a>
                </div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Loading & Skeleton -->
      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-6">
          <app-card title="Loading" icon="mdi-loading">
            <div class="tx-btn-group">
              <button class="button is-primary is-loading">Carregando</button>
              <button class="button is-success is-outlined is-loading">Salvando</button>
              <button class="button is-danger is-loading">Excluindo</button>
            </div>
          </app-card>
        </div>
        <div class="column is-6">
          <app-card title="Skeleton" icon="mdi-rectangle-outline">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div class="tx-skeleton" style="width: 85%;"></div>
              <div class="tx-skeleton" style="width: 60%;"></div>
              <div class="tx-skeleton" style="width: 75%;"></div>
              <div class="tx-skeleton" style="width: 36px; height: 36px; border-radius: 50%;"></div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Carousel -->
      <app-card title="Carousel" icon="mdi-view-carousel" style="margin-top: 1rem; display: block;">
        <div style="position: relative;">
          <div class="tx-carousel-slide" [style.background]="carouselSlides[carouselIdx()].color">
            <span class="mdi tx-carousel-icon" [class]="carouselSlides[carouselIdx()].icon"></span>
            <h3 class="tx-carousel-title">{{ carouselSlides[carouselIdx()].title }}</h3>
            <p class="tx-carousel-desc">{{ carouselSlides[carouselIdx()].desc }}</p>
          </div>
          <button class="button is-small" style="position:absolute; top:50%; left:0.5rem; transform: translateY(-50%);" (click)="prevSlide()">
            <span class="mdi mdi-chevron-left"></span>
          </button>
          <button class="button is-small" style="position:absolute; top:50%; right:0.5rem; transform: translateY(-50%);" (click)="nextSlide()">
            <span class="mdi mdi-chevron-right"></span>
          </button>
          <div style="display:flex; justify-content:center; gap: 0.5rem; margin-top: 0.5rem;">
            <span *ngFor="let s of carouselSlides; let i = index"
              style="width: 8px; height: 8px; border-radius: 50%; cursor: pointer;"
              [style.background]="i === carouselIdx() ? 'var(--tx-primary)' : 'var(--tx-border)'"
              (click)="carouselIdx.set(i)"></span>
          </div>
        </div>
      </app-card>

      <!-- Messages -->
      <app-card title="Mensagens" icon="mdi-message-text" style="margin-top: 1rem; display: block;">
        <div class="tx-message-list">
          <div class="tx-message is-info">
            <div class="tx-message-header"><span class="mdi mdi-information"></span> Informação</div>
            <div class="tx-message-body">Esta é uma mensagem informativa. Use para orientações e dicas ao usuário.</div>
          </div>
          <div class="tx-message is-success">
            <div class="tx-message-header"><span class="mdi mdi-check-circle"></span> Sucesso</div>
            <div class="tx-message-body">Operação realizada com êxito! Os dados foram salvos corretamente.</div>
          </div>
          <div class="tx-message is-warning">
            <div class="tx-message-header"><span class="mdi mdi-alert"></span> Atenção</div>
            <div class="tx-message-body">Verifique os campos antes de continuar. Alguns dados podem estar incompletos.</div>
          </div>
          <div class="tx-message is-danger">
            <div class="tx-message-header"><span class="mdi mdi-close-circle"></span> Erro</div>
            <div class="tx-message-body">Falha ao processar a solicitação. Tente novamente ou contate o suporte.</div>
          </div>
        </div>
      </app-card>

      <!-- Breadcrumb -->
      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-6">
          <app-card title="Breadcrumb — Navegação Hierárquica" icon="mdi-dots-horizontal">
            <p class="tx-component-label">Padrão</p>
            <nav class="tx-breadcrumb">
              <a>Início</a><span class="tx-sep">/</span>
              <a>Interface</a><span class="tx-sep">/</span>
              <a class="is-active">Componentes</a>
            </nav>
            <p class="tx-component-label" style="margin-top: 1rem;">Separador: Seta</p>
            <nav class="tx-breadcrumb">
              <a>Dashboard</a><span class="tx-sep">→</span>
              <a>Usuários</a><span class="tx-sep">→</span>
              <a class="is-active">Editar</a>
            </nav>
            <p class="tx-component-label" style="margin-top: 1rem;">Separador: Ponto</p>
            <nav class="tx-breadcrumb">
              <a>Projetos</a><span class="tx-sep">·</span>
              <a>Alpha</a><span class="tx-sep">·</span>
              <a class="is-active">Relatório</a>
            </nav>
          </app-card>
        </div>
        <div class="column is-6">
          <app-card title="Imagem Responsiva" icon="mdi-image">
            <p class="tx-component-label">Proporção 16:9</p>
            <img src="https://placehold.co/640x360/485fc7/ffffff?text=16:9" alt="Imagem 16:9" style="width: 100%; border-radius: var(--tx-radius);" />
            <div class="columns" style="margin-top: 1rem;">
              <div class="column"><p class="tx-component-label">1:1</p><img src="https://placehold.co/200x200/48c774/ffffff?text=1:1" alt="1:1" style="width:100%; border-radius:var(--tx-radius);" /></div>
              <div class="column"><p class="tx-component-label">4:3</p><img src="https://placehold.co/200x150/3273dc/ffffff?text=4:3" alt="4:3" style="width:100%; border-radius:var(--tx-radius);" /></div>
              <div class="column"><p class="tx-component-label">Lazy</p><img loading="lazy" src="https://placehold.co/200x150/f59e0b/ffffff?text=Lazy" alt="Lazy" style="width:100%; border-radius:var(--tx-radius);" /></div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Sidebar off-canvas -->
      <app-card title="Sidebar Off-Canvas (drawer)" icon="mdi-page-layout-sidebar-left" style="margin-top: 1rem; display: block;">
        <div class="tx-btn-group">
          <button class="button is-primary" (click)="showSidebar.set(true)">
            <span class="mdi mdi-dock-left" style="margin-right:0.25rem;"></span>
            Abrir Sidebar Esquerda
          </button>
          <button class="button is-info" (click)="showSidebarRight.set(true)">
            <span class="mdi mdi-dock-right" style="margin-right:0.25rem;"></span>
            Abrir Sidebar Direita
          </button>
        </div>
        <p style="margin-top:0.75rem; font-size:0.82rem; color:var(--tx-text-muted);">
          Drawer off-canvas com overlay. Ideal para filtros, detalhes e formulários laterais.
        </p>

        <div *ngIf="showSidebar()" class="tx-drawer-backdrop" (click)="showSidebar.set(false)">
          <div class="tx-drawer" (click)="$event.stopPropagation()">
            <div class="tx-offcanvas-panel">
              <div class="tx-offcanvas-header">
                <h3 class="tx-offcanvas-title">Filtros Avançados</h3>
                <button class="button is-ghost is-small" (click)="showSidebar.set(false)">
                  <span class="mdi mdi-close"></span>
                </button>
              </div>
              <div class="tx-offcanvas-body">
                <div class="field">
                  <label class="label">Status</label>
                  <div class="select is-fullwidth">
                    <select [(ngModel)]="sidebarFilter.status" name="sidebarStatus">
                      <option value="">Todos</option>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Categoria</label>
                  <div class="tx-check-group">
                    <label class="checkbox"><input type="checkbox" (change)="toggleCat('hw', $event)" [checked]="sidebarFilter.cats.includes('hw')" /> Hardware</label>
                    <label class="checkbox"><input type="checkbox" (change)="toggleCat('sw', $event)" [checked]="sidebarFilter.cats.includes('sw')" /> Software</label>
                    <label class="checkbox"><input type="checkbox" (change)="toggleCat('per', $event)" [checked]="sidebarFilter.cats.includes('per')" /> Periférico</label>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Faixa de preço (R$ {{ sidebarFilter.price }})</label>
                  <input type="range" min="0" max="5000" step="100" [(ngModel)]="sidebarFilter.price" name="sidebarPrice" style="width:100%; accent-color: var(--tx-primary);" />
                </div>
              </div>
              <div class="tx-offcanvas-footer">
                <button class="button is-primary is-fullwidth" (click)="applyFilters()">
                  <span class="mdi mdi-filter" style="margin-right:0.25rem;"></span>
                  Aplicar Filtros
                </button>
                <button class="button is-light is-fullwidth" style="margin-top: 0.5rem;" (click)="resetFilters()">Limpar</button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="showSidebarRight()" class="tx-drawer-backdrop" (click)="showSidebarRight.set(false)" style="justify-content: flex-end;">
          <div class="tx-drawer is-right" (click)="$event.stopPropagation()">
            <div class="tx-offcanvas-panel">
              <div class="tx-offcanvas-header">
                <h3 class="tx-offcanvas-title">Detalhes do Item</h3>
                <button class="button is-ghost is-small" (click)="showSidebarRight.set(false)">
                  <span class="mdi mdi-close"></span>
                </button>
              </div>
              <div class="tx-offcanvas-body">
                <div class="tx-detail-grid" style="margin-bottom:1rem;">
                  <div><p class="tx-detail-label">Nome</p><p class="tx-detail-value">Monitor 27" 4K</p></div>
                  <div><p class="tx-detail-label">SKU</p><p class="tx-detail-value">MON-27-4K-002</p></div>
                  <div><p class="tx-detail-label">Categoria</p><p class="tx-detail-value">Hardware</p></div>
                  <div><p class="tx-detail-label">Estoque</p><p class="tx-detail-value">8 un.</p></div>
                  <div><p class="tx-detail-label">Preço</p><p class="tx-detail-value">R$ 2.199,90</p></div>
                  <div><p class="tx-detail-label">Status</p><p class="tx-detail-value"><span class="tag is-success is-light">Ativo</span></p></div>
                </div>
                <div class="tx-message is-warning">
                  <div class="tx-message-body" style="font-size:0.82rem;">Estoque baixo — apenas 8 unidades disponíveis.</div>
                </div>
              </div>
              <div class="tx-offcanvas-footer">
                <button class="button is-info is-fullwidth" (click)="showSidebarRight.set(false); ui.notify('Editando...', 'is-info')">
                  <span class="mdi mdi-pencil" style="margin-right:0.25rem;"></span>
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Collapse -->
      <app-card title="Collapse / Acordeão" icon="mdi-chevron-down" style="margin-top: 1rem; display: block;">
        <div class="tx-collapse-list">
          <div *ngFor="let panel of collapsePanels; let i = index" class="tx-collapse-item">
            <div class="tx-collapse-trigger" (click)="togglePanel(i)">
              <span class="mdi" [class]="panel.icon" style="font-size: 1.1rem; color: var(--tx-primary);"></span>
              <span class="tx-collapse-label">{{ panel.title }}</span>
              <span class="mdi tx-collapse-chevron" [class]="openPanel() === i ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
            </div>
            <div *ngIf="openPanel() === i" class="tx-collapse-body">
              {{ panel.content }}
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .tx-skeleton {
      height: 1rem;
      background: linear-gradient(90deg, var(--tx-border-subtle) 0%, var(--tx-border) 50%, var(--tx-border-subtle) 100%);
      background-size: 200% 100%;
      animation: skeletonShimmer 1.4s ease-in-out infinite;
      border-radius: var(--tx-radius-small);
    }
    @keyframes skeletonShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class ComponentsPageComponent {
  readonly ui = inject(UiService);

  readonly showModal = signal<boolean>(false);
  readonly showConfirm = signal<boolean>(false);
  readonly cardDropdown = signal<boolean>(false);
  readonly dd1 = signal<boolean>(false);
  readonly dd2 = signal<boolean>(false);
  readonly showSidebar = signal<boolean>(false);
  readonly showSidebarRight = signal<boolean>(false);
  readonly carouselIdx = signal<number>(0);
  readonly openPanel = signal<number | null>(0);

  modalInput = '';
  sidebarFilter = { status: '', cats: [] as string[], price: 2500 };

  @HostListener('document:click')
  onDocClick(): void {
    this.cardDropdown.set(false);
    this.dd1.set(false);
    this.dd2.set(false);
  }

  readonly progressBars: ProgressBar[] = [
    { label: 'Primary', value: 65, type: 'is-primary' },
    { label: 'Sucesso', value: 80, type: 'is-success' },
    { label: 'Aviso', value: 45, type: 'is-warning' },
    { label: 'Erro', value: 30, type: 'is-danger' },
    { label: 'Info', value: 55, type: 'is-info' },
  ];

  readonly carouselSlides: CarouselSlide[] = [
    { id: 1, title: 'Design System', desc: 'Componentes consistentes, reutilizáveis e acessíveis.', icon: 'mdi-palette', color: 'linear-gradient(135deg, #485fc7 0%, #3a4fa3 100%)' },
    { id: 2, title: 'Angular + Bulma', desc: 'Standalone Components com Bulma 1.x.', icon: 'mdi-angular', color: 'linear-gradient(135deg, #48c774 0%, #2d9e59 100%)' },
    { id: 3, title: 'Dark Mode', desc: 'Suporte completo a tema claro e escuro com CSS variables.', icon: 'mdi-theme-light-dark', color: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
    { id: 4, title: 'Responsivo', desc: 'Layout adaptável para mobile, tablet e desktop.', icon: 'mdi-responsive', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  ];

  readonly collapsePanels: CollapsePanel[] = [
    { title: 'O que é este template?', icon: 'mdi-information-outline', content: 'Template administrativo Angular 19+ construído sobre Bulma 1.x. Inclui layout responsivo, dark mode, autenticação simulada, menu de 3 níveis e diversas páginas de demonstração.' },
    { title: 'Como funciona o Dark Mode?', icon: 'mdi-theme-light-dark', content: 'O dark mode é implementado via CSS custom properties. Ao definir o atributo data-theme="dark" no elemento <html>, os valores das variáveis CSS são substituídos pelos valores do tema escuro.' },
    { title: 'Posso personalizar as cores?', icon: 'mdi-palette', content: 'Sim! As cores são definidas como CSS custom properties no arquivo variables.css (--tx-primary, --tx-success, etc.). Você pode ajustá-las em runtime na tela de Configurações.' },
    { title: 'Estrutura de pastas', icon: 'mdi-folder-outline', content: 'src/assets/styles/ — CSS globais. src/app/components/ — componentes reutilizáveis. src/app/pages/ — telas. src/app/core/services/ — serviços globais (auth, ui, menu). src/app/core/guards/ — guards de rota.' },
  ];

  handleModalSave(): void {
    this.showModal.set(false);
    this.ui.notifySuccess('Modal salvo com sucesso!');
  }

  handleConfirm(): void {
    this.showConfirm.set(false);
    this.ui.notifySuccess('Ação confirmada!');
  }

  prevSlide(): void {
    this.carouselIdx.update((i) => (i === 0 ? this.carouselSlides.length - 1 : i - 1));
  }

  nextSlide(): void {
    this.carouselIdx.update((i) => (i === this.carouselSlides.length - 1 ? 0 : i + 1));
  }

  togglePanel(i: number): void {
    this.openPanel.update((cur) => (cur === i ? null : i));
  }

  toggleCat(cat: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.sidebarFilter.cats.includes(cat)) this.sidebarFilter.cats = [...this.sidebarFilter.cats, cat];
    } else {
      this.sidebarFilter.cats = this.sidebarFilter.cats.filter((c) => c !== cat);
    }
  }

  applyFilters(): void {
    this.showSidebar.set(false);
    this.ui.notifySuccess('Filtros aplicados!');
  }

  resetFilters(): void {
    this.sidebarFilter = { status: '', cats: [], price: 2500 };
    this.showSidebar.set(false);
  }
}
