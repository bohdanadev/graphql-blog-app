import { Context } from '../..';
import { UserParentType } from './interfaces/user-parent-type.interface';

export const userResolvers = {
    Query: {
        me: (_: any, __: any, { userInfo, prisma }: Context) => {
            if (!userInfo) return null;
            return prisma.user.findUnique({
                where: {
                    id: userInfo.userId,
                },
            });
        },
    },
    User: {
        posts: (
            parent: UserParentType,
            __: any,
            { userInfo, prisma }: Context,
        ) => {
            const isOwnProfile = parent.id === userInfo?.userId;

            if (isOwnProfile) {
                return prisma.post.findMany({
                    where: {
                        authorId: parent.id,
                    },
                    orderBy: [
                        {
                            createdAt: 'desc',
                        },
                    ],
                });
            } else {
                return prisma.post.findMany({
                    where: {
                        authorId: parent.id,
                        published: true,
                    },
                    orderBy: [
                        {
                            createdAt: 'desc',
                        },
                    ],
                });
            }
        },
    },
};
