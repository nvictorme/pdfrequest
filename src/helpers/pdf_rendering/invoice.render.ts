import {Invoice} from "../../models/interfaces";
import PDFKit from "pdfkit";

export const renderInvoice = (data: Invoice, doc: PDFKit.PDFDocument): PDFKit.PDFDocument => {
    doc.text(`${data.id_invoice}`, 50, 10);
    doc.text(`${data.notes}`, 50, 30);
    return doc;
};
