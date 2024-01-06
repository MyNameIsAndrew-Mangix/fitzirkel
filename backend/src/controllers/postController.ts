import { RequestHandler } from 'express';
import * as PostModel from '../models/postModel';
import createHttpError from 'http-errors';
import { sendSuccessResponse } from '../util/responseUtils';

export const createPost: RequestHandler = async (req, res, next) => {
    const postDAO = new PostModel.PostDAO(req.db);
    const post: PostModel.Post = {
        user_id: parseInt(req.body.user_id, 10),
        content: req.body.content,
    };

    try {
        const createdPost = await postDAO.createPost(post);
        sendSuccessResponse(res, 201, 'Successfully created post', createdPost);
    } catch (error) {
        console.error(error);
        throw new Error(`Internal server error: ${error}`);
    } finally {
        req.db.release();
    }
};
export const getPosts: RequestHandler = async (req, res, next) => {
    const postDAO = new PostModel.PostDAO(req.db);
    try {
        const posts = await postDAO.getPostsForUserFeed();
        sendSuccessResponse(res, 200, 'Successfully retrieved posts:', posts);
    } catch (error) {
        throw createHttpError(500, 'Internal server error');
    } finally {
        req.db.release();
    }
};
export const getPostById: RequestHandler = async (req, res, next) => {
    const postDAO = new PostModel.PostDAO(req.db);
    try {
        const post = await postDAO.getById(parseInt(req.body.id, 10));
        sendSuccessResponse(res, 200, 'Successfully retrieved post:', post);
    } catch (error) {
        throw createHttpError(500, 'Internal server error');
    } finally {
        req.db.release();
    }
};
export const updatePostById: RequestHandler = (req, res, next) => {
    const postDAO = new PostModel.PostDAO(req.db);
};
export const deletePostById: RequestHandler = (req, res, next) => {};
