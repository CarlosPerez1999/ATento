import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../core/services/reports.service';
import { AuthService } from '../../core/services/auth.service';
import { IReport } from '@atento/shared';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MapComponent } from '../../shared/components/map/map.component';
import { GeolocationService } from '../../core/services/geolocation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    BadgeModule, 
    RouterModule, 
    SelectButtonModule, 
    FormsModule,
    MapComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  authService = inject(AuthService);
  reportsService = inject(ReportsService);
  geoService = inject(GeolocationService);
  router = inject(Router);
  
  // Readonly Signal from service
  reports = this.reportsService.reports;
  reportsResource = this.reportsService.reportsResource;

  mapMode = signal<'markers' | 'heatmap'>('markers');
  mapModeOptions = [
    { label: 'Marcadores', value: 'markers', icon: 'pi pi-map-marker' },
    { label: 'Calor', value: 'heatmap', icon: 'pi pi-bolt' }
  ];

  get mapCenter(): [number, number] {
    const loc = this.geoService.currentLocation();
    return loc ? [loc.lat, loc.lng] : [13.6929, -89.1920];
  }

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
