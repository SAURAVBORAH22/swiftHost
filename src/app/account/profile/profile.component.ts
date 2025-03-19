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
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      dob: ['', Validators.required],
      gender: ['male', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    console.log('Profile Updated:', this.profileForm.value);
    this.toggleEdit();
  }

  get f() {
    return this.profileForm.controls;
  }
}
