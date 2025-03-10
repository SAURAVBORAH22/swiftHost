import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './modals/toast/toast.component';
import { TranslationPipe } from './pipes/translation.pipe';
import { TranslationService } from '../services/translation.service';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FileViewerComponent } from './modals/file-viewer/file-viewer.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';

@NgModule({
    declarations: [
        PageLoaderComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent,
        FileViewerComponent,
        MainNavbarComponent
    ],
    exports: [
        PageLoaderComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent,
        MainNavbarComponent
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
