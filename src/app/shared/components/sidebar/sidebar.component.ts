import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;
  @Input() categories: any[] = [];
  @Output() dataEvent = new EventEmitter<any>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.categories.forEach(category => category.expanded = false);
    }
  }

  toggleCategory(category: any) {
    category.expanded = !category.expanded;
  }

  loadSubcategory(category: any, subcategory: string) {
    this.dataEvent.emit({
      'categoryId': category.id,
      'subcategory': subcategory,
      'name': category.name
    });
  }
}
