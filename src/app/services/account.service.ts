import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    user_info_collection: string = 'USER_INFO';
    address_book_collection: string = 'ADDRESS_BOOK';
    payment_option_collection: string = 'PAYMENT_OPTIONS';

    constructor(private firestore: AngularFirestore) { }

    saveProfileInfo(userId: string, data: any): Observable<boolean> {
        const collectionRef = this.firestore.collection(this.user_info_collection);

        return from(collectionRef.ref.where('userId', '==', userId).get()).pipe(
            switchMap(snapshot => {
                if (!snapshot.empty) {
                    const docId = snapshot.docs[0].id;
                    return from(collectionRef.doc(docId).set(data, { merge: true }));
                } else {
                    return from(collectionRef.add({ ...data, userId }));
                }
            }),
            map(() => true),
            catchError(() => of(false))
        );
    }

    getProfileInfo(userId: string): Observable<any | null> {
        return this.firestore
            .collection(this.user_info_collection, ref => ref.where('userId', '==', userId).limit(1))
            .get()
            .pipe(
                map(snapshot => {
                    if (!snapshot.empty) {
                        return snapshot.docs[0].data();
                    }
                    return null;
                }),
                catchError(() => of(null))
            );
    }

    saveAddressInfo(data: any): Observable<boolean> {
        if (data.id) {
            return from(this.firestore.collection(this.address_book_collection).doc(data.id).set(data, { merge: true })).pipe(
                map(() => true),
                catchError(() => of(false))
            );
        } else {
            const docRef = this.firestore.collection(this.address_book_collection).doc();
            return from(docRef.set(data)).pipe(
                map(() => true),
                catchError(() => of(false))
            );
        }
    }

    getAllAddresses(userId: string): Observable<any[]> {
        return this.firestore
            .collection(this.address_book_collection, ref => ref.where('userId', '==', userId))
            .get()
            .pipe(
                map(snapshot => {
                    if (!snapshot.empty) {
                        return snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...(doc.data() as object)
                        }));
                    }
                    return [];
                }),
                catchError(() => of([]))
            );
    }

    deleteAddress(id: string): Observable<boolean> {
        return from(this.firestore.collection(this.address_book_collection).doc(id).delete()).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
