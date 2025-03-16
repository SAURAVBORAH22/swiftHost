import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { map } from 'rxjs/operators';
import { CouponsService } from 'src/app/services/coupons.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userId: string | null = '';
  loading: boolean = false;
  cartItems: any[] = [];
  productList: (any & { cartQuantity: number, discountedPrice?: number })[] = [];
  couponCode: string = '';
  couponsList: any[] = [];
  selectedCoupon: any = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productsService: ProductsService,
    private couponsService: CouponsService
  ) { }

  ngOnInit(): void {
    this.getAllCartItems();
    this.getAllCoupons();
  }

  getAllCartItems(): void {
    this.loading = true;
    this.getAllCartProductIds().subscribe(
      productIds => {
        if (productIds.length > 0) {
          this.productsService.getProductsByIds(productIds).subscribe(
            products => {
              this.productList = products.map(product => {
                const cartItem = this.cartItems.find(c => c.productId === product.id);
                return { ...product, cartQuantity: cartItem?.quantity || 1 };
              });
              this.loading = false;
            },
            error => this.handleError(error)
          );
        } else {
          this.productList = [];
          this.loading = false;
        }
      }
    );
  }

  getAllCartProductIds(): Observable<string[]> {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (!this.userId) return of([]);

    return this.cartService.getAllCartItems(this.userId!).pipe(
      map(cartItems => {
        this.cartItems = cartItems;
        return cartItems.map(c => c.productId);
      })
    );
  }

  getTotalPrice(): number {
    return this.productList.reduce((sum, item) => sum + (item.discountedPrice ?? item.price) * item.cartQuantity, 0);
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.cartQuantity + change;
    if (newQuantity > 0 && newQuantity <= item.quantity) {
      item.cartQuantity = newQuantity;
    }
  }

  removeItem(item: any): void {
    this.productList = this.productList.filter(p => p !== item);
  }

  applyCoupon(): void {
    if (this.couponCode) {
      this.selectedCoupon = this.couponsList.find(c => c.name === this.couponCode);
    }
    if (this.selectedCoupon) {
      this.productList = this.productList.map(product => {
        const isApplicable = !this.selectedCoupon.categoryId || this.selectedCoupon.categoryId === product.categoryId;
        return isApplicable
          ? { ...product, discountedPrice: product.price * ((100 - this.selectedCoupon.discount) / 100) }
          : { ...product, discountedPrice: undefined };
      });
    }
  }


  getAllCoupons(): void {
    this.couponsService.getAllCoupons().subscribe(coupons => {
      this.couponsList = coupons;
    });
  }

  handleError(error: any): void {
    console.error('Error fetching data:', error);
    this.loading = false;
  }

  clearCart(): void {
    //clear cart logic
  }
}
