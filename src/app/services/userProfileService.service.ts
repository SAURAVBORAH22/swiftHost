import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { UserProfileDetails } from '../models/userProfileDetails';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  collection: string = 'USER_INFO';

  constructor(private firestore: AngularFirestore) { }

  getUserProfileDetails(userId: string): Observable<UserProfileDetails | null> {
    return this.firestore
      .collection<UserProfileDetails>(this.collection, ref => ref.where('userId', '==', userId).limit(1))
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length > 0) {
            const a = actions[0];
            const data = a.payload.doc.data() as UserProfileDetails;
            const id = a.payload.doc.id;
            return { id, ...data };
          }
          return null;
        })
      );
  }

  updateOrCreateUserProfileDetails(userId: string, updatedData: Partial<UserProfileDetails>): Observable<boolean> {
    return this.firestore
      .collection<UserProfileDetails>(this.collection, ref => ref.where('userId', '==', userId).limit(1))
      .snapshotChanges()
      .pipe(
        first(),
        switchMap(actions => {
          if (actions.length > 0) {
            const docId = actions[0].payload.doc.id;
            return from(this.firestore.collection(this.collection).doc(docId).update(updatedData)).pipe(
              map(() => true)
            );
          } else {
            return from(this.firestore.collection(this.collection).add({ userId, ...updatedData })).pipe(
              map(() => true)
            );
          }
        })
      );
  }
}