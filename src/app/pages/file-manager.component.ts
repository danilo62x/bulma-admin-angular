import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { UiService } from '../core/services/ui.service';
import { ProgressComponent } from '../components/ui/progress.component';
import { ModalComponent } from '../components/ui/modal.component';
import { FileDropzoneComponent } from '../components/ui/file-dropzone.component';

interface FolderItem {
  id: string;
  name: string;
  items: number;
  modified: string;
}

type FileKind = 'document' | 'image' | 'archive' | 'sheet';

interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  modified: string;
}

interface MenuAction {
  label: string;
  icon: string;
  danger?: boolean;
}

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [NgFor, NgIf, ProgressComponent, ModalComponent, FileDropzoneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="tx-fm-toolbar">
        <nav class="breadcrumb is-small" aria-label="breadcrumbs" style="margin-bottom: 0;">
          <ul>
            <li><a>Início</a></li>
            <li class="is-active"><a aria-current="page">Meus arquivos</a></li>
          </ul>
        </nav>
        <div class="tx-fm-actions">
          <div class="buttons has-addons" style="margin-bottom: 0;">
            <button class="button is-small" [class.is-primary]="view() === 'grid'" [class.is-light]="view() !== 'grid'" aria-label="Grade" (click)="view.set('grid')">
              <span class="icon"><span class="mdi mdi-view-grid"></span></span>
            </button>
            <button class="button is-small" [class.is-primary]="view() === 'list'" [class.is-light]="view() !== 'list'" aria-label="Lista" (click)="view.set('list')">
              <span class="icon"><span class="mdi mdi-view-list"></span></span>
            </button>
          </div>
          <button class="button is-primary" (click)="uploadOpen.set(true)">
            <span class="icon"><span class="mdi mdi-plus"></span></span>
            <span>Enviar arquivo</span>
          </button>
        </div>
      </div>

      <div class="box tx-storage">
        <div class="tx-storage-head">
          <div class="tx-storage-info">
            <span class="tx-storage-icon"><span class="mdi mdi-database"></span></span>
            <div>
              <p class="has-text-weight-semibold" style="color: var(--tx-text-heading);">Armazenamento</p>
              <p class="is-size-7 has-text-grey">{{ usedGb }} GB de {{ totalGb }} GB utilizados</p>
            </div>
          </div>
          <span class="has-text-weight-semibold" style="color: var(--tx-text-heading);">{{ usedPct }}%</span>
        </div>
        <app-progress [value]="usedPct" [type]="usedPct > 80 ? 'is-danger' : 'is-primary'" size="is-medium" style="display:block;margin-top:1rem;"></app-progress>
      </div>

      <h2 class="tx-fm-section-title">Pastas</h2>
      <div class="columns is-multiline">
        <div *ngFor="let f of FOLDERS" class="column is-3-desktop is-6-tablet">
          <div class="box tx-folder-card">
            <span class="tx-folder-icon"><span class="mdi mdi-folder"></span></span>
            <div class="tx-folder-meta">
              <p class="has-text-weight-medium tx-truncate" style="color: var(--tx-text-heading);">{{ f.name }}</p>
              <p class="is-size-7 has-text-grey">{{ f.items }} itens · {{ f.modified }}</p>
            </div>
            <div class="tx-dropdown is-left" [class.is-active]="openMenu() === 'folder-' + f.id" (click)="$event.stopPropagation()">
              <button class="button is-small is-light" aria-label="Opções" (click)="toggleMenu('folder-' + f.id)">
                <span class="icon"><span class="mdi mdi-dots-vertical"></span></span>
              </button>
              <div class="tx-dropdown-menu">
                <a *ngFor="let a of MENU_ACTIONS" class="dropdown-item" [class.has-text-danger]="a.danger" (click)="onAction(a.label)">
                  <span class="mdi" [class]="a.icon" style="margin-right: 0.4rem;"></span>{{ a.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="tx-fm-section-title">Arquivos</h2>

      <div *ngIf="view() === 'grid'" class="columns is-multiline">
        <div *ngFor="let file of FILES" class="column is-3-desktop is-4-tablet is-6-mobile">
          <div class="box tx-file-card">
            <div class="tx-file-card-head">
              <span class="tx-file-icon" [style.--icon-color]="KIND_STYLE[file.kind].color">
                <span class="mdi" [class]="KIND_STYLE[file.kind].icon"></span>
              </span>
              <div class="tx-dropdown is-left" [class.is-active]="openMenu() === 'file-' + file.id" (click)="$event.stopPropagation()">
                <button class="button is-small is-light" aria-label="Opções" (click)="toggleMenu('file-' + file.id)">
                  <span class="icon"><span class="mdi mdi-dots-vertical"></span></span>
                </button>
                <div class="tx-dropdown-menu">
                  <a *ngFor="let a of MENU_ACTIONS" class="dropdown-item" [class.has-text-danger]="a.danger" (click)="onAction(a.label)">
                    <span class="mdi" [class]="a.icon" style="margin-right: 0.4rem;"></span>{{ a.label }}
                  </a>
                </div>
              </div>
            </div>
            <div>
              <p class="has-text-weight-medium tx-truncate" style="color: var(--tx-text-heading);">{{ file.name }}</p>
              <p class="is-size-7 has-text-grey" style="margin-top: 0.15rem;">{{ file.size }} · {{ file.modified }}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="view() === 'list'" class="box" style="padding: 0;">
        <table class="table is-fullwidth is-hoverable tx-file-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tamanho</th>
              <th>Modificado</th>
              <th class="has-text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let file of FILES">
              <td>
                <div class="tx-file-row-name">
                  <span class="tx-file-icon is-small" [style.--icon-color]="KIND_STYLE[file.kind].color">
                    <span class="mdi" [class]="KIND_STYLE[file.kind].icon"></span>
                  </span>
                  <span class="has-text-weight-medium" style="color: var(--tx-text-heading);">{{ file.name }}</span>
                </div>
              </td>
              <td class="has-text-grey">{{ file.size }}</td>
              <td class="has-text-grey">{{ file.modified }}</td>
              <td class="has-text-right">
                <div class="tx-dropdown is-left" [class.is-active]="openMenu() === 'row-' + file.id" (click)="$event.stopPropagation()">
                  <button class="button is-small is-light" aria-label="Opções" (click)="toggleMenu('row-' + file.id)">
                    <span class="icon"><span class="mdi mdi-dots-vertical"></span></span>
                  </button>
                  <div class="tx-dropdown-menu">
                    <a *ngFor="let a of MENU_ACTIONS" class="dropdown-item" [class.has-text-danger]="a.danger" (click)="onAction(a.label)">
                      <span class="mdi" [class]="a.icon" style="margin-right: 0.4rem;"></span>{{ a.label }}
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-modal [open]="uploadOpen()" (openChange)="uploadOpen.set($event)" width="560px">
        <header class="modal-card-head">
          <div>
            <p class="modal-card-title">Enviar arquivos</p>
            <p class="is-size-7 has-text-grey">Arraste e solte ou selecione do seu dispositivo</p>
          </div>
          <button class="delete" (click)="uploadOpen.set(false)"></button>
        </header>
        <section class="modal-card-body">
          <app-file-dropzone [maxFiles]="8" (filesChange)="onFiles($event)"></app-file-dropzone>
        </section>
        <footer class="modal-card-foot tx-modal-foot">
          <button class="button" (click)="uploadOpen.set(false)">Cancelar</button>
          <button class="button is-primary" (click)="finishUpload()">
            <span class="icon"><span class="mdi mdi-check"></span></span>
            <span>Concluir</span>
          </button>
        </footer>
      </app-modal>
    </div>
  `,
  styles: [
    `
      .tx-fm-toolbar { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
      @media (min-width: 1024px) { .tx-fm-toolbar { flex-direction: row; align-items: center; justify-content: space-between; } }
      .tx-fm-actions { display: flex; align-items: center; gap: 0.5rem; }
      .tx-storage { margin-bottom: 1.25rem; }
      .tx-storage-head { display: flex; align-items: center; justify-content: space-between; }
      .tx-storage-info { display: flex; align-items: center; gap: 0.75rem; }
      .tx-storage-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border-radius: var(--tx-radius); background: rgba(72, 95, 199, 0.1); color: var(--tx-primary); }
      .tx-storage-icon .mdi { font-size: 1.25rem; }
      .tx-fm-section-title { font-size: 0.9rem; font-weight: 600; color: var(--tx-text-heading); margin-bottom: 0.75rem; }
      .tx-folder-card { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0; transition: border-color var(--tx-transition); }
      .tx-folder-card:hover { border-color: var(--tx-primary); }
      .tx-folder-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border-radius: var(--tx-radius); background: rgba(245, 158, 11, 0.12); color: var(--tx-warning); }
      .tx-folder-icon .mdi { font-size: 1.4rem; }
      .tx-folder-meta { min-width: 0; flex: 1; }
      .tx-file-card { margin-bottom: 0; transition: border-color var(--tx-transition); }
      .tx-file-card:hover { border-color: var(--tx-primary); }
      .tx-file-card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem; }
      .tx-file-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; border-radius: var(--tx-radius); color: var(--icon-color, var(--tx-primary)); background: color-mix(in srgb, var(--icon-color, #485fc7) 12%, transparent); }
      .tx-file-icon.is-small { width: 2.25rem; height: 2.25rem; }
      .tx-file-icon .mdi { font-size: 1.4rem; }
      .tx-file-table th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tx-text-muted); }
      .tx-file-row-name { display: flex; align-items: center; gap: 0.75rem; }
      .tx-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .tx-modal-foot { justify-content: flex-end; }
    `,
  ],
})
export class FileManagerComponent {
  private readonly ui = inject(UiService);

  readonly FOLDERS: FolderItem[] = [
    { id: 'f1', name: 'Documentos', items: 24, modified: '24/05/2026' },
    { id: 'f2', name: 'Imagens', items: 132, modified: '22/05/2026' },
    { id: 'f3', name: 'Projetos', items: 9, modified: '20/05/2026' },
    { id: 'f4', name: 'Backups', items: 5, modified: '12/05/2026' },
  ];

  readonly FILES: FileItem[] = [
    { id: 'a1', name: 'Proposta-comercial.pdf', kind: 'document', size: '2,4 MB', modified: 'Hoje, 09:42' },
    { id: 'a2', name: 'Relatorio-maio.xlsx', kind: 'sheet', size: '845 KB', modified: 'Ontem, 18:11' },
    { id: 'a3', name: 'Banner-home.png', kind: 'image', size: '1,1 MB', modified: 'Ontem, 14:25' },
    { id: 'a4', name: 'Apresentacao.pdf', kind: 'document', size: '5,8 MB', modified: '23/05/2026' },
    { id: 'a5', name: 'Logo-vetor.svg', kind: 'image', size: '64 KB', modified: '22/05/2026' },
    { id: 'a6', name: 'Codigo-fonte.zip', kind: 'archive', size: '18,2 MB', modified: '20/05/2026' },
  ];

  readonly KIND_STYLE: Record<FileKind, { icon: string; color: string }> = {
    document: { icon: 'mdi-file-document', color: '#485fc7' },
    image: { icon: 'mdi-image', color: '#48c774' },
    archive: { icon: 'mdi-folder-zip', color: '#f59e0b' },
    sheet: { icon: 'mdi-file-table', color: '#3273dc' },
  };

  readonly MENU_ACTIONS: MenuAction[] = [
    { label: 'Abrir', icon: 'mdi-eye' },
    { label: 'Renomear', icon: 'mdi-pencil' },
    { label: 'Baixar', icon: 'mdi-download' },
    { label: 'Excluir', icon: 'mdi-delete', danger: true },
  ];

  readonly view = signal<'grid' | 'list'>('grid');
  readonly uploadOpen = signal(false);
  readonly openMenu = signal<string | null>(null);
  private pendingFiles: File[] = [];

  readonly usedGb = 64.5;
  readonly totalGb = 100;
  readonly usedPct = Math.round((this.usedGb / this.totalGb) * 100);

  toggleMenu(id: string): void {
    this.openMenu.update((cur) => (cur === id ? null : id));
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.openMenu.set(null);
  }

  onFiles(list: File[]): void {
    this.pendingFiles = list;
  }

  finishUpload(): void {
    this.uploadOpen.set(false);
    const count = this.pendingFiles.length;
    this.pendingFiles = [];
    this.ui.notifySuccess(
      count > 0 ? `${count} arquivo${count > 1 ? 's' : ''} enviado${count > 1 ? 's' : ''} com sucesso` : 'Arquivos enviados com sucesso'
    );
  }

  onAction(label: string): void {
    this.openMenu.set(null);
    this.ui.notifySuccess(`${label} executado`);
  }
}
