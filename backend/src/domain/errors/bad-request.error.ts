import { AppError } from "./app.error";
export class BadRequestError extends AppError {
    statusCode = 400;
    constructor(public message: string ) {
        super(message)
    }

    serializeErrors() {
        return [{message: this.message}]
    }
}