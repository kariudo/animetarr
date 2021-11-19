import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isAuthenticated = false;
  password = '';

  constructor(private http: HttpClient) {}

  authenticate(password: string): Observable<boolean> {
    // TODO hit the server with the password to test it, if it works, save it and use it.
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
            // TODO store it.        localStorage.setItem('password', JSON.stringify(password));
          }
          return accepted;
        })
      );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.password = '';
  }
}
