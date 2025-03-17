import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-list-filter',
  templateUrl: './product-list-filter.component.html',
  styleUrls: ['./product-list-filter.component.css']
})
export class ProductListFilterComponent {
  @Output() filterChanged = new EventEmitter<any>();

  filters: any = { name: '', rating: null, minPrice: null, maxPrice: null };

  applyFilters(): void {
    this.filterChanged.emit({ ...this.filters }); // Emit a copy of the filters
  }

  resetFilters(): void {
    this.filters = { name: '', rating: null, minPrice: null, maxPrice: null };
    this.filterChanged.emit(this.filters); // Emit empty filters
  }
}
