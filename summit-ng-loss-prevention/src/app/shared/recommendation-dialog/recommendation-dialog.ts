import { Component, computed, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideCalendarDays, LucideCheck, LucideFileImage, LucideLightbulb, LucideSearch, LucideSparkles, LucideUploadCloud, LucideX } from '@lucide/angular';

interface StandardRecommendation {
  readonly code: string;
  readonly title: string;
}

type Urgency = 'Routine' | 'Important' | 'Critical';

const STANDARD_RECOMMENDATIONS: readonly StandardRecommendation[] = [
  { code: 'ADM 51', title: 'Applications and verifications' },
  { code: 'ADM 23', title: 'Bilingual communications' },
  { code: 'ADM 34', title: 'Certificate of insurance — subcontractors' },
  { code: 'ADM 53', title: 'Communicable illness response plan' },
  { code: 'ADM 999', title: 'Custom administrative recommendation' },
  { code: 'ADM 6', title: 'Disciplinary program' },
];

@Component({
  selector: 'app-recommendation-dialog',
  imports: [ButtonDirective, LucideCalendarDays, LucideCheck, LucideFileImage, LucideLightbulb, LucideSearch, LucideSparkles, LucideUploadCloud, LucideX],
  templateUrl: './recommendation-dialog.html',
  styleUrl: './recommendation-dialog.scss',
})
export class RecommendationDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  readonly visitTitle = input.required<string>();
  readonly sourceSection = input('Visited locations');
  readonly recommendationNumber = input.required<number>();
  readonly saved = output<void>();
  readonly query = signal('');
  readonly selectedStandard = signal<StandardRecommendation | null>(null);
  readonly urgencyLevels: readonly Urgency[] = ['Routine', 'Important', 'Critical'];
  readonly urgency = signal<Urgency>('Routine');
  readonly title = signal('');
  readonly description = signal('');
  readonly dueDate = signal('');
  readonly files = signal<readonly string[]>([]);
  readonly filteredStandards = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query
      ? STANDARD_RECOMMENDATIONS.filter((item) => `${item.code} ${item.title}`.toLowerCase().includes(query))
      : STANDARD_RECOMMENDATIONS;
  });
  readonly canSave = computed(() => Boolean(this.title().trim() && this.description().trim() && this.dueDate()));

  open(): void {
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  selectStandard(item: StandardRecommendation): void {
    this.selectedStandard.set(item);
    this.title.set(item.title);
  }

  updateText(target: 'query' | 'title' | 'description' | 'dueDate', event: Event): void {
    this[target].set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  addFiles(event: Event): void {
    const selected = Array.from((event.target as HTMLInputElement).files ?? [], (file) => file.name);
    this.files.update((files) => [...files, ...selected].slice(0, 3));
  }

  removeFile(fileName: string): void {
    this.files.update((files) => files.filter((file) => file !== fileName));
  }

  save(): void {
    if (!this.canSave()) return;
    this.saved.emit();
    this.close();
    this.reset();
  }

  private reset(): void {
    this.query.set('');
    this.selectedStandard.set(null);
    this.urgency.set('Routine');
    this.title.set('');
    this.description.set('');
    this.dueDate.set('');
    this.files.set([]);
  }
}
