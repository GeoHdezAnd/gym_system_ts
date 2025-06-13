import { AppError } from "./app.error";

export class ConflictError extends AppError {
    statusCode = 409;
  
    constructor(public message: string) {
      super(message);
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
  }