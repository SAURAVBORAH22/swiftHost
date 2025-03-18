import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    query_collection: string = 'QUERY';

    constructor(private firestore: AngularFirestore) { }

    addNewQuery(data: any): Observable<boolean> {
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
