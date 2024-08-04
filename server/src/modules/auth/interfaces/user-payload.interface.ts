export interface UserPayload {
    userErrors: {
        message: string;
    }[];
    token: string | null;
}
