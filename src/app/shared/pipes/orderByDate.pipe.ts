import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderByDate'
})
export class OrderByDatePipe implements PipeTransform {
    transform(orders: any[]): any[] {
        if (!orders) return [];
        return orders.sort((a, b) => {
            const dateA = new Date(a.orderDate).getTime();
            const dateB = new Date(b.orderDate).getTime();
            return dateB - dateA;
        });
    }
}
