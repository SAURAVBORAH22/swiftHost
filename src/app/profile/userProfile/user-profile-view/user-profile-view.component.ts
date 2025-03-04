import { Component, OnInit } from '@angular/core';
import { UserProfileDetails } from 'src/app/models/userProfileDetails';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserProfileService } from 'src/app/services/userProfileService.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css'],
  providers: [TranslationPipe]
})
export class UserProfileViewComponent implements OnInit {
  user!: UserProfileDetails;
  registeredEmail: string | null = null;
  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastService: ToastService,
    private translate: TranslationPipe,
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.registeredEmail = this.authService.getUserFromLocalStore()?.registeredEmail || null;
    if (this.registeredEmail) {
      this.userProfileService.getUserProfileDetailsByEmail(this.registeredEmail)
        .subscribe((profile: UserProfileDetails | null) => {
          if (profile) {
            this.user = profile;
          }
        }, (error: any) => {
          this.toastService.showToast(this.translate.transform('ERROR_FETCHING_USER_PROFILE'), 'error');
        });
    }
  }
}
