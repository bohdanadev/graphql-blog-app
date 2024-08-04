import { gql } from 'apollo-server';

export const profileSchema = gql`
    type Profile {
        id: ID!
        bio: String!
        isMyProfile: Boolean!
        user: User!
    }

    type Query {
        profile(userId: ID!): Profile
    }
`;
