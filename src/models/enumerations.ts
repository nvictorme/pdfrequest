// *********************************************
// !!! DO NOT ALTER THE ORDER OF ENUMS !!!
// IF YOU EVER NEED TO ADD NEW ENTRIES TO AN ENUM
// MAKE SURE YOU DO IT AT THE END OF IT
// OR YOU WILL END UP CAUSING IRREVERSIBLE DAMAGE
// *******************************************
export enum DocumentType {
    invoice
}

export enum InvoiceStatus {
    open,
    confirmed,
    payment_pending,
    partial_payment,
    paid,
    closed,
    deleted
}

export enum PaymentMethod {
    cashapp,
    venmo,
    paypal,
    zelle,
    crypto,
    stripe,
    cash,
    check,
    bank_deposit,
    wire_transfer,
    remittance
}
