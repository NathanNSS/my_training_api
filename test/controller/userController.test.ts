import {MockManager, Manager, createMockContext} from "../__mocks__/mockPrisma";
import {UserController} from "../../src/controller/userController";
import {UserModel} from "../../src/model/userModel";

let mockMng: MockManager;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let manager: Manager;

const mockUserModel: Partial<UserModel> = {
    getUserById: jest.fn(),
};

jest.mock("../../src/model/userModel", () => {
    return {
        UserModel: jest.fn().mockImplementation(() => mockUserModel),
    };
});

beforeEach(() => {
    jest.resetAllMocks();
    mockMng = createMockContext();
    manager = mockMng as unknown as Manager;
});

describe("UserController", () => {
    test("Deve retornar error caso deja chamado um id diferente de 1", async () => {
        const userController = new UserController();

        await expect(userController.fetchUserById(123)).rejects.toThrow();
    });
});
