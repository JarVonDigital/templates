import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AttachmentDialogState {
  readonly photoOpen = signal(false);
  readonly documentOpen = signal(false);
  readonly selectedVisitId = signal<number | 'all'>(2);

  openPhoto(): void { this.photoOpen.set(true); }
  closePhoto(): void { this.photoOpen.set(false); }
  openDocument(): void { this.documentOpen.set(true); }
  closeDocument(): void { this.documentOpen.set(false); }
  selectVisit(visitId: number | 'all'): void { this.selectedVisitId.set(visitId); }
}
