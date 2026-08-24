import { Component, signal } from '@angular/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideSave } from '@lucide/angular';
import { PolicySummary } from '../../shared/policy-summary/policy-summary';
import { UiField } from '../../shared/ui-field/ui-field';
import { VisitCard, VisitDetails } from '../../shared/visit-card/visit-card';

@Component({
  selector: 'app-tasks-page',
  imports: [ButtonDirective, LucideSave, PolicySummary, UiField, VisitCard],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {
  private nextVisitId = 3;
  readonly visits = signal<readonly VisitDetails[]>([
    { id: 1, title: 'Visit Detail', location: '123 Main St, Somewhere TX 21333', description: 'Job Site', date: '08/14/2026' },
    { id: 2, title: 'Visit Detail #2', location: '22 Main St, Elsewhere TX 31333', description: 'Warehouse', date: '08/15/2026', badge: '3' },
  ]);

  addVisit(): void {
    const id = this.nextVisitId++;
    this.visits.update((visits) => [...visits, { id, title: `Visit Detail #${id}`, location: '', description: '', date: '08/16/2026' }]);
  }

  removeVisit(id: number): void { this.visits.update((visits) => visits.filter((visit) => visit.id !== id)); }

  updateVisitLocation(id: number, location: string): void {
    this.visits.update((visits) => visits.map((visit) => visit.id === id ? { ...visit, location } : visit));
  }
}
