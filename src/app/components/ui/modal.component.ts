import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" class="modal is-active">
      <div class="modal-background" (click)="onBackdrop()"></div>
      <div class="modal-card" [style.width]="width" [style.max-width]="'100%'">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Input() width = '500px';
  @Input() closeOnBackdrop = true;
  @Output() openChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  onBackdrop(): void {
    if (this.closeOnBackdrop) this.close();
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}
