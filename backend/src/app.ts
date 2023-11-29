import 'dotenv/config';
import express from 'express';
import createHttpError from 'http-errors';
import cors from 'cors';
import session from 'express-session';
import env from './util/validateEnv';

import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

app.use('/');
app.use('/api/');
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found')); //add a 404 page later
});
