import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home/home.component";
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HomeSidebarComponent } from './home-sidebar/home-sidebar.component';

const routes: Routes = [
    {
        path: '', component: HomeLayoutComponent, children: [
            { path: '', component: HomeComponent },
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        HomeComponent,
        HomeLayoutComponent,
        HomeSidebarComponent
    ]
})
export class HomeModule { }