import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import { OrderByDatePipe } from 'src/app/shared/pipes/orderByDate.pipe';
@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css'],
  providers: [OrderByDatePipe]
})
export class OrderStatusComponent implements OnInit {
  userId: string | null = '';
  orders: any[] = [];
  loading: boolean = false;
  status: string = 'Cancelled';

  constructor(
    private ordersService: OrderService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private orderByDate: OrderByDatePipe,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params.status) {
          this.status = params.status;
        }
      });
    const user = this.authService.getUserFromSession();
    this.userId = user?.userId || null;

    if (this.userId) {
      this.fetchAllOrdersForAUserByStatus();
    }
  }

  fetchAllOrdersForAUserByStatus() {
    if (!this.userId) return;
    this.loading = true;
    this.ordersService.getAllOrdersForUserByStatus(this.userId, this.status).subscribe(
      orders => {
        this.orders = orders.map(order => ({
          ...order,
          payment: this.encryptionService.decryptObject(order.payment)
        }));
        this.loading = false;
      },
      error => {
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


  navigateToDetails(item: any): void {
    this.router.navigate(['/products/', item.id]);
  }
}
