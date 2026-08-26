import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideBuilding2, LucideList, LucideShieldPlus, LucideUsers } from '@lucide/angular';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NavItem { readonly icon: 'list' | 'users' | 'building-2' | 'shield-plus'; readonly label: string; readonly route: string; }

@Component({
  selector: 'app-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, LucideList, LucideUsers, LucideBuilding2, LucideShieldPlus],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly scrollPositions = new WeakMap<EventTarget, number>();
  private readonly mobileQuery = '(max-width: 700px)';
  private readonly scrollThreshold = 8;

  readonly expanded = signal(false);
  readonly navigationHidden = signal(false);
  readonly expandedChange = output<boolean>();
  readonly mobileNavigationHiddenChange = output<boolean>();

  readonly navItems: readonly NavItem[] = [
    { icon: 'list', label: 'Tasks', route: '/tasks' },
    { icon: 'users', label: 'Accounts', route: '/accounts' },
    { icon: 'building-2', label: 'Claims', route: '/claims' },
    { icon: 'shield-plus', label: 'Recommendations', route: '/recommendations' },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.showNavigation());

    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;

      const handleScroll = (event: Event): void => this.updateForScroll(event, view);
      const handleResize = (): void => {
        if (!view.matchMedia(this.mobileQuery).matches || view.scrollY <= 16) this.showNavigation();
        this.scrollPositions.set(this.document, view.scrollY);
      };

      this.document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
      view.addEventListener('resize', handleResize, { passive: true });
      this.scrollPositions.set(this.document, view.scrollY);

      this.destroyRef.onDestroy(() => {
        this.document.removeEventListener('scroll', handleScroll, true);
        view.removeEventListener('resize', handleResize);
      });
    });
  }

  toggle(): void {
    this.expanded.update((expanded) => {
      const next = !expanded;
      this.expandedChange.emit(next);
      return next;
    });
  }

  showNavigation(): void {
    this.setNavigationHidden(false);
  }

  private updateForScroll(event: Event, view: Window): void {
    if (!view.matchMedia(this.mobileQuery).matches) {
      this.showNavigation();
      return;
    }

    const target = event.target ?? this.document;
    const position = target === this.document
      ? view.scrollY
      : target instanceof Element
        ? target.scrollTop
        : view.scrollY;
    const previousPosition = this.scrollPositions.get(target) ?? position;
    const delta = position - previousPosition;

    if (position <= 16) {
      this.showNavigation();
      this.scrollPositions.set(target, position);
      return;
    }

    if (Math.abs(delta) < this.scrollThreshold) return;

    this.setNavigationHidden(delta > 0);
    this.scrollPositions.set(target, position);
  }

  private setNavigationHidden(hidden: boolean): void {
    if (this.navigationHidden() === hidden) return;
    this.navigationHidden.set(hidden);
    this.mobileNavigationHiddenChange.emit(hidden);
  }
}
