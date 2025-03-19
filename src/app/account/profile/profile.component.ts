import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;
  isEditing: boolean = false;
  submitted: boolean = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.valid) {
      console.log('Profile Updated:', this.profileForm.value);
      this.toggleEdit();
    }
  }

  // Helper for form field validation
  get f() {
    return this.profileForm.controls;
  }

  // Password match validation
  isPasswordMismatch(): boolean {
    return (
      this.profileForm.value.newPassword &&
      this.profileForm.value.confirmPassword &&
      this.profileForm.value.newPassword !== this.profileForm.value.confirmPassword
    );
  }
}
