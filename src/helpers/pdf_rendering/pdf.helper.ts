import PDFKit from "pdfkit";
import {Response} from "express";
import {DocumentType} from "../../models/enumerations";
import {renderInvoice} from "./invoice.render";

const switchByDocumentType = (documentType: DocumentType, data: any, doc: PDFKit.PDFDocument): PDFKit.PDFDocument => {
    switch (documentType) {
        case DocumentType.invoice: {
            return renderInvoice(data, doc);
        }
        default: {
            return renderInvoice(data, doc)
        }
    }
};

export const createPDF = (documentType: DocumentType, data: any, res: Response) => {
    let doc = new PDFKit();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData: any = Buffer.concat(buffers);
        res.status(200).contentType("application/pdf").send(pdfData);
    });
    switchByDocumentType(documentType, data, doc).save().end();
};
