import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


const params = new URLSearchParams(window.location.search);
const sessionData = params.get("session");

if (sessionData) {
    try {
        const decodedData = JSON.parse(atob(sessionData));
        sessionStorage.setItem('userData', JSON.stringify(decodedData));
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    } catch (error) {
        console.error('Error parsing session data:', error);
    }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
