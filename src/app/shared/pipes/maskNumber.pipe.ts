import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskNumber'
})
export class MaskNumberPipe implements PipeTransform {

    transform(value: string): string {
        if (!value || value.length < 4) {
            return value;
        }
        const last4 = value.slice(-4);
        return `${'*'.repeat(value.length - 4)}${last4}`;
    }
}
