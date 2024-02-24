import {MockManager, Manager, createMockContext} from "../__mocks__/mockPrisma";
import {UserRepository} from "../../src/repositories/userRepository";
import {User} from "@prisma/client";

let mockMng: MockManager;
let manager: Manager;

beforeEach(() => {
    mockMng = createMockContext();
    manager = mockMng as unknown as Manager;
});

const exampleUserReturner: User = {
    id: 1,
    name: "Alice",
    email: "alice@prisma.io",
    password: "123456",
    Weight: null,
    height: null,
    age: null,
    updatedAt: new Date("2024-02-21T14:24:40.317Z"),
    createdAt: new Date("2024-02-21T14:24:40.317Z"),
};

describe("UserRepository", () => {
    test("Deve chamar o usuário no banco", async () => {
        const userRepository = new UserRepository(manager.prisma);

        mockMng.prisma.user.findUnique.mockResolvedValue(exampleUserReturner);

        const response = await userRepository.getUserById(1);

        expect(response).toEqual(exampleUserReturner);
        expect(mockMng.prisma.user.findUnique).toHaveBeenCalled();
    });
});
