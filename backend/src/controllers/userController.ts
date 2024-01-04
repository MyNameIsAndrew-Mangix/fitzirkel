import { RequestHandler } from 'express';
import * as UserModel from '../models/userModel';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { sendSuccessResponse } from '../util/responseUtils';
import passport from 'passport';

interface HttpError {
    status: number;
    message: string;
}

export const createUser: RequestHandler = async (req, res, next) => {
    const userDAO = new UserModel.UserDAO(req.db);
    const username = req.body.username;
    const email = req.body.email;
    const passRaw = req.body.password;
    try {
        if (!username || !email || !passRaw) {
            throw createHttpError(400, 'Parameters missing');
        }
        await req.db.query('BEGIN');

        const userExistResult = await userDAO.findByUsername(username);
        if (userExistResult) {
            throw createHttpError(409, 'Username already exists');
        }
        const emailExistResult = await userDAO.findByEmail(email);
        if (emailExistResult) {
            throw createHttpError(409, 'Email already in use');
        }

        const hashedPass = await bcrypt.hash(passRaw, 15);
        const { rows } = await req.db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPass]
        );
        sendSuccessResponse(res, 201, 'User created', rows[0]);
        await req.db.query('COMMIT');
    } catch (error) {
        console.error('Error starting transaction', error);
        await req.db.query('ROLLBACK');
        const typedError = error as HttpError;
        if (typedError.status) {
            next(error);
        } else next(createHttpError(500, 'Internal server error'));
    } finally {
        req.db.release();
    }
};

export const login: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate('local', (err: any, user: Express.User, info: any) => {
        if (err) return next(err);
        if (!user) {
            console.error('Authentication error:', info);
            return createHttpError(401, 'Invalid credentials');
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            sendSuccessResponse(res, 200, 'Login successful', user);
        });
    })(req, res, next);
};

export const logout: RequestHandler = (req, res, next) => {
    req.logout;
    req.session.destroy;
    res.redirect('/');
};
