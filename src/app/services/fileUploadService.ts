import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {
    private cloudName = 'ds2ugn46u';
    private uploadPreset = 'SwiftHost';

    constructor(private http: HttpClient) { }

    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);

        try {
            const upload$: Observable<{ secure_url: string }> = this.http.post<{ secure_url: string }>(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
                formData
            );

            const response = await upload$.toPromise();
            return response?.secure_url ?? '';
        } catch (error) {
            return '';
        }
    }
}
