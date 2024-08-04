import { Context } from '../..';
import { ProfileParentType } from './interfaces/profile-parent-type.interface';

export const profileResolvers = {
    Query: {
        profile: async (
            _: any,
            { userId }: { userId: string },
            { prisma, userInfo }: Context,
        ) => {
            const isMyProfile = Number(userId) === userInfo?.userId;

            const profile = await prisma.profile.findUnique({
                where: {
                    userId: Number(userId),
                },
            });

            if (!profile) return null;

            return {
                ...profile,
                isMyProfile,
            };
        },
    },
    Profile: {
        user: (
            parent: ProfileParentType,
            __: any,
            { userInfo, prisma }: Context,
        ) => {
            return prisma.user.findUnique({
                where: {
                    id: parent.userId,
                },
            });
        },
    },
};
