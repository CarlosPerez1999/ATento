import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReportsService } from '../../core/services/reports.service';
import { AuthService } from '../../core/services/auth.service';
import { IReport } from '@atento/shared';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, BadgeModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  authService = inject(AuthService);
  reportsService = inject(ReportsService);
  router = inject(Router);
  
  // Readonly Signal from service
  reports = this.reportsService.reports;
  reportsResource = this.reportsService.reportsResource;

  viewReport(id: string) {
    this.router.navigate(['/citizen/reports', id]);
  }

  get reportsValue(): IReport[] {
    return this.reports() || [];
  }

  get activeReportsCount(): number {
    return this.reportsValue.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length;
  }

  get resolvedCasesCount(): number {
    return this.reportsValue.filter(r => r.status === 'RESOLVED').length;
  }

  get recentActivity() {
    return this.reportsValue.slice(0, 5);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'ELECTRICITY': return 'pi-bolt';
      case 'WASTE': return 'pi-truck';
      case 'POTHOLE': return 'pi-map-marker';
      case 'PUBLIC_LIGHTING': return 'pi-sun';
      case 'WATER': return 'pi-tint';
      default: return 'pi-folder';
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'POTHOLE': return 'Baches / Vías';
      case 'ELECTRICITY': return 'Eléctrico';
      case 'WATER': return 'Agua Potable';
      case 'WASTE': return 'Basura / Desechos';
      case 'PUBLIC_LIGHTING': return 'Alumbrado Público';
      case 'OTHER': return 'Otro';
      default: return category;
    }
  }
}
