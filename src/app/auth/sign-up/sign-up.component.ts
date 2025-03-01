import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthResponseModel } from 'src/app/models/authResponseModel';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [AuthService]
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup = new FormGroup({});
  loading: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
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

  onSubmit() {
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    this.loading = true;
    this.authService.loginOrSignUp(email, password, false).subscribe((authResponseModel: AuthResponseModel) => {
      if (authResponseModel) {
        const user = this.authService.formatUser(authResponseModel);
        this.authService.setUserInLocalStorage(user);
        this.router.navigate(['home']);
      }
      this.loading = false;
    });
  }

  goToLogin(): void {
    this.router.navigate(['login'])
  }

}
