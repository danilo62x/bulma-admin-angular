import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { CardComponent } from '../components/ui/card.component';

interface ScaleItem { label: string; size: string; usage: string; bold: boolean; }
interface ColorItem { class: string; label: string; }

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [NgFor, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <app-card title="Títulos" icon="mdi-format-header-1">
        <div class="tx-typo-section">
          <h1 class="title is-1">Título Nível 1 <span class="tx-typo-badge">.title.is-1</span></h1>
          <h2 class="title is-2">Título Nível 2 <span class="tx-typo-badge">.title.is-2</span></h2>
          <h3 class="title is-3">Título Nível 3 <span class="tx-typo-badge">.title.is-3</span></h3>
          <h4 class="title is-4">Título Nível 4 <span class="tx-typo-badge">.title.is-4</span></h4>
          <h5 class="title is-5">Título Nível 5 <span class="tx-typo-badge">.title.is-5</span></h5>
          <h6 class="title is-6">Título Nível 6 <span class="tx-typo-badge">.title.is-6</span></h6>
        </div>
      </app-card>

      <app-card title="Subtítulos" icon="mdi-format-header-2" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-section">
          <p class="subtitle is-3">Subtítulo tamanho 3 <span class="tx-typo-badge">.subtitle.is-3</span></p>
          <p class="subtitle is-4">Subtítulo tamanho 4 <span class="tx-typo-badge">.subtitle.is-4</span></p>
          <p class="subtitle is-5">Subtítulo tamanho 5 <span class="tx-typo-badge">.subtitle.is-5</span></p>
          <p class="subtitle is-6">Subtítulo tamanho 6 <span class="tx-typo-badge">.subtitle.is-6</span></p>
        </div>
      </app-card>

      <app-card title="Tamanhos de Texto" icon="mdi-format-size" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-section">
          <p class="is-size-1">Tamanho 1 — 3rem <span class="tx-typo-badge">.is-size-1</span></p>
          <p class="is-size-2">Tamanho 2 — 2.5rem <span class="tx-typo-badge">.is-size-2</span></p>
          <p class="is-size-3">Tamanho 3 — 2rem <span class="tx-typo-badge">.is-size-3</span></p>
          <p class="is-size-4">Tamanho 4 — 1.5rem <span class="tx-typo-badge">.is-size-4</span></p>
          <p class="is-size-5">Tamanho 5 — 1.25rem <span class="tx-typo-badge">.is-size-5</span></p>
          <p class="is-size-6">Tamanho 6 — 1rem (padrão) <span class="tx-typo-badge">.is-size-6</span></p>
          <p class="is-size-7">Tamanho 7 — 0.75rem <span class="tx-typo-badge">.is-size-7</span></p>
        </div>
      </app-card>

      <div class="columns" style="margin-top: 1rem;">
        <div class="column is-6">
          <app-card title="Pesos de Fonte" icon="mdi-format-bold">
            <div class="tx-typo-weight-list">
              <p class="has-text-weight-light">Light — 300 <span class="tx-typo-badge">.has-text-weight-light</span></p>
              <p class="has-text-weight-normal">Normal — 400 <span class="tx-typo-badge">.has-text-weight-normal</span></p>
              <p class="has-text-weight-medium">Medium — 500 <span class="tx-typo-badge">.has-text-weight-medium</span></p>
              <p class="has-text-weight-semibold">Semibold — 600 <span class="tx-typo-badge">.has-text-weight-semibold</span></p>
              <p class="has-text-weight-bold">Bold — 700 <span class="tx-typo-badge">.has-text-weight-bold</span></p>
            </div>
          </app-card>
        </div>
        <div class="column is-6">
          <app-card title="Transformações" icon="mdi-format-letter-case">
            <div class="tx-typo-weight-list">
              <p class="is-capitalized">capitalized text <span class="tx-typo-badge">.is-capitalized</span></p>
              <p class="is-lowercase">LOWERCASE TEXT <span class="tx-typo-badge">.is-lowercase</span></p>
              <p class="is-uppercase">uppercase text <span class="tx-typo-badge">.is-uppercase</span></p>
              <p class="is-italic">Texto em itálico <span class="tx-typo-badge">.is-italic</span></p>
              <p><del>Texto riscado</del> com <code>&lt;del&gt;</code></p>
              <p><u>Texto sublinhado</u> com <code>&lt;u&gt;</code></p>
            </div>
          </app-card>
        </div>
      </div>

      <app-card title="Cores de Texto" icon="mdi-palette" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-colors-grid">
          <div *ngFor="let c of textColors" class="tx-typo-color-item">
            <p [class]="c.class" style="font-size: 0.95rem; font-weight: 600;">{{ c.label }}</p>
            <code class="tx-typo-badge">{{ c.class }}</code>
          </div>
          <div class="tx-typo-color-item">
            <p style="color: var(--tx-primary); font-size: 0.95rem; font-weight: 600;">Primary Token</p>
            <code class="tx-typo-badge">--tx-primary</code>
          </div>
          <div class="tx-typo-color-item">
            <p style="color: var(--tx-text-muted); font-size: 0.95rem; font-weight: 600;">Muted Token</p>
            <code class="tx-typo-badge">--tx-text-muted</code>
          </div>
          <div class="tx-typo-color-item">
            <p style="color: var(--tx-text-heading); font-size: 0.95rem; font-weight: 600;">Heading Token</p>
            <code class="tx-typo-badge">--tx-text-heading</code>
          </div>
        </div>
      </app-card>

      <app-card title="Alinhamento de Texto" icon="mdi-format-align-left" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-align-list">
          <p class="has-text-left tx-typo-align-item">Alinhado à esquerda <span class="tx-typo-badge">.has-text-left</span></p>
          <p class="has-text-centered tx-typo-align-item">Centralizado <span class="tx-typo-badge">.has-text-centered</span></p>
          <p class="has-text-right tx-typo-align-item">Alinhado à direita <span class="tx-typo-badge">.has-text-right</span></p>
          <p class="has-text-justified tx-typo-align-item">
            Justificado: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            <span class="tx-typo-badge">.has-text-justified</span>
          </p>
        </div>
      </app-card>

      <app-card title="Elementos Inline" icon="mdi-code-tags" style="margin-top: 1rem; display: block;">
        <div class="content" style="font-size: 0.9rem;">
          <p>
            Use <strong>negrito</strong> com <code>&lt;strong&gt;</code>,
            <em>itálico</em> com <code>&lt;em&gt;</code>,
            <small>pequeno</small> com <code>&lt;small&gt;</code>,
            e <code>código inline</code> com <code>&lt;code&gt;</code>.
          </p>
          <p>
            Abreviação: <abbr title="HyperText Markup Language">HTML</abbr>.
            Referência: <cite>Design Systems</cite>.
            Tecla: <kbd>Ctrl</kbd> + <kbd>C</kbd>.
            Variável: <var>x</var> = <var>y</var> + 2.
          </p>
          <blockquote>
            "A boa tipografia cria harmonia entre forma e função."
            <footer>— Ellen Lupton</footer>
          </blockquote>
        </div>
      </app-card>

      <app-card title="Escala do Design System" icon="mdi-ruler" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-scale-grid">
          <div *ngFor="let s of scaleItems" class="tx-typo-scale-item">
            <p [style.font-size]="s.size" [style.color]="'var(--tx-text-heading)'" [style.font-weight]="s.bold ? '700' : '400'" style="line-height: 1.3;">Aa</p>
            <div class="tx-typo-scale-meta">
              <strong>{{ s.label }}</strong>
              <span>{{ s.size }} · {{ s.usage }}</span>
            </div>
          </div>
        </div>
      </app-card>

      <app-card title="Stack de Fontes" icon="mdi-format-font" style="margin-top: 1rem; display: block;">
        <div class="tx-typo-font-stack">
          <div class="tx-typo-font-item">
            <p style="font-family: 'Inter', sans-serif; font-size: 1.5rem; font-weight: 700;">
              Inter — Aa Bb Cc Dd Ee 0123456789
            </p>
            <code class="tx-typo-badge">$family-sans-serif (primária)</code>
          </div>
          <div class="tx-typo-font-item" style="margin-top: 1rem;">
            <p style="font-family: 'Cascadia Code', 'Consolas', monospace; font-size: 1.1rem;">
              Cascadia Code — const fn = (x) =&gt; x * 2;
            </p>
            <code class="tx-typo-badge">monospace (código)</code>
          </div>
        </div>
      </app-card>
    </div>
  `,
})
export class TypographyComponent {
  readonly textColors: ColorItem[] = [
    { class: 'has-text-primary', label: 'Primary' },
    { class: 'has-text-link', label: 'Link' },
    { class: 'has-text-info', label: 'Info' },
    { class: 'has-text-success', label: 'Success' },
    { class: 'has-text-warning', label: 'Warning' },
    { class: 'has-text-danger', label: 'Danger' },
    { class: 'has-text-dark', label: 'Dark' },
    { class: 'has-text-grey', label: 'Grey' },
    { class: 'has-text-grey-light', label: 'Grey Light' },
  ];

  readonly scaleItems: ScaleItem[] = [
    { label: 'Display', size: '2rem', usage: 'Títulos de página', bold: true },
    { label: 'H1', size: '1.6rem', usage: 'Seção principal', bold: true },
    { label: 'H2', size: '1.3rem', usage: 'Seção secundária', bold: true },
    { label: 'H3', size: '1.1rem', usage: 'Card title', bold: true },
    { label: 'Body', size: '1rem', usage: 'Texto corrido', bold: false },
    { label: 'Small', size: '0.875rem', usage: 'Labels, meta', bold: false },
    { label: 'Caption', size: '0.75rem', usage: 'Badges, timestamps', bold: false },
  ];
}
