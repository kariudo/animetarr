import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials = {
    password: '',
    rememberMe: false,
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login(): void {
    this.auth
      .authenticate(this.credentials.password, this.credentials.rememberMe)
      .subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
