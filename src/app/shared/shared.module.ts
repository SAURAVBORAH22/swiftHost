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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    declarations: [
        PageLoaderComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent,
        FileViewerComponent,
        NavbarComponent,
        SidebarComponent,
        CarouselComponent,
        ProductCardComponent,
        FooterComponent
    ],
    exports: [
        PageLoaderComponent,
        ToastComponent,
        TranslationPipe,
        FileUploaderComponent,
        NavbarComponent,
        SidebarComponent,
        CarouselComponent,
        ProductCardComponent,
        FooterComponent
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
