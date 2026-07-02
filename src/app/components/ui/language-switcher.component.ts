import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { LANGUAGES, type LanguageCode } from '../../core/transloco-loader';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-dropdown is-left" [class.is-active]="open()" (click)="$event.stopPropagation()">
      <button
        class="button is-ghost tx-icon-btn"
        [title]="current().label"
        aria-label="Idioma"
        (click)="open.set(!open())"
      >
        <span style="font-size: 1.1rem;">{{ current().flag }}</span>
      </button>
      <div class="tx-dropdown-menu" style="min-width: 180px;">
        <a
          *ngFor="let lang of languages"
          class="dropdown-item"
          [class.has-text-weight-semibold]="lang.code === current().code"
          (click)="choose(lang.code)"
        >
          <span style="margin-right: 0.5rem;">{{ lang.flag }}</span>
          {{ lang.label }}
          <span *ngIf="lang.code === current().code" class="mdi mdi-check" style="float: right;"></span>
        </a>
      </div>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  private transloco = inject(TranslocoService);
  protected readonly languages = LANGUAGES;
  protected open = signal(false);
  protected active = signal<string>(this.transloco.getActiveLang());

  protected current = () => this.languages.find((l) => l.code === this.active()) ?? this.languages[0];

  choose(code: LanguageCode) {
    this.transloco.setActiveLang(code);
    this.active.set(code);
    try {
      localStorage.setItem('lang', code);
    } catch {}
    this.open.set(false);
  }

  @HostListener('document:click')
  onDocClick() {
    this.open.set(false);
  }
}
