import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HomePageService {
    category_collection: string = 'CATEGORIES';

    constructor(private firestore: AngularFirestore) { }

    getCategoriesData(): Observable<any[]> {
        return this.firestore.collection(this.category_collection).valueChanges();
    }
}