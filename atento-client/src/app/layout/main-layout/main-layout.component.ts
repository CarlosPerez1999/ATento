import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule, AvatarModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  geoService = inject(GeolocationService);
  router = inject(Router);

  ngOnInit() {
    // Proactively request location on entry
    this.geoService.getCurrentPosition().catch(err => {
      console.log('Location request skipped or denied at startup');
    });
  }

  logout() {
    this.authService.logout();
  }
}
