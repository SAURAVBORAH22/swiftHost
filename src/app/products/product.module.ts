import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductDetailsComponent } from './product-details/product-details.component';

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
        path: ':id',
        component: ProductDetailsComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ProductListComponent,
        ProductDetailsComponent
    ]
})
export class ProductModule { }
