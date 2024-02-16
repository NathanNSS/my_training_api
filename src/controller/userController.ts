import {ErrorExpress} from "../model/errorHandlingExpress";
import {UserModel} from "../model/userModel";

const userFake = new UserModel({name: "Cleiton", email: "cleiton@email.com"});

export class UserController {
    fetchUserById(id: string): Promise<unknown> {
        if (id === "123") {
            throw new ErrorExpress({
                name: "Id errado",
                statusCode: 400,
                description: "Passe um id valido para continuar",
            });
        }

        return userFake.fetchUserById(id);
    }
}
