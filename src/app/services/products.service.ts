import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    product_collection: string = 'PRODUCT';

    constructor(private firestore: AngularFirestore) { }

    getAllProducts(): Observable<any[]> {
        return this.firestore.collection(this.product_collection).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as { [key: string]: any };
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
        );
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

    getProductsByIds(productIds: string[]): Observable<any[]> {
        const productObservables = productIds.map(id =>
            this.firestore.collection(this.product_collection).doc(id).get()
        );
        return new Observable(observer => {
            Promise.all(productObservables.map(obs => obs.toPromise()))
                .then(snapshots => {
                    const products = snapshots
                        .filter(snapshot => snapshot.exists)
                        .map(snapshot => {
                            const data = snapshot.data() as { [key: string]: any };
                            return { id: snapshot.id, ...data };
                        });
                    observer.next(products);
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }

    searchProducts(searchedText: string): Observable<any[]> {
        return this.firestore.collection(this.product_collection, ref =>
            ref.where('keywords', 'array-contains', searchedText.toLowerCase())
        )
            .snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    getProductById(productId: string): Observable<any> {
        return this.firestore.collection(this.product_collection).doc(productId).snapshotChanges().pipe(
            map(a => {
                const data = a.payload.data() as { [key: string]: any };
                const id = a.payload.id;
                return { id, ...data };
            })
        );
    }

    getProductsRecommendation(categoryId: string): Observable<any[]> {
        return this.firestore
            .collection(this.product_collection, ref =>
                ref.where('categoryId', '==', categoryId)
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

    updateProducts(products: any[]): Observable<boolean> {
        return new Observable(observer => {
            const batch = this.firestore.firestore.batch();
            products.forEach(product => {
                const { id, ...updateData } = product;
                const docRef = this.firestore.collection(this.product_collection).doc(id).ref;
                batch.update(docRef, updateData);
            });
            batch.commit()
                .then(() => {
                    observer.next(true);
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }
}
