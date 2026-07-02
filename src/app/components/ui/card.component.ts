import { ChangeDetectionStrategy, Component, Input, contentChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgTemplateOutlet, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-card">
      <div *ngIf="title || titleTpl() || toolbarTpl()" class="tx-card-header">
        <span *ngIf="icon" class="mdi tx-card-header-icon" [class]="icon"></span>
        <span class="tx-card-title">
          <ng-container *ngIf="titleTpl(); else titleText">
            <ng-container *ngTemplateOutlet="titleTpl()!"></ng-container>
          </ng-container>
          <ng-template #titleText>{{ title }}</ng-template>
        </span>
        <ng-container *ngIf="toolbarTpl()">
          <ng-container *ngTemplateOutlet="toolbarTpl()!"></ng-container>
        </ng-container>
      </div>
      <div class="tx-card-body" [style.padding]="noPadding ? '0' : null">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footerTpl()" class="tx-card-footer">
        <ng-container *ngTemplateOutlet="footerTpl()!"></ng-container>
      </div>
    </div>
  `,
})
export class CardComponent {
  @Input() title?: string;
  @Input() icon?: string;
  @Input() noPadding = false;

  readonly titleTpl = contentChild<TemplateRef<unknown>>('title');
  readonly toolbarTpl = contentChild<TemplateRef<unknown>>('toolbar');
  readonly footerTpl = contentChild<TemplateRef<unknown>>('footer');
}
