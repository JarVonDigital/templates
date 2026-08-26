import { Component, inject, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { LucideCheck, LucideFilePlus2, LucideFileText, LucideUpload, LucideX } from '@lucide/angular';
import { DocumentAttachment, DocumentStore } from '../document-store/document-store';
import { AttachmentDialogState } from '../attachment-dialog-state/attachment-dialog-state';

@Component({
  selector: 'app-document-upload-dialog',
  imports: [LucideCheck, LucideFilePlus2, LucideFileText, LucideUpload, LucideX],
  templateUrl: './document-upload-dialog.html',
  styleUrl: './document-upload-dialog.scss',
})
export class DocumentUploadDialog {
  private readonly documentStore = inject(DocumentStore);
  private readonly dialogState = inject(AttachmentDialogState);
  readonly open = input(false);
  readonly closed = output<void>();
  readonly saved = output<DocumentAttachment>();

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  readonly selectedFile = signal<File | null>(null);
  readonly documentTitle = signal('');
  readonly documentNote = signal('');

  openFilePicker(): void { this.fileInput()?.nativeElement.click(); }

  handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile.set(file);
    this.documentTitle.set(file.name.replace(/\.[^/.]+$/, '') || 'Task document');
    this.documentNote.set('');
    input.value = '';
  }

  updateTitle(event: Event): void { this.documentTitle.set((event.target as HTMLInputElement).value); }
  updateNote(event: Event): void { this.documentNote.set((event.target as HTMLTextAreaElement).value); }

  saveDocument(): void {
    const file = this.selectedFile();
    if (!file) return;
    const selectedVisitId = this.dialogState.selectedVisitId();
    const document = this.documentStore.addDocument(file.name, this.documentTitle(), this.documentNote(), file.size, this.getFileType(file.name), selectedVisitId === 'all' ? 2 : selectedVisitId);
    this.saved.emit(document);
    this.close();
  }

  close(): void {
    this.selectedFile.set(null);
    this.documentTitle.set('');
    this.documentNote.set('');
    this.closed.emit();
  }

  private getFileType(fileName: string): string {
    const extension = fileName.split('.').at(-1);
    return extension ? extension.toUpperCase() : 'FILE';
  }
}
