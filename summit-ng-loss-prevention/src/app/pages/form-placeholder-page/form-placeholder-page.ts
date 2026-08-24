import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PlaceholderPage } from '../../shared/placeholder-page/placeholder-page';

const FORM_TITLES: Readonly<Record<string, string>> = {
  'lr-and-r': 'LR and R',
  rse: 'RSE',
  'service-frequency-change': 'Service Frequency Change',
  'alert-uw': 'Alert UW',
};

@Component({
  selector: 'app-form-placeholder-page',
  imports: [PlaceholderPage],
  template: `<app-placeholder-page [title]="title()" />`,
})
export class FormPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly title = computed(() => FORM_TITLES[this.params().get('formId') ?? ''] ?? 'Task Form');
}
