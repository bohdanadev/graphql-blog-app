import { Post, Prisma } from '.prisma/client';

export interface PostPayloadType {
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}
