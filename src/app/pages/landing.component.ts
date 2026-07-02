import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LandingNavComponent } from '../components/landing/landing-nav.component';
import { HeroSectionComponent } from '../components/landing/hero-section.component';
import { FeaturesSectionComponent } from '../components/landing/features-section.component';
import { PricingSectionComponent } from '../components/landing/pricing-section.component';
import { FaqSectionComponent } from '../components/landing/faq-section.component';
import { ContactSectionComponent } from '../components/landing/contact-section.component';
import { LandingFooterComponent } from '../components/landing/landing-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingNavComponent,
    HeroSectionComponent,
    FeaturesSectionComponent,
    PricingSectionComponent,
    FaqSectionComponent,
    ContactSectionComponent,
    LandingFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tx-lp-page">
      <app-landing-nav></app-landing-nav>
      <main>
        <app-hero-section></app-hero-section>
        <app-features-section></app-features-section>
        <app-pricing-section></app-pricing-section>
        <app-faq-section></app-faq-section>
        <app-contact-section></app-contact-section>
      </main>
      <app-landing-footer></app-landing-footer>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  ngOnInit(): void {
    document.title = 'Admin Template — O template admin que acelera seu produto';
  }
}
