import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  LucideArrowDownAZ,
  LucideCalendarClock,
  LucideCheckCircle2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCircleAlert,
  LucideFilter,
  LucideLightbulb,
  LucideMoreVertical,
  LucideSearch,
  LucideShieldAlert,
  LucideX,
} from '@lucide/angular';
import { BulkActionItem, BulkActions } from '../../shared/bulk-actions/bulk-actions';
import { TableShell } from '../../shared/table-shell/table-shell';
import { TableHeader } from '../../shared/table-header/table-header';

type Urgency = 'Routine' | 'Important' | 'Critical';
type RecommendationStatus = 'Open' | 'In progress' | 'Scheduled' | 'Awaiting verification' | 'Verified' | 'Completed' | 'Cancelled Policy';
type BulkRecommendationStatus = Extract<RecommendationStatus, 'Verified' | 'Completed' | 'Cancelled Policy'>;
type RecommendationSortKey = 'id' | 'title' | 'location' | 'dueDate' | 'owner' | 'status';
type RecommendationColumnKey = 'title' | 'location' | 'dueDate' | 'owner' | 'status';

interface Recommendation {
  readonly id: string;
  readonly title: string;
  readonly standard: string;
  readonly description: string;
  readonly urgency: Urgency;
  readonly visit: string;
  readonly location: string;
  readonly dateAdded: string;
  readonly dueDate: string;
  readonly owner: string;
  readonly status: RecommendationStatus;
  readonly statusDate: string | null;
}

interface RecommendationFilters {
  readonly urgency: Urgency | '';
  readonly status: RecommendationStatus | '';
  readonly owner: string;
  readonly location: string;
  readonly dueMode: 'before' | 'on' | 'after' | 'range';
  readonly dueDate: string;
  readonly dueDateEnd: string;
}

interface RecommendationColumnDefinition {
  readonly key: RecommendationColumnKey;
  readonly label: string;
  readonly value: (recommendation: Recommendation) => string;
  readonly cellClass?: (recommendation: Recommendation) => string;
}

const RECOMMENDATIONS: readonly Recommendation[] = [
  { id: 'REC-001', title: 'Document subcontractor certificates of insurance', standard: 'ADM 34 · Administrative', description: 'Collect current certificates and confirm coverage before subcontractors return to the job site.', urgency: 'Critical', visit: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', dateAdded: '08/14/2026', dueDate: '08/22/2026', owner: 'R. Patel', status: 'Open', statusDate: null },
  { id: 'REC-002', title: 'Establish an immediate illness response protocol', standard: 'ADM 53 · Administrative', description: 'Post reporting steps and identify who can isolate a work area when a communicable illness is reported.', urgency: 'Critical', visit: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', dateAdded: '08/15/2026', dueDate: '08/23/2026', owner: 'M. Chen', status: 'In progress', statusDate: null },
  { id: 'REC-003', title: 'Correct the blocked emergency exit route', standard: 'Custom · Property', description: 'Remove stored pallets from the south exit aisle and maintain the marked clearance at all times.', urgency: 'Critical', visit: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', dateAdded: '08/15/2026', dueDate: '08/21/2026', owner: 'J. Alvarez', status: 'Awaiting verification', statusDate: null },
  { id: 'REC-004', title: 'Provide bilingual safety communications', standard: 'ADM 23 · Administrative', description: 'Translate orientation materials and daily hazard notices for the primary languages used by the crew.', urgency: 'Important', visit: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', dateAdded: '08/14/2026', dueDate: '08/29/2026', owner: 'S. Wilson', status: 'In progress', statusDate: null },
  { id: 'REC-005', title: 'Formalize the disciplinary program', standard: 'ADM 6 · Administrative', description: 'Publish consistent progressive-discipline steps for repeated safety rule violations.', urgency: 'Important', visit: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', dateAdded: '08/15/2026', dueDate: '09/04/2026', owner: 'K. Morris', status: 'Scheduled', statusDate: null },
  { id: 'REC-006', title: 'Standardize applicant verification records', standard: 'ADM 51 · Administrative', description: 'Use a shared checklist to document license, experience, and reference verification for new hires.', urgency: 'Important', visit: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', dateAdded: '08/14/2026', dueDate: '09/08/2026', owner: 'R. Patel', status: 'Open', statusDate: null },
  { id: 'REC-007', title: 'Add monthly housekeeping inspections', standard: 'Custom · Property', description: 'Schedule a documented walkthrough of storage, access, and waste areas each month.', urgency: 'Routine', visit: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', dateAdded: '08/15/2026', dueDate: '09/18/2026', owner: 'M. Chen', status: 'Scheduled', statusDate: null },
  { id: 'REC-008', title: 'Refresh the approved driver list', standard: 'Custom · Fleet', description: 'Reconcile active drivers against motor vehicle record checks and current authorization forms.', urgency: 'Routine', visit: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', dateAdded: '08/14/2026', dueDate: '09/25/2026', owner: 'S. Wilson', status: 'Open', statusDate: null },
  { id: 'REC-009', title: 'Review administrative forms annually', standard: 'ADM 999 · Administrative', description: 'Assign an annual review date and document the owner for each loss-prevention form.', urgency: 'Routine', visit: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', dateAdded: '08/15/2026', dueDate: '10/02/2026', owner: 'K. Morris', status: 'Scheduled', statusDate: null },
];

const RECOMMENDATION_BULK_ACTIONS: readonly BulkActionItem[] = [
  { id: 'Verified', label: 'Mark verified', icon: 'verified' },
  { id: 'Completed', label: 'Mark completed', icon: 'completed' },
  { id: 'Cancelled Policy', label: 'Cancel policy', icon: 'cancelled' },
];

const EMPTY_FILTERS: RecommendationFilters = { urgency: '', status: '', owner: '', location: '', dueMode: 'before', dueDate: '', dueDateEnd: '' };

@Component({
  selector: 'app-recommendations-page',
  imports: [BulkActions, TableShell, TableHeader, LucideArrowDownAZ, LucideCalendarClock, LucideCheckCircle2, LucideChevronLeft, LucideChevronRight, LucideCircleAlert, LucideFilter, LucideLightbulb, LucideMoreVertical, LucideSearch, LucideShieldAlert, LucideX],
  templateUrl: './recommendations-page.html',
  styleUrl: './recommendations-page.scss',
})
export class RecommendationsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly contextParams = toSignal(this.route.parent?.paramMap ?? this.route.paramMap, { initialValue: this.route.parent?.snapshot.paramMap ?? this.route.snapshot.paramMap });
  readonly taskId = computed(() => this.contextParams().get('taskId'));
  readonly bulkActions = RECOMMENDATION_BULK_ACTIONS;
  readonly columns = signal<readonly RecommendationColumnDefinition[]>([
    { key: 'title', label: 'Recommendation', value: (recommendation) => `${recommendation.id} · ${recommendation.title} · ${recommendation.standard}`, cellClass: () => 'recommendation-cell' },
    { key: 'location', label: 'Visit location', value: (recommendation) => `${recommendation.visit} · ${recommendation.location}`, cellClass: () => 'location-cell' },
    { key: 'dueDate', label: 'Timeline', value: (recommendation) => `Added ${recommendation.dateAdded} · Due ${recommendation.dueDate}`, cellClass: () => 'date-cell' },
    { key: 'owner', label: 'Owner', value: (recommendation) => recommendation.owner, cellClass: () => 'owner' },
    { key: 'status', label: 'Status', value: (recommendation) => recommendation.status, cellClass: (recommendation) => `status ${recommendation.status.toLowerCase().replaceAll(' ', '-')}` },
  ]);
  readonly urgencyLevels: readonly Urgency[] = ['Critical', 'Important', 'Routine'];
  readonly selectedUrgency = signal<Urgency>('Critical');
  readonly query = signal('');
  readonly recommendations = signal(RECOMMENDATIONS);
  readonly selected = signal<ReadonlySet<string>>(new Set());
  readonly announcement = signal('');
  readonly filtersOpen = signal(false);
  readonly columnsOpen = signal(false);
  readonly visibleColumns = signal<ReadonlySet<string>>(new Set(this.columns().map((column) => column.key)));
  readonly filterDraft = signal<RecommendationFilters>(EMPTY_FILTERS);
  readonly activeFilters = signal<RecommendationFilters>(EMPTY_FILTERS);
  readonly sortKey = signal<RecommendationSortKey>('dueDate');
  readonly sortDescending = signal(false);
  readonly rowMenu = signal<string | null>(null);
  readonly page = signal(1);
  readonly pageSize = 10;
  readonly recommendationStatuses: readonly RecommendationStatus[] = ['Open', 'In progress', 'Scheduled', 'Awaiting verification', 'Verified', 'Completed', 'Cancelled Policy'];
  readonly owners = [...new Set(RECOMMENDATIONS.map((recommendation) => recommendation.owner))];
  readonly locations = [...new Set(RECOMMENDATIONS.map((recommendation) => recommendation.location))];
  readonly filteredRecommendations = computed(() => {
    const query = this.query().trim().toLowerCase();
    const filters = this.activeFilters();
    return this.recommendations().filter((recommendation) => (this.taskId() ? recommendation.urgency === this.selectedUrgency() : true)
      && (!query || Object.values(recommendation).some((value) => String(value ?? '').toLowerCase().includes(query)))
      && (!filters.urgency || recommendation.urgency === filters.urgency)
      && (!filters.status || recommendation.status === filters.status)
      && (!filters.owner || recommendation.owner === filters.owner)
      && (!filters.location || recommendation.location === filters.location)
      && this.matchesDueDate(recommendation.dueDate, filters));
  });
  readonly sortedRecommendations = computed(() => {
    const key = this.sortKey();
    const direction = this.sortDescending() ? -1 : 1;
    return [...this.filteredRecommendations()].sort((left, right) => String(left[key]).localeCompare(String(right[key]), undefined, { numeric: true }) * direction);
  });
  readonly pagedRecommendations = computed(() => this.sortedRecommendations().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredRecommendations().length / this.pageSize)));
  readonly activeFilterCount = computed(() => Object.entries(this.activeFilters()).filter(([key, value]) => key !== 'dueMode' && Boolean(value)).length);
  readonly allVisibleSelected = computed(() => this.filteredRecommendations().length > 0
    && this.filteredRecommendations().every((recommendation) => this.selected().has(recommendation.id)));

  isColumnVisible(key: RecommendationColumnKey): boolean { return this.visibleColumns().has(key); }


  countFor(urgency: Urgency): number {
    return this.recommendations().filter((recommendation) => recommendation.urgency === urgency).length;
  }

  updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  updateFilter<K extends keyof RecommendationFilters>(key: K, value: RecommendationFilters[K]): void {
    this.filterDraft.update((filters) => ({ ...filters, [key]: value }));
  }

  applyFilters(): void {
    this.activeFilters.set({ ...this.filterDraft() });
    this.page.set(1);
    this.filtersOpen.set(false);
  }

  resetFilters(): void {
    this.filterDraft.set(EMPTY_FILTERS);
    this.activeFilters.set(EMPTY_FILTERS);
    this.page.set(1);
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  toggleSort(key: RecommendationSortKey): void {
    if (this.sortKey() === key) this.sortDescending.update((descending) => !descending);
    else { this.sortKey.set(key); this.sortDescending.set(false); }
    this.page.set(1);
  }

  sortPressed(key: RecommendationSortKey): boolean {
    return this.sortKey() === key;
  }

  applyRowStatus(id: string, status: BulkRecommendationStatus): void {
    this.recommendations.update((recommendations) => recommendations.map((recommendation) => recommendation.id === id
      ? { ...recommendation, status, statusDate: null }
      : recommendation));
    this.rowMenu.set(null);
    this.announcement.set(`${id} changed to ${status}`);
  }

  pageStart(): number {
    return this.filteredRecommendations().length ? (this.page() - 1) * this.pageSize + 1 : 0;
  }

  pageEnd(): number {
    return Math.min(this.page() * this.pageSize, this.filteredRecommendations().length);
  }

  private matchesDueDate(date: string, filters: RecommendationFilters): boolean {
    if (!filters.dueDate) return true;
    const recommendationDate = this.toDateValue(date);
    const startDate = this.toDateValue(filters.dueDate);
    const endDate = filters.dueDateEnd ? this.toDateValue(filters.dueDateEnd) : startDate;
    if (!recommendationDate || !startDate) return true;
    if (filters.dueMode === 'on') return recommendationDate === startDate;
    if (filters.dueMode === 'after') return recommendationDate > startDate;
    if (filters.dueMode === 'range') return recommendationDate >= startDate && recommendationDate <= endDate;
    return recommendationDate < startDate;
  }

  private toDateValue(date: string): number {
    const [month, day, year] = date.split('/').map(Number);
    return month && day && year ? new Date(year, month - 1, day).getTime() : 0;
  }

  toggleRecommendation(id: string, checked: boolean): void {
    this.selected.update((current) => {
      const next = new Set(current);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  toggleVisible(checked: boolean): void {
    this.selected.update((current) => {
      const next = new Set(current);
      this.filteredRecommendations().forEach((recommendation) => checked ? next.add(recommendation.id) : next.delete(recommendation.id));
      return next;
    });
  }

  clearSelection(): void {
    this.selected.set(new Set());
  }

  applyBulkStatus(status: BulkRecommendationStatus): void {
    const selected = this.selected();
    const statusDate = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(new Date());
    this.recommendations.update((recommendations) => recommendations.map((recommendation) => selected.has(recommendation.id)
      ? { ...recommendation, status, statusDate }
      : recommendation));
    this.announcement.set(`${selected.size} ${selected.size === 1 ? 'recommendation' : 'recommendations'} changed to ${status} on ${statusDate}`);
    this.clearSelection();
  }

  handleBulkAction(action: string): void {
    if (action === 'Verified' || action === 'Completed' || action === 'Cancelled Policy') this.applyBulkStatus(action);
  }
}
