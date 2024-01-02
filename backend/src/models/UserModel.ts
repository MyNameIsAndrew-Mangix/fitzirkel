interface User {
    id: number; //primary key
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    //posts: Post[];
    //profile foreign key
    /* DOES THIS MAKE SENSE OR AM I INSANE?
     * password foreign key ->
     * Password {id number,
     *  user_id number FK,
     *  password_hash string,
     *  salt string
     * }
     */
}

export default User;
