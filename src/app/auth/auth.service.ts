import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { from, Observable } from "rxjs";
import { AuthResponseModel } from "../models/authResponseModel";
import { map } from "rxjs/operators";
import { User } from "../models/userModel";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    timeoutInterval: any;
    constructor(
        private afAuth: AngularFireAuth,
        private router: Router
    ) { }

    loginOrSignUp(email: string, password: string, isLogin: boolean): Observable<AuthResponseModel> {
        const apiToCall = isLogin ? this.afAuth.signInWithEmailAndPassword(email, password) : this.afAuth.createUserWithEmailAndPassword(email, password);
        return from(apiToCall).pipe(
            map((userCredential: any) => {
                const user = userCredential.user;
                return {
                    idToken: user?.idToken || '',
                    email: user?.email || '',
                    refreshToken: user?.refreshToken,
                    expiresIn: userCredential.expirationDate || '3600',
                    localId: user?.uid || '',
                    registered: userCredential.additionalUserInfo?.isNewUser || false,
                };
            })
        );
    }

    formatUser(data: AuthResponseModel): User {
        const expirationDate = new Date(new Date().getTime() + +data.expiresIn * 1000)
        const user = new User(data.email, data.refreshToken, data.localId, expirationDate);
        return user;
    }

    runTimeoutInterval(user: User): void {
        const todaysDate = new Date().getTime();
        const expirationDate = user.expireDate.getTime();
        const timeInterval = expirationDate - todaysDate;
        this.timeoutInterval = setTimeout(() => {
            this.logoutUserFromSession();
        }, timeInterval)
    }

    setUserInLocalStorage(user: User): void {
        localStorage.setItem('userData', JSON.stringify(user));
        this.runTimeoutInterval(user);
    }

    logoutUserFromSession(): void {
        localStorage.removeItem('userData');
        if (this.timeoutInterval) {
            clearTimeout(this.timeoutInterval);
            this.timeoutInterval = null;
        }
        this.router.navigate(['login']);
    }

    getUserFromLocalStore() {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            const expirationDate = new Date(userData.expirationDate);
            const user = new User(userData.email, userData.refreshToken, userData.localId, expirationDate);
            this.runTimeoutInterval(user);
            return user;
        }
        return null
    }

    isAuthenticated(): boolean {
        if (this.getUserFromLocalStore() !== null) {
            return true;
        }
        return false;
    }
}