import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from "./cart/cart.component";
import { FormsModule } from "@angular/forms";
import { ProductListFilterComponent } from './product-list-filter/product-list-filter.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { ReviewModalComponent } from './review-modal/review-modal.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';

const routes: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: 'list',
        component: ProductListComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    },
    {
        path: 'order-status',
        component: OrderStatusComponent
    },
    {
        path: 'my-reviews',
        component: MyReviewsComponent
    },
    {
        path: ':id',
        component: ProductDetailsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule
    ],
    declarations: [
        ProductListComponent,
        ProductDetailsComponent,
        CartComponent,
        ProductListFilterComponent,
        CheckoutComponent,
        OrdersComponent,
        OrderStatusComponent,
        ReviewModalComponent,
        MyReviewsComponent
    ]
})
export class ProductModule { }
