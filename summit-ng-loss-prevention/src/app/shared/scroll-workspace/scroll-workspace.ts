import { AfterViewInit, Component, effect, ElementRef, inject, Injector, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-scroll-workspace',
  imports: [NgTemplateOutlet],
  host: { '[style.--scroll-workspace-height]': 'height()', '[class.is-collapsed]': 'collapsed()' },
  template: `<header #heading class="scroll-heading"><ng-container [ngTemplateOutlet]="headingTemplate()" [ngTemplateOutletContext]="templateContext()" /></header><section class="scroll-surface" [attr.aria-label]="surfaceLabel()"><ng-container [ngTemplateOutlet]="fixedTemplate()" [ngTemplateOutletContext]="templateContext()" />@if (collapsed() && compactTemplate(); as compact) { <div class="scroll-compact"><ng-container [ngTemplateOutlet]="compact" [ngTemplateOutletContext]="templateContext()" /></div> }<div #scrollBody class="scroll-body" tabindex="0" (scroll)="onScroll($event)" (scrollend)="onScrollEnd()"><ng-container [ngTemplateOutlet]="bodyTemplate()" [ngTemplateOutletContext]="templateContext()" /></div></section>`,
  styleUrl: './scroll-workspace.scss',
})
export class ScrollWorkspace implements AfterViewInit {
  readonly headingTemplate = input.required<TemplateRef<unknown>>();
  readonly fixedTemplate = input.required<TemplateRef<unknown>>();
  readonly bodyTemplate = input.required<TemplateRef<unknown>>();
  readonly compactTemplate = input<TemplateRef<unknown>>();
  readonly templateContext = input<Record<string, unknown>>({});
  readonly surfaceLabel = input('Scrollable workspace');
  readonly height = input('calc(100dvh - 50px)');
  readonly collapseThreshold = input(40);
  readonly expandThreshold = input(24);
  readonly resetKey = input<unknown>();
  readonly collapsedChange = output<boolean>();
  readonly scrollPosition = output<number>();

  private readonly injector = inject(Injector);
  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');
  private readonly scrollBody = viewChild.required<ElementRef<HTMLElement>>('scrollBody');
  private headingTween: gsap.core.Tween | undefined;
  private transitioning = false;
  private lastScrollTop = 0;
  private collapseQueued = false;
  private scrollSettled = false;
  private resetReady = false;
  readonly collapsed = signal(false);

  ngAfterViewInit(): void {
    effect(() => {
      this.resetKey();
      if (this.resetReady) this.setCollapsed(false);
      this.resetReady = true;
    }, { injector: this.injector });
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    const scrollingDown = scrollTop > this.lastScrollTop;
    this.lastScrollTop = scrollTop;
    this.scrollPosition.emit(scrollTop);
    if (this.transitioning) return;

    if (!this.collapsed()) {
      if (this.collapseQueued && this.scrollSettled && scrollingDown) {
        this.collapseQueued = false;
        this.scrollSettled = false;
        this.setCollapsed(true);
      } else if (scrollTop > this.collapseThreshold()) {
        this.collapseQueued = true;
      } else {
        this.collapseQueued = false;
        this.scrollSettled = false;
      }
    } else if (scrollTop < this.expandThreshold()) {
      this.setCollapsed(false);
    }
  }

  onScrollEnd(): void {
    if (!this.collapsed() && this.lastScrollTop > this.collapseThreshold()) this.scrollSettled = true;
  }

  private setCollapsed(collapsed: boolean): void {
    if (this.collapsed() === collapsed || this.transitioning) return;
    this.collapsed.set(collapsed);
    this.collapsedChange.emit(collapsed);
    const heading = this.heading().nativeElement;
    const scrollBody = this.scrollBody().nativeElement;
    const scrollTop = Math.max(scrollBody.scrollTop, this.lastScrollTop);
    const scrollBehavior = scrollBody.style.scrollBehavior;
    scrollBody.style.scrollBehavior = 'auto';
    const preserveScrollPosition = () => scrollBody.scrollTop = scrollTop;
    this.headingTween?.kill();
    this.transitioning = true;
    this.headingTween = gsap.to(heading, {
      height: collapsed ? 0 : heading.scrollHeight,
      autoAlpha: collapsed ? 0 : 1,
      marginBottom: collapsed ? 0 : 28,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: true,
      onUpdate: preserveScrollPosition,
      onComplete: () => {
        if (!collapsed) gsap.set(heading, { clearProps: 'height,opacity,visibility,marginBottom' });
        gsap.delayedCall(0.016, () => {
          preserveScrollPosition();
          scrollBody.style.scrollBehavior = scrollBehavior;
          this.transitioning = false;
        });
      },
    });
  }
}
