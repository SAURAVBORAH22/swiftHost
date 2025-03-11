import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HomePageService {
    category_collection: string = 'CATEGORIES';
    product_collection: string = 'PRODUCT';
    wishlist_collection: string = 'WISHLIST';

    constructor(private firestore: AngularFirestore) { }

    getCategoriesData(): Observable<any[]> {
        return this.firestore.collection(this.category_collection).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as { [key: string]: any };
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    getAllProducts(): Observable<any[]> {
        return this.firestore.collection(this.product_collection).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as { [key: string]: any };
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
    }

    isProductWishlisted(productId: string, userId: string): Observable<boolean> {
        return this.firestore
            .collection(this.wishlist_collection, ref =>
                ref.where('productId', '==', productId).where('userId', '==', userId)
            )
            .get()
            .pipe(map(snapshot => !snapshot.empty));
    }

    addToWishlist(wishlistProduct: any): Observable<boolean> {
        return this.isProductWishlisted(wishlistProduct.productId, wishlistProduct.userId).pipe(
            switchMap(exists => {
                if (exists) {
                    return from(Promise.resolve(false)); // Already exists, return false
                }
                const id = this.firestore.createId(); // Generate a unique document ID
                return from(this.firestore.collection(this.wishlist_collection).doc(id).set(wishlistProduct)).pipe(
                    map(() => true) // Successfully added
                );
            })
        );
    }

    removeFromWishlist(productId: string, userId: string): Observable<boolean> {
        return this.firestore
            .collection(this.wishlist_collection, ref =>
                ref.where('productId', '==', productId).where('userId', '==', userId)
            )
            .get()
            .pipe(
                switchMap(snapshot => {
                    if (snapshot.empty) {
                        return from(Promise.resolve(false)); // No matching entry, return false
                    }
                    const batch = this.firestore.firestore.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return from(batch.commit()).pipe(map(() => true)); // Successfully deleted
                })
            );
    }
}
