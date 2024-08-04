import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { configs } from '../../configs/config';
import { Context } from '../../index';
import { SigninArgs } from './interfaces/signin.interface';
import { SignupArgs } from './interfaces/signup.interface';
import { UserPayload } from './interfaces/user-payload.interface';

export const authResolvers = {
    Mutation: {
        signup: async (
            _: any,
            { credentials, name, bio }: SignupArgs,
            { prisma }: Context,
        ): Promise<UserPayload> => {
            const { email, password } = credentials;

            const isEmail = validator.isEmail(email);

            if (!isEmail) {
                return {
                    userErrors: [
                        {
                            message: 'Invalid email',
                        },
                    ],
                    token: null,
                };
            }

            const isValidPassword = validator.isLength(password, {
                min: 5,
            });

            if (!isValidPassword) {
                return {
                    userErrors: [
                        {
                            message: 'Invalid password',
                        },
                    ],
                    token: null,
                };
            }

            if (!name || !bio) {
                return {
                    userErrors: [
                        {
                            message: 'Invalid name or bio',
                        },
                    ],
                    token: null,
                };
            }

            const hashedPassword = await bcrypt.hash(password, configs.SALT);

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                },
            });

            await prisma.profile.create({
                data: {
                    bio,
                    userId: user.id,
                },
            });

            return {
                userErrors: [],
                token: JWT.sign(
                    {
                        userId: user.id,
                    },
                    configs.JSON_SIGNATURE,
                    {
                        expiresIn: 3600000,
                    },
                ),
            };
        },
        signin: async (
            _: any,
            { credentials }: SigninArgs,
            { prisma }: Context,
        ): Promise<UserPayload> => {
            const { email, password } = credentials;

            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                return {
                    userErrors: [{ message: 'Invalid credentials' }],
                    token: null,
                };
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return {
                    userErrors: [{ message: 'Invalid credentials' }],
                    token: null,
                };
            }

            return {
                userErrors: [],
                token: JWT.sign({ userId: user.id }, configs.JSON_SIGNATURE, {
                    expiresIn: 3600000,
                }),
            };
        },
    },
};
