import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  activeTab: string = '';
  dropdownOpen: boolean = false;
  cartItemCount: number = 0;
  languageDropdownOpen: boolean = false;
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private translationService: TranslationService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeTab = event.urlAfterRedirects;
        this.closeDropdowns();
      }
    });
    // Fetch initial cart count on load
    this.loadCartCount();

    // Listen for updates to cart count
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleLanguageDropdown() {
    this.languageDropdownOpen = !this.languageDropdownOpen;
  }

  changeLanguage(language: string) {
    this.translationService.changeLanguage(language);
    this.languageDropdownOpen = false;
  }

  onLogout() {
    this.authService.logoutUserFromSession();
  }

  private closeDropdowns() {
    this.dropdownOpen = false;
    this.languageDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!event.target) return;

    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.dropdown')) {
      this.closeDropdowns();
    }
  }

  loadCartCount() {
    const userId = this.authService.getUserFromSession()?.userId;
    if (!userId) {
      return;
    }
    this.cartService.getCartItemCount(userId).subscribe(cartCount => {
      this.cartService.updateCartCount(cartCount);
    });
  }

  navigateToProductList(type: string) {
    const query_params: any = { type };
    this.router.navigate(['/products/list'], { queryParams: query_params });
  }

  onSearch(searchedText: string) {
    this.router.navigate(['/products/list'], {
      queryParams: { type: 'search', searchedText: searchedText.trim() }
    });
  }

  navigateToCart(): void {
    this.router.navigate(['/products/cart']);
  }
}
