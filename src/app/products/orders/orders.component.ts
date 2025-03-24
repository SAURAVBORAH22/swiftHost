import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import { OrderByDatePipe } from 'src/app/shared/pipes/orderByDate.pipe';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [OrderByDatePipe]
})
export class OrdersComponent implements OnInit {
  userId: string | null = '';
  orders: any[] = [];
  loading: boolean = false;

  constructor(
    private ordersService: OrderService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private orderByDate: OrderByDatePipe,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUserFromLocalStore();
    this.userId = user?.userId || null;

    if (this.userId) {
      this.fetchAllOrdersForAUser();
    }
  }

  fetchAllOrdersForAUser() {
    if (!this.userId) return;
    this.loading = true;
    this.ordersService.getAllOrdersForUser(this.userId).subscribe(
      orders => {
        this.orders = orders.map(order => ({
          ...order,
          payment: this.encryptionService.decryptObject(order.payment)
        }));
        this.loading = false;
      },
      error => {
        console.error('Error fetching orders:', error);
        this.loading = false;
      }
    );
  }

  trackByOrderId(index: number, order: any): string {
    return order.id;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready To Ship':
        return 'ready-to-ship';
      case 'Cancelled':
        return 'cancelled';
      case 'Returned':
        return 'returned';
      case 'Delivered':
        return 'complete';
      default:
        return '';
    }
  }

  updateOrderStatus(orderId: string, status: string): void {
    this.ordersService.updateOrderStatus(orderId, status).subscribe(
      isSuccess => {
        if (isSuccess) {
          this.toastService.showToast(`Your order was ${status} successfully.`, 'success');
          this.fetchAllOrdersForAUser();
        }
      },
      error => {
        this.toastService.showToast('Processing error, please try again.', 'error');
      }
    );
  }
}
