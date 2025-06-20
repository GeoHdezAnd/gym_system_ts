import { AppError } from "./app.error";

export class NotFoundError extends AppError {
    statusCode = 404;
  
    constructor(public message: string = 'Resource not found') {
      super(message);
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
  }