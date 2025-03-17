import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart_collection: string = 'CART';
    private cartCount = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCount.asObservable();

    constructor(private firestore: AngularFirestore) { }

    updateCartCount(count: number) {
        this.cartCount.next(count);
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

    getAllCartItems(userId: string | null): Observable<any[]> {
        return this.firestore
            .collection(this.cart_collection, ref => ref.where('userId', '==', userId))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Record<string, any>;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    clearCart(userId: string | null): Observable<boolean> {
        return this.firestore
            .collection(this.cart_collection, ref => ref.where('userId', '==', userId))
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
