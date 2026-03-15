import { Component, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ReportCategory, ICreateReportDto } from '@atento/shared';

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    InputTextModule, 
    SelectModule, 
    TextareaModule, 
    ButtonModule,
    RippleModule
  ],
  templateUrl: './new-report.component.html'
})
export class NewReportComponent {
  private reportsService = inject(ReportsService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Using signals for form state
  title = signal('');
  category = signal<ReportCategory | null>(null);
  description = signal('');
  
  isSubmitting = signal(false);

  categories = [
    { label: 'Baches / Vías', value: ReportCategory.POTHOLE },
    { label: 'Eléctrico', value: ReportCategory.ELECTRICITY },
    { label: 'Agua Potable', value: ReportCategory.WATER },
    { label: 'Basura / Desechos', value: ReportCategory.WASTE },
    { label: 'Alumbrado Público', value: ReportCategory.PUBLIC_LIGHTING },
    { label: 'Otro', value: ReportCategory.OTHER }
  ];

  submitReport() {
    if (!this.title() || this.title().length < 5) {
      this.notificationService.warn('Título demasiado corto (mín. 5 caps).');
      return;
    }
    if (!this.category()) {
      this.notificationService.warn('Selecciona una categoría.');
      return;
    }

    this.isSubmitting.set(true);

    const reportData: ICreateReportDto = {
      title: this.title(),
      category: this.category()!,
      description: this.description(),
      location: {
        lat: 13.6929,
        lng: -89.1920,
        address: 'Centro San Salvador'
      }
    };

    console.log('Enviando reporte:', reportData);

    this.reportsService.createReport(reportData).subscribe({
      next: (newReport) => {
        this.isSubmitting.set(false);
        // Local insertion to avoid full reload
        this.reportsService.addLocalReport(newReport);
        this.notificationService.success('¡Reporte enviado!');
        this.router.navigate(['/citizen/reports']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al enviar:', err);
        this.notificationService.error('Error en el envío.');
      }
    });
  }
}
