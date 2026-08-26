import { Component, ViewEncapsulation, input, output } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-filter-drawer',
  imports: [LucideX],
  templateUrl: './filter-drawer.html',
  styleUrl: './filter-drawer.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FilterDrawer {
  readonly title = input.required<string>();
  readonly description = input('Refine results');
  readonly dismissed = output<void>();

}
