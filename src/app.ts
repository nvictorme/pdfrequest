import express from "express";
import cors from "cors";
import {MainRoute, InvoicesRoute} from "./routes/app.routes";

import dotenv from "dotenv";
dotenv.config({path: __dirname + "/.env"});

// initialize express app
const app: express.Application = express();
// disable x-powered-by header
app.disable("x-powered-by");
// enable CORS
app.use(cors({origin: true}));
// enable JSON support for automatic body parsing
app.use(express.json());
// define routes
app.use("/", MainRoute);
app.use("/invoices", InvoicesRoute);

// server starts listening on PORT
const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);
app.listen(PORT, () => {
    console.info(`Listening on port: ${PORT}`);
});
