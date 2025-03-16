import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';

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

  @ViewChild('mainImage') mainImage!: ElementRef<HTMLImageElement>;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.getProductDetails();
  }

  getProductDetails(): void {
    this.productsService.getProductById(this.productId).subscribe(product => {
      this.productDetails = product;
      this.selectedImage = product.images[0];
      this.generateStars(product.rating);
    });
  }

  changeImage(image: string) {
    this.selectedImage = image;
  }

  increaseQuantity() {
    this.quantity++;
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
}
