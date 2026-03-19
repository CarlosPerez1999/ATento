import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet.heat';
import { IReport } from '@atento/shared';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div #mapContainer class="w-full h-full rounded-2xl shadow-inner border border-surface-200 overflow-hidden"></div>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .leaflet-container { font-family: inherit; }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  @Input() reports: IReport[] = [];
  @Input() center: [number, number] = [13.6929, -89.1920]; // Default San Salvador
  @Input() zoom: number = 13;
  @Input() mode: 'markers' | 'heatmap' = 'markers';

  private map?: L.Map;
  private markerLayer = L.layerGroup();
  private heatLayer?: any;

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['reports'] || changes['mode']) {
        this.updateMapContent();
      }
      if (changes['center'] && !changes['center'].isFirstChange()) {
        const curr = changes['center'].currentValue;
        const prev = changes['center'].previousValue;
        
        // Evitar recientes bloqueos y reseteos forzosos del usuario durante changeDetection
        if (!prev || curr[0] !== prev[0] || curr[1] !== prev[1]) {
          this.map.setView(this.center, this.zoom);
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    L.control.attribution({
      position: 'bottomright',
      prefix: 'Data © <a href="https://openstreetmap.org">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    this.markerLayer.addTo(this.map);
    this.updateMapContent();
  }

  private updateMapContent() {
    if (!this.map) return;

    // Clear existing layers
    this.markerLayer.clearLayers();
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
    }

    if (this.mode === 'markers') {
      this.renderMarkers();
    } else {
      this.renderHeatmap();
    }
  }

  private renderMarkers() {
    this.reports.forEach(report => {
      if (!report.location || typeof report.location.lat !== 'number' || typeof report.location.lng !== 'number') {
        return; // Skip invalid reports
      }
      const icon = this.getCategoryIcon(report.category);
      const marker = L.marker([report.location.lat, report.location.lng], { icon });
      
      const popupContent = `
        <div class="p-2 min-w-48">
          <p class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">${report.category}</p>
          <h3 class="font-bold text-surface-900 mb-1">${report.title}</h3>
          <p class="text-xs text-surface-600 line-clamp-2 mb-2">${report.description}</p>
          <div class="flex items-center justify-between border-t border-surface-100 pt-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">${report.status}</span>
            <a href="/citizen/reports/${report.id}" class="text-[10px] font-black text-blue-700 uppercase">Ver detalles</a>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup'
      });
      
      this.markerLayer.addLayer(marker);
    });
  }

  private renderHeatmap() {
    if (!this.map) return;
    
    const validReports = this.reports.filter(r => r.location && typeof r.location.lat === 'number' && typeof r.location.lng === 'number');
    const heatPoints = validReports.map(r => [r.location.lat, r.location.lng, 0.5] as [number, number, number]);
    
    // @ts-ignore - heatLayer comes from leaflet.heat plugin
    this.heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' }
    }).addTo(this.map);
  }

  private getCategoryIcon(category: string): L.DivIcon {
    // Basic category colors
    let color = '#3b82f6'; // blue
    if (category === 'POTHOLE') color = '#ef4444'; // red
    if (category === 'WASTE') color = '#22c55e'; // green
    if (category === 'ELECTRICITY') color = '#eab308'; // yellow

    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white" style="background: ${color}">
          <i class="pi pi-map-marker text-xs"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }
}
