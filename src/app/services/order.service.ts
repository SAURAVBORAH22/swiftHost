import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order_collection: string = 'ORDERS';

    constructor(private firestore: AngularFirestore) { }

    addNewOrder(data: any): Observable<boolean> {
        const addQuery$ = from(this.firestore.collection(this.order_collection).add(data));
        return addQuery$.pipe(
            map(() => {
                return true;
            }),
            catchError((error) => {
                return [false];
            })
        );
    }

    getAllOrdersForUser(userId: string | null): Observable<any[]> {
        return this.firestore
            .collection(this.order_collection, ref => ref.where('userId', '==', userId))
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Record<string, any>;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    updateOrderStatus(orderId: string, newStatus: string): Observable<boolean> {
        const updateQuery$ = from(
            this.firestore
                .collection(this.order_collection)
                .doc(orderId)
                .update({ orderStatus: newStatus })
        );
        return updateQuery$.pipe(
            map(() => true),
            catchError((error) => {
                return [false];
            })
        );
    }

    getAllOrdersForUserByStatus(userId: string | null, status: string): Observable<any[]> {
        return this.firestore
            .collection(this.order_collection, ref =>
                ref.where('userId', '==', userId).where('orderStatus', '==', status)
            )
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Record<string, any>;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }
}
