import { ApolloError } from 'apollo-server-errors';

export class ApiError extends ApolloError {
    constructor(message: string, code: string | any) {
        super(message, code);

        Object.defineProperty(this, 'name', { value: 'MyError' });
    }
}
