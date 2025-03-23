import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    query_collection: string = 'ORDERS';

    constructor(private firestore: AngularFirestore) { }

    addNewOrder(data: any): Observable<boolean> {
        const addQuery$ = from(this.firestore.collection(this.query_collection).add(data));
        return addQuery$.pipe(
            map(() => {
                return true;
            }),
            catchError((error) => {
                return [false];
            })
        );
    }
}
