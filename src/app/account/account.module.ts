import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './payment/payment.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        SidebarComponent,
        AccountLayoutComponent,
        ProfileComponent,
        AddressBookComponent,
        PaymentComponent
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
    ]
})
export class AccountModule { }
