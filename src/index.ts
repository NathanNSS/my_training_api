import express from "express";
import compression from "compression";
import cors from "cors";

import {routerUser} from "./routes/user.routing";
import {errorHandling} from "./middlewares/errorHandling";
import {headerSecurity} from "./middlewares/ headerSecurity";
import {genericPrevBruteForce, loginPrevBruteForce} from "./middlewares/PrevBruteForce";

const app = express();
const port = 5000;

app.disable("x-powered-by"); //Segurança: reduzir a impressão digital do servidor
app.set("trust proxy", true); //Auxilia para capturar um IP confiável

app.use(cors());
app.use(compression());
app.use(headerSecurity);
app.use(genericPrevBruteForce);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/login", loginPrevBruteForce);
app.use("/", routerUser);

app.use(errorHandling);

app.listen(port, () => console.log("✔ Server Running"));
