import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated: boolean;
  password: string;

  constructor(private http: HttpClient, private router: Router) {
    this.password = localStorage.getItem('credentials') || '';
    this.isAuthenticated = !!this.password.length;
  }

  authenticate(password: string, rememberMe = false): Observable<boolean> {
    return this.http
      .post<boolean>(`/auth`, {
        password,
      })
      .pipe(
        map((accepted) => {
          if (accepted) {
            this.isAuthenticated = true;
            this.password = btoa(password);
            console.log('password is awesome, encoding as ', this.password);
          }
          if (rememberMe) {
            localStorage.setItem('credentials', this.password);
          }
          return accepted;
        })
      );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.password = '';
    localStorage.removeItem('credentials');
    this.router.navigate(['/login']);
  }
}
