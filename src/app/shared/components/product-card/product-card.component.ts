import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HomePageService } from 'src/app/services/homePage.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslationPipe } from '../../pipes/translation.pipe';

@Component({
  selector: 'app-product-card',
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
    private translate: TranslationPipe
  ) { }

  addToCart() {
    console.log(`Added ${this.product.name} to cart`);
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
          console.log("Removed from wishlist:", isSuccess);
          if (!isSuccess) {
            this.isWishlisted = true;
          }
        },
        error => { this.toastService.showToast(this.translate.transform('Error occured while removing product from wishlist'), 'error'); }
      );
    }
  }
}
