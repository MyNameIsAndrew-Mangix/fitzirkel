import { RequestHandler } from 'express';
import pool from './db';
import createHttpError from 'http-errors';

export const connectDBMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const client = await pool.connect();
        req.db = client; // Attach the database client to the request object

        //ensure the connection is released back to the pool after the request is processed
        res.on('finish', () => {
            client.release();
        });

        next();
    } catch (error) {
        console.error('Error connecting to the database', error);
        next(createHttpError(500, 'Internal Server Error'));
    }
};
