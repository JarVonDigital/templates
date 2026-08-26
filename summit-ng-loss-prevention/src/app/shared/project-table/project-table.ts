import { Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { LucideArrowDownAZ } from '@lucide/angular';

export type ProjectTableSortDirection = 'asc' | 'desc';

export interface ProjectTableColumn {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
}

export interface ProjectTableSortChange {
  readonly key: string;
  readonly direction: ProjectTableSortDirection;
}

@Component({
  selector: 'app-project-table',
  imports: [LucideArrowDownAZ],
  templateUrl: './project-table.html',
  styleUrl: './project-table.scss',
  host: { '[class.fill-height]': 'fillHeight()', '[class.mobile-cards]': 'mobileCards()' },
  encapsulation: ViewEncapsulation.None,
})
export class ProjectTable {
  readonly columns = input.required<readonly ProjectTableColumn[]>();
  readonly visibleColumns = input<ReadonlySet<string> | null>(null);
  readonly sortKey = input<string | null>(null);
  readonly sortDirection = input<ProjectTableSortDirection>('asc');
  readonly tableLabel = input.required<string>();
  readonly minWidth = input('0');
  readonly fillHeight = input(false);
  readonly mobileCards = input(true);
  readonly sortChange = output<ProjectTableSortChange>();
  readonly displayColumns = computed(() => {
    const visibleColumns = this.visibleColumns();
    return visibleColumns ? this.columns().filter((column) => visibleColumns.has(column.key)) : this.columns();
  });

  ariaSort(key: string): 'ascending' | 'descending' | null {
    if (this.sortKey() !== key) return null;
    return this.sortDirection() === 'desc' ? 'descending' : 'ascending';
  }

  requestSort(column: ProjectTableColumn): void {
    if (column.sortable === false) return;
    const direction = this.sortKey() === column.key && this.sortDirection() === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key: column.key, direction });
  }
}
