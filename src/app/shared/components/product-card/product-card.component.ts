import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HomePageService } from 'src/app/services/homePage.service';

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
    private authService: AuthService
  ) { }

  addToCart() {
    console.log(`Added ${this.product.name} to cart`);
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    const userId = this.authService.getUserFromLocalStore()?.userId;

    if (!userId) {
      console.error("User not found!");
      return;
    }

    if (this.isWishlisted) {
      // Add to wishlist only if not already added
      const data = {
        productId: this.product.id,
        userId: userId
      };
      this.homePageService.addToWishlist(data).subscribe(
        isSuccess => {
          console.log("Added to wishlist:", isSuccess);
          if (!isSuccess) {
            this.isWishlisted = false; // Revert UI state if already exists
          }
        },
        error => console.error("Error adding to wishlist:", error)
      );
    } else {
      // Remove from wishlist
      this.homePageService.removeFromWishlist(this.product.id, userId).subscribe(
        isSuccess => {
          console.log("Removed from wishlist:", isSuccess);
          if (!isSuccess) {
            this.isWishlisted = true; // Revert UI state if deletion fails
          }
        },
        error => console.error("Error removing from wishlist:", error)
      );
    }
  }
}
