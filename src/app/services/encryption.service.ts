import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {
    private secretKey = environment.encryptionKey;

    encryptObject(object: any): string {
        const jsonString = JSON.stringify(object);
        return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
    }

    decryptObject(ciphertext: string): any {
        const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    }
}
