export interface Payment {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string | null;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: [];
    created_at: number;
}
