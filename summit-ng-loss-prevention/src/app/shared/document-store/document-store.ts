import { Injectable, signal } from '@angular/core';

export interface DocumentAttachment {
  readonly id: string;
  readonly visitId: number;
  readonly fileName: string;
  readonly title: string;
  readonly note: string;
  readonly size: string;
  readonly createdAt: string;
  readonly fileType: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentStore {
  private readonly documentState = signal<readonly DocumentAttachment[]>([
    { id: 'site-checklist', visitId: 2, fileName: 'Site inspection checklist.pdf', title: 'Site inspection checklist', note: 'Completed inspection checklist', size: '248 KB', createdAt: 'Today, 9:46 AM', fileType: 'PDF' },
    { id: 'safety-certificate', visitId: 2, fileName: 'Safety program certificate.pdf', title: 'Safety program certificate', note: 'Current certificate of insurance', size: '1.2 MB', createdAt: 'Yesterday, 3:22 PM', fileType: 'PDF' },
    { id: 'previous-visit-report', visitId: 1, fileName: 'Previous visit report.pdf', title: 'Previous visit report', note: 'Recommendations from the prior visit', size: '486 KB', createdAt: 'Aug 14, 10:35 AM', fileType: 'PDF' },
  ]);

  readonly documents = this.documentState.asReadonly();

  addDocument(fileName: string, title: string, note: string, size: number, fileType: string, visitId: number): DocumentAttachment {
    const document: DocumentAttachment = {
      id: `document-${Date.now()}`,
      visitId,
      fileName: fileName || 'task-document',
      title: title.trim() || fileName || 'New task document',
      note: note.trim() || 'Task document',
      size: this.formatSize(size),
      createdAt: 'Just now',
      fileType: fileType || 'FILE',
    };

    this.documentState.update((documents) => [document, ...documents]);
    return document;
  }

  private formatSize(bytes: number): string {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
