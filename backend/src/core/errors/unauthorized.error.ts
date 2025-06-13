import { AppError } from "./app.error";

export class UnauthorizedError extends AppError {
    statusCode = 401;
  
    constructor(public message: string) {
      super(message);
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
  }