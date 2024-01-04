import passport from 'passport';
import { Strategy } from 'passport-local';
import pool from '../db';
import { UserDAO } from '../models/userModel';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Express } from 'express-serve-static-core';

const userDAO = new UserDAO(pool);

const PgSession = connectPgSimple(session);

passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const user = await userDAO.findByUsername(username);

            if (!user) return done(null, false);

            const passwordMatch = await userDAO.verifyPassword(user, password);

            if (!passwordMatch) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await userDAO.findById(id);
        done(null, user || false);
    } catch (error) {
        done(error);
    }
});

export const configureSessions = (app: Express) => {
    app.use(
        session({
            store: new PgSession({
                pool,
                tableName: 'user_sessions',
            }),
            secret: process.env.SESSION_SECRET as string,
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
};
