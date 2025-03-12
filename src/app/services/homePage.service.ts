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
    cart_collection: string = 'CART';

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

    addToCart(cartProduct: any): Observable<boolean> {
        const cartRef = this.firestore.collection(this.cart_collection, ref =>
            ref.where('productId', '==', cartProduct.productId).where('userId', '==', cartProduct.userId)
        );

        return cartRef.get().pipe(
            switchMap(snapshot => {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    const existingData: any = doc.data();
                    const newQuantity = (existingData.quantity || 0) + cartProduct.quantity;

                    return from(doc.ref.update({ quantity: newQuantity })).pipe(map(() => true));
                } else {
                    const id = this.firestore.createId();
                    return from(this.firestore.collection(this.cart_collection).doc(id).set(cartProduct)).pipe(
                        map(() => true)
                    );
                }
            })
        );
    }


    removeFromCart(productId: string, userId: string): Observable<boolean> {
        return this.firestore
            .collection(this.cart_collection, ref =>
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

    getCartItemCount(userId: string): Observable<number> {
        return this.firestore
            .collection(this.cart_collection, ref => ref.where('userId', '==', userId))
            .get()
            .pipe(map(snapshot => snapshot.size));
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
