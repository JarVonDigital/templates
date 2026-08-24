import { Component, input } from '@angular/core';
import { LucideCalendarDays, LucideChevronDown } from '@lucide/angular';

@Component({ selector: 'app-ui-field', imports: [LucideCalendarDays, LucideChevronDown], templateUrl: './ui-field.html', styleUrl: './ui-field.scss' })
export class UiField {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly required = input(false);
  readonly kind = input<'text' | 'select' | 'date'>('text');
  readonly options = input<readonly string[]>([]);
}
