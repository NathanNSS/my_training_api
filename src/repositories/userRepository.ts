import {PrismaClient, User} from "@prisma/client";

export class UserRepository {
    manager;

    constructor(manager: PrismaClient) {
        this.manager = manager;
    }

    async getUserById(id: number): Promise<User | null> {
        return this.manager.user.findUnique({
            where: {
                id: id,
            },
        });
    }
}
