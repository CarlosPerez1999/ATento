import { Injectable, signal } from '@angular/core';

export interface IGeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  // Signal to track permission status
  // 'prompt' | 'granted' | 'denied'
  permissionStatus = signal<PermissionState>('prompt');
  
  // Signal to store current location
  currentLocation = signal<IGeoLocation | null>(null);

  constructor() {
    this.checkPermissionStatus();
  }

  /**
   * Checks the current browser permission status for geolocation
   */
  async checkPermissionStatus() {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        this.permissionStatus.set(result.state);
        
        result.onchange = () => {
          this.permissionStatus.set(result.state);
        };
      } catch (error) {
        console.error('Error checking permission status:', error);
      }
    }
  }

  /**
   * Requests the current position and resolves address
   */
  async getCurrentPosition(): Promise<IGeoLocation> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Proactively get address
          const address = await this.getAddress(coords.lat, coords.lng);
          const fullLocation: IGeoLocation = { ...coords, address };
          
          this.currentLocation.set(fullLocation);
          this.permissionStatus.set('granted');
          resolve(fullLocation);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            this.permissionStatus.set('denied');
          }
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  /**
   * Simple reverse geocoding using Nominatim (OpenStreetMap)
   * Free for low volume use
   */
  async getAddress(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: {
          'Accept-Language': 'es',
          'User-Agent': 'ATento-Client-App'
        }
      });
      const data = await response.json();
      return data.display_name || 'Ubicación desconocida';
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return 'No se pudo determinar la dirección';
    }
  }
}
