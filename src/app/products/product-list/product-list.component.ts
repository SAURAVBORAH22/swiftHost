import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { WishListService } from 'src/app/services/wishlist.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [TranslationPipe, ProductsService, WishListService, CartService]
})
export class ProductListComponent implements OnInit, OnDestroy {
  type: string | null = null;
  categoryId: string = '';
  subcategory: string = '';
  productList: any[] = [];
  private queryParamsSubscription: Subscription | null = null;
  userId: string | null = '';
  loading: boolean = false;
  searchedText: string = '';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private wishlistService: WishListService,
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || null;
      this.categoryId = params['categoryId'] || '';
      this.subcategory = params['subcategory'] || '';
      this.searchedText = params['searchedText'] || '';
      if (this.searchedText) {
        this.searchedText = this.searchedText.toLowerCase();
      }
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
        wishlistedProductIds => {
          if (wishlistedProductIds.length > 0) {
            this.productsService.getProductsByIds(wishlistedProductIds).subscribe(
              products => {
                this.productList = products;
                this.loading = false;
              },
              error => this.handleError(error)
            );
          } else {
            this.productList = [];
            this.loading = false;
          }
        },
        error => this.handleError(error)
      );
      return;
    } else if (this.type === 'search' && this.searchedText) {
      apiToCall = this.productsService.searchProducts(this.searchedText.toLowerCase());
    } else {
      apiToCall = this.productsService.getAllProducts();
    }

    apiToCall.subscribe(
      products => {
        this.productList = products;
        this.loading = false;
      },
      error => this.handleError(error)
    );
  }

  getAllWishListedProductIds(): Observable<string[]> {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (!this.userId) return of([]);

    return new Observable(observer => {
      this.wishlistService.getAllWishlistedProducts(this.userId!).subscribe(
        wishlistedProducts => {
          observer.next(wishlistedProducts.map(wp => wp.productId));
          observer.complete();
        },
        error => {
          this.handleError(error);
          observer.next([]);
          observer.complete();
        }
      );
    });
  }

  handleError(error: any): void {
    this.toastService.showToast(this.translate.transform('Something went wrong while getting products'), 'error');
    this.loading = false;
  }

  moveToCart() {
    const userId = this.authService.getUserFromLocalStore()?.userId || '';
    if (this.productList.length) {
      let operationsInProgress = this.productList.length;

      this.productList.forEach((product) => {
        this.addToCart(product, userId);

        this.wishlistService.removeFromWishlist(product.id, userId).subscribe(
          isSuccess => {
            if (isSuccess) {
              operationsInProgress--;
              if (operationsInProgress === 0) {
                this.reloadPage();
              }
            } else {
              operationsInProgress--;
              this.toastService.showToast(this.translate.transform('Error occurred while removing product from wishlist'), 'error');
              if (operationsInProgress === 0) {
                this.reloadPage();
              }
            }
          },
          error => {
            operationsInProgress--;
            this.toastService.showToast(this.translate.transform('Error occurred while removing product from wishlist'), 'error');
            console.error('Error removing from wishlist:', error);
            if (operationsInProgress === 0) {
              this.reloadPage();
            }
          }
        );
      });
    } else {
      this.reloadPage();
    }
  }

  addToCart(product: any, userId: string): void {
    if (!userId) {
      return;
    }
    const data = {
      productId: product.id,
      userId: userId,
      quantity: 1
    };
    this.cartService.addToCart(data).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.cartService.getCartItemCount(userId).subscribe(cartCount => {
            this.cartService.updateCartCount(cartCount);
          });
        } else {
          this.toastService.showToast(this.translate.transform('Failed to add to cart'), 'error');
        }
      },
      error => {
        this.toastService.showToast(this.translate.transform('Failed to add to cart'), 'error');
        console.error('Error adding to cart:', error);
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }


  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}