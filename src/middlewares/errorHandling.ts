/* eslint-disable @typescript-eslint/no-unused-vars */
import {Request, Response, NextFunction} from "express-serve-static-core";
import {BaseError, ErrorExpress, errorHandler} from "../model/errorHandlingExpress";

export function errorHandling(err: BaseError, req: Request, res: Response, next: NextFunction) {
    if (!errorHandler.isTrustedError(err)) next(err);

    const {messageEX} = err;

    if (!messageEX) {
        const {messageEX} = new ErrorExpress();
        return res.status(messageEX.statusCode).send(messageEX.name);
    }
    console.error(err.stack);
    res.status(messageEX.statusCode).send(messageEX.name);
}
