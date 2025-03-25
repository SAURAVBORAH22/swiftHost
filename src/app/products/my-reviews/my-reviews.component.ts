import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css']
})
export class MyReviewsComponent implements OnInit {
  reviews: any[] = [];
  userId: string | null = '';
  loading: boolean = true;
  productLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private reviewsService: ReviewsService,
    private productService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;

    if (!this.userId) {
      this.loading = false;
      return;
    }

    this.fetchAllReviewsByUser();
  }

  fetchAllReviewsByUser(): void {
    this.loading = true;

    this.reviewsService.getAllReviewsByUser(this.userId || '')
      .subscribe((reviews) => {
        this.reviews = reviews;
        this.loading = false;

        const productIds: string[] = reviews.map(r => r.productId);
        if (productIds.length > 0) {
          this.fetchAllProductsById(productIds);
        }
      }, () => {
        this.loading = false;
      });
  }

  fetchAllProductsById(productIds: string[]): void {
    this.productLoading = true;

    this.productService.getProductsByIds(productIds)
      .subscribe((products) => {
        this.reviews = this.reviews.map(review => {
          const product = products.find(p => p.id === review.productId);
          return { ...review, product: product || null };
        });

        this.productLoading = false;
      }, () => {
        this.productLoading = false;
      });
  }

  navigateToDetails(item: any): void {
    this.router.navigate(['/products/', item.id]);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  trackById(index: number, item: any): string {
    return item?.id || index.toString();
  }
}
