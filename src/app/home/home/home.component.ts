import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageService } from 'src/app/services/homePage.service';
import { ProductsService } from 'src/app/services/products.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TranslationPipe, ProductsService]
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
  newArrivalList: any[] = [];
  bestSellersList: any[] = [];

  constructor(
    private router: Router,
    private homePageService: HomePageService,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.loadAPIs();
  }

  private loadAPIs(): void {
    this.fetchCategories();
    this.getRecommendations();
    this.getAllProducts();
    this.getNewArrvials();
    this.getBestSellersList();
  }

  fetchCategories(): void {
    this.homePageService.getCategoriesData().subscribe(categories => {
      this.categoriesList = categories;
      this.categoriesList.sort((a, b) => a.sequence - b.sequence);
    });
  }

  getRecommendations(): void {
    this.productsService.getAllProducts().subscribe(products => {
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
    this.productsService.getAllProducts().subscribe(products => {
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
    this.productsService.getProductsByCategory(this.selectedCategory.categoryId, this.selectedCategory.subcategory)
      .subscribe(products => {
        this.productByCategoryList = products;
      });
  }

  getNewArrvials() {
    this.productsService.getNewArrvials().subscribe(products => {
      this.newArrivalList = products;
    });
  }

  getBestSellersList() {
    this.productsService.getAllHighRatedProducts().subscribe(products => {
      this.bestSellersList = products;
    });
  }

  navigateToProductList(type: string) {
    const query_params: any = { type };
    if (type === 'category' && this.selectedCategory) {
      Object.assign(query_params, {
        categoryId: this.selectedCategory.categoryId,
        subcategory: this.selectedCategory.subcategory
      });
    }
    this.router.navigate(['/products/list'], { queryParams: query_params });
  }
}
