import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { HomePageService } from 'src/app/services/homePage.service';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private translationService: TranslationService,
    private cartService: CartService,
    private homePageService: HomePageService
  ) { }

  ngOnInit(): void {
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
    this.languageDropdownOpen = false; // Close the dropdown after selecting
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
    const userId = this.authService.getUserFromLocalStore()?.userId;
    if (!userId) {
      return;
    }
    this.homePageService.getCartItemCount(userId).subscribe(cartCount => {
      this.cartService.updateCartCount(cartCount);
    });
  }
}
