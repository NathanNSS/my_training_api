import {Router} from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {z} from "zod";

import {UserController} from "../controller/userController";

const router = Router();

const userController = new UserController();

router.get("/user/:id", async (req: Request, res: Response, next: NextFunction) => {
    const schemaParams = z.object({
        id: z.string(),
    });
    try {
        const reqCliet = schemaParams.parse(req.params);

        const response = await userController.fetchUserById(reqCliet.id);

        res.send(response);
    } catch (error) {
        next(error);
    }
});

export {router as routerUser};
