import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { UiService } from '../../core/services/ui.service';
import { AppSidebarComponent } from './app-sidebar.component';
import { AppHeaderComponent } from './app-header.component';
import { FooterBarComponent } from './footer-bar.component';
import { CookieBannerComponent } from '../ui/cookie-banner.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgStyle,
    RouterOutlet,
    AppSidebarComponent,
    AppHeaderComponent,
    FooterBarComponent,
    CookieBannerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-layout">
      <app-sidebar></app-sidebar>

      <div
        class="tx-backdrop"
        [class.is-active]="ui.sidebarMobileOpen()"
        (click)="ui.toggleSidebarMobile(false)"
      ></div>

      <div
        class="tx-main"
        [class.sidebar-collapsed]="ui.sidebarCollapsed()"
        [ngStyle]="mainStyle()"
      >
        <app-header></app-header>
        <main class="tx-content">
          <router-outlet></router-outlet>
        </main>
        <app-footer-bar></app-footer-bar>
      </div>

      <div class="tx-notifications">
        <div
          *ngFor="let notif of ui.notifications(); trackBy: trackById"
          class="tx-notification notification"
          [ngClass]="notif.type"
        >
          <button class="delete" (click)="ui.dismissNotification(notif.id)"></button>
          {{ notif.message }}
        </div>
      </div>

      <app-cookie-banner></app-cookie-banner>
    </div>
  `,
})
export class AppLayoutComponent implements OnInit {
  readonly ui = inject(UiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly mainStyle = computed(() => {
    if (this.ui.sidebarCollapsed()) return {};
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return {};
    return { 'margin-left': `${this.ui.sidebarWidth()}px` };
  });

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.findDeepestChild(this.route.snapshot);
        const title = child.data?.['title'] as string | undefined;
        if (title) this.ui.setPageTitle(title);
      });
    // Apply current title on init
    const child = this.findDeepestChild(this.route.snapshot);
    const title = child.data?.['title'] as string | undefined;
    if (title) this.ui.setPageTitle(title);
  }

  trackById = (_: number, n: { id: number }) => n.id;

  private findDeepestChild(snap: any): any {
    while (snap.firstChild) snap = snap.firstChild;
    return snap;
  }
}
