import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'home-sidebar',
  templateUrl: './home-sidebar.component.html',
  styleUrls: ['./home-sidebar.component.css']
})
export class HomeSidebarComponent {
  isCollapsed = false;
  @Input() categories: any[] = [];
  @Output() dataEvent = new EventEmitter<any>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.categories.forEach(category => {
        category.expanded = false;
      });
    }
  }

  toggleCategory(category: any) {
    this.categories.forEach(cat => cat.active = false);
    category.active = true;
    category.expanded = !category.expanded;
  }

  loadSubcategory(category: any, subcategory: string) {
    this.categories.forEach(cat => cat.active = false);
    category.active = true;

    this.dataEvent.emit({
      categoryId: category.id,
      subcategory: subcategory,
      name: category.name
    });
  }
}
