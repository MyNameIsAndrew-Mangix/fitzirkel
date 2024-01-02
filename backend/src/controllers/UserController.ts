import { RequestHandler, Request } from 'express';
import * as UserModel from '../models/UserModel';
import createHttpError from 'http-errors';
import bcrypt, { hash } from 'bcrypt';
import { sendSuccessResponse } from '../util/responseUtils';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

interface HttpError {
    status: number;
    message: string;
}

export const createUser: RequestHandler = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passRaw = req.body.password;
    try {
        if (!username || !email || !passRaw) {
            throw createHttpError(400, 'Parameters missing');
        }
        await req.db.query('BEGIN');

        const userExistResult = await getUserByUsername(req, username);

        if (userExistResult.rows.length > 0) {
            throw createHttpError(409, 'Username already exists');
        }
        const emailExistResult = await req.db.query(
            'SELECT 1 FROM users WHERE email = $1 FOR UPDATE',
            [email]
        );
        if (emailExistResult.rows.length > 0) {
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

passport.use(
    new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        try {
            const user = await getUserByUsername(req, username);

            if (!user || !(await bcrypt.compare(password, user.password)))
                return done(null, false, { message: 'Invalid username or password' });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

async function getUserByUsername(req: Request, username: string) {
    console.log(
        JSON.stringify(
            await req.db.query('SELECT 1 FROM users WHERE username = $1 FOR UPDATE', [username])
        )
    );
    return await req.db.query('SELECT 1 FROM users WHERE username = $1 FOR UPDATE', [username]);
}
