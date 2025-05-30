import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
    {
        path: '', component: AccountLayoutComponent, children: [
            { path: 'profile', component: ProfileComponent },
            { path: 'address-book', component: AddressBookComponent },
            { path: 'payment', component: PaymentComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
