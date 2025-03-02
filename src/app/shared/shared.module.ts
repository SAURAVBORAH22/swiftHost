import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './modals/toast/toast.component';
import { TranslationPipe } from './pipes/translation.pipe';
import { TranslationService } from './translation.service';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FileViewerComponent } from './modals/file-viewer/file-viewer.component';

@NgModule({
    declarations: [
        PageLoaderComponent,
        NavbarComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent,
        FileViewerComponent
    ],
    exports: [
        PageLoaderComponent,
        NavbarComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ],
    providers: [
        TranslationService
    ],
})
export class SharedModule { }
