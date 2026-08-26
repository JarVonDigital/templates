import { Component, computed, inject, model, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideBriefcaseBusiness, LucideChevronLeft, LucideChevronRight, LucideCircleCheck, LucideCircleDollarSign, LucideFilter, LucideSearch } from '@lucide/angular';
import claimsTestData from '../../../../claims-test-data.json';
import { ProjectTable, ProjectTableColumn, ProjectTableSortChange, ProjectTableSortDirection } from '../../shared/project-table/project-table';
import { FilterDrawer } from '../../shared/filter-drawer/filter-drawer';
import { ScrollWorkspace } from '../../shared/scroll-workspace/scroll-workspace';
import { TableHeader } from '../../shared/table-header/table-header';

interface ClaimKey {
  readonly fund: string;
  readonly member: number;
  readonly subCode: number;
  readonly fundYear: number;
  readonly claimNumber: number;
  readonly sequence: string;
  readonly monthEndPeriod: number;
}

interface Claim {
  readonly claimKey: ClaimKey;
  readonly policyPeriod: { readonly start: string; readonly end: string };
  readonly iwName: string;
  readonly status: 'Open' | 'Closed';
  readonly dateOfInjury: string;
  readonly totalIncurred: number;
}

type ClaimColumnKey = 'claimNumber' | 'iwName' | 'policyPeriod' | 'dateOfInjury' | 'status' | 'totalIncurred';

const CLAIMS = claimsTestData as readonly Claim[];
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const CLAIM_COLUMNS: readonly ProjectTableColumn[] = [
  { key: 'claimNumber', label: 'Claim #' },
  { key: 'iwName', label: 'Injured worker' },
  { key: 'policyPeriod', label: 'Policy period' },
  { key: 'dateOfInjury', label: 'Date of injury' },
  { key: 'status', label: 'Status' },
  { key: 'totalIncurred', label: 'Total incurred' },
];
const PAGE_SIZE = 10;

@Component({
  selector: 'app-claims-page',
  imports: [ProjectTable, FilterDrawer, ScrollWorkspace, TableHeader, LucideBriefcaseBusiness, LucideChevronLeft, LucideChevronRight, LucideCircleCheck, LucideCircleDollarSign, LucideFilter, LucideSearch],
  templateUrl: './claims-page.html',
  styleUrl: './claims-page.scss',
})
export class ClaimsPage {
  private readonly route = inject(ActivatedRoute);
  readonly taskId = this.route.parent?.snapshot.paramMap.get('taskId') ?? '';
  readonly claims = signal(CLAIMS);
  readonly query = signal('');
  readonly columns = model<readonly ProjectTableColumn[]>(CLAIM_COLUMNS);
  readonly visibleColumns = model<ReadonlySet<string>>(new Set(CLAIM_COLUMNS.map((column) => column.key)));
  readonly columnsOpen = model(false);
  readonly filtersOpen = signal(false);
  readonly statusFilter = signal<Claim['status'] | 'All'>('All');
  readonly statuses: readonly (Claim['status'] | 'All')[] = ['All', 'Open', 'Closed'];
  readonly page = signal(1);
  readonly sortKey = signal<ClaimColumnKey>('claimNumber');
  readonly sortDirection = signal<ProjectTableSortDirection>('desc');
  readonly filteredClaims = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.claims().filter((claim) => {
      const matchesStatus = this.statusFilter() === 'All' || claim.status === this.statusFilter();
      const matchesQuery = !query || [
      claim.claimKey.claimNumber,
      claim.claimKey.fund,
      claim.claimKey.fundYear,
      claim.iwName,
      claim.status,
      claim.dateOfInjury,
      claim.policyPeriod.start,
      claim.policyPeriod.end,
      claim.totalIncurred,
      ].some((value) => String(value).toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  });
  readonly sortedClaims = computed(() => {
    const key = this.sortKey();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    return [...this.filteredClaims()].sort((left, right) => this.compareClaims(left, right, key) * direction);
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.sortedClaims().length / PAGE_SIZE)));
  readonly pageStart = computed(() => this.sortedClaims().length ? (this.page() - 1) * PAGE_SIZE + 1 : 0);
  readonly pageEnd = computed(() => Math.min(this.page() * PAGE_SIZE, this.sortedClaims().length));
  readonly pagedClaims = computed(() => this.sortedClaims().slice((this.page() - 1) * PAGE_SIZE, this.page() * PAGE_SIZE));
  readonly activeFilterCount = computed(() => this.statusFilter() === 'All' ? 0 : 1);
  readonly openClaimCount = computed(() => this.claims().filter((claim) => claim.status === 'Open').length);
  readonly closedClaimCount = computed(() => this.claims().filter((claim) => claim.status === 'Closed').length);
  readonly totalIncurred = computed(() => this.claims().reduce((total, claim) => total + claim.totalIncurred, 0));

  search(query: string): void {
    this.query.set(query);
    this.page.set(1);
  }

  applyTableSort(change: ProjectTableSortChange): void {
    if (!this.columns().some((column) => column.key === change.key)) return;
    this.sortKey.set(change.key as ClaimColumnKey);
    this.sortDirection.set(change.direction);
  }

  formatCurrency(value: number): string {
    return CURRENCY_FORMATTER.format(value);
  }

  isColumnVisible(key: string): boolean {
    return this.visibleColumns().has(key);
  }

  setStatusFilter(status: Claim['status'] | 'All'): void {
    this.statusFilter.set(status);
    this.page.set(1);
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  private compareClaims(left: Claim, right: Claim, key: ClaimColumnKey): number {
    const leftValue = this.claimSortValue(left, key);
    const rightValue = this.claimSortValue(right, key);
    return typeof leftValue === 'number' && typeof rightValue === 'number'
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true });
  }

  private claimSortValue(claim: Claim, key: ClaimColumnKey): number | string {
    if (key === 'claimNumber') return claim.claimKey.claimNumber;
    if (key === 'policyPeriod') return claim.policyPeriod.start;
    if (key === 'totalIncurred') return claim.totalIncurred;
    return claim[key];
  }
}
