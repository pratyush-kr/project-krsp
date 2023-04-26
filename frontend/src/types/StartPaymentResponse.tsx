import { Order } from "./Order";
import { Payment } from "./Payment";

export interface StartPaymentResponse {
    payment: Payment;
    order: Order;
}
