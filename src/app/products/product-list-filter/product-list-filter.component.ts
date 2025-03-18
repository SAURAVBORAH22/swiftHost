import { Component, EventEmitter, Output } from '@angular/core';
import { HomePageService } from 'src/app/services/homePage.service';

@Component({
  selector: 'app-product-list-filter',
  templateUrl: './product-list-filter.component.html',
  styleUrls: ['./product-list-filter.component.css']
})
export class ProductListFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();
  categoriesList: any[] = [];

  filters: any = {
    name: '',
    rating: null,
    minPrice: 0,
    maxPrice: 100000,
    category: null
  };

  constructor(private homePageService: HomePageService) {
    this.fetchCategories();
  }

  applyFilters(): void {
    this.validatePriceRange();
    this.filterChanged.emit({ ...this.filters });
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      rating: null,
      minPrice: 0,
      maxPrice: 100000,
      category: null
    };
    this.filterChanged.emit({ ...this.filters });
  }

  validatePriceRange(): void {
    if (this.filters.minPrice > this.filters.maxPrice) {
      [this.filters.minPrice, this.filters.maxPrice] = [this.filters.maxPrice, this.filters.minPrice];
    }
  }

  fetchCategories(): void {
    this.homePageService.getCategoriesData().subscribe(categories => {
      this.categoriesList = categories;
      this.categoriesList.sort((a, b) => a.sequence - b.sequence);
    });
  }
}
