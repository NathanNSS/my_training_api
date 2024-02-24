import {UserRepository} from "../repositories/userRepository";
import {prisma} from "../prisma";

// interface IUser {
//     id?: string;
//     name: string;
//     email: string;
// }

export class UserModel {
    private userRepository: UserRepository;

    constructor(userRepository = new UserRepository(prisma)) {
        this.userRepository = userRepository;
    }

    async getUserById(id: number) {
        return this.userRepository.getUserById(id);
    }
}
