import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactComponent } from "./contact/contact.component";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
    {
        path: '', component: ContactComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [
        ContactComponent
    ]
})
export class ContactModule { }