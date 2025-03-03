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
      firstName: new FormControl('',[Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      dateOfBirth: new FormControl('',[Validators.required]),
      addressLine1: new FormControl('',[Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('',[Validators.required]),
      state: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
      zipcode: new FormControl('',[Validators.required]),
      businessName: new FormControl('',[Validators.required]),
      buisnessType: new FormControl('', [Validators.required]),
      industry: new FormControl('', [Validators.required]),
      domain: new FormControl(''),
      registrationNumber: new FormControl(''),
      businessEmail: new FormControl('', [Validators.required, Validators.email]),
      businessPhoneNumber: new FormControl('', [Validators.required]),
      businessAddressLine1: new FormControl('',[Validators.required]),
      businessAddressLine2: new FormControl(''),
      businessCity: new FormControl('',[Validators.required]),
      businessState: new FormControl('',[Validators.required]),
      businessCountry: new FormControl('',[Validators.required]),
      businessZipcode: new FormControl('',[Validators.required]),
      linkedIn: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      youtube: new FormControl(''),
      businessDescription: new FormControl('')
    })
  }

  handleFileUpload(files: File[]): void {
    console.log('Files uploaded:', files);
    // Handle API upload here
  }

  onSubmit() {

  }

}
