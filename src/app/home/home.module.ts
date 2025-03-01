import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'home', component: HomeComponent
            }
        ]
    }
]

@NgModule({
    imports: [CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule { }