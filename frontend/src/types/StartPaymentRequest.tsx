export interface StartPaymentRequest {
    amount: string;
    userName: string;
    email: string;
    appointment_date: string;
    appointment_time: string;
    doctor: string;
    contact: string;
}
