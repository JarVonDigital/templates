import { Injectable, signal } from '@angular/core';

export interface PhotoAttachment {
  readonly id: string;
  readonly visitId: number;
  readonly src: string;
  readonly title: string;
  readonly note: string;
  readonly createdAt: string;
  readonly kind: 'static' | 'upload';
}

@Injectable({ providedIn: 'root' })
export class PhotoStore {
  private readonly photoState = signal<readonly PhotoAttachment[]>([
    { id: 'site-overview', visitId: 2, src: '/task-photo-overview.svg', title: 'Site overview', note: 'Warehouse exterior', createdAt: 'Today, 9:42 AM', kind: 'static' },
    { id: 'exit-route', visitId: 2, src: '/task-photo-exit-route.svg', title: 'Emergency exit', note: 'Blocked route marked for review', createdAt: 'Yesterday, 3:18 PM', kind: 'static' },
    { id: 'equipment-check', visitId: 2, src: '/task-photo-equipment.svg', title: 'Equipment check', note: 'Guarding verification', createdAt: 'Aug 20, 2026', kind: 'static' },
    { id: 'previous-loading-dock', visitId: 1, src: '/task-photo-overview.svg', title: 'Loading dock', note: 'Previous visit overview', createdAt: 'Aug 14, 10:15 AM', kind: 'static' },
    { id: 'previous-exit-route', visitId: 1, src: '/task-photo-exit-route.svg', title: 'Route review', note: 'Previous visit follow-up', createdAt: 'Aug 14, 10:28 AM', kind: 'static' },
  ]);

  readonly photos = this.photoState.asReadonly();

  addPhoto(source: string, title: string, note: string, visitId: number): PhotoAttachment {
    const photo: PhotoAttachment = {
      id: `photo-${Date.now()}`,
      visitId,
      src: source,
      title: title.trim() || 'New task photo',
      note: note.trim() || 'Annotated photo',
      createdAt: 'Just now',
      kind: 'upload',
    };

    this.photoState.update((photos) => [photo, ...photos]);
    return photo;
  }
}
