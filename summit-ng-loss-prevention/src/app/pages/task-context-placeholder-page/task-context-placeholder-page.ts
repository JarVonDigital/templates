import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceholderPage } from '../../shared/placeholder-page/placeholder-page';

@Component({
  selector: 'app-task-context-placeholder-page',
  imports: [PlaceholderPage],
  template: `<app-placeholder-page [title]="title" />`,
})
export class TaskContextPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  readonly title = `${String(this.route.snapshot.data['title'] ?? 'Task details')} · Task ${this.route.parent?.snapshot.paramMap.get('taskId') ?? ''}`;
}
