import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './modals/toast/toast.component';

@NgModule({
    declarations: [
        PageLoaderComponent,
        NavbarComponent,
        ToastComponent
    ],
    exports: [
        PageLoaderComponent,
        NavbarComponent,
        ToastComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ]
})
export class SharedModule { }
