import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') label = '';
  @Input() tooltipType: 'is-dark' | 'is-success' | 'is-warning' | 'is-danger' | 'is-info' = 'is-dark';
  @Input() tooltipPosition: 'is-top' | 'is-right' | 'is-bottom' | 'is-left' = 'is-top';

  private tipEl: HTMLElement | null = null;

  constructor(private host: ElementRef<HTMLElement>, private r: Renderer2) {}

  @HostListener('mouseenter')
  onEnter(): void {
    if (!this.label) return;
    if (this.tipEl) return;
    const el = this.r.createElement('span') as HTMLElement;
    this.r.addClass(el, 'tx-tooltip-fixed');
    el.textContent = this.label;
    this.r.setStyle(el, 'position', 'absolute');
    this.r.setStyle(el, 'background', '#363636');
    this.r.setStyle(el, 'color', 'white');
    this.r.setStyle(el, 'font-size', '0.72rem');
    this.r.setStyle(el, 'padding', '0.3rem 0.6rem');
    this.r.setStyle(el, 'border-radius', '4px');
    this.r.setStyle(el, 'white-space', 'nowrap');
    this.r.setStyle(el, 'pointer-events', 'none');
    this.r.setStyle(el, 'z-index', '500');
    this.r.appendChild(document.body, el);

    const rect = this.host.nativeElement.getBoundingClientRect();
    const tipRect = el.getBoundingClientRect();
    let top = 0, left = 0;
    switch (this.tooltipPosition) {
      case 'is-top':
        top = rect.top - tipRect.height - 6 + window.scrollY;
        left = rect.left + rect.width / 2 - tipRect.width / 2 + window.scrollX;
        break;
      case 'is-bottom':
        top = rect.bottom + 6 + window.scrollY;
        left = rect.left + rect.width / 2 - tipRect.width / 2 + window.scrollX;
        break;
      case 'is-right':
        top = rect.top + rect.height / 2 - tipRect.height / 2 + window.scrollY;
        left = rect.right + 6 + window.scrollX;
        break;
      case 'is-left':
        top = rect.top + rect.height / 2 - tipRect.height / 2 + window.scrollY;
        left = rect.left - tipRect.width - 6 + window.scrollX;
        break;
    }
    this.r.setStyle(el, 'top', `${top}px`);
    this.r.setStyle(el, 'left', `${left}px`);
    this.tipEl = el;
  }

  @HostListener('mouseleave')
  @HostListener('click')
  onLeave(): void {
    this.dispose();
  }

  ngOnDestroy(): void { this.dispose(); }

  private dispose(): void {
    if (this.tipEl) {
      this.r.removeChild(document.body, this.tipEl);
      this.tipEl = null;
    }
  }
}
