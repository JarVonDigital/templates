import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import {
  LucideCalendarDays,
  LucideCheck,
  LucideCheckCircle2,
  LucideChevronDown,
  LucideClipboardCheck,
  LucideFileText,
  LucideInfo,
  LucideSave,
  LucideShieldPlus,
  LucideShieldCheck,
} from '@lucide/angular';
import { RecommendationDialog } from '../../shared/recommendation-dialog/recommendation-dialog';

interface FormSection {
  readonly description: string;
  readonly icon: 'calendar' | 'clipboard' | 'file' | 'info';
  readonly id: string;
  readonly label: string;
}

const FORM_SECTIONS: readonly FormSection[] = [
  { id: 'visit', label: 'Visit details', description: 'Date and location', icon: 'calendar' },
  { id: 'accident-review', label: 'Accident review', description: 'Current and multi-year claims', icon: 'clipboard' },
  { id: 'visit-notes', label: 'Visit review notes', description: 'Operations and safety activity', icon: 'file' },
  { id: 'additional-info', label: 'Additional info', description: 'Context and recommendations', icon: 'info' },
];

@Component({
  selector: 'app-lr-and-r-page',
  imports: [
    LucideCalendarDays,
    LucideCheck,
    LucideCheckCircle2,
    LucideChevronDown,
    LucideClipboardCheck,
    LucideFileText,
    LucideInfo,
    LucideSave,
    LucideShieldPlus,
    LucideShieldCheck,
    RecommendationDialog,
  ],
  templateUrl: './lr-and-r-page.html',
  styleUrl: './lr-and-r-page.scss',
})
export class LrAndRPage {
  private readonly recommendationDialog = viewChild.required(RecommendationDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly sections = FORM_SECTIONS;
  readonly collapsedSections = signal<ReadonlySet<string>>(new Set());
  readonly completedSections = signal<ReadonlySet<string>>(new Set(FORM_SECTIONS.map((section) => section.id)));
  readonly recommendationCounts = signal<Readonly<Record<string, number>>>({});
  readonly activeRecommendationSection = signal('Visit details');
  readonly latestVisitLocation = '22 Main St, Elsewhere, TX 31333';
  readonly saved = signal(false);
  readonly assessment = signal('Satisfactory');
  readonly completedSectionCount = computed(() => this.completedSections().size);
  readonly completionPercentage = computed(() => Math.round((this.completedSectionCount() / this.sections.length) * 100));
  readonly allSectionsComplete = computed(() => this.completedSectionCount() === this.sections.length);
  readonly isNotApplicable = computed(() => this.assessment() === 'Not applicable');
  readonly totalRecommendationCount = computed(() => Object.values(this.recommendationCounts()).reduce((total, count) => total + count, 0));
  readonly announcement = computed(() => {
    if (this.saved()) return 'Loss Runs and Recommendations draft saved.';
    return '';
  });

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const section = this.sections.find((item) => item.id === visible?.target.id);
        if (section) this.activeRecommendationSection.set(section.label);
      }, { rootMargin: '-15% 0px -70% 0px' });
      this.sections.forEach((section) => {
        const element = this.host.nativeElement.querySelector(`#${section.id}`);
        if (element) observer.observe(element);
      });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  isCollapsed(sectionId: string): boolean {
    return this.isNotApplicable() || this.collapsedSections().has(sectionId);
  }

  toggleSection(sectionId: string): void {
    if (this.isNotApplicable()) return;
    this.collapsedSections.update((current) => {
      const next = new Set(current);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }

  isSectionComplete(sectionId: string): boolean {
    return this.completedSections().has(sectionId);
  }

  toggleSectionComplete(sectionId: string): void {
    if (this.isNotApplicable()) return;
    this.completedSections.update((current) => {
      const next = new Set(current);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }

  toggleAllSections(): void {
    if (this.isNotApplicable()) return;
    this.completedSections.set(this.allSectionsComplete() ? new Set() : new Set(this.sections.map((section) => section.id)));
  }

  openRecommendation(sectionTitle: string): void {
    this.activeRecommendationSection.set(sectionTitle);
    this.recommendationDialog().open();
  }

  recommendationSaved(): void {
    const section = this.activeRecommendationSection();
    this.recommendationCounts.update((counts) => ({ ...counts, [section]: (counts[section] ?? 0) + 1 }));
  }

  saveDraft(): void {
    this.saved.set(true);
  }

  updateAssessment(event: Event): void {
    const assessment = (event.target as HTMLSelectElement).value;
    this.assessment.set(assessment);
    this.collapsedSections.set(assessment === 'Not applicable' ? new Set(this.sections.map((section) => section.id)) : new Set());
    this.saved.set(false);
  }
}
