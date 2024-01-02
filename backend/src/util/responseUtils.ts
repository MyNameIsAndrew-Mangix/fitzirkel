/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from 'express';

export function sendSuccessResponse<T>(res: Response, statusCode: number, message: string): void;
export function sendSuccessResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T
): void;

export function sendSuccessResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
): void {
    res.status(statusCode).json({ message, data });
}
