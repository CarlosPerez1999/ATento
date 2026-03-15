import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'citizen',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'reports',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/reports/report-list/report-list.component').then(m => m.ReportListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/reports/new-report/new-report.component').then(m => m.NewReportComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/reports/report-details/report-details.component').then(m => m.ReportDetailsComponent)
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'citizen/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
