import {Invoice, InvoiceItem, Person, Summary} from "../../models/interfaces";
import PDFKit from "pdfkit";

export const renderInvoice = (data: Invoice, doc: PDFKit.PDFDocument): void => {
    doc.fontSize(10);
    // number of total pages needed based on item count
    const itemsPerPage = 20;
    const totalPages = Math.ceil(data.items.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        if (i > 1) doc.addPage();
        // render contact headers
        renderPersonHeader(data.sender, doc, false);
        renderPersonHeader(data.customer, doc, true);
        // render items table
        const firstItemIndex = itemsPerPage * (i - 1);
        let lastItemIndex = itemsPerPage * i > data.items.length ? data.items.length : itemsPerPage * i;
        let lastY = renderItemsTable(data.items.slice(firstItemIndex, lastItemIndex), doc);

        if (i === totalPages) {
            let subTotal = calculateSubTotal(data.items);
            lastY = renderSummary(subTotal, data.summary, lastY, doc);
            lastY = renderNotes(data.notes, lastY, doc);
        }
    }
};

const calculateSubTotal = (items: InvoiceItem[]): number => {
    const subTotal = items.reduce((subTotal, item) => {
        return subTotal += (item.quantity * item.price);
    }, 0);
    return Number(subTotal.toFixed(2));
};

const renderPersonHeader = (person: Person, doc: PDFKit.PDFDocument, isCustomer: boolean): void => {
    let align: string = isCustomer ? "right" : "left";
    let x = isCustomer ? 300 : 20;
    let y = 20;
    doc.text(`${person.company ?? person.name}`, x, y, {align});
    doc.text(`${person.name}`, x, y = y + 15, {align});
    doc.text(`${person.email}`, x, y = y + 15, {align});
    doc.text(`${person.phone}`, x, y = y + 15, {align});
    doc.text(`${person.address?.street}`, x, y = y + 15, {align});
    doc.text(`${person.address?.unit}`, x, y = y + 15, {align});
    doc.text(`${person.address?.city}, ${person.address?.region} ${person.address?.zip_code}`, x, y = y + 15, {align});
    doc.text(`${person.address?.country}`, x, y = y + 15, {align});
};

const renderItemsTable = (items: InvoiceItem[], doc: PDFKit.PDFDocument): number => {
    let x = 20;
    let y = 170;
    // table headers
    doc.moveTo(x, y).lineTo(550, y).stroke();
    doc.moveTo(x, y).lineTo(x, y + 20).stroke();
    doc.moveTo(550, y).lineTo(550, y + 20).stroke();
    doc.moveTo(x, y + 20).lineTo(550, y + 20).stroke();
    doc.text("SKU", x + 5, y + 5, {align: "left"});
    doc.text("Name", x + 75, y + 5);
    doc.text("Quantity", x + 250, y + 5, {align: "center"});
    doc.text("Price", x + 350, y + 5, { align: "center"});
    doc.text("Amount", x + 450, y + 5, {align: "right"});
    y += 5;
    // invoice items
    items.forEach(item => {
        y += 20;
        doc.fontSize(8).text(`${item.sku}`, x + 5, y + 5, {align: "left"});
        doc.text(`${item.name}`, x + 75, y + 5);
        doc.text(`${item.quantity}`, x + 250, y + 5, {align: "center"});
        doc.text(`${item.price}`, x + 350, y + 5, { align: "center"});
        doc.text(`${item.quantity * item.price}`, x + 450, y + 5, {align: "right"});
        // draw horizontal separator
        doc.moveTo(x, y + 17.5).lineTo(550, y + 17.5).stroke();
    });
    y += 17.5;
    // draw all the vertical separators
    doc.moveTo(x, 170).lineTo(x, y).stroke();
    doc.moveTo(x + 70, 170).lineTo(x + 70, y).stroke();
    doc.moveTo(x + 360, 170).lineTo(x + 360, y).stroke();
    doc.moveTo(x + 410, 170).lineTo(x + 410, y).stroke();
    doc.moveTo(x + 465, 170).lineTo(x + 465, y).stroke();
    doc.moveTo(550, 170).lineTo(550, y).stroke();
    return y;
};

const renderSubTotal = (subTotal: number, y: number, doc: PDFKit.PDFDocument): number => {
    y += 5;
    doc.text("Sub-total:", 375, y, { align: "center"});
    doc.text(`${subTotal}`, 475, y, {align: "right"});
    return y;
};

const renderCredit = (credit: number, y: number, doc: PDFKit.PDFDocument): number => {
    y += 15;
    doc.text("Credit:", 375, y, { align: "center"});
    doc.text(`${credit}`, 475, y, {align: "right"});
    return y;
};

const renderDiscount = (discount: number, total_discount: number, y: number, doc: PDFKit.PDFDocument): number => {
    y += 15;
    doc.text(`Discount ${discount}%:`, 375, y, { align: "center"});
    doc.text(`${total_discount}`, 475, y, {align: "right"});
    return y;
};

const renderTax = (tax: number, total_tax: number, y: number, doc: PDFKit.PDFDocument): number => {
    y += 15;
    doc.text(`Tax ${tax}%:`, 375, y, { align: "center"});
    doc.text(`${total_tax}`, 475, y, {align: "right"});
    return y;
};

const renderTotal = (total: number, y: number, doc: PDFKit.PDFDocument): number => {
    y += 15;
    doc.fontSize(11);
    doc.text(`Total:`, 375, y, { align: "center"});
    doc.text(`${total}`, 475, y, {align: "right"});
    return y;
};

const renderSummary = (subTotal: number, summary: Summary, lastY: number, doc: PDFKit.PDFDocument): number => {
    lastY = renderSubTotal(subTotal, lastY, doc);
    lastY = renderCredit(summary.credit, lastY, doc);
    subTotal -= summary.credit; // subtract credit from subTotal
    const discount = summary.discount;
    const total_discount = Number(discount == 0 ? 0 : (subTotal * (discount/100)).toFixed(2));
    lastY = renderDiscount(discount, total_discount, lastY, doc);
    subTotal -= total_discount;
    const tax = summary.tax;
    const total_tax = Number((subTotal * (tax/100)).toFixed(2));
    lastY = renderTax(tax, total_tax, lastY, doc);
    const total = Number((subTotal + total_tax).toFixed(2));
    lastY = renderTotal(total, lastY, doc);
    return lastY;
};

const renderNotes = (notes: string, y: number, doc: PDFKit.PDFDocument): number => {
    y += 30;
    doc.fontSize(9);
    doc.text(`Notes: ${notes ?? ""}`, 20, y);
    return y;
};
