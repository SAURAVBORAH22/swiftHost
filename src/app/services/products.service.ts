import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    product_collection: string = 'PRODUCT';

    constructor(private firestore: AngularFirestore) { }

    getAllProducts(): Observable<any[]> {
        return this.firestore.collection(this.product_collection).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as { [key: string]: any };
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    getProductsByCategory(categoryId: string, subcategory: string): Observable<any[]> {
        return this.firestore
            .collection(this.product_collection, ref =>
                ref.where('categoryId', '==', categoryId).where('subcategory', '==', subcategory)
            )
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as { [key: string]: any };
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    getNewArrvials(): Observable<any[]> {
        return this.firestore.collection(this.product_collection, ref =>
            ref.orderBy('createdOn', 'desc').limit(4)
        ).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as { [key: string]: any };
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    getAllHighRatedProducts(): Observable<any[]> {
        return this.firestore.collection(this.product_collection, ref => ref.where('rating', '>=', 4))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as { [key: string]: any };
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }
}
