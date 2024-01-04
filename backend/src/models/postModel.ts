import { Pool, QueryResult } from 'pg';

interface Post {
    id: number; //primary key
    user_id: number; //foreign key
    content: string;
    post_date: Date;
    tags?: string[];
    likes?: number;
    dislikes?: number;
    comments?: number;
    view_count?: number;
}

class PostDAO {
    constructor(private pool: Pool) {}

    async createPost(post: Post): Promise<Post> {
        const query = `INSERT INTO posts (user_id, content, post_date, likes, dislikes, comments, view_count, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;
        const values = [
            post.user_id,
            post.content,
            new Date(),
            post.tags || [],
            post.likes || 0,
            post.dislikes || 0,
            post.comments || 0,
            post.view_count || 0,
        ];
        const client = await this.pool.connect();

        try {
            const result: QueryResult = await client.query(query, values);
            const createdPost: Post = result.rows[0];
            return createdPost;
        } catch (error) {
            throw new Error(`Error creating post: ${error}`);
        } finally {
            client.release();
        }
    }

    async findByUserId(userId: number): Promise<Post[] | null> {
        const query = 'SELECT * FROM posts WHERE user_id = $1';
        const values = [userId];
        const client = await this.pool.connect();
        try {
            const result: QueryResult = await client.query(query, values);
            const posts: Post[] = result.rows;

            return posts || null;
        } catch (error) {
            throw new Error(`Error fetching post by user.id: ${error}`);
        } finally {
            client.release();
        }
    }
}
