import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [PageLoaderComponent, NavbarComponent],
    exports: [PageLoaderComponent, NavbarComponent],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ]
})
export class SharedModule { }
