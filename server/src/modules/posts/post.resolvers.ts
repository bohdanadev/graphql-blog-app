import { StatusCodes } from 'http-status-codes';
import { Context } from '../..';
import { ApiError } from '../../errors/api-error';
import { userLoader } from '../../loaders/user-loader';
import { canUserMutatePost } from '../../utils/can-user-mutate-post';
import { PostArgs } from './interfaces/post-args.interface';
import { PostParentType } from './interfaces/post-parent-type.interface';
import { PostPayloadType } from './interfaces/post-payload.interface';

export const postResolvers = {
    Query: {
        posts: (_: any, __: any, { prisma }: Context) => {
            return prisma.post.findMany({
                where: {
                    published: true,
                },
                orderBy: [
                    {
                        createdAt: 'desc',
                    },
                ],
            });
        },
    },
    Mutation: {
        postCreate: async (
            _: any,
            { post }: PostArgs,
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                throw new ApiError(
                    'Forbidden access (unauthenticated)',
                    StatusCodes.FORBIDDEN,
                );
            }

            const { title, content } = post;
            if (!title || !content) {
                throw new ApiError(
                    'You must provide title and content to create a post',
                    StatusCodes.BAD_REQUEST,
                );
            }

            return {
                post: prisma.post.create({
                    data: {
                        title,
                        content,
                        authorId: userInfo.userId,
                    },
                }),
            };
        },
        postUpdate: async (
            _: any,
            { post, postId }: { postId: string; post: PostArgs['post'] },
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                throw new ApiError(
                    'Forbidden access (unauthenticated)',
                    StatusCodes.FORBIDDEN,
                );
            }

            const isAllowed = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (!isAllowed) {
                throw new ApiError('Forbidden access', StatusCodes.FORBIDDEN);
            }

            const { title, content } = post;

            if (!title && !content) {
                throw new ApiError(
                    'Need to have at least one field to update',
                    StatusCodes.BAD_REQUEST,
                );
            }

            const existingPost = await prisma.post.findUnique({
                where: {
                    id: Number(postId),
                },
            });

            if (!existingPost) {
                throw new ApiError(
                    'Post does not exist',
                    StatusCodes.NOT_FOUND,
                );
            }

            const payloadToUpdate = {
                title,
                content,
            };

            if (!title) delete payloadToUpdate.title;
            if (!content) delete payloadToUpdate.content;

            return {
                post: prisma.post.update({
                    data: {
                        ...payloadToUpdate,
                    },
                    where: {
                        id: Number(postId),
                    },
                }),
            };
        },
        postDelete: async (
            _: any,
            { postId }: { postId: string },
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                throw new ApiError(
                    'Forbidden access (unauthenticated)',
                    StatusCodes.FORBIDDEN,
                );
            }

            const isAllowed = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (!isAllowed) {
                throw new ApiError('Forbidden access', StatusCodes.FORBIDDEN);
            }

            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId),
                },
            });

            if (!post) {
                throw new ApiError(
                    'Post does not exist',
                    StatusCodes.NOT_FOUND,
                );
            }

            await prisma.post.delete({
                where: {
                    id: Number(postId),
                },
            });

            return {
                post,
            };
        },
        postPublish: async (
            _: any,
            { postId }: { postId: string },
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                throw new ApiError(
                    'Forbidden access (unauthenticated)',
                    StatusCodes.FORBIDDEN,
                );
            }

            const isAllowed = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (!isAllowed) {
                throw new ApiError('Forbidden access', StatusCodes.FORBIDDEN);
            }

            return {
                post: prisma.post.update({
                    where: {
                        id: Number(postId),
                    },
                    data: {
                        published: true,
                    },
                }),
            };
        },
        postUnpublish: async (
            _: any,
            { postId }: { postId: string },
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                throw new ApiError(
                    'Forbidden access (unauthenticated)',
                    StatusCodes.FORBIDDEN,
                );
            }

            const isAllowed = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (!isAllowed) {
                throw new ApiError('Forbidden access', StatusCodes.FORBIDDEN);
            }

            return {
                post: prisma.post.update({
                    where: {
                        id: Number(postId),
                    },
                    data: {
                        published: false,
                    },
                }),
            };
        },
    },
    Post: {
        user: (parent: PostParentType, __: any, { prisma }: Context) => {
            return userLoader.load(parent.authorId);
        },
    },
};
