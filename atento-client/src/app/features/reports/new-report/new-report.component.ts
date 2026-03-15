import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

import { ReportsService } from '../../../core/services/reports.service';
import { NotificationService } from '../../../core/services/notification.service';
import { GeolocationService, IGeoLocation } from '../../../core/services/geolocation.service';
import { ReportCategory, ICreateReportDto, IReport } from '@atento/shared';

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
    RippleModule,
    DialogModule
  ],
  templateUrl: './new-report.component.html'
})
export class NewReportComponent implements OnInit {
  private reportsService = inject(ReportsService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  public geoService = inject(GeolocationService);

  title = signal('');
  category = signal<ReportCategory | null>(null);
  description = signal('');
  
  isSubmitting = signal(false);
  isDetectingLocation = signal(false);
  locationData = signal<IGeoLocation | null>(null);

  // Duplicity prevention
  nearbyReports = signal<IReport[]>([]);
  showDuplicityWarning = signal(false);
  isCheckingDuplicity = signal(false);

  categories = [
    { label: 'Baches / Vías', value: ReportCategory.POTHOLE },
    { label: 'Eléctrico', value: ReportCategory.ELECTRICITY },
    { label: 'Agua Potable', value: ReportCategory.WATER },
    { label: 'Basura / Desechos', value: ReportCategory.WASTE },
    { label: 'Alumbrado Público', value: ReportCategory.PUBLIC_LIGHTING },
    { label: 'Otro', value: ReportCategory.OTHER }
  ];

  constructor() {
    // Proactive check when both location and category are available
    effect(() => {
      const loc = this.locationData();
      const cat = this.category();
      console.log('Duplicity Check Effect Triggered:', { loc, cat });
      if (loc && cat) {
        this.checkDuplicates(loc.lat, loc.lng, cat);
      }
    });

    // Subscribe to global location changes
    effect(() => {
      const globalLoc = this.geoService.currentLocation();
      if (globalLoc && !this.locationData()) {
        console.log('Applying global location to form:', globalLoc);
        this.locationData.set(globalLoc);
      }
    });
  }

  ngOnInit() {
    if (this.geoService.permissionStatus() === 'granted' && !this.geoService.currentLocation()) {
      this.requestLocation();
    }
  }

  async requestLocation() {
    this.isDetectingLocation.set(true);
    try {
      const coords = await this.geoService.getCurrentPosition();
      const address = await this.geoService.getAddress(coords.lat, coords.lng);
      
      this.locationData.set({
        ...coords,
        address
      });
      
      this.notificationService.success('Ubicación detectada correctamente');
    } catch (error: any) {
      console.error('Error getting location:', error);
      if (error.code === 1) {
        this.notificationService.error('Se requiere permiso de ubicación para reportar.');
      } else {
        this.notificationService.error('Error al detectar la ubicación.');
      }
    } finally {
      this.isDetectingLocation.set(false);
    }
  }

  checkDuplicates(lat: number, lng: number, category: string) {
    this.isCheckingDuplicity.set(true);
    this.reportsService.checkNearbyReports(lat, lng, category).subscribe({
      next: (reports) => {
        this.nearbyReports.set(reports);
        if (reports.length > 0) {
          this.showDuplicityWarning.set(true);
        }
        this.isCheckingDuplicity.set(false);
      },
      error: () => this.isCheckingDuplicity.set(false)
    });
  }

  async submitReport() {
    if (!this.title() || this.title().length < 5) {
      this.notificationService.warn('Título demasiado corto (mín. 5 caps).');
      return;
    }
    if (!this.category()) {
      this.notificationService.warn('Selecciona una categoría.');
      return;
    }

    if (!this.locationData()) {
      if (this.geoService.permissionStatus() === 'denied') {
        this.notificationService.error('Por favor, habilita los permisos de ubicación en tu navegador.');
      } else {
        this.notificationService.warn('Detectando ubicación necesaria...');
        await this.requestLocation();
      }
      if (!this.locationData()) return;
    }

    this.isSubmitting.set(true);

    const reportData: ICreateReportDto = {
      title: this.title(),
      category: this.category()!,
      description: this.description(),
      location: this.locationData()!
    };

    this.reportsService.createReport(reportData).subscribe({
      next: (newReport) => {
        this.isSubmitting.set(false);
        this.reportsService.addLocalReport(newReport);
        this.notificationService.success('¡Reporte enviado exitosamente!');
        this.router.navigate(['/citizen/reports']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error al enviar:', err);
        this.notificationService.error('Ocurrió un error al enviar el reporte.');
      }
    });
  }
}
