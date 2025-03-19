import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AccountLayoutComponent } from './account-layout/account-layout.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        SidebarComponent,
        AccountLayoutComponent,
        ProfileComponent,
        AddressBookComponent
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        ReactiveFormsModule
    ]
})
export class AccountModule { }
