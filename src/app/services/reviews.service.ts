import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {
    review_collection: string = 'REVIEWS';

    constructor(private firestore: AngularFirestore) { }

    addNewReview(data: any): Observable<boolean> {
        return this.firestore.collection(this.review_collection, ref =>
            ref.where('userId', '==', data.userId)
                .where('productId', '==', data.productId)
        )
            .get()
            .pipe(
                switchMap(snapshot => {
                    if (snapshot.empty) {
                        return from(this.firestore.collection(this.review_collection).add(data))
                            .pipe(
                                map(() => true),
                                catchError(err => {
                                    return of(false);
                                })
                            );
                    } else {
                        return of(false);
                    }
                }),
                catchError(err => {
                    return of(false);
                })
            );
    }

    getAllReviewsForProduct(productId: string): Observable<any[]> {
        return this.firestore
            .collection(this.review_collection, ref =>
                ref.where('productId', '==', productId)
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

    checkIfReviewAlreadyAddedByUser(productId: string, userId: string): Observable<boolean> {
        return this.firestore.collection(this.review_collection, ref =>
            ref.where('userId', '==', userId)
                .where('productId', '==', productId)
        )
            .get()
            .pipe(
                map(snapshot => !snapshot.empty),
                catchError(err => {
                    return of(false);
                })
            );
    }

    getAllReviewsByUser(userId: string): Observable<any[]> {
        return this.firestore
            .collection(this.review_collection, ref =>
                ref.where('userId', '==', userId)
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
}
