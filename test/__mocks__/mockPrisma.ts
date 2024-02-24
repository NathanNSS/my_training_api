import {PrismaClient} from "@prisma/client";
import {mockDeep, DeepMockProxy} from "jest-mock-extended";

export interface Manager {
    prisma: PrismaClient;
}

export interface MockManager {
    prisma: DeepMockProxy<PrismaClient>;
}

export const createMockContext = (): MockManager => {
    return {
        prisma: mockDeep<PrismaClient>(),
    };
};
