import { Component, OnInit } from '@angular/core';
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
    });
  }

}
