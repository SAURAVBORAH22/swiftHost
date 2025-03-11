import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileDetails } from 'src/app/models/userProfileDetails';
import { AuthService } from 'src/app/services/auth.service';
import { HomePageService } from 'src/app/services/homePage.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserProfileService } from 'src/app/services/userProfileService.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TranslationPipe]
})
export class HomeComponent implements OnInit {
  @ViewChild('productContainer', { static: false }) productContainer!: ElementRef;

  loading: boolean = false;
  userId: string | null = '';
  categoriesList: any[] = [];
  recommendationList: any[] = [];
  productsList: any[] = [];

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private router: Router,
    private homePageService: HomePageService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.fetchCategories();
    this.getRecommendations();
    this.getAllProducts();
  }

  private loadUserProfile(): void {
    this.loading = true;
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (this.userId) {
      this.userProfileService.getUserProfileDetails(this.userId)
        .subscribe((profile: UserProfileDetails | null) => {
          if (profile === null) {
            this.router.navigate(['/userProfile/edit']);
            this.toastService.showToast(this.translate.transform('PLEASE_COMPLETE_YOUR_PROFILE'), 'info');
          }
          this.loading = false;
        }, (error: any) => {
          this.toastService.showToast(this.translate.transform('ERROR_FETCHING_USER_PROFILE'), 'error');
          this.loading = false;
        });
    }
  }

  fetchCategories(): void {
    this.homePageService.getCategoriesData().subscribe(categories => {
      this.categoriesList = categories;
      this.categoriesList.sort((a, b) => a.sequence - b.sequence);
    });
  }

  getRecommendations(): void {
    this.homePageService.getAllProducts().subscribe(products => {
      this.recommendationList = this.getRandomProducts(products);
    });
  }

  private getRandomProducts(products: any[]): any[] {
    return products.sort(() => Math.random() - 0.5);
  }

  getAllProducts(): void {
    this.homePageService.getAllProducts().subscribe(products => {
      this.productsList = products;
    });
  }

  scrollLeft(): void {
    if (this.productContainer) {
      this.productContainer.nativeElement.scrollBy({ left: -260, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.productContainer) {
      this.productContainer.nativeElement.scrollBy({ left: 260, behavior: 'smooth' });
    }
  }
}
