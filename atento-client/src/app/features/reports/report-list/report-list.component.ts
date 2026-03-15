import { Component, inject, signal, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { IReport } from '@atento/shared';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule, InputTextModule, ConfirmDialogModule, SelectButtonModule, CardModule, FormsModule],
  providers: [ConfirmationService],
  templateUrl: './report-list.component.html'
})
export class ReportListComponent implements OnInit {
  router = inject(Router);
  reportsService = inject(ReportsService);
  notificationService = inject(NotificationService);
  confirmationService = inject(ConfirmationService);
  
  reports = this.reportsService.reports;
  reportsResource = this.reportsService.reportsResource;

  viewMode = signal<'table' | 'grid'>('table');
  isMobile = signal(false);

  viewOptions = [
    { icon: 'pi pi-list', value: 'table' },
    { icon: 'pi pi-th-large', value: 'grid' }
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.viewMode.set('grid');
    }
  }

  viewReport(id: string) {
    this.router.navigate(['/citizen/reports', id]);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'IN_PROGRESS': return 'info';
      case 'RESOLVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'CANCELED': return 'danger';
      default: return 'info';
    }
  }

  getSeverityLabel(status: string) {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En Curso';
      case 'RESOLVED': return 'Resuelto';
      case 'REJECTED': return 'Rechazado';
      case 'CANCELED': return 'Cancelado';
      default: return status;
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

  getCategoryIcon(category: string): string {
    const cat = category?.trim().toUpperCase();
    switch (cat) {
      case 'POTHOLE': return 'pi-map-marker';
      case 'ELECTRICITY': return 'pi-bolt';
      case 'WATER': return 'pi-tint';
      case 'WASTE': return 'pi-truck';
      case 'PUBLIC_LIGHTING': return 'pi-sun';
      default: return 'pi-folder';
    }
  }

  getCategoryClass(category: string): string {
    const cat = category?.trim().toUpperCase();
    switch (cat) {
      case 'POTHOLE': return 'bg-blue-100 text-blue-700 font-bold shadow-sm';
      case 'ELECTRICITY': return 'bg-yellow-100 text-yellow-700 font-bold shadow-sm';
      case 'WATER': return 'bg-cyan-100 text-cyan-700 font-bold shadow-sm';
      case 'WASTE': return 'bg-green-100 text-green-700 font-bold shadow-sm';
      case 'PUBLIC_LIGHTING': return 'bg-orange-100 text-orange-700 font-bold shadow-sm';
      default: return 'bg-surface-200 text-surface-700 font-bold shadow-sm';
    }
  }

  cancelReport(report: IReport, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estás seguro de que deseas cancelar el reporte "${report.title}"?`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'No, mantener',
      acceptLabel: 'Sí, cancelar',
      rejectButtonStyleClass: 'p-button-text p-button-secondary font-bold mr-2',
      acceptButtonStyleClass: 'p-button-danger p-button-raised font-bold',
      defaultFocus: 'reject',
      accept: () => {
        this.reportsService.cancelReport(report.id).subscribe({
          next: () => {
            this.notificationService.success('Reporte cancelado correctamente', 'Éxito');
            this.reportsService.refreshReports();
          },
          error: () => this.notificationService.error('No se pudo cancelar el reporte', 'Error')
        });
      }
    });
  }
}
