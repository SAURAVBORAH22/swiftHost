import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { TranslationPipe } from 'src/app/shared/pipes/translation.pipe';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [TranslationPipe, ProductsService]
})
export class ProductListComponent implements OnInit, OnDestroy {
  type: string | null = null;
  categoryId: string = '';
  subcategory: string = '';
  productList: any[] = [];
  private queryParamsSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.type = params['type'] || null;
      this.categoryId = params['categoryId'] || '';
      this.subcategory = params['subcategory'] || '';
      this.loadList();
    });
  }

  loadList(): void {
    let apiToCall;
    if (this.type === 'best') {
      apiToCall = this.productsService.getAllHighRatedProducts();
    } else if (this.type === 'category' && this.categoryId) {
      apiToCall = this.productsService.getProductsByCategory(this.categoryId, this.subcategory);
    } else {
      apiToCall = this.productsService.getAllProducts();
    }

    apiToCall.subscribe(
      (products: any[]) => {
        this.productList = products;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}
