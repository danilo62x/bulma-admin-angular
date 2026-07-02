import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

/**
 * Drag-and-drop file upload (native HTML5), styled with Bulma + tx tokens,
 * with an inline list + remove.
 */
@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <label
        class="tx-dropzone"
        [class.is-active]="dragging()"
        (dragover)="$event.preventDefault(); dragging.set(true)"
        (dragleave)="$event.preventDefault(); dragging.set(false)"
        (drop)="onDrop($event)"
      >
        <input type="file" class="is-hidden" [accept]="accept()" multiple (change)="onPick($event)" />
        <span class="mdi mdi-cloud-upload tx-dropzone-icon"></span>
        <p class="has-text-weight-medium">
          {{ dragging() ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para enviar' }}
        </p>
        <p class="is-size-7 has-text-grey">Até {{ maxFiles() }} arquivos</p>
      </label>

      <ul *ngIf="files().length" style="margin-top: 0.75rem;">
        <li *ngFor="let file of files(); let idx = index" class="tx-file-row">
          <span class="mdi mdi-file-outline" style="margin-right: 0.5rem;"></span>
          <span class="tx-file-name">{{ file.name }}</span>
          <span class="is-size-7 has-text-grey" style="margin-left: 0.5rem;">{{ formatSize(file.size) }}</span>
          <button class="delete is-small" style="margin-left: auto;" (click)="remove(idx)"></button>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .tx-dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 2rem;
        text-align: center;
        border: 2px dashed var(--tx-border, #d0d5dd);
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.15s;
      }
      .tx-dropzone:hover,
      .tx-dropzone.is-active {
        border-color: var(--tx-primary, #485fc7);
      }
      .tx-dropzone-icon {
        font-size: 2rem;
        color: var(--tx-primary, #485fc7);
      }
      .tx-file-row {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--tx-border, #e4e7ec);
        border-radius: 6px;
        margin-bottom: 0.5rem;
      }
      .tx-file-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
  ],
})
export class FileDropzoneComponent {
  readonly accept = input<string>('');
  readonly maxFiles = input(5);
  readonly filesChange = output<File[]>();

  protected files = signal<File[]>([]);
  protected dragging = signal(false);

  private add(list: FileList | null) {
    if (!list) return;
    const next = [...this.files(), ...Array.from(list)].slice(0, this.maxFiles());
    this.files.set(next);
    this.filesChange.emit(next);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragging.set(false);
    this.add(e.dataTransfer?.files ?? null);
  }

  onPick(e: Event) {
    this.add((e.target as HTMLInputElement).files);
  }

  remove(idx: number) {
    const next = this.files().filter((_, i) => i !== idx);
    this.files.set(next);
    this.filesChange.emit(next);
  }

  formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}
