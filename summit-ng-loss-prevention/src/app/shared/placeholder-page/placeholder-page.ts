import { Component, input } from '@angular/core';
import { LucidePanelsTopLeft } from '@lucide/angular';

@Component({
  selector: 'app-placeholder-page',
  imports: [LucidePanelsTopLeft],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss',
})
export class PlaceholderPage {
  readonly title = input.required<string>();
}
