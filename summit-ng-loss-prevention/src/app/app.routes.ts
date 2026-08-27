import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'policies/:policyId',
    loadComponent: () => import('./layouts/policy-context-layout/policy-context-layout').then((m) => m.PolicyContextLayout),
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', loadComponent: () => import('./pages/task-list-page/task-list-page').then((m) => m.TaskListPage) },
      { path: 'tasks/:taskId', loadComponent: () => import('./pages/tasks-page/tasks-page').then((m) => m.TasksPage) },
      { path: 'tasks/:taskId/forms/lr-and-r', loadComponent: () => import('./pages/lr-and-r-page/lr-and-r-page').then((m) => m.LrAndRPage) },
      { path: 'tasks/:taskId/forms/:formId', loadComponent: () => import('./pages/form-placeholder-page/form-placeholder-page').then((m) => m.FormPlaceholderPage) },
      { path: 'account', loadComponent: () => import('./pages/account-page/account-page').then((m) => m.AccountPage) },
      { path: 'claims', loadComponent: () => import('./pages/claims-page/claims-page').then((m) => m.ClaimsPage) },
      { path: 'claims/:claimId', loadComponent: () => import('./pages/claim-detail-page/claim-detail-page').then((m) => m.ClaimDetailPage) },
      { path: 'recommendations', loadComponent: () => import('./pages/recommendations-page/recommendations-page').then((m) => m.RecommendationsPage) },
    ],
  },
  {
    path: 'tasks/:taskId',
    loadComponent: () =>
      import('./layouts/task-context-layout/task-context-layout').then(
        (m) => m.TaskContextLayout
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/tasks-page/tasks-page').then((m) => m.TasksPage),
      },
      {
        path: 'forms/lr-and-r',
        loadComponent: () =>
          import('./pages/lr-and-r-page/lr-and-r-page').then(
            (m) => m.LrAndRPage
          ),
      },
      {
        path: 'forms/:formId',
        loadComponent: () =>
          import('./pages/form-placeholder-page/form-placeholder-page').then(
            (m) => m.FormPlaceholderPage
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account-page/account-page').then((m) => m.AccountPage),
      },
      {
        path: 'claims',
        loadComponent: () =>
          import('./pages/claims-page/claims-page').then((m) => m.ClaimsPage),
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./pages/recommendations-page/recommendations-page').then(
            (m) => m.RecommendationsPage
          ),
      },
    ],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/task-list-page/task-list-page').then((m) => m.TaskListPage),
  },
  {
    path: '',
    children: [
      {
        path: 'accounts',
        loadComponent: () =>
          import('./pages/accounts-page/accounts-page').then((m) => m.AccountsPage),
      },
      {
        path: 'claims',
        loadComponent: () =>
          import('./pages/claims-page/claims-page').then((m) => m.ClaimsPage),
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./pages/recommendations-page/recommendations-page').then(
            (m) => m.RecommendationsPage
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'tasks' },
];
