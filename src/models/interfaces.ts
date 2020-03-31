import {InvoiceStatus, PaymentMethod} from "./enumerations";

export interface Person {
    id_person?: number;
    name: string;
    company?: string;
    tax_id?: string;
    email: string;
    phone?: string;
    address?: Address;
}

export interface Address {
    street: string;
    unit: string;
    city: string;
    region: string;
    zip_code: string;
    country: string;
}

export interface Invoice {
    id_invoice?: number;
    date_created: Date | string | any;
    sender: Person;
    customer: Person;
    items: InvoiceItem[];
    summary: Summary;
    notes: string;
    status?: InvoiceStatus;
    payment_method?: PaymentMethod;
}

export interface InvoiceItem {
    id_item?: number;
    sku?: string;
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

export interface Summary {
    credit: number;
    discount: number;
    tax: number;
    sub_total?: number;
    total?: number;
}


