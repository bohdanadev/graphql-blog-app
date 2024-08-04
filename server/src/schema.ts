import { authSchema } from './modules/auth/auth.schema';
import { postSchema } from './modules/posts/post.schema';
import { profileSchema } from './modules/profile/profile.schema';
import { userSchema } from './modules/users/user.schema';

export const typeDefs = [authSchema, postSchema, profileSchema, userSchema];
