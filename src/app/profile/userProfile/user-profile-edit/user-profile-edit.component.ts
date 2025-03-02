import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css'],
  providers: [TranslationPipe]
})
export class UserProfileEditComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  constructor(
    private translate: TranslationPipe
  ) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl('',
        [
          Validators.required
        ]
      ),
      middleName: new FormControl(''),
      lastName: new FormControl('',
        [
          Validators.required
        ]
      ),
      email: new FormControl('',
        [
          Validators.required, Validators.email
        ]
      ),
      dateOfBirth: new FormControl('',
        [
          Validators.required
        ]
      ),
      addressLine1: new FormControl('',
        [
          Validators.required
        ]
      ),
      addressLine2: new FormControl(''),
      city: new FormControl('',
        [
          Validators.required
        ]
      ),
      state: new FormControl('',
        [
          Validators.required
        ]
      ),
      country: new FormControl('',
        [
          Validators.required
        ]
      ),
      zipcode: new FormControl('',
        [
          Validators.required
        ]
      )
    })
  }

  handleFileUpload(files: File[]): void {
    console.log('Files uploaded:', files);
    // Handle API upload here
  }

  onSubmit() {

  }

}
