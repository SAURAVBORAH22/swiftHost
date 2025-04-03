import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent implements OnInit {
  @Input() productId!: string;
  @Input() allowReview!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  reviews: any[] = [];
  loading: boolean = false;
  rating: number = 0;
  reviewText: string = '';
  productDetails: any;
  userId: string | null = '';
  reviewAlreadyExists: boolean = false;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private reviewsService: ReviewsService,
    private toastService: ToastService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUserFromSession();
    this.userId = user?.userId || null;
    this.checkIfReviewAlreadyAddedByUser();
    this.fetchProductDetails();
    this.fetchReviews();
  }

  checkIfReviewAlreadyAddedByUser(): void {
    this.loading = true;
    this.reviewsService.checkIfReviewAlreadyAddedByUser(this.productId, this.userId || '').subscribe(
      (success) => {
        this.reviewAlreadyExists = success;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchProductDetails(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        this.productDetails = product;
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  fetchReviews(): void {
    this.loading = true;
    this.reviewsService.getAllReviewsForProduct(this.productId).subscribe(
      (reviews: any[]) => {
        this.reviews = reviews;
        const userIds: string[] = [...new Set(this.reviews.map((r) => r.userId))];
        this.accountService.fetchAllUserProfilesByIds(userIds).subscribe(
          (userProfiles) => {
            this.reviews.forEach((review) => {
              const user = userProfiles.find((u: any) => u.userId === review.userId);
              review.fullName = user ? `${user.firstName} ${user.lastName}` : 'Anonymous User';
            });
            this.loading = false;
          },
          () => this.loading = false
        );
      },
      () => this.loading = false
    );
  }

  setRating(star: number): void {
    this.rating = star;
  }

  submitReview(): void {
    if (this.reviewAlreadyExists) {
      this.toastService.showToast('You have already submitted a review for this product.', 'error');
      return;
    }
    const reviewPayload = {
      productId: this.productId,
      rating: this.rating,
      review: this.reviewText,
      userId: this.userId
    };
    this.reviewsService.addNewReview(reviewPayload).subscribe(
      (success) => {
        if (success) {
          this.toastService.showToast('Your review was submitted successfully.', 'success');
          this.productService.updateProductRating(this.productDetails);
          this.fetchReviews();
          this.reviewText = '';
          this.rating = 0;
        } else {
          this.toastService.showToast('Processing error, please try again.', 'error');
        }
      }
    );
  }

  close(): void {
    this.closeModal.emit();
  }
}
