import { Context } from '../..';
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
                return {
                    userErrors: [
                        {
                            message: 'Forbidden access (unauthenticated)',
                        },
                    ],
                    post: null,
                };
            }

            const { title, content } = post;
            if (!title || !content) {
                return {
                    userErrors: [
                        {
                            message:
                                'You must provide title and content to create a post',
                        },
                    ],
                    post: null,
                };
            }

            return {
                userErrors: [],
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
                return {
                    userErrors: [
                        {
                            message: 'Forbidden access (unauthenticated)',
                        },
                    ],
                    post: null,
                };
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (error) return error;

            const { title, content } = post;

            if (!title && !content) {
                return {
                    userErrors: [
                        {
                            message:
                                'Need to have at least on e field to update',
                        },
                    ],
                    post: null,
                };
            }

            const existingPost = await prisma.post.findUnique({
                where: {
                    id: Number(postId),
                },
            });

            if (!existingPost) {
                return {
                    userErrors: [
                        {
                            message: 'Post does not exist',
                        },
                    ],
                    post: null,
                };
            }

            const payloadToUpdate = {
                title,
                content,
            };

            if (!title) delete payloadToUpdate.title;
            if (!content) delete payloadToUpdate.content;

            return {
                userErrors: [],
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
                return {
                    userErrors: [
                        {
                            message: 'Forbidden access (unauthenticated)',
                        },
                    ],
                    post: null,
                };
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (error) return error;

            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId),
                },
            });

            if (!post) {
                return {
                    userErrors: [
                        {
                            message: 'Post does not exist',
                        },
                    ],
                    post: null,
                };
            }

            await prisma.post.delete({
                where: {
                    id: Number(postId),
                },
            });

            return {
                userErrors: [],
                post,
            };
        },
        postPublish: async (
            _: any,
            { postId }: { postId: string },
            { prisma, userInfo }: Context,
        ): Promise<PostPayloadType> => {
            if (!userInfo) {
                return {
                    userErrors: [
                        {
                            message: 'Forbidden access (unauthenticated)',
                        },
                    ],
                    post: null,
                };
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (error) return error;

            return {
                userErrors: [],
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
                return {
                    userErrors: [
                        {
                            message: 'Forbidden access (unauthenticated)',
                        },
                    ],
                    post: null,
                };
            }

            const error = await canUserMutatePost({
                userId: userInfo.userId,
                postId: Number(postId),
                prisma,
            });

            if (error) return error;

            return {
                userErrors: [],
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
