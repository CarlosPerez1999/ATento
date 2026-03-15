import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { IReport, ICreateReportDto, IUpdateReportDto } from '@atento/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/reports';

  private _reports = signal<IReport[]>([]);
  public reports = this._reports.asReadonly();

  // Using standard httpResource for declarative fetching (Signals)
  reportsResource = httpResource<IReport[]>(() => `${this.apiUrl}/my-reports`);

  constructor() {
    // Sync resource value to our local signal
    effect(() => {
      const data = this.reportsResource.value();
      if (data) {
        this._reports.set(data);
      }
    });
  }

  // Local insertion to avoid re-fetching the entire list
  addLocalReport(report: IReport) {
    this._reports.update(prev => [report, ...prev]);
  }

  // Reload the resource from the server if needed
  refreshReports() {
    this.reportsResource.reload();
  }

  // For POST, PATCH, DELETE we still use standard Observables as requested
  createReport(data: ICreateReportDto): Observable<IReport> {
    return this.http.post<IReport>(this.apiUrl, data);
  }

  updateReport(id: string, data: IUpdateReportDto): Observable<IReport> {
    return this.http.patch<IReport>(`${this.apiUrl}/${id}`, data);
  }

  cancelReport(id: string): Observable<IReport> {
    return this.http.patch<IReport>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getReport(id: string): Observable<IReport> {
    return this.http.get<IReport>(`${this.apiUrl}/${id}`);
  }

  checkNearbyReports(lat: number, lng: number, category: string): Observable<IReport[]> {
    return this.http.get<IReport[]>(`${this.apiUrl}/nearby`, {
      params: { lat: lat.toString(), lng: lng.toString(), category, radius: '50' }
    });
  }
}
