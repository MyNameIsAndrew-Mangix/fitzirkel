import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const ensureAuth: RequestHandler = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //TODO: ADD REDIRECT TO LOGIN PAGE
        createHttpError(401, 'REDIRECT THEM TO LOGIN PAGE!!!!!!!');
    }
};
