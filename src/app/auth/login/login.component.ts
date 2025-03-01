import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthResponseModel } from 'src/app/models/authResponseModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl('',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]
      )
    })
  }

  onSubmit(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.loading = true;
    this.authService.loginOrSignUp(email, password, true).subscribe((authResponseModel: AuthResponseModel) => {
      if (authResponseModel) {
        const user = this.authService.formatUser(authResponseModel);
        this.authService.setUserInLocalStorage(user);
        this.router.navigate(['home']);
      }
      this.loading = false;
    })
  }

  goToSignup(): void {
    this.router.navigate(['signup']);
  }

}
