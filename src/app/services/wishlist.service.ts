import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WishListService {
    wishlist_collection: string = 'WISHLIST';

    constructor(private firestore: AngularFirestore) { }

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
                    return from(Promise.resolve(false));
                }
                const id = this.firestore.createId();
                return from(this.firestore.collection(this.wishlist_collection).doc(id).set(wishlistProduct)).pipe(
                    map(() => true)
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
                        return from(Promise.resolve(false));
                    }
                    const batch = this.firestore.firestore.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return from(batch.commit()).pipe(map(() => true));
                })
            );
    }
}
