import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideArrowDownAZ,
  LucideArrowLeftRight,
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideMap,
  LucideMoreVertical,
  LucidePencil,
  LucideX,
} from '@lucide/angular';
import { BulkActionItem, BulkActions } from '../../shared/bulk-actions/bulk-actions';
import { TableShell } from '../../shared/table-shell/table-shell';
import { TableHeader } from '../../shared/table-header/table-header';

type TaskStatus = 'Pending' | 'Attempt 1' | 'Scheduled' | 'WIP' | 'Closed-Cancelled' | 'Completed';
type ColumnKey = 'due' | 'status' | 'task' | 'policy' | 'client' | 'dba' | 'address' | 'lastVisit' | 'cancelled' | 'reason' | 'consultant';
type SortDirection = 'asc' | 'desc';
type BulkAction = 'reassign' | 'status' | 'map' | null;
type DueMode = 'before' | 'on' | 'after' | 'range';

interface TaskRow {
  readonly id: string;
  readonly due: string;
  readonly status: TaskStatus;
  readonly policy: string;
  readonly client: string;
  readonly dba: string;
  readonly address: string;
  readonly state: string;
  readonly county: string;
  readonly city: string;
  readonly zip: string;
  readonly premium: number;
  readonly lastVisit: string;
  readonly cancelled: string;
  readonly reason: string;
  readonly consultant: string;
}

interface ColumnDefinition {
  readonly key: ColumnKey;
  readonly label: string;
  readonly value: (task: TaskRow) => string;
  readonly cellClass?: (task: TaskRow) => string;
}

interface FilterValues {
  readonly status: string;
  readonly state: string;
  readonly consultant: string;
  readonly due: string;
  readonly dueMode: DueMode;
  readonly dueEnd: string;
  readonly county: string;
  readonly city: string;
  readonly zip: string;
  readonly premiumMin: string;
  readonly premiumMax: string;
  readonly taskId: string;
  readonly policy: string;
  readonly client: string;
  readonly lastVisit: string;
  readonly cancelled: string;
  readonly reason: string;
}

interface SavedFilter extends FilterValues { readonly name: string; }

const SAVED_FILTERS_KEY = 'summit-loss-prevention-saved-filters';

const TASKS: readonly TaskRow[] = [
  { id: '800001', due: '08/07/2026', status: 'Pending', policy: '0190-00765', client: 'Berkun-Air, Inc.', dba: '', address: '54 Main Rd, Asheville, NC 28806', state: 'NC', county: 'Buncombe', city: 'Asheville', zip: '28806', premium: 48500, lastVisit: '08/07/2025', cancelled: '04/11/2023', reason: 'Customer Unresponsive', consultant: 'Bill Stultz' },
  { id: '800101', due: '08/12/2026', status: 'Attempt 1', policy: '0830-57161', client: 'AFG Distribution, Inc.', dba: '', address: '354 Turtle Rd, Sulphur, AL 42043', state: 'AL', county: 'Calcasieu', city: 'Sulphur', zip: '42043', premium: 72000, lastVisit: '08/07/2025', cancelled: '', reason: '', consultant: 'Steven Hidalgo' },
  { id: '802301', due: '08/16/2026', status: 'Scheduled', policy: '0999-11613', client: 'Gulf Coast Water & Ice LLC', dba: '', address: '4354 Whiskey Rd, Green Cove Springs, FL 32043', state: 'FL', county: 'Clay', city: 'Green Cove Springs', zip: '32043', premium: 91500, lastVisit: '08/07/2025', cancelled: '', reason: '', consultant: 'Jonathan Campbell' },
  { id: '804101', due: '08/27/2026', status: 'WIP', policy: '0521-24351', client: 'Nova Molecular Technologies, Inc.', dba: 'Molecular Tech', address: '454 Lake Rd, Sweetwater, FL 32043', state: 'FL', county: 'Miami-Dade', city: 'Sweetwater', zip: '32043', premium: 128000, lastVisit: '08/07/2025', cancelled: '01/21/2026', reason: 'Customer Unresponsive', consultant: 'John Saffer' },
  { id: '808001', due: '09/07/2026', status: 'Closed-Cancelled', policy: '0521-24372', client: 'Smoky Mountain Surgical, LLC', dba: '', address: '8366 Beer Rd, Knoxville, TN 37920', state: 'TN', county: 'Knox', city: 'Knoxville', zip: '37920', premium: 61000, lastVisit: '08/07/2025', cancelled: '', reason: '', consultant: 'Pam Slay' },
  { id: '708701', due: '09/12/2026', status: 'Completed', policy: '0196-60230', client: 'Brannon Brothers Construction, LLC', dba: '', address: '935 Manchester Rd, Sacramento, TN 32043', state: 'TN', county: 'McLean', city: 'Sacramento', zip: '32043', premium: 147000, lastVisit: '08/07/2025', cancelled: '', reason: '', consultant: 'Ledria Batiste' },
  { id: '812204', due: '09/18/2026', status: 'Pending', policy: '0330-44120', client: 'Carolina Fabrication Group', dba: 'CFG', address: '212 Ridgeview Dr, Charlotte, NC 28202', state: 'NC', county: 'Mecklenburg', city: 'Charlotte', zip: '28202', premium: 83000, lastVisit: '03/14/2026', cancelled: '', reason: '', consultant: 'Robert Hollins' },
  { id: '815420', due: '09/24/2026', status: 'Scheduled', policy: '0470-90112', client: 'Blue River Logistics', dba: '', address: '80 Harbor Blvd, Mobile, AL 36602', state: 'AL', county: 'Mobile', city: 'Mobile', zip: '36602', premium: 116000, lastVisit: '02/20/2026', cancelled: '', reason: '', consultant: 'Sonya Burgess' },
  { id: '817090', due: '10/02/2026', status: 'Attempt 1', policy: '0782-33004', client: 'Evergreen Medical Supply', dba: 'Evergreen', address: '901 Pine St, Nashville, TN 37203', state: 'TN', county: 'Davidson', city: 'Nashville', zip: '37203', premium: 56000, lastVisit: '11/19/2025', cancelled: '', reason: '', consultant: 'John Saffer' },
  { id: '820055', due: '10/14/2026', status: 'WIP', policy: '0911-55201', client: 'Sunstate Industrial Services', dba: '', address: '17 Commerce Way, Tampa, FL 33602', state: 'FL', county: 'Hillsborough', city: 'Tampa', zip: '33602', premium: 99000, lastVisit: '01/07/2026', cancelled: '', reason: '', consultant: 'Jonathan Campbell' },
];

const TASK_BULK_ACTIONS: readonly BulkActionItem[] = [
  { id: 'export', label: 'Export CSV', icon: 'download' },
  { id: 'reassign', label: 'Reassign', icon: 'reassign' },
  { id: 'status', label: 'Change status', icon: 'status' },
  { id: 'map', label: 'Show on map', icon: 'map' },
];

@Component({
  selector: 'app-task-list-page',
  imports: [RouterLink, BulkActions, TableShell, TableHeader, LucideArrowDownAZ, LucideArrowLeftRight, LucideCheck, LucideChevronLeft, LucideChevronRight, LucideMap, LucideMoreVertical, LucidePencil, LucideX],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.scss',
})
export class TaskListPage {
  readonly bulkActions = TASK_BULK_ACTIONS;
  readonly columns = signal<readonly ColumnDefinition[]>([
    { key: 'due', label: 'Due', value: (task) => task.due, cellClass: () => 'date-cell' },
    { key: 'status', label: 'Status', value: (task) => task.status, cellClass: (task) => `status-pill ${task.status.toLowerCase().replaceAll(' ', '-')}` },
    { key: 'task', label: 'Task', value: (task) => task.id, cellClass: () => 'task-link' },
    { key: 'policy', label: 'Policy', value: (task) => task.policy },
    { key: 'client', label: 'Client', value: (task) => task.client, cellClass: () => 'client-link' },
    { key: 'dba', label: 'DBA', value: (task) => task.dba || '—' },
    { key: 'address', label: 'Address', value: (task) => task.address, cellClass: () => 'wide-cell' },
    { key: 'lastVisit', label: 'Last visit', value: (task) => task.lastVisit },
    { key: 'cancelled', label: 'Cancelled', value: (task) => task.cancelled || '—' },
    { key: 'reason', label: 'Reason', value: (task) => task.reason || '—' },
    { key: 'consultant', label: 'Consultant', value: (task) => task.consultant },
  ]);
  readonly statuses: readonly TaskStatus[] = ['Pending', 'Attempt 1', 'Scheduled', 'WIP', 'Closed-Cancelled', 'Completed'];
  readonly consultants = ['Bill Stultz', 'Jonathan Campbell', 'John Saffer', 'Ledria Batiste', 'Pam Slay', 'Robert Hollins', 'Sonya Burgess', 'Steven Hidalgo'];
  readonly states = ['AL', 'FL', 'NC', 'TN'];
  readonly locationOptions: Readonly<Record<string, { readonly counties: readonly string[]; readonly cities: readonly string[] }>> = {
    AL: { counties: ['Calcasieu', 'Mobile'], cities: ['Mobile', 'Sulphur'] },
    FL: { counties: ['Clay', 'Hillsborough', 'Miami-Dade'], cities: ['Green Cove Springs', 'Sweetwater', 'Tampa'] },
    NC: { counties: ['Buncombe', 'Mecklenburg'], cities: ['Asheville', 'Charlotte'] },
    TN: { counties: ['Davidson', 'Knox', 'McLean'], cities: ['Knoxville', 'Nashville', 'Sacramento'] },
  };
  readonly reasons = ['Customer Unresponsive'];
  readonly tasks = signal<readonly TaskRow[]>(TASKS);
  readonly query = signal('');
  readonly statusFilter = signal('');
  readonly stateFilter = signal('');
  readonly consultantFilter = signal('');
  readonly dueBefore = signal('');
  readonly dueMode = signal<DueMode>('before');
  readonly dueEnd = signal('');
  readonly countyFilter = signal('');
  readonly cityFilter = signal('');
  readonly zipFilter = signal('');
  readonly premiumMinFilter = signal('');
  readonly premiumMaxFilter = signal('');
  readonly taskIdFilter = signal('');
  readonly policyFilter = signal('');
  readonly clientFilter = signal('');
  readonly lastVisitFilter = signal('');
  readonly cancelledFilter = signal('');
  readonly reasonFilter = signal('');
  readonly filterDraftStatus = signal('');
  readonly filterDraftState = signal('');
  readonly filterDraftConsultant = signal('');
  readonly filterDraftDue = signal('');
  readonly filterDraftDueMode = signal<DueMode>('before');
  readonly filterDraftDueEnd = signal('');
  readonly filterDraftCounty = signal('');
  readonly filterDraftCity = signal('');
  readonly filterDraftZip = signal('');
  readonly filterDraftPremiumMin = signal('');
  readonly filterDraftPremiumMax = signal('');
  readonly filterDraftTaskId = signal('');
  readonly filterDraftPolicy = signal('');
  readonly filterDraftClient = signal('');
  readonly filterDraftLastVisit = signal('');
  readonly filterDraftCancelled = signal('');
  readonly filterDraftReason = signal('');
  readonly savedFilters = signal<readonly SavedFilter[]>(TaskListPage.readSavedFilters());
  readonly savedFilterName = signal('');
  readonly selectedSavedFilter = signal('');
  readonly selected = signal<ReadonlySet<string>>(new Set());
  readonly visibleColumns = signal<ReadonlySet<string>>(new Set(this.columns().map((column) => column.key)));
  readonly columnsOpen = signal(false);
  readonly filtersOpen = signal(false);
  readonly rowMenu = signal<string | null>(null);
  readonly bulkAction = signal<BulkAction>(null);
  readonly bulkValue = signal('');
  readonly sortKey = signal<ColumnKey>('due');
  readonly sortDirection = signal<SortDirection>('asc');
  readonly page = signal(1);
  readonly pageSize = 40;
  readonly announcement = signal('');
  readonly countyOptions = computed(() => this.locationOptions[this.filterDraftState()]?.counties ?? []);
  readonly cityOptions = computed(() => this.locationOptions[this.filterDraftState()]?.cities ?? []);

  readonly filteredTasks = computed(() => {
    const query = this.query().trim().toLowerCase();
    const dueDate = this.dueBefore();
    const dueEnd = this.dueEnd();
    const premiumMin = Number(this.premiumMinFilter());
    const premiumMax = Number(this.premiumMaxFilter());
    const matchingTasks = this.tasks().filter((task) => {
      const matchesQuery = !query || Object.values(task).some((value) => String(value).toLowerCase().includes(query));
      const taskDue = this.toTimestamp(task.due);
      const dueStart = dueDate ? new Date(`${dueDate}T00:00:00`).getTime() : 0;
      const dueFinish = dueEnd ? new Date(`${dueEnd}T23:59:59`).getTime() : 0;
      const matchesDue = !dueDate || this.dueMode() === 'before' && taskDue <= dueStart || this.dueMode() === 'on' && taskDue === dueStart || this.dueMode() === 'after' && taskDue >= dueStart || this.dueMode() === 'range' && taskDue >= dueStart && (!dueEnd || taskDue <= dueFinish);
      return matchesQuery && matchesDue
        && (!this.stateFilter() || task.state === this.stateFilter())
        && (!this.countyFilter() || task.county === this.countyFilter())
        && (!this.cityFilter() || task.city === this.cityFilter())
        && (!this.zipFilter() || task.zip === this.zipFilter().trim())
        && (!this.premiumMinFilter() || task.premium >= premiumMin)
        && (!this.premiumMaxFilter() || task.premium <= premiumMax)
        && (!this.statusFilter() || task.status === this.statusFilter())
        && (!this.taskIdFilter() || task.id.includes(this.taskIdFilter().trim()))
        && (!this.policyFilter() || task.policy.toLowerCase().includes(this.policyFilter().trim().toLowerCase()))
        && (!this.clientFilter() || task.client.toLowerCase().includes(this.clientFilter().trim().toLowerCase()))
        && (!this.lastVisitFilter() || this.toInputDate(task.lastVisit) === this.lastVisitFilter())
        && (!this.cancelledFilter() || this.cancelledFilter() === 'yes' && !!task.cancelled || this.cancelledFilter() === 'no' && !task.cancelled)
        && (!this.reasonFilter() || task.reason === this.reasonFilter())
        && (!this.consultantFilter() || task.consultant === this.consultantFilter());
    });
    return [...matchingTasks].sort((left, right) => this.compare(left, right));
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredTasks().length / this.pageSize)));
  readonly pageTasks = computed(() => this.filteredTasks().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  readonly pageStart = computed(() => this.filteredTasks().length ? (this.page() - 1) * this.pageSize + 1 : 0);
  readonly pageEnd = computed(() => Math.min(this.page() * this.pageSize, this.filteredTasks().length));
  readonly selectedTasks = computed(() => this.tasks().filter((task) => this.selected().has(task.id)));
  readonly allPageSelected = computed(() => this.pageTasks().length > 0 && this.pageTasks().every((task) => this.selected().has(task.id)));
  readonly activeFilterCount = computed(() => [this.statusFilter(), this.stateFilter(), this.countyFilter(), this.cityFilter(), this.zipFilter(), this.consultantFilter(), this.dueBefore(), this.premiumMinFilter(), this.premiumMaxFilter(), this.taskIdFilter(), this.policyFilter(), this.clientFilter(), this.lastVisitFilter(), this.cancelledFilter(), this.reasonFilter()].filter(Boolean).length);

  isColumnVisible(key: ColumnKey): boolean { return this.visibleColumns().has(key); }
  toggleTask(id: string, checked: boolean): void { this.selected.update((current) => { const next = new Set(current); checked ? next.add(id) : next.delete(id); return next; }); }
  togglePage(checked: boolean): void { this.selected.update((current) => { const next = new Set(current); this.pageTasks().forEach((task) => checked ? next.add(task.id) : next.delete(task.id)); return next; }); }
  clearSelection(): void { this.selected.set(new Set()); }
  search(value: string): void { this.query.set(value); this.page.set(1); }
  sort(key: ColumnKey): void { if (this.sortKey() === key) this.sortDirection.update((direction) => direction === 'asc' ? 'desc' : 'asc'); else { this.sortKey.set(key); this.sortDirection.set('asc'); } }
  goToPage(page: number): void { this.page.set(Math.min(Math.max(page, 1), this.totalPages())); }
  openFilters(): void {
    this.setDraftFilters(this.activeFilterValues()); this.filtersOpen.set(true);
  }
  applyFilters(): void {
    this.setActiveFilters(this.draftFilterValues()); this.page.set(1); this.filtersOpen.set(false); this.announcement.set(`${this.activeFilterCount()} filters applied`);
  }
  resetFilters(): void {
    this.filterDraftStatus.set(''); this.filterDraftState.set(''); this.filterDraftCounty.set(''); this.filterDraftCity.set(''); this.filterDraftZip.set(''); this.filterDraftConsultant.set(''); this.filterDraftDue.set(''); this.filterDraftDueMode.set('before'); this.filterDraftDueEnd.set(''); this.filterDraftPremiumMin.set(''); this.filterDraftPremiumMax.set(''); this.filterDraftTaskId.set(''); this.filterDraftPolicy.set(''); this.filterDraftClient.set(''); this.filterDraftLastVisit.set(''); this.filterDraftCancelled.set(''); this.filterDraftReason.set(''); this.statusFilter.set(''); this.stateFilter.set(''); this.countyFilter.set(''); this.cityFilter.set(''); this.zipFilter.set(''); this.consultantFilter.set(''); this.dueBefore.set(''); this.dueMode.set('before'); this.dueEnd.set(''); this.premiumMinFilter.set(''); this.premiumMaxFilter.set(''); this.taskIdFilter.set(''); this.policyFilter.set(''); this.clientFilter.set(''); this.lastVisitFilter.set(''); this.cancelledFilter.set(''); this.reasonFilter.set(''); this.page.set(1);
  }
  changeDraftState(state: string): void { this.filterDraftState.set(state); this.filterDraftCounty.set(''); this.filterDraftCity.set(''); }
  loadSavedFilter(name: string): void {
    const savedFilter = this.savedFilters().find((filter) => filter.name === name);
    if (!savedFilter) return;
    this.setDraftFilters(savedFilter); this.selectedSavedFilter.set(name); this.savedFilterName.set(name);
  }
  saveFilter(): void {
    const name = this.savedFilterName().trim();
    if (!name) return;
    const savedFilter: SavedFilter = { name, ...this.draftFilterValues() };
    this.savedFilters.update((filters) => {
      const next = filters.filter((filter) => filter.name !== name);
      return [...next, savedFilter];
    });
    this.persistSavedFilters(); this.selectedSavedFilter.set(name); this.announcement.set(`Saved filter ${name}`);
  }
  deleteSelectedSavedFilter(): void {
    const name = this.selectedSavedFilter();
    if (!name) return;
    this.savedFilters.update((filters) => filters.filter((filter) => filter.name !== name));
    this.persistSavedFilters(); this.selectedSavedFilter.set(''); this.savedFilterName.set('');
  }
  handleBulkAction(action: string): void {
    if (action === 'export') this.exportSelected();
    if (action === 'reassign' || action === 'status' || action === 'map') this.openBulkAction(action);
  }
  openBulkAction(action: BulkAction): void { this.rowMenu.set(null); this.bulkValue.set(''); this.bulkAction.set(action); }
  applyBulkAction(): void {
    const action = this.bulkAction(); const value = this.bulkValue(); const ids = this.selected();
    if ((action === 'reassign' || action === 'status') && !value) return;
    if (action === 'reassign') this.tasks.update((tasks) => tasks.map((task) => ids.has(task.id) ? { ...task, consultant: value } : task));
    if (action === 'status') this.tasks.update((tasks) => tasks.map((task) => ids.has(task.id) ? { ...task, status: value as TaskStatus } : task));
    this.announcement.set(`${ids.size} ${ids.size === 1 ? 'task' : 'tasks'} updated`); this.bulkAction.set(null); this.clearSelection();
  }
  exportSelected(): void {
    const rows = this.selectedTasks();
    const csv = [['Task', 'Due', 'Status', 'Policy', 'Client', 'Address', 'Consultant'], ...rows.map((task) => [task.id, task.due, task.status, task.policy, task.client, task.address, task.consultant])].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'summit-tasks.csv'; link.click(); URL.revokeObjectURL(link.href); this.announcement.set(`${rows.length} tasks exported`);
  }
  private draftFilterValues(): FilterValues {
    return { status: this.filterDraftStatus(), state: this.filterDraftState(), consultant: this.filterDraftConsultant(), due: this.filterDraftDue(), dueMode: this.filterDraftDueMode(), dueEnd: this.filterDraftDueEnd(), county: this.filterDraftCounty(), city: this.filterDraftCity(), zip: this.filterDraftZip(), premiumMin: this.filterDraftPremiumMin(), premiumMax: this.filterDraftPremiumMax(), taskId: this.filterDraftTaskId(), policy: this.filterDraftPolicy(), client: this.filterDraftClient(), lastVisit: this.filterDraftLastVisit(), cancelled: this.filterDraftCancelled(), reason: this.filterDraftReason() };
  }
  private activeFilterValues(): FilterValues {
    return { status: this.statusFilter(), state: this.stateFilter(), consultant: this.consultantFilter(), due: this.dueBefore(), dueMode: this.dueMode(), dueEnd: this.dueEnd(), county: this.countyFilter(), city: this.cityFilter(), zip: this.zipFilter(), premiumMin: this.premiumMinFilter(), premiumMax: this.premiumMaxFilter(), taskId: this.taskIdFilter(), policy: this.policyFilter(), client: this.clientFilter(), lastVisit: this.lastVisitFilter(), cancelled: this.cancelledFilter(), reason: this.reasonFilter() };
  }
  private setDraftFilters(filters: FilterValues): void {
    this.filterDraftStatus.set(filters.status); this.filterDraftState.set(filters.state); this.filterDraftCounty.set(filters.county); this.filterDraftCity.set(filters.city); this.filterDraftZip.set(filters.zip); this.filterDraftConsultant.set(filters.consultant); this.filterDraftDue.set(filters.due); this.filterDraftDueMode.set(filters.dueMode); this.filterDraftDueEnd.set(filters.dueEnd); this.filterDraftPremiumMin.set(filters.premiumMin); this.filterDraftPremiumMax.set(filters.premiumMax); this.filterDraftTaskId.set(filters.taskId); this.filterDraftPolicy.set(filters.policy); this.filterDraftClient.set(filters.client); this.filterDraftLastVisit.set(filters.lastVisit); this.filterDraftCancelled.set(filters.cancelled); this.filterDraftReason.set(filters.reason);
  }
  private setActiveFilters(filters: FilterValues): void {
    this.statusFilter.set(filters.status); this.stateFilter.set(filters.state); this.countyFilter.set(filters.county); this.cityFilter.set(filters.city); this.zipFilter.set(filters.zip); this.consultantFilter.set(filters.consultant); this.dueBefore.set(filters.due); this.dueMode.set(filters.dueMode); this.dueEnd.set(filters.dueEnd); this.premiumMinFilter.set(filters.premiumMin); this.premiumMaxFilter.set(filters.premiumMax); this.taskIdFilter.set(filters.taskId); this.policyFilter.set(filters.policy); this.clientFilter.set(filters.client); this.lastVisitFilter.set(filters.lastVisit); this.cancelledFilter.set(filters.cancelled); this.reasonFilter.set(filters.reason);
  }
  private persistSavedFilters(): void { localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(this.savedFilters())); }
  private static readSavedFilters(): readonly SavedFilter[] {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_FILTERS_KEY) ?? '[]') as unknown;
      return Array.isArray(saved) ? saved.filter((filter): filter is SavedFilter => typeof filter === 'object' && filter !== null && typeof (filter as { name?: unknown }).name === 'string') : [];
    } catch { return []; }
  }
  private compare(left: TaskRow, right: TaskRow): number { const key = this.sortKey(); const leftValue = this.columnValue(left, key); const rightValue = this.columnValue(right, key); const result = key === 'due' || key === 'lastVisit' || key === 'cancelled' ? this.toTimestamp(leftValue) - this.toTimestamp(rightValue) : leftValue.localeCompare(rightValue); return this.sortDirection() === 'asc' ? result : -result; }
  private columnValue(task: TaskRow, key: ColumnKey): string { return key === 'task' ? task.id : task[key]; }
  private toTimestamp(value: string): number { if (!value) return Number.MAX_SAFE_INTEGER; const [month, day, year] = value.split('/').map(Number); return new Date(year, month - 1, day).getTime(); }
  private toInputDate(value: string): string { const [month, day, year] = value.split('/'); return `${year}-${month}-${day}`; }
}
