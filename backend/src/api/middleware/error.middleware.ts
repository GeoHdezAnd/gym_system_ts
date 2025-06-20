import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors";

interface ErrorResponse {
    success: boolean;
    error: {
        message: string;
        code?: string;
    };
}
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    const errorResponse: ErrorResponse = {
        success: false,
        error: {
            message: "Internal Server Error",
        },
    };

    // Manejo de errores conocidos
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        errorResponse.error.message = err.message;
    }
    if (process.env.NODE_ENV == "development") {
        console.log(err);
    }
    res.status(statusCode).json(errorResponse);
};
