import { StatusCodes } from 'http-status-codes';
import { Context } from '..';
import { ApiError } from '../errors/api-error';

interface CanUserMutatePostParams {
    userId: number;
    postId: number;
    prisma: Context['prisma'];
}

export const canUserMutatePost = async ({
    userId,
    postId,
    prisma,
}: CanUserMutatePostParams): Promise<boolean> => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    });

    if (post?.authorId !== user.id) {
        throw new ApiError('Post is not owned by user', StatusCodes.FORBIDDEN);
    }
    return true;
};
