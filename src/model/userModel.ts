import {randomUUID} from "node:crypto";
import {fakeAwait} from "../utils";
interface IUser {
    id?: string;
    name: string;
    email: string;
}

export class UserModel implements IUser {
    id?: string;
    name: string;
    email: string;

    constructor({id = randomUUID(), email, name}: IUser) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    async fetchUserById(id: string) {
        this.id = id;
        return await fakeAwait(this, true);
    }
}
