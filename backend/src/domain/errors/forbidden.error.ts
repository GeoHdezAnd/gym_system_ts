import { AppError } from "./app.error";

export class ForbiddenError extends AppError {
    statusCode = 403;
  
    constructor(public message: string) {
      super(message);
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
  }