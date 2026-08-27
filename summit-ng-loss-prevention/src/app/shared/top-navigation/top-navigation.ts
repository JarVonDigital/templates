import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideBuilding2,
  LucideCamera,
  LucideList,
  LucidePaperclip,
  LucideShieldPlus,
  LucideUsers,
} from '@lucide/angular';

@Component({
  selector: 'app-top-navigation',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideList,
    LucideUsers,
    LucideBuilding2,
    LucideShieldPlus,
    LucidePaperclip,
    LucideCamera,
  ],
  templateUrl: './top-navigation.html',
  styleUrl: './top-navigation.scss',
})
export class TopNavigation {
  readonly policyId = input.required<string>();
  readonly taskId = input<string | null>(null);
  readonly claimId = input<string | null>(null);
  readonly taskDetail = input(false);
  readonly highSeverityRecommendationCount = input(0);
  readonly takePhoto = output<void>();
  readonly openAttachments = output<void>();

  taskTabRoute(): string[] {
    return this.taskId()
      ? ['/policies', this.policyId(), 'tasks', this.taskId() as string]
      : ['/policies', this.policyId(), 'tasks'];
  }

  tabQueryParams(): Record<string, string> | null {
    const params: Record<string, string> = {};
    if (this.taskId()) params['taskId'] = this.taskId() as string;
    if (this.claimId()) params['claimId'] = this.claimId() as string;
    return Object.keys(params).length ? params : null;
  }
}
