import { ApolloServer } from 'apollo-server';
import { PrismaClient, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { getUserFromToken } from './utils/get-user-from-token';
import { authResolvers } from './modules/auth/auth.resolvers';
import { postResolvers } from './modules/posts/post.resolvers';
import { profileResolvers } from './modules/profile/profile.resolvers';
import { userResolvers } from './modules/users/user.resolvers';
import { authSchema } from './modules/auth/auth.schema';
import { postSchema } from './modules/posts/post.schema';
import { profileSchema } from './modules/profile/profile.schema';
import { userSchema } from './modules/users/user.schema';

export const prisma = new PrismaClient();

const typeDefs = [authSchema, postSchema, profileSchema, userSchema];

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    userInfo: {
        userId: number;
    } | null;
}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query: {
            ...postResolvers.Query,
            ...profileResolvers.Query,
            ...userResolvers.Query,
        },
        Mutation: {
            ...authResolvers.Mutation,
            ...postResolvers.Mutation,
        },
        Post: {
            ...postResolvers.Post,
        },
        Profile: {
            ...profileResolvers.Profile,
        },
        User: {
            ...userResolvers.User,
        },
    },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserFromToken(req.headers.authorization);

        return {
            prisma,
            userInfo,
        };
    },
});
server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`);
});
