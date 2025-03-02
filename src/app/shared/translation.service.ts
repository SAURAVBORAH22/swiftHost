// src/app/services/translation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import en from '../../assets/i18n/en.json';
import fr from '../../assets/i18n/fr.json';
import hindi from '../../assets/i18n/hindi.json';
import arabic from '../../assets/i18n/arabic.json';
import bengali from '../../assets/i18n/bengali.json';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private currentLanguage: any = new BehaviorSubject<string>(localStorage.getItem('localisation') || 'en');
    private translations: any = {
        en,
        fr,
        hindi,
        arabic,
        bengali
    };

    get currentLanguage$() {
        return this.currentLanguage.asObservable();
    }

    changeLanguage(language: string) {
        this.currentLanguage.next(language);
        this.setLocalisationToLocalStorage(language);
    }

    getTranslation(key: string): string {
        return this.translations[this.currentLanguage.getValue()][key] || key;
    }

    setLocalisationToLocalStorage(localisation: string): void {
        localStorage.setItem('localisation', localisation);
    }
}
