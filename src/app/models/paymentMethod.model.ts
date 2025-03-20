export interface Payment {
    id?: string;
    userId: string;
    method: string;
    details: any;
}
