import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SharedModule } from "../shared/shared.module";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '', redirectTo: 'login', pathMatch: 'full'
            },
            {
                path: 'login', component: LoginComponent
            },
            {
                path: 'signup', component: SignUpComponent
            }
        ]
    }
]

@NgModule({
    imports: [CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        LoginComponent,
        SignUpComponent
    ]
})
export class AuthModule { }