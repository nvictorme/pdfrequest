import PDFKit from "pdfkit";
import {Response} from "express";
import {DocumentType} from "../../models/enumerations";
import {renderInvoice} from "./invoice.render";

const renderByDocumentType = (documentType: DocumentType, data: any, doc: PDFKit.PDFDocument): void => {
    switch (documentType) {
        case DocumentType.invoice: {
            renderInvoice(data, doc);
            break;
        }
        default: {
            renderInvoice(data, doc);
        }
    }
};

export const createPDF = (documentType: DocumentType, data: any, res: Response) => {
    let doc = new PDFKit({
        layout: "portrait",
        size: "LETTER"
    });
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData: any = Buffer.concat(buffers);
        res.status(200).contentType("application/pdf").send(pdfData);
    });
    renderByDocumentType(documentType, data, doc);
    doc.save().end();
};
