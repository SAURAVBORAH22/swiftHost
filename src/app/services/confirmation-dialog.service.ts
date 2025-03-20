import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { ConfirmationDialogComponent } from '../shared/modals/confirmation-dialog/confirmation-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmationDialogService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }

    confirm(title: string, message: string): Promise<boolean> {
        return new Promise((resolve) => {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ConfirmationDialogComponent);
            const componentRef = componentFactory.create(this.injector);

            // Set dynamic data
            componentRef.instance.title = title;
            componentRef.instance.message = message;

            // Subscribe to events from the component
            componentRef.instance.confirm.subscribe(() => {
                resolve(true);
                this.removeComponent(componentRef);
            });
            componentRef.instance.cancel.subscribe(() => {
                resolve(false);
                this.removeComponent(componentRef);
            });

            // Attach component to Angular's component tree
            this.appRef.attachView(componentRef.hostView);

            // Get DOM element from the component
            const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
            // Append the element to the body so it overlays the app
            document.body.appendChild(domElem);
        });
    }

    private removeComponent(componentRef: any) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }
}
