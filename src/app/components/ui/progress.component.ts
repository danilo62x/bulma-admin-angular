import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <progress class="progress" [class]="typeClass + ' ' + sizeClass" [value]="value === null ? null : value" max="100">
      {{ value }}%
    </progress>
  `,
})
export class ProgressComponent {
  @Input() value: number | null = null;
  @Input() type: 'is-primary' | 'is-success' | 'is-info' | 'is-warning' | 'is-danger' | '' = 'is-primary';
  @Input() size: 'is-small' | 'is-medium' | 'is-large' | '' = '';

  get typeClass(): string { return this.type; }
  get sizeClass(): string { return this.size; }
}
