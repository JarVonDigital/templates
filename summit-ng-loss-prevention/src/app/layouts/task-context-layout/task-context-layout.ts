import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { LucideArrowLeft, LucideCheckCircle2, LucideCircle, LucideInfo, LucidePrinter } from '@lucide/angular';
import { TopNavigation } from '../../shared/top-navigation/top-navigation';

interface TaskFormLink {
  readonly completed: boolean;
  readonly label: string;
  readonly slug: string;
}

@Component({
  selector: 'app-task-context-layout',
  imports: [ButtonDirective, RouterLink, RouterLinkActive, RouterOutlet, LucideArrowLeft, LucideCheckCircle2, LucideCircle, LucideInfo, LucidePrinter, TopNavigation],
  templateUrl: './task-context-layout.html',
  styleUrl: './task-context-layout.scss',
})
export class TaskContextLayout {
  private readonly route = inject(ActivatedRoute);
  readonly taskId = toSignal(this.route.paramMap.pipe(map((params) => params.get('taskId') ?? 'Task')), { initialValue: 'Task' });
  readonly highSeverityRecommendationCount = signal(3);
  readonly forms = signal<readonly TaskFormLink[]>([
    { label: 'LR and R', slug: 'lr-and-r', completed: true },
    { label: 'RSE', slug: 'rse', completed: false },
    { label: 'Service Frequency Change', slug: 'service-frequency-change', completed: false },
    { label: 'Alert UW', slug: 'alert-uw', completed: false },
  ]);
}
