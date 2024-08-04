import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { configs } from '../../configs/config';
import { SigninArgs } from './interfaces/signin.interface';
import { SignupArgs } from './interfaces/signup.interface';
import { UserPayload } from './interfaces/user-payload.interface';
import { Context } from '../..';
import { ApiError } from '../../errors/api-error';
import { StatusCodes } from 'http-status-codes';

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
                throw new ApiError('Invalid email', StatusCodes.BAD_REQUEST);
            }

            const isValidPassword = validator.isLength(password, {
                min: 5,
            });

            if (!isValidPassword) {
                throw new ApiError('Invalid password', StatusCodes.BAD_REQUEST);
            }

            if (!name || !bio) {
                throw new ApiError(
                    'Invalid name or bio',
                    StatusCodes.BAD_REQUEST,
                );
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
                throw new ApiError(
                    'Invalid credentials',
                    StatusCodes.NOT_FOUND,
                );
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new ApiError(
                    'Invalid credentials',
                    StatusCodes.BAD_REQUEST,
                );
            }

            return {
                token: JWT.sign({ userId: user.id }, configs.JSON_SIGNATURE, {
                    expiresIn: 3600000,
                }),
            };
        },
    },
};
