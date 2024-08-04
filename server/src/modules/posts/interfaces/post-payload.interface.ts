import { Post, Prisma } from '.prisma/client';

export interface PostPayloadType {
    userErrors: {
        message: string;
    }[];
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}
