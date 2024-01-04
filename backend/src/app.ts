import 'dotenv/config';
import express from 'express';
import createHttpError from 'http-errors';
import cors from 'cors';
import session from 'express-session';
import pool from './db';
import passport from 'passport';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import { configureSessions } from './middleware/passport';
import { ensureAuth } from './middleware/authMiddleware';

const app = express();
configureSessions(app);
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        const client = await pool.connect();
        req.db = client; //attach the db client to the req object
        next();
    } catch (error) {
        console.error('Error connecting to the databse', error);
        createHttpError(500, 'Internal server error');
    }
});

app.use('/', (req, res, next) => {
    next();
});
app.use('/api/', (req, res, next) => {
    next();
});
app.use('/api/users', userRoutes);
app.use('/api/posts', ensureAuth, postRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found')); //add a 404 page later
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
