import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-table-shell',
  imports: [NgTemplateOutlet],
  host: { '[class.fill-height]': 'fillHeight()' },
  template: '<div class="table-shell">@if (contentTemplate(); as template) { <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="templateContext()" /> } @else { <ng-content /> }</div>',
  styleUrl: './table-shell.scss',
})
export class TableShell {
  readonly fillHeight = input(false);
  readonly contentTemplate = contentChild<TemplateRef<unknown>>(TemplateRef, { descendants: false });
  readonly templateContext = input<Record<string, unknown>>({});
}
