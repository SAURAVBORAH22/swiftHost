import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { WishListService } from 'src/app/services/wishlist.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [TranslationPipe, ProductsService, WishListService]
})
export class ProductListComponent implements OnInit, OnDestroy {
  type: string | null = null;
  categoryId: string = '';
  subcategory: string = '';
  productList: any[] = [];
  private queryParamsSubscription: Subscription | null = null;
  userId: string | null = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private wishlistService: WishListService,
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslationPipe
  ) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || null;
      this.categoryId = params['categoryId'] || '';
      this.subcategory = params['subcategory'] || '';
      this.loadList();
    });
  }

  loadList(): void {
    this.loading = true;
    let apiToCall: Observable<any[]>;
    if (this.type === 'best') {
      apiToCall = this.productsService.getAllHighRatedProducts();
    } else if (this.type === 'category' && this.categoryId) {
      apiToCall = this.productsService.getProductsByCategory(this.categoryId, this.subcategory);
    } else if (this.type === 'wishlist') {
      this.getAllWishListedProductIds().subscribe(
        (wishlistedProductIds: string[]) => {
          this.productsService.getProductsByIds(wishlistedProductIds).subscribe(
            (products: any[]) => {
              this.productList = products;
              this.loading = false;
            },
            error => {
              console.error('Error fetching wishlisted products:', error);
              this.loading = false;
            }
          );
        }
      );
      return;
    } else {
      apiToCall = this.productsService.getAllProducts();
    }

    apiToCall.subscribe(
      (products: any[]) => {
        this.productList = products;
        this.loading = false;
      },
      error => {
        this.toastService.showToast(this.translate.transform('Something went wrong while getting products'), 'error');
        this.loading = false;
      }
    );
  }

  getAllWishListedProductIds(): Observable<string[]> {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (!this.userId) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return new Observable(observer => {
      this.wishlistService.getAllWishlistedProducts(this.userId!).subscribe(
        (wishlistedProducts: any[]) => {
          const wishlistedProductIds = wishlistedProducts.map(wp => wp.productId);
          observer.next(wishlistedProductIds);
          observer.complete();
        },
        error => {
          this.toastService.showToast(this.translate.transform('Something went wrong while getting products'), 'error');
          observer.next([]);
          observer.complete();
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}