import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';
import { ToastService } from 'src/app/services/toast.service';

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
  selected_products: any[] = [];
  cartItems: any[] = [];
  selectedCoupon: any;
  isLoadingAddresses: boolean = false;
  isLoadingPayments: boolean = false;
  isLoadingProducts: boolean = false;
  selected_address: any;
  selected_payment: any;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private toastService: ToastService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        if (params.selectedCoupon) {
          this.selectedCoupon = JSON.parse(params.selectedCoupon);
        }
      });

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
            this.selected_address = defaultAddress;
          }
          this.isLoadingAddresses = false;
        },
        error => {
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
            this.selected_payment = this.saved_payments[0];
          }
          this.isLoadingPayments = false;
        },
        error => {
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
                  const requestedQuantity = cartItem?.quantity || 1;
                  const availableQuantity = product.quantity ?? requestedQuantity;
                  if (availableQuantity === 0) {
                    return {
                      ...product,
                      cartQuantity: 0,
                      outOfStock: true,
                      limited: true
                    };
                  }
                  const effectiveQuantity = requestedQuantity > availableQuantity ? availableQuantity : requestedQuantity;
                  const limited = requestedQuantity > availableQuantity;
                  return {
                    ...product,
                    cartQuantity: effectiveQuantity,
                    limited,
                    outOfStock: false
                  };
                });
                if (this.selectedCoupon && this.selected_products.length > 0) {
                  this.selected_products = this.selected_products.map(product => {
                    const isApplicable = !this.selectedCoupon.categoryId ||
                      this.selectedCoupon.categoryId === product.categoryId;
                    return isApplicable
                      ? { ...product, discountedPrice: product.price * ((100 - this.selectedCoupon.discount) / 100) }
                      : { ...product, discountedPrice: undefined };
                  });
                }
                if (this.isAnyProductOutOfStock()) {
                  this.toastService.showToast('Some items in your cart are currently out of stock. Please update your cart before placing your order.', 'info');
                }
                this.isLoadingProducts = false;
              },
              error => {
                this.isLoadingProducts = false;
              }
            );
        } else {
          this.selected_products = [];
          this.isLoadingProducts = false;
        }
      },
      error => {
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

  selectAddress(address: any): void {
    this.selectedAddressId = address.id;
    this.selected_address = address;
  }

  selectPayment(payment: any): void {
    this.selectedPaymentId = payment.id;
    this.selected_payment = payment;
  }

  trackByAddressId(index: number, address: any): string {
    return address.id;
  }

  trackByPaymentId(index: number, payment: any): string {
    return payment.id;
  }

  placeOrder(): void {
    const orderDetails = {
      products: this.selected_products,
      address: this.selected_address,
      paymentType: this.selectedPaymentType,
      payment: this.encryptionService.encryptObject(this.selected_payment)
    }
    this.orderService.addNewOrder(orderDetails).subscribe(success => {
      if (success) {
        this.toastService.showToast('Thank you for shopping with us! Your order has been successfully placed. We are getting it ready and will update you as soon as it is on its way.', 'success');
        this.cartService.clearCart(this.userId)
          .subscribe(success => {
            this.cartService.getCartItemCount(this.userId || '').subscribe(cartCount => {
              this.cartService.updateCartCount(cartCount);
            });
          });
      }
    });
  }

  isAnyProductOutOfStock(): boolean {
    return this.selected_products.some(product => product.outOfStock);
  }

  getSubtotal(): number {
    if (!this.selected_products || this.selected_products.length === 0) {
      return 0;
    }
    return this.selected_products.reduce((total, product) => {
      const price = product.discountedPrice || product.price;
      const quantity = product.cartQuantity;
      return total + (price * quantity);
    }, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shippingCost = 0;
    return subtotal + shippingCost;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
