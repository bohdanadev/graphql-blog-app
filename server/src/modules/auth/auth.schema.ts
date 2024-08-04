import { gql } from 'apollo-server';

export const authSchema = gql`
    type AuthPayload {
        token: String
    }

    type Mutation {
        signup(
            credentials: CredentialsInput!
            name: String!
            bio: String!
        ): AuthPayload!
        signin(credentials: CredentialsInput!): AuthPayload!
    }

    input CredentialsInput {
        email: String!
        password: String!
    }
`;
