import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  @ViewChild('categoryProductContainer', { static: false }) categoryProductContainer!: ElementRef;
  @ViewChild('allProductContainer', { static: false }) allProductContainer!: ElementRef;
  @Output() cartUpdated = new EventEmitter<boolean>();
  loading: boolean = false;
  userId: string | null = '';
  categoriesList: any[] = [];
  recommendationList: any[] = [];
  productsList: any[] = [];
  isCategorySelected: boolean = false;
  selectedCategory: any;
  productByCategoryList: any[] = [];

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
      this.recommendationList = this.getRandomProducts(products, 5);
    });
  }

  private getRandomProducts(products: any[], count: number): any[] {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  getAllProducts(): void {
    this.homePageService.getAllProducts().subscribe(products => {
      this.productsList = products;
    });
  }

  scrollLeft(container: HTMLElement): void {
    if (container) {
      container.scrollBy({ left: -260, behavior: 'smooth' });
    }
  }

  scrollRight(container: HTMLElement): void {
    if (container) {
      container.scrollBy({ left: 260, behavior: 'smooth' });
    }
  }


  updateCartCount(event: boolean) {
    this.cartUpdated.emit(event);
  }

  receiveData(data: string) {
    this.isCategorySelected = true;
    this.selectedCategory = data;
    this.homePageService.getProductsByCategory(this.selectedCategory.categoryId, this.selectedCategory.subcategory)
      .subscribe(products => {
        this.productByCategoryList = products;
      });
  }
}
