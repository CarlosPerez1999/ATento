import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule, AvatarModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  logout() {
    this.authService.logout();
  }
}
