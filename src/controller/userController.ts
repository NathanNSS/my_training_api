import {ErrorExpress} from "../model/errorHandlingExpress";
import {UserModel} from "../model/userModel";

export class UserController {
    userModel: UserModel;

    constructor(userModel = new UserModel()) {
        this.userModel = userModel;
    }

    async fetchUserById(id: number): Promise<unknown> {
        //example test
        if (id !== 1)
            throw new ErrorExpress({
                name: "Bad Request",
                statusCode: 400,
            });
        return this.userModel.getUserById(id);
    }
}
