import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { ButtonGroup } from '@openng/optimus-ui/buttongroup';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { LucideTrash2 } from '@lucide/angular';
import { FilterDrawer } from '../filter-drawer/filter-drawer';
import { DueMode, SavedTaskFilter, TaskFilterValues } from './task-filter.types';

type SelectOption = { readonly label: string; readonly value: string };

@Component({
  selector: 'app-task-filter-drawer',
  imports: [FormsModule, ButtonDirective, ButtonGroup, FilterDrawer, InputText, Select, LucideTrash2],
  templateUrl: './task-filter-drawer.html',
  styleUrl: './task-filter-drawer.scss',
})
export class TaskFilterDrawer implements OnInit {
  readonly draft = input.required<TaskFilterValues>();
  readonly savedFilters = input<readonly SavedTaskFilter[]>([]);
  readonly states = input<readonly string[]>([]);
  readonly statuses = input<readonly string[]>([]);
  readonly consultants = input<readonly string[]>([]);
  readonly reasons = input<readonly string[]>([]);
  readonly locations = input.required<Readonly<Record<string, { readonly counties: readonly string[]; readonly cities: readonly string[] }>>>();
  readonly closed = output<void>();
  readonly applied = output<TaskFilterValues>();
  readonly reset = output<void>();
  readonly saved = output<{ readonly name: string; readonly values: TaskFilterValues }>();
  readonly deleted = output<string>();

  readonly working = signal<TaskFilterValues>({ status: '', state: '', consultant: '', due: '', dueMode: 'before', dueEnd: '', county: '', city: '', zip: '', premiumMin: '', premiumMax: '', taskId: '', policy: '', client: '', lastVisit: '', cancelled: '', reason: '' });
  readonly selectedSavedFilter = signal('');
  readonly savedFilterName = signal('');
  readonly stateOptions = computed(() => this.toOptions(this.states(), 'Any state'));
  readonly statusOptions = computed(() => this.toOptions(this.statuses(), 'Any status'));
  readonly consultantOptions = computed(() => this.toOptions(this.consultants(), 'Any consultant'));
  readonly reasonOptions = computed(() => this.toOptions(this.reasons(), 'Any reason'));
  readonly savedFilterOptions = computed(() => this.toOptions(this.savedFilters().map((filter) => filter.name), 'Choose a saved filter'));
  readonly countyOptions = computed(() => this.toOptions(this.locations()[this.working().state]?.counties ?? [], 'Any county'));
  readonly cityOptions = computed(() => this.toOptions(this.locations()[this.working().state]?.cities ?? [], 'Any city'));

  ngOnInit(): void { this.working.set(this.draft()); }
  update<K extends keyof TaskFilterValues>(key: K, value: TaskFilterValues[K]): void { this.working.update((current) => ({ ...current, [key]: value })); }
  changeState(state: string): void { this.working.update((current) => ({ ...current, state, county: '', city: '' })); }
  selectDueMode(dueMode: DueMode): void { this.update('dueMode', dueMode); }
  loadSavedFilter(name: string): void {
    this.selectedSavedFilter.set(name);
    const saved = this.savedFilters().find((filter) => filter.name === name);
    if (saved) { const { name: savedName, ...values } = saved; this.working.set(values); this.savedFilterName.set(savedName); }
  }
  save(): void { const name = this.savedFilterName().trim(); if (name) this.saved.emit({ name, values: this.working() }); }
  delete(): void { const name = this.selectedSavedFilter(); if (name) { this.deleted.emit(name); this.selectedSavedFilter.set(''); this.savedFilterName.set(''); } }
  apply(): void { this.applied.emit(this.working()); }
  resetDraft(): void {
    this.working.set({ status: '', state: '', consultant: '', due: '', dueMode: 'before', dueEnd: '', county: '', city: '', zip: '', premiumMin: '', premiumMax: '', taskId: '', policy: '', client: '', lastVisit: '', cancelled: '', reason: '' });
    this.reset.emit();
  }
  private toOptions(values: readonly string[], emptyLabel: string): SelectOption[] { return [{ label: emptyLabel, value: '' }, ...values.map((value) => ({ label: value, value }))]; }
}
