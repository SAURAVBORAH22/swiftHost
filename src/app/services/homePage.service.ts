import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HomePageService {
    category_collection: string = 'CATEGORIES';
    product_collection: string = 'PRODUCT';

    constructor(private firestore: AngularFirestore) { }

    getCategoriesData(): Observable<any[]> {
        return this.firestore.collection(this.category_collection).valueChanges();
    }

    getAllProducts(): Observable<any[]> {
        return this.firestore.collection(this.product_collection).valueChanges();
    }
}