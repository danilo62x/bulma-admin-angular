import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, startWith } from 'rxjs';
import { UiService } from '../../core/services/ui.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuService, MenuItem } from '../../core/services/menu.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="tx-sidebar"
      [class.is-collapsed]="ui.sidebarCollapsed()"
      [class.is-mobile-open]="ui.sidebarMobileOpen()"
      [ngStyle]="sidebarStyle()"
    >
      <div class="tx-sidebar-brand">
        <div class="tx-sidebar-icon-box">A</div>
        <span class="tx-sidebar-brand-text">Admin Template</span>
      </div>

      <nav class="tx-sidebar-nav">
        <ng-container *ngFor="let item of menu.items">
          <!-- Has children: level 1 parent -->
          <ng-container *ngIf="item.children?.length; else level1Leaf">
            <div
              class="tx-nav-item"
              [class.is-active]="isGroupActive(item)"
              (click)="toggleGroup(item.label)"
            >
              <span class="tx-nav-icon mdi" [class]="item.icon"></span>
              <span class="tx-nav-label">{{ item.label }}</span>
              <span
                class="tx-nav-chevron mdi mdi-chevron-down"
                [class.is-open]="openGroups().has(item.label)"
              ></span>
            </div>
            <div
              class="tx-nav-submenu"
              [class.is-open]="openGroups().has(item.label) && !ui.sidebarCollapsed()"
            >
              <ng-container *ngFor="let child of item.children!">
                <!-- Level 2 parent -->
                <ng-container *ngIf="child.children?.length; else level2Leaf">
                  <div
                    class="tx-nav-subgroup"
                    [class.is-active]="isGroupActive(child)"
                    (click)="$event.stopPropagation(); toggleGroup(child.label)"
                  >
                    <span class="mdi" [class]="child.icon" style="font-size: 1rem;"></span>
                    {{ child.label }}
                    <span
                      class="tx-nav-subgroup-chevron mdi mdi-chevron-down"
                      [class.is-open]="openGroups().has(child.label)"
                    ></span>
                  </div>
                  <div
                    class="tx-nav-subsubmenu"
                    [class.is-open]="openGroups().has(child.label)"
                  >
                    <a
                      *ngFor="let grand of child.children!"
                      [routerLink]="grand.href ?? '#'"
                      class="tx-nav-subsubitem"
                      [class.is-active]="isActive(grand.href)"
                      (click)="onNavClick()"
                    >
                      <span class="mdi" [class]="grand.icon" style="margin-right: 0.4rem; font-size: 0.9rem;"></span>
                      {{ grand.label }}
                    </a>
                  </div>
                </ng-container>
                <ng-template #level2Leaf>
                  <a
                    [routerLink]="child.href ?? '#'"
                    class="tx-nav-subitem"
                    [class.is-active]="isActive(child.href)"
                    (click)="onNavClick()"
                  >
                    <span class="mdi" [class]="child.icon" style="margin-right: 0.5rem; font-size: 1rem;"></span>
                    {{ child.label }}
                  </a>
                </ng-template>
              </ng-container>
            </div>
          </ng-container>

          <ng-template #level1Leaf>
            <a
              [routerLink]="item.href ?? '#'"
              class="tx-nav-item"
              [class.is-active]="isActive(item.href)"
              (click)="onNavClick()"
            >
              <span class="tx-nav-icon mdi" [class]="item.icon"></span>
              <span class="tx-nav-label">{{ item.label }}</span>
            </a>
          </ng-template>
        </ng-container>
      </nav>

      <div class="tx-sidebar-footer">
        <div
          *ngFor="let item of menu.footerItems"
          class="tx-nav-item"
          (click)="handleFooterAction(item)"
        >
          <span class="tx-nav-icon mdi" [class]="item.icon"></span>
          <span class="tx-nav-label">{{ item.label }}</span>
        </div>
      </div>

      <div
        *ngIf="!ui.sidebarCollapsed()"
        class="tx-resize-handle"
        [class.is-resizing]="isResizing()"
        (mousedown)="startResize($event)"
      ></div>
    </aside>
  `,
})
export class AppSidebarComponent implements OnInit {
  readonly ui = inject(UiService);
  readonly auth = inject(AuthService);
  readonly menu = inject(MenuService);
  private readonly router = inject(Router);

  readonly currentUrl = signal<string>('/');
  readonly openGroups = signal<Set<string>>(new Set());
  readonly isResizing = signal<boolean>(false);

  readonly sidebarStyle = computed(() => {
    if (this.ui.sidebarCollapsed()) return {};
    return {
      width: `${this.ui.sidebarWidth()}px`,
      'min-width': `${this.ui.sidebarWidth()}px`,
    };
  });

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), startWith(null))
      .subscribe(() => {
        this.currentUrl.set(this.router.url);
        this.autoOpenActiveGroups();
      });
  }

  isActive(href?: string): boolean {
    if (!href) return false;
    const url = this.currentUrl();
    return url === href || url.startsWith(href + '/');
  }

  isGroupActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some((c) => {
      if (c.children?.length) return this.isGroupActive(c);
      return this.isActive(c.href);
    });
  }

  toggleGroup(label: string): void {
    this.openGroups.update((set) => {
      const next = new Set(set);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  onNavClick(): void {
    if (window.innerWidth <= 768) this.ui.toggleSidebarMobile(false);
  }

  handleFooterAction(item: MenuItem): void {
    if (item.action === 'logout') {
      this.auth.logout();
      this.router.navigateByUrl('/login');
    } else if (item.href) {
      this.router.navigateByUrl(item.href);
      this.onNavClick();
    }
  }

  startResize(e: MouseEvent): void {
    this.isResizing.set(true);
    const startX = e.clientX;
    const startWidth = this.ui.sidebarWidth();
    const onMove = (ev: MouseEvent) => this.ui.setSidebarWidth(startWidth + (ev.clientX - startX));
    const onUp = () => {
      this.isResizing.set(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  private autoOpenActiveGroups(): void {
    this.openGroups.update((set) => {
      const next = new Set(set);
      const walk = (items: MenuItem[]) => {
        items.forEach((item) => {
          if (item.children?.length) {
            const hasActive = item.children.some((c) =>
              c.children?.length ? c.children.some((g) => this.isActive(g.href)) : this.isActive(c.href)
            );
            if (hasActive) next.add(item.label);
            item.children.forEach((child) => {
              if (child.children?.length) {
                if (child.children.some((g) => this.isActive(g.href))) next.add(child.label);
              }
            });
          }
        });
      };
      walk(this.menu.items);
      return next;
    });
  }
}
