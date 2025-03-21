import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageService } from 'src/app/services/homePage.service';
import { ProductsService } from 'src/app/services/products.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  categoriesList: any[] = [];

  constructor(
    private homePageService: HomePageService,
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.homePageService.getCategoriesData().subscribe(categories => {
      this.categoriesList = categories;
      this.categoriesList.sort((a, b) => a.sequence - b.sequence);
    });
  }

  receiveData(data: any) {
    this.categoryService.updateCategory(data);
    this.router.navigate(['/home']);
  }
}
