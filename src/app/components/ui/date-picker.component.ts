import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import type { Instance } from 'flatpickr/dist/types/instance';
import { UiService } from '../../core/services/ui.service';

/**
 * Date / date-time picker wrapping flatpickr, styled with Bulma.
 */
@Component({
  selector: 'app-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      @if (label()) {
        <label class="label">{{ label() }}</label>
      }
      <div class="control has-icons-left">
        <input
          #input
          type="text"
          class="input"
          [placeholder]="placeholder()"
        />
        <span class="icon is-left"><i class="mdi mdi-calendar-today"></i></span>
      </div>
    </div>
  `,
})
export class DatePickerComponent implements AfterViewInit, OnDestroy {
  private ui = inject(UiService);

  readonly label = input<string>();
  readonly placeholder = input('Selecione uma data');
  readonly showTime = input(false);
  readonly valueChange = output<Date | null>();

  private inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private fp?: Instance;

  constructor() {
    effect(() => {
      const dark = this.ui.darkMode();
      this.fp?.calendarContainer?.classList.toggle('flatpickr-dark', dark);
    });
  }

  ngAfterViewInit(): void {
    this.fp = flatpickr(this.inputRef().nativeElement, {
      enableTime: this.showTime(),
      dateFormat: this.showTime() ? 'd/m/Y H:i' : 'd/m/Y',
      locale: Portuguese,
      onChange: (dates) => this.valueChange.emit(dates[0] ?? null),
    });
  }

  ngOnDestroy(): void {
    this.fp?.destroy();
  }
}
