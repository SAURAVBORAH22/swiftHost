import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileDetails } from 'src/app/models/userProfileDetails';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/fileUploadService';
import { ToastService } from 'src/app/services/toast.service';
import { UserProfileService } from 'src/app/services/userProfileService.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css'],
  providers: [TranslationPipe, FileUploadService]
})
export class UserProfileEditComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  registeredEmail: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private router: Router,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
  }

  private initForm(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      businessName: new FormControl('', [Validators.required]),
      businessType: new FormControl('', [Validators.required]),
      industry: new FormControl('', [Validators.required]),
      domain: new FormControl(''),
      registrationNumber: new FormControl(''),
      businessEmail: new FormControl('', [Validators.required, Validators.email]),
      businessPhoneNumber: new FormControl('', [Validators.required]),
      businessAddressLine1: new FormControl('', [Validators.required]),
      businessAddressLine2: new FormControl(''),
      businessCity: new FormControl('', [Validators.required]),
      businessState: new FormControl('', [Validators.required]),
      businessCountry: new FormControl('', [Validators.required]),
      businessZipcode: new FormControl('', [Validators.required]),
      linkedIn: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl(''),
      youtube: new FormControl(''),
      businessDescription: new FormControl(''),
      profilePicture: new FormControl(''),
      companyLogo: new FormControl('')
    });
  }

  private loadUserProfile(): void {
    this.registeredEmail = this.authService.getUserFromLocalStore()?.registeredEmail || null;

    if (this.registeredEmail) {
      this.userProfileService.getUserProfileDetailsByEmail(this.registeredEmail)
        .subscribe((profile: UserProfileDetails | null) => {
          if (profile) {
            this.profileForm.patchValue(profile);
          }
        }, error => {
          this.toastService.showToast(this.translate.transform('ERROR_FETCHING_USER_PROFILE'), 'error');
        });
    }
  }

  async handleFileUpload(files: File[], type: string): Promise<void> {
    this.loading = true;
    if (files.length && this.registeredEmail) {
      try {
        const imageUrl = await this.fileUploadService.uploadFile(files[0]);
        if (type === 'profile') {
          this.profileForm.patchValue({ profilePicture: imageUrl });
        } else {
          this.profileForm.patchValue({ companyLogo: imageUrl });
        }
      } catch (error) {
        this.toastService.showToast(this.translate.transform('FILE_UPLOAD_FAILED'), 'error');
      }
    }
    this.loading = false;
  }


  onSubmit(): void {
    if (this.profileForm.valid) {
      const userProfile: UserProfileDetails = this.profileForm.value;

      if (this.registeredEmail) {
        userProfile.registeredEmail = this.registeredEmail;
        this.userProfileService.updateOrCreateUserProfileDetailsByEmail(this.registeredEmail, userProfile)
          .subscribe(success => {
            if (success) {
              this.toastService.showToast(this.translate.transform('PROFILE_UPDATED_SUCCESSFULLY'), 'success');
              this.router.navigate(['userProfile/view'])
            } else {
              this.toastService.showToast(this.translate.transform('PROFILE_UPDATION_FAILED'), 'error');
            }
          });
      }
    }
  }
}