import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categorySource = new BehaviorSubject<any>(null);
    currentCategory$ = this.categorySource.asObservable();

    updateCategory(category: any) {
        this.categorySource.next(category);
    }
}
