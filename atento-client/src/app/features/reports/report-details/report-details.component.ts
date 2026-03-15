import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReportsService } from '../../../core/services/reports.service';
import { AuthService } from '../../../core/services/auth.service';
import { IReport } from '@atento/shared';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { NotificationService } from '../../../core/services/notification.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TagModule, CardModule, SkeletonModule, AvatarModule],
  templateUrl: './report-details.component.html'
})
export class ReportDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  private reportsService = inject(ReportsService);
  private notificationService = inject(NotificationService);

  report = signal<IReport | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReport(id);
    } else {
      this.error.set('No se encontró el ID del reporte');
      this.isLoading.set(false);
    }
  }

  loadReport(id: string) {
    this.isLoading.set(true);
    this.reportsService.getReport(id).subscribe({
      next: (data) => {
        this.report.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading report:', err);
        this.error.set('Houve un error al cargar los detalles del reporte.');
        this.isLoading.set(false);
        this.notificationService.error('Error al cargar reporte', 'Error');
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'IN_PROGRESS': return 'info';
      case 'RESOLVED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  }

  getSeverityLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En Progreso';
      case 'RESOLVED': return 'Resuelto';
      case 'REJECTED': return 'Rechazado';
      case 'CANCELED': return 'Cancelado';
      default: return status;
    }
  }

  getCategoryIcon(category: string): string {
    const cat = category?.trim().toUpperCase();
    switch (cat) {
      case 'POTHOLE': return 'pi pi-map-marker';
      case 'ELECTRICITY': return 'pi pi-bolt';
      case 'WATER': return 'pi pi-tint';
      case 'WASTE': return 'pi pi-truck';
      case 'PUBLIC_LIGHTING': return 'pi pi-sun';
      default: return 'pi pi-folder';
    }
  }

  getCategoryLabel(category: string) {
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
