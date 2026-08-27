import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { gsap } from 'gsap';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideArrowLeft, LucideCheckCircle2, LucideChevronLeft, LucideChevronRight, LucideCircle, LucidePhone, LucidePrinter } from '@lucide/angular';
import { TopNavigation } from '../../shared/top-navigation/top-navigation';
import { PhotoUploadDialog } from '../../shared/photo-upload-dialog/photo-upload-dialog';
import { DocumentUploadDialog } from '../../shared/document-upload-dialog/document-upload-dialog';
import { AttachmentDialogState } from '../../shared/attachment-dialog-state/attachment-dialog-state';
import { LossPreventionContactsState } from '../../shared/loss-prevention-contacts-state/loss-prevention-contacts-state';
import { WorkspaceData } from '../../shared/workspace-data/workspace-data';

interface TaskFormLink {
  readonly completed: boolean;
  readonly label: string;
  readonly slug: string;
}

@Component({
  selector: 'app-policy-context-layout',
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, LucideArrowLeft, LucideCheckCircle2, LucideChevronLeft, LucideChevronRight, LucideCircle, LucidePhone, LucidePrinter, TopNavigation, PhotoUploadDialog, DocumentUploadDialog],
  templateUrl: './policy-context-layout.html',
  styleUrl: './policy-context-layout.scss',
})
export class PolicyContextLayout {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workspaceData = inject(WorkspaceData);
  private readonly dialogState = inject(AttachmentDialogState);
  private readonly contactsState = inject(LossPreventionContactsState);
  private readonly contextSidebar = viewChild<ElementRef<HTMLElement>>('contextSidebar');

  readonly policyId = toSignal(this.route.paramMap.pipe(map((params) => params.get('policyId') ?? '0190-00765')), { initialValue: this.route.snapshot.paramMap.get('policyId') ?? '0190-00765' });
  readonly currentUrl = toSignal(this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), map((event) => event.urlAfterRedirects)), { initialValue: this.router.url });
  readonly policy = computed(() => this.workspaceData.policyFor(this.policyId()));
  readonly taskDetail = computed(() => /\/tasks\/[^/?]+/.test(this.currentUrl()));
  readonly policyBackVisible = computed(() => /\/claims\/[^/?]+/.test(this.currentUrl()));
  readonly taskId = computed(() => {
    const url = this.currentUrl();
    return url.match(/\/tasks\/([^/?]+)/)?.[1]
      ?? new URLSearchParams(url.split('?')[1] ?? '').get('taskId');
  });
  readonly displayedTaskDetail = signal(false);
  readonly displayedTaskId = signal<string | null>(null);
  readonly displayedPolicyBackVisible = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly claimId = computed(() => this.currentUrl().match(/\/claims\/([^/?]+)/)?.[1] ?? new URLSearchParams(this.currentUrl().split('?')[1] ?? '').get('claimId'));
  readonly highSeverityRecommendationCount = 3;
  readonly photoDialogOpen = this.dialogState.photoOpen;
  readonly documentDialogOpen = this.dialogState.documentOpen;
  readonly forms: readonly TaskFormLink[] = [
    { label: 'Loss Runs & Recommendations', slug: 'lr-and-r', completed: true },
    { label: 'Risk and safety evaluation', slug: 'rse', completed: false },
    { label: 'Service frequency change', slug: 'service-frequency-change', completed: false },
    { label: 'Underwriting alert', slug: 'alert-uw', completed: false },
  ];

  private sidebarInitialized = false;
  private sidebarTransitionId = 0;
  private activeSidebarTimeline: gsap.core.Timeline | undefined;

  constructor() {
    effect(() => {
      const taskDetail = this.taskDetail();
      const taskId = this.taskId();
      const policyBackVisible = this.policyBackVisible();
      const transitionId = ++this.sidebarTransitionId;
      setTimeout(() => this.transitionSidebar(taskDetail, taskId, policyBackVisible, transitionId), 0);
    });
  }

  openPhotoDialog(): void { this.dialogState.openPhoto(); }
  closePhotoDialog(): void { this.dialogState.closePhoto(); }
  openDocumentDialog(): void { this.dialogState.openDocument(); }
  closeDocumentDialog(): void { this.dialogState.closeDocument(); }
  openContacts(): void { this.contactsState.requestOpen(); }
  toggleSidebar(): void { this.sidebarCollapsed.update((collapsed) => !collapsed); }
  contextQueryParams(): Record<string, string> | null { return this.claimId() ? { claimId: this.claimId() as string } : null; }
  claimsTableQueryParams(): Record<string, string> | null { return this.taskId() ? { taskId: this.taskId() as string } : null; }
  policyBackLabel(): string { return this.currentUrl().includes('/tasks') ? 'Back to policy tasks' : 'Back to claims'; }
  policyBackRoute(): string[] { return this.currentUrl().includes('/tasks') ? ['/policies', this.policyId(), 'tasks'] : ['/policies', this.policyId(), 'claims']; }

  private transitionSidebar(taskDetail: boolean, taskId: string | null, policyBackVisible: boolean, transitionId: number): void {
    const sidebar = this.contextSidebar()?.nativeElement;
    if (!sidebar || typeof window === 'undefined' || transitionId !== this.sidebarTransitionId) return;

    const contextChanged = this.displayedTaskDetail() !== taskDetail
      || (taskDetail && this.displayedTaskId() !== taskId)
      || (!taskDetail && this.displayedPolicyBackVisible() !== policyBackVisible);
    if (this.sidebarInitialized && !contextChanged) return;

    if (!this.sidebarInitialized) {
      this.sidebarInitialized = true;
      this.displayedTaskDetail.set(taskDetail);
      this.displayedTaskId.set(taskId);
      this.displayedPolicyBackVisible.set(policyBackVisible);
      this.animateSidebarEntry(sidebar, taskDetail, transitionId);
      return;
    }

    const sidebarItems = this.sidebarItems(sidebar);
    this.activeSidebarTimeline?.kill();
    gsap.killTweensOf(sidebarItems);
    const direction = taskDetail ? -1 : 1;
    this.activeSidebarTimeline = gsap.timeline({
      onComplete: () => {
        if (transitionId !== this.sidebarTransitionId) return;
        this.displayedTaskDetail.set(taskDetail);
        this.displayedTaskId.set(taskId);
        this.displayedPolicyBackVisible.set(policyBackVisible);
        setTimeout(() => {
          if (transitionId === this.sidebarTransitionId) this.animateSidebarEntry(sidebar, taskDetail, transitionId);
        }, 0);
      },
    })
      .to(sidebarItems, { autoAlpha: 0, x: direction * 10, duration: 0.24, stagger: 0.04, ease: 'power2.in' });
  }

  private animateSidebarEntry(sidebar: HTMLElement, taskDetail: boolean, transitionId: number): void {
    if (transitionId !== this.sidebarTransitionId) return;

    const sidebarItems = this.sidebarItems(sidebar);
    gsap.killTweensOf(sidebarItems);
    const direction = taskDetail ? -1 : 1;

    this.activeSidebarTimeline?.kill();
    this.activeSidebarTimeline = gsap.timeline();
    this.activeSidebarTimeline.fromTo(
      sidebarItems,
      { autoAlpha: 0, x: direction * 14, filter: 'blur(2px)' },
      { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.34, stagger: 0.075, ease: 'power2.out', clearProps: 'transform,filter' },
      '-=0.2',
    );
  }

  private sidebarItems(sidebar: HTMLElement): NodeListOf<HTMLElement> {
    return sidebar.querySelectorAll<HTMLElement>('.task-heading, .workspace-return, .policy-heading, .back-link, .sidebar-note, .contacts-button, .worksheet-button, .forms-navigation');
  }
}
