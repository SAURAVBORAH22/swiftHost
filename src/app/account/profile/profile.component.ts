import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  userId: string | null = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: ['', Validators.required],
      gender: ['male', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromSession()?.userId || null;
    this.getProfileDetails();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.submitted = false;
  }

  getProfileDetails() {
    this.isLoading = true;
    this.accountService.getProfileInfo(this.userId || '').subscribe(profileInfo => {
      if (profileInfo) {
        this.profileForm.patchValue(profileInfo);
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.toastService.showToast('Failed to load profile details.', 'error');
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const formData = {
      userId: this.userId,
      ...this.profileForm.value
    };
    this.accountService.saveProfileInfo(this.userId || '', formData).subscribe(success => {
      this.isSubmitting = false;
      if (success) {
        this.toastService.showToast('Your details were saved successfully.', 'success');
        this.toggleEdit();
      } else {
        this.toastService.showToast('Something happened while processing your request.', 'error');
      }
    }, error => {
      this.isSubmitting = false;
      this.toastService.showToast('An error occurred while saving your details.', 'error');
    });
  }

  get f() {
    return this.profileForm.controls;
  }
}
