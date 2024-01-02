interface Post {
    id: number; //primary key
    user_id: number; //foreign key
    content: string;
    likes: number;
    dislikes: number;
    //comment
}
