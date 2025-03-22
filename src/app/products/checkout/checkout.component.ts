import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  userId: string | null = '';
  saved_addresses: any[] = [];
  saved_payments: any[] = [];
  selectedAddressId: string | null = null;
  selectedPaymentId: string | null = null;
  selectedPaymentType: string = 'Online'; // 'Online' or 'COD'
  productId: string = '';
  selected_products: any[] = [];
  cartItems: any[] = [];

  // Loader flags for showing Bootstrap spinners
  isLoadingAddresses: boolean = false;
  isLoadingPayments: boolean = false;
  isLoadingProducts: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserFromLocalStore()?.userId || null;
    if (this.userId) {
      this.fetchAllAddresses();
      this.fetchAllPaymentOptions();
      this.getAllCartItems();
    }
  }

  fetchAllAddresses(): void {
    this.isLoadingAddresses = true;
    this.accountService.getAllAddresses(this.userId || '')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        addresses => {
          // Sort addresses so that default addresses appear on top
          this.saved_addresses = addresses.sort((a, b) => {
            if (a.isDefault && !b.isDefault) {
              return -1;
            } else if (!a.isDefault && b.isDefault) {
              return 1;
            } else {
              return 0;
            }
          });
          if (this.saved_addresses.length > 0) {
            const defaultAddress = this.saved_addresses.find(addr => addr.isDefault);
            this.selectedAddressId = defaultAddress ? defaultAddress.id : this.saved_addresses[0].id;
          }
          this.isLoadingAddresses = false;
        },
        error => {
          console.error('Error fetching addresses:', error);
          this.isLoadingAddresses = false;
        }
      );
  }

  fetchAllPaymentOptions(): void {
    this.isLoadingPayments = true;
    this.accountService.fetchAllPaymentOptionsForUser(this.userId || '')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        payment_options => {
          payment_options.forEach(payment_option => {
            payment_option.details = this.encryptionService.decryptObject(payment_option.details);
          });
          this.saved_payments = payment_options;
          if (this.saved_payments.length > 0) {
            this.selectedPaymentId = this.saved_payments[0].id;
          }
          this.isLoadingPayments = false;
        },
        error => {
          console.error('Error fetching payment options:', error);
          this.isLoadingPayments = false;
        }
      );
  }

  getAllCartItems(): void {
    this.isLoadingProducts = true;
    this.getAllCartProductIds().subscribe(
      productIds => {
        if (productIds.length > 0) {
          this.productsService.getProductsByIds(productIds)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
              products => {
                this.selected_products = products.map(product => {
                  const cartItem = this.cartItems.find(c => c.productId === product.id);
                  return { ...product, cartQuantity: cartItem?.quantity || 1 };
                });
                this.isLoadingProducts = false;
              },
              error => {
                console.error('Error fetching products:', error);
                this.isLoadingProducts = false;
              }
            );
        } else {
          this.selected_products = [];
          this.isLoadingProducts = false;
        }
      },
      error => {
        console.error('Error fetching cart items:', error);
        this.isLoadingProducts = false;
      }
    );
  }

  getAllCartProductIds(): Observable<string[]> {
    if (!this.userId) {
      return of([]);
    }
    return this.cartService.getAllCartItems(this.userId)
      .pipe(
        map(cartItems => {
          this.cartItems = cartItems;
          return cartItems.map(c => c.productId);
        })
      );
  }

  selectAddress(id: string): void {
    this.selectedAddressId = id;
  }

  selectPayment(id: string): void {
    this.selectedPaymentId = id;
  }

  trackByAddressId(index: number, address: any): string {
    return address.id;
  }

  trackByPaymentId(index: number, payment: any): string {
    return payment.id;
  }

  placeOrder(): void {
    if (this.selectedAddressId && (this.selectedPaymentType === 'COD' || this.selectedPaymentId)) {
      console.log('Order placed with address ID:', this.selectedAddressId);
      console.log('Payment Type:', this.selectedPaymentType);
      if (this.selectedPaymentType === 'Online') {
        console.log('Payment selected:', this.selectedPaymentId);
      }
      // Add order placement logic here
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
