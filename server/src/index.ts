import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { Query } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >;
    userInfo: {
        userId: number;
    } | null;
}
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
    },
});

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`);
});
