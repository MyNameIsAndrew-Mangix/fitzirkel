/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool, QueryResult } from 'pg';
import { EmptyResultError } from 'sequelize';

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

    private async executeQuery(query: string, values: any[], returnArray: false): Promise<Post | null>;
    private async executeQuery(query: string, values: any[], returnArray: true): Promise<Post[] | null>;
    private async executeQuery(query: string, values: any[], returnArray: boolean): Promise<Post | Post[] | null> {
        try {
            let result: QueryResult;
            if (values.length === 0) {
                result = await this.pool.query(query);
            } else {
                result = await this.pool.query(query, values);
            }
            const data = result.rows;

            if (data.length === 0) {
                throw new Error('No data found for the query');
            }
            if (returnArray) {
                return data;
            } else {
                return data[0];
            }
        } catch (error) {
            throw new EmptyResultError(`Error executing query: ${error}`);
        }
    }

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

        return await this.executeQuery(query, values, false);
    }

    async getPostsForUserFeed(): Promise<Post[] | null> {
        const query = 'SELECT * FROM posts ORDER BY post_date DESC LIMIT 10';
        return await this.executeQuery(query, [], true);
    }
    async getById(id: number): Promise<Post | null> {
        const query = 'SELECT * FROM posts WHERE id = $1';
        const values = [id];
        return await this.executeQuery(query, values, false);
    }

    async getByUserId(userId: number): Promise<Post[] | null> {
        const query = 'SELECT * FROM posts WHERE user_id = $1';
        const values = [userId];
        return await this.executeQuery(query, values, true);
    }

    async updateContent(id: number, content: string): Promise<Post | null> {
        const query = 'UPDATE posts SET content = $2 WHERE id = $1 RETURNING *;';
        const values = [id, content];
        return await this.executeQuery(query, values, false);
    }

    async updateLikesAndDislikes(id: number, newLikes: number, newDislikes: number): Promise<Post | null> {
        const query = 'UPDATE posts SET likes = $2, dislikes = $3 WHERE id = $1 RETURNING *;';
        const values = [id, newLikes, newDislikes];
        return await this.executeQuery(query, values, false);
    }
    async updateComments(id: number, newCommentCount: number): Promise<Post | null> {
        const query = 'UPDATE posts SET comments = $2 WHERE id = $1 RETURNING *;';
        const values = [id, newCommentCount];
        return await this.executeQuery(query, values, false);
    }
    async updateViewCount(id: number, newViewCount: number): Promise<Post | null> {
        const query = 'UPDATE posts SET view_count = $2 WHERE id = $1 RETURNING *;';
        const values = [id, newViewCount];
        return await this.executeQuery(query, values, false);
    }
    async updateTags(id: number, newTags: string[]): Promise<Post | null> {
        const query = 'UPDATE posts SET tags = $2 WHERE id = $1 RETURNING *;';
        const values = [id, newTags];
        return await this.executeQuery(query, values, false);
    }
}
export { Post, PostDAO };
