import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslationPipe } from '../../pipes/translation.pipe';
import { CartService } from 'src/app/services/cart.service';
import { WishListService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  providers: [TranslationPipe]
})
export class ProductCardComponent {
  @Input() product: any = {};
  isWishlisted: boolean = false;
  starsArray: number[] = [0, 1, 2, 3, 4];

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private cartService: CartService,
    private wishlistService: WishListService
  ) { }

  getStarClass(index: number): string {
    const rating = this.product?.rating || 0;
    if (index < Math.floor(rating)) {
      return 'bi bi-star-fill text-warning';
    } else if (index < rating) {
      return 'bi bi-star-half text-warning';
    } else {
      return 'bi bi-star text-secondary';
    }
  }

  addToCart() {
    const userId = this.authService.getUserFromLocalStore()?.userId;
    if (!userId) {
      return;
    }
    const data = {
      productId: this.product.id,
      userId: userId,
      quantity: 1
    };
    this.cartService.addToCart(data).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.toastService.showToast(this.translate.transform('Product was added to cart'), 'success');
          this.cartService.getCartItemCount(userId).subscribe(cartCount => {
            this.cartService.updateCartCount(cartCount);
          });
        }
      },
      error => {
        this.toastService.showToast(this.translate.transform('Failed to add to cart'), 'error');
      }
    );
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    const userId = this.authService.getUserFromLocalStore()?.userId;
    if (!userId) {
      return;
    }
    if (this.isWishlisted) {
      const data = {
        productId: this.product.id,
        userId: userId
      };
      this.wishlistService.addToWishlist(data).subscribe(
        isSuccess => {
          if (!isSuccess) {
            this.isWishlisted = false;
          }
        },
        error => {
          this.toastService.showToast(this.translate.transform('Error occured while adding product to wishlist'), 'error');
        }
      );
    } else {
      this.wishlistService.removeFromWishlist(this.product.id, userId).subscribe(
        isSuccess => {
          if (!isSuccess) {
            this.isWishlisted = true;
          }
        },
        error => {
          this.toastService.showToast(this.translate.transform('Error occured while removing product from wishlist'), 'error');
        }
      );
    }
  }
}
