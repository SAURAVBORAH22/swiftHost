import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';
import { WishListService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  providers: [ProductsService]
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  productDetails: any;
  selectedImage: string = '';
  quantity: number = 1;
  selectedSize: string = 'M';
  zoomLensStyle = {};
  stars: { filled: boolean }[] = [];
  userId: string | null = '';
  recommendationList: any[] = [];

  @ViewChild('mainImage') mainImage!: ElementRef<HTMLImageElement>;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private wishlistService: WishListService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    this.getProductDetails();
  }

  getProductDetails(): void {
    this.productsService.getProductById(this.productId).subscribe(product => {
      this.productDetails = product;
      this.selectedImage = product.images[0];
      this.generateStars(product.rating);
      this.getProductsRecommendations();
    });
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  increaseQuantity() {
    if (this.productDetails?.quantity && this.quantity < this.productDetails.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  generateStars(rating: number) {
    this.stars = Array.from({ length: 5 }, (_, i) => ({
      filled: i < Math.round(rating)
    }));
  }

  zoomImage(event: MouseEvent) {
    const img = this.mainImage.nativeElement;
    const lensSize = 120;
    const scale = 2;

    const x = event.offsetX - lensSize / 2;
    const y = event.offsetY - lensSize / 2;

    const maxX = img.width - lensSize;
    const maxY = img.height - lensSize;
    const lensX = Math.max(0, Math.min(x, maxX));
    const lensY = Math.max(0, Math.min(y, maxY));

    this.zoomLensStyle = {
      display: 'block',
      top: `${lensY}px`,
      left: `${lensX}px`,
      backgroundImage: `url(${this.selectedImage})`,
      backgroundPosition: `-${lensX * scale}px -${lensY * scale}px`,
      backgroundSize: `${img.width * scale}px ${img.height * scale}px`
    };
  }

  resetZoom() {
    this.zoomLensStyle = { display: 'none' };
  }

  addToCart(): void {
    const data = {
      productId: this.productId,
      userId: this.userId,
      quantity: 1
    };
    this.cartService.addToCart(data).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.cartService.getCartItemCount(this.userId || '').subscribe(cartCount => {
            this.cartService.updateCartCount(cartCount);
          });
          this.router.navigate(['/products/cart']);
        }
      },
      error => {
        this.toastService.showToast('Failed to add to cart', 'error');
      }
    );
  }

  addToWishlist() {
    const data = {
      productId: this.productId,
      userId: this.userId
    };
    this.wishlistService.addToWishlist(data).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.router.navigate(['/products/list'], { queryParams: { type: 'wishlist' } });
        }
      },
      error => {
        this.toastService.showToast('Error occured while adding product to wishlist', 'error');
      }
    );
  }

  getProductsRecommendations(): void {
    this.productsService.getProductsRecommendation(this.productDetails.categoryId).subscribe(products => {
      this.recommendationList = products;
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
}
