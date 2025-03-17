import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

interface Product {
  id: string;
  images: string[];
  name: string;
  description?: string;
  price: string;
  link: string;
}

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() products: Product[] = [];
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 3000;

  currentIndex = 0;
  intervalId: any;
  currentImages: string[] = [];

  constructor(
    private elRef: ElementRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeRandomImages();
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  ngAfterViewInit() {
    this.updateBackgroundColor();
  }

  initializeRandomImages() {
    this.currentImages = this.products.map(product => this.getRandomImage(product.images));
  }

  getRandomImage(images: string[]): string {
    return images.length ? images[Math.floor(Math.random() * images.length)] : '';
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
    this.currentImages[this.currentIndex] = this.getRandomImage(this.products[this.currentIndex].images);
    this.updateBackgroundColor();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.products.length) % this.products.length;
    this.currentImages[this.currentIndex] = this.getRandomImage(this.products[this.currentIndex].images);
    this.updateBackgroundColor();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.currentImages[this.currentIndex] = this.getRandomImage(this.products[this.currentIndex].images);
    this.updateBackgroundColor();
  }

  updateBackgroundColor() {
    const image = new Image();
    image.src = this.currentImages[this.currentIndex];
    image.crossOrigin = "Anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(image, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const bgColor = `rgb(${r}, ${g}, ${b})`;
        this.elRef.nativeElement.querySelector(".carousel").style.backgroundColor = bgColor;
      }
    };
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(['/products/', productId]);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }
}
