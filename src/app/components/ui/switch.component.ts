import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchComponent), multi: true },
  ],
  template: `
    <label class="tx-switch" [class]="typeClass + ' ' + sizeClass" [class.is-disabled]="disabled">
      <input
        type="checkbox"
        [checked]="value"
        [disabled]="disabled"
        (change)="onToggle($event)"
      />
      <span class="tx-switch-track">
        <span class="tx-switch-thumb"></span>
      </span>
      <span class="tx-switch-label"><ng-content></ng-content></span>
    </label>
  `,
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() value = false;
  @Input() type: 'is-primary' | 'is-success' | 'is-info' | 'is-warning' | 'is-danger' = 'is-primary';
  @Input() size: 'is-small' | 'is-medium' | 'is-large' | '' = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<boolean>();

  private onChangeFn: (v: boolean) => void = () => {};
  private onTouchedFn: () => void = () => {};

  get typeClass(): string {
    return this.type;
  }
  get sizeClass(): string {
    return this.size;
  }

  onToggle(e: Event): void {
    if (this.disabled) return;
    const v = (e.target as HTMLInputElement).checked;
    this.value = v;
    this.valueChange.emit(v);
    this.onChangeFn(v);
    this.onTouchedFn();
  }

  writeValue(v: boolean): void { this.value = !!v; }
  registerOnChange(fn: (v: boolean) => void): void { this.onChangeFn = fn; }
  registerOnTouched(fn: () => void): void { this.onTouchedFn = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
