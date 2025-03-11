import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    constructor(private fireStore: AngularFirestore) { }

    // don't expose
    async bulkUpload(collectionName: string, data: any[]) {
        const batch = this.fireStore.firestore.batch();

        data.forEach(item => {
            const docRef = this.fireStore.collection(collectionName).doc().ref;
            batch.set(docRef, item);
        });

        await batch.commit(); // Commit all writes
        console.log('Bulk upload completed!');
    }
}
