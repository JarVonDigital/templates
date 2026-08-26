import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideArrowLeft, LucideCheckCircle2, LucideCircle, LucideInfo, LucidePhone, LucidePrinter } from '@lucide/angular';
import { TopNavigation } from '../../shared/top-navigation/top-navigation';
import { PhotoUploadDialog } from '../../shared/photo-upload-dialog/photo-upload-dialog';
import { DocumentUploadDialog } from '../../shared/document-upload-dialog/document-upload-dialog';
import { AttachmentDialogState } from '../../shared/attachment-dialog-state/attachment-dialog-state';
import { LossPreventionContactsState } from '../../shared/loss-prevention-contacts-state/loss-prevention-contacts-state';

interface TaskFormLink {
  readonly completed: boolean;
  readonly label: string;
  readonly slug: string;
}

@Component({
  selector: 'app-task-context-layout',
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, LucideArrowLeft, LucideCheckCircle2, LucideCircle, LucideInfo, LucidePhone, LucidePrinter, TopNavigation, PhotoUploadDialog, DocumentUploadDialog],
  templateUrl: './task-context-layout.html',
  styleUrl: './task-context-layout.scss',
})
export class TaskContextLayout {
  private readonly route = inject(ActivatedRoute);
  readonly taskId = toSignal(this.route.paramMap.pipe(map((params) => params.get('taskId') ?? 'Task')), { initialValue: 'Task' });
  readonly highSeverityRecommendationCount = signal(3);
  private readonly dialogState = inject(AttachmentDialogState);
  private readonly contactsState = inject(LossPreventionContactsState);
  readonly photoDialogOpen = this.dialogState.photoOpen;
  readonly documentDialogOpen = this.dialogState.documentOpen;
  readonly forms = signal<readonly TaskFormLink[]>([
    { label: 'Loss Runs & Recommendations', slug: 'lr-and-r', completed: true },
    { label: 'Risk and safety evaluation', slug: 'rse', completed: false },
    { label: 'Service frequency change', slug: 'service-frequency-change', completed: false },
    { label: 'Underwriting alert', slug: 'alert-uw', completed: false },
  ]);

  openPhotoDialog(): void { this.dialogState.openPhoto(); }
  closePhotoDialog(): void { this.dialogState.closePhoto(); }
  openDocumentDialog(): void { this.dialogState.openDocument(); }
  closeDocumentDialog(): void { this.dialogState.closeDocument(); }
  openContacts(): void { this.contactsState.requestOpen(); }
}
