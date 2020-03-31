import {Request, Response, Router} from "express";
import {createPDF} from "../helpers/pdf_rendering/pdf.helper";
import {Invoice} from "../models/interfaces";
import {DocumentType} from "../models/enumerations";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Invoices are cool beans"
    })
});

router.post("/", ((req: Request, res: Response) => {
    const payload: Invoice = req.body;
    createPDF(DocumentType.invoice, payload, res);
}));

export const InvoicesRoute: Router = router;
