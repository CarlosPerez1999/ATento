import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { IAuthResponse, ILoginDto, IRegisterDto, IUser, UserRole } from '@atento/shared';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000/auth';

  currentUser = signal<IUser | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkInitialSession();
  }

  login(credentials: ILoginDto): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthentication(res)),
      catchError(err => throwError(() => err))
    );
  }

  register(data: IRegisterDto): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthentication(res)),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    this.http.get(`${this.apiUrl}/logout`).subscribe({
       next: () => this.clearSession(),
       error: () => this.clearSession()
    });
  }

  private handleAuthentication(res: IAuthResponse) {
    if (res.accessToken && res.refreshToken) {
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      this.currentUser.set(res.user as any); // Type cast to shared IUser
      this.isAuthenticated.set(true);

      const redirectUrl = res.user.role === UserRole.ADMIN ? '/admin/dashboard' : '/citizen/dashboard';
      console.log('Login exitoso. Redirigiendo a:', redirectUrl);
      this.router.navigate([redirectUrl]);
    }
  }

  private clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  private checkInitialSession() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.http.get<IUser>(`${this.apiUrl}/me`).subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          
          // If on Login/Root, redirect to Dashboard
          const currentUrl = window.location.pathname;
          if (currentUrl === '/' || currentUrl.includes('/auth/login')) {
             const redirectUrl = user.role === UserRole.ADMIN ? '/admin/dashboard' : '/citizen/dashboard';
             this.router.navigate([redirectUrl]);
          }
        },
        error: () => this.clearSession()
      });
    }
  }
}
