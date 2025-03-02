import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { UserProfileEditComponent } from "./userProfile/user-profile-edit/user-profile-edit.component";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
    {
        path: 'userProfile',
        children: [
            {
                path: 'edit', component: UserProfileEditComponent
            }
        ]
    }
]

@NgModule({
    imports: [CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        ReactiveFormsModule
    ],
    declarations: [
        UserProfileEditComponent
    ]
})
export class ProfileModule { }