import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  userId: string | null = '';
  loading: boolean = false;
  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (this.userId) {
      this.userProfileService.getUserProfileDetails(this.userId)
        .subscribe((profile: UserProfileDetails | null) => {
          if (profile) {
            this.user = profile;
          }
          this.loading = false;
        }, (error: any) => {
          this.toastService.showToast(this.translate.transform('ERROR_FETCHING_USER_PROFILE'), 'error');
          this.loading = false;
        });
    }
  }

  navigateToEdit() {
    this.router.navigate(['/userProfile/edit']);
  }
}
