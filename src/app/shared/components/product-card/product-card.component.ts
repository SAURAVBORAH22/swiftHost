import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HomePageService } from 'src/app/services/homePage.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslationPipe } from '../../pipes/translation.pipe';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product: any;
  isWishlisted: boolean = false;

  constructor(
    private homePageService: HomePageService,
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslationPipe,
    private cartService: CartService
  ) { }

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
    this.homePageService.addToCart(data).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.toastService.showToast(this.translate.transform('Product was added to cart'), 'success');
          this.homePageService.getCartItemCount(userId).subscribe(cartCount => {
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
      this.homePageService.addToWishlist(data).subscribe(
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
      this.homePageService.removeFromWishlist(this.product.id, userId).subscribe(
        isSuccess => {
          if (!isSuccess) {
            this.isWishlisted = true;
          }
        },
        error => { this.toastService.showToast(this.translate.transform('Error occured while removing product from wishlist'), 'error'); }
      );
    }
  }
}
