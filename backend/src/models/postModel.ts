import { Pool, QueryResult } from 'pg';

interface Post {
    id?: number; //primary key
    user_id: number; //foreign key
    content: string;
    post_date?: Date;
    likes?: number;
    dislikes?: number;
    comments?: number;
    view_count?: number;
    tags?: string[];
}

class PostDAO {
    constructor(private pool: Pool) {}

    async createPost(post: Post): Promise<Post | null> {
        const query = `INSERT INTO posts (user_id, content, post_date, likes, dislikes, comments, view_count, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;
        const values = [
            post.user_id,
            post.content,
            new Date(),
            post.likes || 0,
            post.dislikes || 0,
            post.comments || 0,
            post.view_count || 0,
            post.tags || [],
        ];

        try {
            const result: QueryResult = await this.pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('No rows returned after creating the post');
            }
            const createdPost: Post = result.rows[0];
            return createdPost;
        } catch (error) {
            console.error(`Error creating post: ${error}`);
            return null;
        }
    }

    async getPostsForUserFeed(): Promise<Post[] | null> {
        const query = 'SELECT * FROM posts ORDER BY post_date DESC LIMIT 10';

        try {
            const result: QueryResult = await this.pool.query(query);
            if (result.rows.length === 0) {
                throw new Error('No rows returned from 10 most recent post query');
            }
            const posts: Post[] = result.rows;

            return posts || null;
        } catch (error) {
            throw new Error(`Error fetching 10 most recent posts: ${error}`);
        }
    }

    async findByUserId(userId: number): Promise<Post[] | null> {
        const query = 'SELECT * FROM posts WHERE user_id = $1';
        const values = [userId];
        try {
            const result: QueryResult = await this.pool.query(query, values);
            const posts: Post[] = result.rows;

            return posts || null;
        } catch (error) {
            throw new Error(`Error fetching post by user.id: ${error}`);
        }
    }
}

export { Post, PostDAO };
