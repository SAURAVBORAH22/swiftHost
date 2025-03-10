export class User {
    constructor(
        private email: string,
        private refreshToken: string,
        private localId: string,
        private expirationDate: Date
    ) { }

    get expireDate(): Date {
        return this.expirationDate;
    }

    get userToken() {
        return this.refreshToken;
    }

    get registeredEmail() {
        return this.email;
    }

    get userId() {
        return this.localId;
    }
}