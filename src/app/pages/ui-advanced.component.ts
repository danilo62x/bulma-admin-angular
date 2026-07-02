import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../components/ui/card.component';

interface Panel {
  title: string;
  icon?: string;
  content: string;
}

@Component({
  selector: 'app-ui-advanced',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, FormsModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-advanced">
      <!-- Breadcrumb -->
      <app-card title="Breadcrumb — Trilha de navegação" icon="mdi-chevron-right">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><a href="#"><span class="icon is-small"><i class="mdi mdi-view-dashboard"></i></span><span>Início</span></a></li>
            <li><a href="#">Componentes</a></li>
            <li class="is-active"><a href="#" aria-current="page">Avançados</a></li>
          </ul>
        </nav>
        <p class="tx-component-label" style="margin-top: 1rem;">Separador: seta</p>
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Usuários</a></li>
            <li class="is-active"><a href="#" aria-current="page">Editar</a></li>
          </ul>
        </nav>
      </app-card>

      <!-- Tabs -->
      <app-card title="Abas" icon="mdi-tab" style="margin-top: 1rem; display: block;">
        <div class="tabs is-boxed">
          <ul>
            <li *ngFor="let t of tab1Items; let i = index" [class.is-active]="activeTab() === i">
              <a (click)="activeTab.set(i)"><span class="icon is-small"><i class="mdi" [class]="t.icon"></i></span><span>{{ t.label }}</span></a>
            </li>
          </ul>
        </div>
        <p style="font-size: 0.9rem; color: var(--tx-text-muted);">{{ tab1Items[activeTab()].content }}</p>

        <p class="tx-component-label" style="margin-top: 1rem;">Aba toggle expandida</p>
        <div class="tabs is-toggle is-fullwidth">
          <ul>
            <li *ngFor="let t of tab2Items; let i = index" [class.is-active]="activeTab2() === i">
              <a (click)="activeTab2.set(i)"><span>{{ t }}</span></a>
            </li>
          </ul>
        </div>
      </app-card>

      <!-- Accordion -->
      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-6">
          <app-card title="Acordeão — apenas um aberto" icon="mdi-chevron-down">
            <div class="tx-accordion">
              <div *ngFor="let panel of accordionPanels; let i = index" class="tx-accordion-item">
                <div class="tx-accordion-trigger" role="button" (click)="openPanel.set(openPanel() === i ? -1 : i)">
                  <span class="mdi" [class]="panel.icon"></span>
                  <span class="tx-accordion-label">{{ panel.title }}</span>
                  <span class="mdi tx-accordion-chevron" [class]="openPanel() === i ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
                </div>
                <div *ngIf="openPanel() === i" class="tx-accordion-body">{{ panel.content }}</div>
              </div>
            </div>
          </app-card>
        </div>
        <div class="column is-6">
          <app-card title="Acordeão — múltiplos abertos" icon="mdi-chevron-down">
            <div class="tx-accordion">
              <div *ngFor="let panel of faqPanels; let i = index" class="tx-accordion-item">
                <div class="tx-accordion-trigger" role="button" (click)="toggleMulti(i)">
                  <span class="tx-accordion-label">{{ panel.title }}</span>
                  <span class="mdi tx-accordion-chevron" [class]="multiOpen()[i] ? 'mdi-chevron-up' : 'mdi-chevron-down'"></span>
                </div>
                <div *ngIf="multiOpen()[i]" class="tx-accordion-body">{{ panel.content }}</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Steps -->
      <app-card title="Etapas" icon="mdi-format-list-numbered" style="margin-top: 1rem; display: block;">
        <ul class="steps has-content-centered">
          <li *ngFor="let s of steps; let i = index" class="steps-segment" [class.is-active]="activeStep() === i">
            <span class="steps-marker"><span class="icon"><i class="mdi" [class]="s.icon"></i></span></span>
            <div class="steps-content"><p class="is-size-7 has-text-weight-medium">{{ s.label }}</p></div>
          </li>
        </ul>
        <p class="tx-step-content">{{ steps[activeStep()].content }}</p>
        <div class="tx-btn-group" style="justify-content: center; margin-top: 1rem;">
          <button class="button" [disabled]="activeStep() === 0" (click)="activeStep.set(activeStep() - 1)">
            <span class="icon"><i class="mdi mdi-chevron-left"></i></span><span>Anterior</span>
          </button>
          <button class="button is-primary" [disabled]="activeStep() === steps.length - 1" (click)="activeStep.set(activeStep() + 1)">
            <span>Próximo</span><span class="icon"><i class="mdi mdi-chevron-right"></i></span>
          </button>
        </div>
      </app-card>

      <div class="columns" style="margin-top: 1rem;">
        <!-- Rate -->
        <div class="column is-6">
          <app-card title="Avaliação" icon="mdi-star">
            <div class="tx-rate-row">
              <div class="tx-rate">
                <span *ngFor="let n of [1,2,3,4,5]" class="mdi" [class]="n <= rating() ? 'mdi-star' : 'mdi-star-outline'" (click)="rating.set(n)"></span>
              </div>
              <span style="font-size: 0.875rem; color: var(--tx-text-muted);">{{ rating() }} de 5</span>
            </div>
            <div class="tx-rate-row" style="border-top: 1px solid var(--tx-border); padding-top: 1rem; margin-top: 1rem;">
              <span style="font-size: 0.875rem;">Somente leitura:</span>
              <div class="tx-rate is-readonly">
                <span *ngFor="let n of [1,2,3,4,5]" class="mdi" [class]="n <= 4 ? 'mdi-star' : 'mdi-star-outline'"></span>
              </div>
            </div>
            <div class="tx-rate-row" style="margin-top: 1rem;">
              <span style="font-size: 0.875rem;">Com corações:</span>
              <div class="tx-rate is-heart">
                <span *ngFor="let n of [1,2,3,4,5]" class="mdi" [class]="n <= ratingHalf() ? 'mdi-heart' : 'mdi-heart-outline'" (click)="ratingHalf.set(n)"></span>
              </div>
            </div>
          </app-card>
        </div>

        <!-- TagInput -->
        <div class="column is-6">
          <app-card title="Entrada de tags" icon="mdi-tag-multiple">
            <div class="tx-taginput">
              <span *ngFor="let tag of tags(); let i = index" class="tag is-primary is-light">
                {{ tag }}
                <button class="delete is-small" (click)="removeTag(i)"></button>
              </span>
              <input
                class="tx-taginput-field"
                type="text"
                placeholder="Adicionar tecnologia..."
                [(ngModel)]="tagInput"
                (keydown.enter)="addTag(); $event.preventDefault()"
                (keydown.backspace)="onBackspace()"
              />
            </div>
            <p style="margin-top: 0.5rem; font-size: 0.78rem; color: var(--tx-text-muted);">
              {{ tags().length }} tag(s) — pressione Enter para adicionar, Backspace para remover.
            </p>
          </app-card>
        </div>
      </div>

      <!-- Badges -->
      <app-card title="Badges" icon="mdi-label" style="margin-top: 1rem; display: block;">
        <p class="tx-component-label">Soft / light</p>
        <div class="tx-tags-showcase">
          <span class="tag is-primary is-light">Primário</span>
          <span class="tag is-success is-light">Sucesso</span>
          <span class="tag is-warning is-light">Aviso</span>
          <span class="tag is-danger is-light">Erro</span>
          <span class="tag is-light">Neutro</span>
        </div>
        <p class="tx-component-label" style="margin-top: 1rem;">Solid</p>
        <div class="tx-tags-showcase">
          <span class="tag is-primary">Primário</span>
          <span class="tag is-success">Sucesso</span>
          <span class="tag is-warning">Aviso</span>
          <span class="tag is-danger">Erro</span>
          <span class="tag is-dark">Neutro</span>
        </div>
        <p class="tx-component-label" style="margin-top: 1rem;">Com ponto de status e ícone</p>
        <div class="tx-tags-showcase">
          <span class="tag is-success is-light"><span class="tx-badge-dot" style="background: var(--tx-success);"></span>Online</span>
          <span class="tag is-warning is-light"><span class="tx-badge-dot" style="background: var(--tx-warning);"></span>Pendente</span>
          <span class="tag is-light"><span class="tx-badge-dot" style="background: var(--tx-text-muted);"></span>Offline</span>
          <span class="tag is-primary"><span class="icon is-small"><i class="mdi mdi-star"></i></span><span>Premium</span></span>
          <span class="tag is-success"><span class="icon is-small"><i class="mdi mdi-check"></i></span><span>Verificado</span></span>
        </div>
      </app-card>

      <!-- Avatars -->
      <app-card title="Avatares" icon="mdi-account-circle" style="margin-top: 1rem; display: block;">
        <p class="tx-component-label">Tamanhos (iniciais)</p>
        <div class="tx-avatar-row">
          <span class="tx-av tx-av-xs" [ngStyle]="avatarStyle('Ana Silva')">{{ initials('Ana Silva') }}</span>
          <span class="tx-av tx-av-sm" [ngStyle]="avatarStyle('Bruno Costa')">{{ initials('Bruno Costa') }}</span>
          <span class="tx-av tx-av-md" [ngStyle]="avatarStyle('Carla Dias')">{{ initials('Carla Dias') }}</span>
          <span class="tx-av tx-av-lg" [ngStyle]="avatarStyle('Diego Luz')">{{ initials('Diego Luz') }}</span>
          <span class="tx-av tx-av-xl" [ngStyle]="avatarStyle('Erica Melo')">{{ initials('Erica Melo') }}</span>
        </div>

        <p class="tx-component-label" style="margin-top: 1.25rem;">Com status</p>
        <div class="tx-avatar-row">
          <span class="tx-av tx-av-md" [ngStyle]="avatarStyle('João Pedro')">
            {{ initials('João Pedro') }}<span class="tx-av-status" style="background: var(--tx-warning);"></span>
          </span>
          <span class="tx-av tx-av-md" [ngStyle]="avatarStyle('Lia Souza')">
            {{ initials('Lia Souza') }}<span class="tx-av-status" style="background: var(--tx-text-muted);"></span>
          </span>
          <span class="tx-av tx-av-md" [ngStyle]="avatarStyle('Marina Reis')">
            {{ initials('Marina Reis') }}<span class="tx-av-status" style="background: var(--tx-success);"></span>
          </span>
        </div>

        <p class="tx-component-label" style="margin-top: 1.25rem;">Grupo empilhado</p>
        <div class="tx-avatar-group">
          <span *ngFor="let n of groupNames" class="tx-av tx-av-md tx-av-stacked" [ngStyle]="avatarStyle(n)">{{ initials(n) }}</span>
          <span class="tx-av tx-av-md tx-av-stacked tx-av-extra">+5</span>
        </div>
      </app-card>

      <!-- Skeleton -->
      <app-card title="Skeleton" icon="mdi-rectangle-outline" style="margin-top: 1rem; display: block;">
        <div class="tx-btn-group" style="margin-bottom: 1rem;">
          <button class="button is-small" (click)="loadingSkeleton.set(!loadingSkeleton())">
            <span class="icon"><i class="mdi mdi-refresh"></i></span>
            <span>{{ loadingSkeleton() ? 'Mostrar conteúdo' : 'Mostrar loading' }}</span>
          </button>
        </div>

        <div *ngIf="loadingSkeleton()" class="tx-skeleton-block">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="tx-skeleton tx-skeleton-circle"></span>
            <div style="flex: 1;">
              <span class="tx-skeleton" style="width: 40%; display: block;"></span>
              <span class="tx-skeleton" style="width: 25%; display: block; margin-top: 0.5rem;"></span>
            </div>
          </div>
          <span class="tx-skeleton" style="height: 120px; display: block;"></span>
          <span class="tx-skeleton" style="display: block;"></span>
          <span class="tx-skeleton" style="width: 90%; display: block;"></span>
          <span class="tx-skeleton" style="width: 75%; display: block;"></span>
        </div>

        <div *ngIf="!loadingSkeleton()" class="tx-skeleton-block">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="tx-av tx-av-lg" [ngStyle]="avatarStyle('Time Produto')">{{ initials('Time Produto') }}</span>
            <div>
              <p style="font-weight: 600; color: var(--tx-text-heading);">Equipe de Produto</p>
              <p style="font-size: 0.8rem; color: var(--tx-text-muted);">12 membros ativos</p>
            </div>
          </div>
          <div class="tx-skeleton-loaded">Conteúdo carregado</div>
          <p style="font-size: 0.9rem; color: var(--tx-text-muted);">
            O conteúdo real substitui os placeholders assim que os dados terminam de carregar, evitando saltos de layout.
          </p>
        </div>
      </app-card>
    </div>
  `,
  styles: [
    `
      .tx-accordion { border: 1px solid var(--tx-border); border-radius: var(--tx-radius); overflow: hidden; }
      .tx-accordion-item { border-bottom: 1px solid var(--tx-border); }
      .tx-accordion-item:last-child { border-bottom: none; }
      .tx-accordion-trigger { display: flex; align-items: center; gap: 0.65rem; padding: 0.85rem 1rem; cursor: pointer; background: var(--tx-card-bg); transition: background-color var(--tx-transition); }
      .tx-accordion-trigger:hover { background: var(--tx-body-bg); }
      .tx-accordion-trigger .mdi:first-child { color: var(--tx-primary); font-size: 1.1rem; }
      .tx-accordion-label { flex: 1; font-size: 0.9rem; font-weight: 500; color: var(--tx-text); }
      .tx-accordion-chevron { font-size: 1rem; color: var(--tx-text-muted); }
      .tx-accordion-body { padding: 0.85rem 1rem 1rem; font-size: 0.875rem; color: var(--tx-text-muted); line-height: 1.6; background: var(--tx-body-bg); border-top: 1px solid var(--tx-border-subtle); }
      .tx-step-content { font-size: 0.9rem; color: var(--tx-text-muted); padding: 1rem 0; text-align: center; }
      .tx-rate-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
      .tx-rate { display: inline-flex; gap: 0.15rem; cursor: pointer; color: var(--tx-warning); font-size: 1.3rem; }
      .tx-rate.is-readonly { cursor: default; }
      .tx-rate.is-heart { color: var(--tx-danger); }
      .tx-taginput { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; border: 1px solid var(--tx-border); border-radius: var(--tx-radius-small, 4px); padding: 0.4rem 0.5rem; background: var(--tx-card-bg); }
      .tx-taginput-field { border: none; outline: none; background: transparent; flex: 1; min-width: 8rem; font-size: 0.875rem; color: var(--tx-text); padding: 0.2rem; }
      .tx-avatar-row { display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap; }
      .tx-av { position: relative; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 600; flex-shrink: 0; }
      .tx-av-xs { width: 28px; height: 28px; font-size: 0.65rem; }
      .tx-av-sm { width: 36px; height: 36px; font-size: 0.75rem; }
      .tx-av-md { width: 48px; height: 48px; font-size: 0.95rem; }
      .tx-av-lg { width: 60px; height: 60px; font-size: 1.15rem; }
      .tx-av-xl { width: 76px; height: 76px; font-size: 1.45rem; }
      .tx-av-status { position: absolute; bottom: 1px; right: 1px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--tx-card-bg); }
      .tx-avatar-group { display: flex; align-items: center; }
      .tx-av-stacked { border: 2px solid var(--tx-card-bg); margin-left: -0.75rem; }
      .tx-av-stacked:first-child { margin-left: 0; }
      .tx-av-extra { background: var(--tx-body-bg); color: var(--tx-text-muted); }
      .tx-skeleton-block { display: flex; flex-direction: column; gap: 1rem; }
      .tx-skeleton { height: 1rem; border-radius: 6px; background: linear-gradient(90deg, var(--tx-body-bg) 25%, var(--tx-border-subtle, #eee) 37%, var(--tx-body-bg) 63%); background-size: 400% 100%; animation: tx-shimmer 1.4s ease infinite; }
      .tx-skeleton-circle { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }
      @keyframes tx-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
      .tx-skeleton-loaded { display: flex; align-items: center; justify-content: center; height: 120px; border-radius: var(--tx-radius); background: color-mix(in srgb, var(--tx-primary) 12%, transparent); color: var(--tx-primary); font-weight: 500; font-size: 0.9rem; }
      .tx-badge-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 0.4rem; flex-shrink: 0; }
    `,
  ],
})
export class UiAdvancedComponent {
  readonly tab1Items = [
    { label: 'Visão geral', icon: 'mdi-view-dashboard', content: 'Resumo geral do projeto, métricas e indicadores principais em um só lugar.' },
    { label: 'Atividade', icon: 'mdi-bell', content: 'Histórico de eventos recentes, notificações e ações realizadas pela equipe.' },
    { label: 'Configurações', icon: 'mdi-cog', content: 'Ajuste preferências, integrações e permissões da sua conta.' },
  ];
  readonly tab2Items = ['Mensal', 'Trimestral', 'Anual'];
  readonly activeTab = signal(0);
  readonly activeTab2 = signal(0);

  readonly accordionPanels: Panel[] = [
    { title: 'O que está incluído?', icon: 'mdi-package-variant', content: 'Todos os componentes de UI, temas claro e escuro, e exemplos prontos para produção.' },
    { title: 'Posso personalizar as cores?', icon: 'mdi-palette', content: 'Sim, todas as cores usam tokens de design (CSS custom properties) configuráveis em tempo de execução.' },
    { title: 'Há suporte a TypeScript?', icon: 'mdi-language-typescript', content: 'Completo — todos os componentes possuem tipos estritos com Angular standalone.' },
  ];
  readonly openPanel = signal(0);

  readonly faqPanels: Panel[] = [
    { title: 'Entrega', content: 'Enviamos para todo o Brasil em até 5 dias úteis.' },
    { title: 'Trocas e devoluções', content: 'Você tem até 30 dias para solicitar a troca.' },
    { title: 'Garantia', content: 'Todos os produtos têm garantia de 12 meses.' },
  ];
  readonly multiOpen = signal<boolean[]>([true, true, false]);

  toggleMulti(i: number): void {
    this.multiOpen.update((arr) => arr.map((v, idx) => (idx === i ? !v : v)));
  }

  readonly steps = [
    { label: 'Carrinho', icon: 'mdi-cart', content: 'Itens selecionados — revise o seu carrinho de compras.' },
    { label: 'Endereço', icon: 'mdi-map-marker', content: 'Informe o endereço de entrega do pedido.' },
    { label: 'Pagamento', icon: 'mdi-credit-card', content: 'Escolha a forma de pagamento: cartão ou Pix.' },
    { label: 'Confirmação', icon: 'mdi-check', content: 'Pedido realizado com sucesso!' },
  ];
  readonly activeStep = signal(1);

  readonly rating = signal(3);
  readonly ratingHalf = signal(4);

  readonly tags = signal<string[]>(['Angular', 'Bulma', 'TypeScript']);
  tagInput = '';

  addTag(): void {
    const v = this.tagInput.trim();
    if (v && !this.tags().includes(v)) this.tags.update((arr) => [...arr, v]);
    this.tagInput = '';
  }
  onBackspace(): void {
    if (!this.tagInput && this.tags().length) this.tags.update((arr) => arr.slice(0, -1));
  }
  removeTag(i: number): void {
    this.tags.update((arr) => arr.filter((_, idx) => idx !== i));
  }

  readonly loadingSkeleton = signal(true);
  readonly groupNames = ['Marina Costa', 'Lucas Pinto', 'André Sá', 'Rafa Lima'];

  private readonly avatarColors = ['#485fc7', '#48c774', '#3273dc', '#f59e0b', '#9b59b6', '#e74c3c', '#1abc9c'];

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  avatarStyle(name: string): Record<string, string> {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    const color = this.avatarColors[Math.abs(h) % this.avatarColors.length];
    return { background: `color-mix(in srgb, ${color} 16%, transparent)`, color };
  }
}
