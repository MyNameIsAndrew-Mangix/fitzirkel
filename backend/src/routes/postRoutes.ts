import express from 'express';
import * as postController from '../controllers/postController';
const router = express.Router();

router.post('/createPost', postController.createPost); //create post
router.get('/getPosts', postController.getPosts); //read posts
router.get('/getPostsByUserId', postController.getPostsByUserId);
router.get('/getPostById', postController.getPostById); //read post by id
router.patch('/editPost', postController.editPost); //update post
router.patch('/updateLikesAndDislikes', postController.updateLikesAndDislikes);
router.patch('/commentPost', postController.updateComments);
router.patch('/updateViews', postController.updateViews);
router.delete('/deletePost', postController.deletePostById); //delete post

//what do people on social media do with posts?
/*
they make posts, 
edit posts, 
delete posts, 
get posts in bulk (feed), 
and read individual posts
any else??
should comment be on post API or its own API?
*/

export default router;
