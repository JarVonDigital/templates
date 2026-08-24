import { NgOptimizedImage } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideBuilding2, LucideList, LucideShieldPlus, LucideUsers } from '@lucide/angular';

interface NavItem { readonly icon: 'list' | 'users' | 'building-2' | 'shield-plus'; readonly label: string; readonly route: string; }

@Component({
  selector: 'app-sidebar',
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, LucideList, LucideUsers, LucideBuilding2, LucideShieldPlus],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly expanded = signal(false);
  readonly expandedChange = output<boolean>();

  readonly navItems: readonly NavItem[] = [
    { icon: 'list', label: 'Tasks', route: '/tasks' },
    { icon: 'users', label: 'Accounts', route: '/accounts' },
    { icon: 'building-2', label: 'Claims', route: '/claims' },
    { icon: 'shield-plus', label: 'Recommendations', route: '/recommendations' },
  ];

  toggle(): void {
    this.expanded.update((expanded) => {
      const next = !expanded;
      this.expandedChange.emit(next);
      return next;
    });
  }
}
