import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

/**
 * Rich-text editor wrapping ngx-quill (Quill, snow theme). Works with ngModel /
 * reactive forms via ControlValueAccessor; emits HTML.
 */
@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [QuillModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RichTextEditorComponent), multi: true },
  ],
  template: `
    <div class="box" style="padding: 0; overflow: hidden;">
      <quill-editor
        [styles]="{ minHeight: '10rem', border: 'none' }"
        [placeholder]="placeholder()"
        [modules]="modules"
        [ngModel]="value"
        (onContentChanged)="onChanged($event.html ?? '')"
        (onBlur)="onTouched()"
      />
    </div>
  `,
})
export class RichTextEditorComponent implements ControlValueAccessor {
  readonly placeholder = input('Escreva algo...');

  protected value = '';
  protected modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  protected onChange: (val: string) => void = () => {};
  protected onTouched: () => void = () => {};

  onChanged(html: string) {
    this.value = html;
    this.onChange(html);
  }

  writeValue(val: string): void {
    this.value = val ?? '';
  }
  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
