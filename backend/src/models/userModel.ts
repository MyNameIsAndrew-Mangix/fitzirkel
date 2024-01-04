import { Pool, QueryResult } from 'pg';
import bcrypt from 'bcrypt';

interface User {
    id: number; //primary key
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    //one to many relation, user to posts
    //profile foreign key?
    /* DOES THIS MAKE SENSE OR AM I INSANE?
     * password foreign key ->
     * Password {id number,
     *  user_id number foreign key,
     *  password_hash string,
     *  salt string
     * }
     */
}

class UserDAO {
    constructor(private pool: Pool) {}

    async findByUsername(username: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE username = $1 FOR UPDATE';
        const values = [username];
        try {
            const result: QueryResult = await this.pool.query(query, values);
            const user: User | undefined = result.rows[0];

            return user || null;
        } catch (error) {
            throw new Error(`Error fetching user by username: ${error}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1 FOR UPDATE';
        const values = [email];
        try {
            const result: QueryResult = await this.pool.query(query, values);
            const user: User | undefined = result.rows[0];
            return user || null;
        } catch (error) {
            throw new Error(`Error fetching user by email: ${error}`);
        }
    }

    async findById(id: number): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        try {
            const result: QueryResult = await this.pool.query(query, values);
            const user: User | undefined = result.rows[0];
            return user || null;
        } catch (error) {
            throw new Error(`Error fetching user by ID: ${error}`);
        }
    }

    async verifyPassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}

export { User, UserDAO };
