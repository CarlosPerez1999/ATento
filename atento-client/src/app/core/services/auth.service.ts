import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { IAuthResponse, ILoginDto, IRegisterDto } from '@atento/shared';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:3000/auth'; // Using local API for now

  // Signal state management 
  currentUser = signal<IAuthResponse['user'] | null>(null);
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
      this.currentUser.set(res.user);
      this.isAuthenticated.set(true);
      this.router.navigate(['/']); // Redirect to dashboard or home
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
        // Here we could decode the token or call a /me endpoint to rehydrate the user
        this.isAuthenticated.set(true);
    }
  }
}
