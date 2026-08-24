import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideBuilding2,
  LucideCamera,
  LucideList,
  LucidePaperclip,
  LucideSend,
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
    LucideSend,
  ],
  templateUrl: './top-navigation.html',
  styleUrl: './top-navigation.scss',
})
export class TopNavigation {
  readonly taskId = input.required<string>();
  readonly highSeverityRecommendationCount = input(0);
}
