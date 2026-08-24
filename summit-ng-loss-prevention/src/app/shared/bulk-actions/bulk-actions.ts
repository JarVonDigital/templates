import { Component, input, output } from '@angular/core';
import {
  LucideArrowLeftRight,
  LucideBadgeCheck,
  LucideBan,
  LucideCheckCircle2,
  LucideDownload,
  LucideMap,
  LucidePencil,
  LucideX,
} from '@lucide/angular';

export type BulkActionIcon = 'download' | 'reassign' | 'status' | 'map' | 'verified' | 'completed' | 'cancelled';

export interface BulkActionItem {
  readonly id: string;
  readonly label: string;
  readonly icon: BulkActionIcon;
}

@Component({
  selector: 'app-bulk-actions',
  imports: [LucideArrowLeftRight, LucideBadgeCheck, LucideBan, LucideCheckCircle2, LucideDownload, LucideMap, LucidePencil, LucideX],
  templateUrl: './bulk-actions.html',
  styleUrl: './bulk-actions.scss',
})
export class BulkActions {
  readonly selectedCount = input.required<number>();
  readonly actions = input.required<readonly BulkActionItem[]>();
  readonly ariaLabel = input('Bulk actions');
  readonly actionSelected = output<string>();
  readonly cleared = output<void>();
}
