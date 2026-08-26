import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideFileText, LucidePlus, LucideSave } from '@lucide/angular';
import { PolicySummary } from '../../shared/policy-summary/policy-summary';
import { UiField } from '../../shared/ui-field/ui-field';
import { VisitCard, VisitDetails } from '../../shared/visit-card/visit-card';
import { PhotoStore } from '../../shared/photo-store/photo-store';
import { DocumentStore } from '../../shared/document-store/document-store';
import { AttachmentDialogState } from '../../shared/attachment-dialog-state/attachment-dialog-state';

@Component({
  selector: 'app-tasks-page',
  imports: [ButtonDirective, LucideFileText, LucidePlus, LucideSave, NgOptimizedImage, PolicySummary, UiField, VisitCard],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {
  private readonly policySummary = viewChild.required(PolicySummary);
  private readonly photoStore = inject(PhotoStore);
  private readonly documentStore = inject(DocumentStore);
  private readonly dialogState = inject(AttachmentDialogState);
  readonly photos = this.photoStore.photos;
  readonly documents = this.documentStore.documents;
  readonly selectedVisitId = this.dialogState.selectedVisitId;
  readonly visiblePhotos = computed(() => {
    const visitId = this.selectedVisitId();
    return visitId === 'all' ? this.photos() : this.photos().filter((photo) => photo.visitId === visitId);
  });
  readonly visibleDocuments = computed(() => {
    const visitId = this.selectedVisitId();
    return visitId === 'all' ? this.documents() : this.documents().filter((document) => document.visitId === visitId);
  });
  private nextVisitId = 3;
  readonly visits = signal<readonly VisitDetails[]>([
    { id: 1, title: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', description: 'Job Site', date: '08/14/2026', contact: 'Benjamin Hammerton', timing: 'past' },
    { id: 2, title: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', description: 'Warehouse', date: '09/02/2026', badge: '3', contact: 'Susie Hammerton', timing: 'future' },
  ]);

  addVisit(): void {
    const id = this.nextVisitId++;
    this.visits.update((visits) => [...visits, { id, title: `Visit Detail #${id}`, location: '', description: '', date: '09/03/2026', contact: 'Benjamin Hammerton', timing: 'future' }]);
  }

  removeVisit(id: number): void { this.visits.update((visits) => visits.filter((visit) => visit.id !== id)); }

  updateVisitLocation(id: number, location: string): void {
    this.visits.update((visits) => visits.map((visit) => visit.id === id ? { ...visit, location } : visit));
  }

  private contactPickerVisitId = signal<number | null>(null);

  openContactPicker(id: number): void {
    this.contactPickerVisitId.set(id);
    this.policySummary().openContacts(true);
  }

  updateVisitContact(contact: string): void {
    const id = this.contactPickerVisitId();
    if (id === null) return;
    this.visits.update((visits) => visits.map((visit) => visit.id === id ? { ...visit, contact } : visit));
    this.contactPickerVisitId.set(null);
  }

  openPhotoDialog(): void { this.dialogState.openPhoto(); }
  openDocumentDialog(): void { this.dialogState.openDocument(); }

  selectVisit(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.dialogState.selectVisit(value === 'all' ? 'all' : Number(value));
  }
}
