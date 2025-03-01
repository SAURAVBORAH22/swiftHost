import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userData = localStorage.getItem("userData");
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                const token = parsedData?.token;

                if (token) {
                    const clonedReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return next.handle(clonedReq);
                }
            } catch (error) {
                console.error("Error parsing userData from localStorage", error);
            }
        }

        return next.handle(req);
    }
}
