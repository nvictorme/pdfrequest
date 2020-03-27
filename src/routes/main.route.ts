import {Router, Request, Response} from "express";

const router: Router = Router();

router.get("/", ((req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to PDFRequest"
    })
}));

export const MainRoute: Router = router;
