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
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login(): void {
    console.log(`Authenticating with: ${this.credentials.password}`);
    this.auth
      .authenticate(this.credentials.password)
      .subscribe((success: boolean) => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
