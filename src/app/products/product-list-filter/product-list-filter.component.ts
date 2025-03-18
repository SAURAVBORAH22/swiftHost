import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-list-filter',
  templateUrl: './product-list-filter.component.html',
  styleUrls: ['./product-list-filter.component.css']
})
export class ProductListFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  filters: any = {
    name: '',
    rating: null,
    minPrice: 0,
    maxPrice: 100000
  };

  applyFilters(): void {
    this.validatePriceRange();
    this.filterChanged.emit({ ...this.filters });
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      rating: null,
      minPrice: 0,
      maxPrice: 100000
    };
    this.filterChanged.emit({ ...this.filters });
  }

  validatePriceRange(): void {
    if (this.filters.minPrice > this.filters.maxPrice) {
      [this.filters.minPrice, this.filters.maxPrice] = [this.filters.maxPrice, this.filters.minPrice];
    }
  }
}
