import JWT from 'jsonwebtoken';
import { configs } from './../configs/config';

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token, configs.JSON_SIGNATURE) as {
            userId: number;
        };
    } catch (error) {
        return null;
    }
};
