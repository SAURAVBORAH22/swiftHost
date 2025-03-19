import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    user_info_collection: string = 'USER_INFO';

    constructor(private firestore: AngularFirestore) { }

    saveProfileInfo(data: any): Observable<boolean> {
        const docRef = this.firestore.collection(this.user_info_collection).doc();
        return from(docRef.set(data)).pipe(
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
}
