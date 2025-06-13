export abstract class AppError extends Error{
    abstract statusCode: number;
    abstract serializeErrors(): {message: string; field?:string}[];
}