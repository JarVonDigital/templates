import { Component, input, model, output, signal } from '@angular/core';
import { LucideCheck, LucideChevronDown, LucideColumns3, LucideFilter, LucideGripVertical, LucideSearch, LucideX } from '@lucide/angular';

export interface TableColumn { readonly key: string; readonly label: string; }

@Component({
  selector: 'app-table-header',
  imports: [LucideCheck, LucideChevronDown, LucideColumns3, LucideFilter, LucideGripVertical, LucideSearch, LucideX],
  templateUrl: './table-header.html',
  styleUrl: './table-header.scss',
})
export class TableHeader {
  readonly title = input.required<string>();
  readonly searchLabel = input.required<string>();
  readonly searchPlaceholder = input.required<string>();
  readonly resultCount = input.required<number>();
  readonly resultLabel = input.required<string>();
  readonly filterCount = input(0);
  readonly columns = model<readonly TableColumn[]>([]);
  readonly visibleColumns = model<ReadonlySet<string>>(new Set());
  readonly columnsOpen = model(false);
  readonly draggedColumn = signal<string | null>(null);
  readonly searchChanged = output<string>();
  readonly filtersOpened = output<void>();

  isColumnVisible(key: string): boolean { return this.visibleColumns().has(key); }

  toggleColumn(key: string): void {
    this.visibleColumns.update((current) => {
      const next = new Set(current);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  moveColumn(key: string, direction: -1 | 1): void {
    this.columns.update((columns) => {
      const index = columns.findIndex((column) => column.key === key);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= columns.length) return columns;
      const reordered = [...columns];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  startColumnDrag(event: PointerEvent, key: string): void {
    if (event.button === 0) {
      event.preventDefault();
      this.draggedColumn.set(key);
    }
  }

  moveDraggedColumn(event: PointerEvent, targetKey: string): void {
    const sourceKey = this.draggedColumn();
    if (!sourceKey || sourceKey === targetKey || event.buttons !== 1) return;
    this.columns.update((columns) => {
      const sourceIndex = columns.findIndex((column) => column.key === sourceKey);
      const targetIndex = columns.findIndex((column) => column.key === targetKey);
      if (sourceIndex < 0 || targetIndex < 0) return columns;
      const reordered = [...columns];
      const [moved] = reordered.splice(sourceIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered;
    });
  }
}
