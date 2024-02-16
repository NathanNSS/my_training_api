interface IErrorExpress {
    messageEX: IMessageEX;
}

interface IMessageEX {
    name: string;
    statusCode: number;
    description?: string;
}

const defaultMessage: IMessageEX = {
    name: "Internal Error",
    statusCode: 500,
    description: "An unexpected error occurred, please try again later!",
};

export class BaseError extends Error {
    public readonly messageEX: IMessageEX;

    constructor({messageEX}: IErrorExpress) {
        super(JSON.stringify(messageEX));

        Object.setPrototypeOf(this, new.target.prototype);

        this.messageEX = messageEX;

        //Error.captureStackTrace(this); //adicionar contexto(BaseError, ErrorExpress) na stack do error
    }
}

export class ErrorExpress extends BaseError {
    constructor(messageEX: IMessageEX = defaultMessage) {
        super({messageEX: messageEX});
    }
}

class ErrorHandler {
    public isTrustedError(error: Error) {
        if (error instanceof BaseError) {
            return error.messageEX;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();
