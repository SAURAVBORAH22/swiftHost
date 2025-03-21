import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageService } from 'src/app/services/homePage.service';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('categoryProductContainer', { static: false }) categoryProductContainer!: ElementRef;
  @ViewChild('allProductContainer', { static: false }) allProductContainer!: ElementRef;

  loading: boolean = false;
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
    private productsService: ProductsService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadAPIs();

    // Subscribe to selected category changes from the shared service
    this.categoryService.currentCategory$.subscribe(category => {
      if (category) {
        this.selectedCategory = category;
        this.isCategorySelected = true;
        this.loadCategoryProducts(category);
      }
    });
  }

  private loadAPIs(): void {
    this.getRecommendations();
    this.getAllProducts();
    this.getNewArrvials();
    this.getBestSellersList();
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

  loadCategoryProducts(category: any) {
    this.productsService.getProductsByCategory(category.categoryId, category.subcategory)
      .subscribe(products => {
        this.productByCategoryList = products;
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
