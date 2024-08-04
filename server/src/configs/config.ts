import dotenv from 'dotenv';

dotenv.config();

type ConfigType = {
    JSON_SIGNATURE: string;
    SALT: number;
};

export const configs: ConfigType = {
    JSON_SIGNATURE: process.env.JSON_SIGNATURE!, // Non-null assertion
    SALT: Number(process.env.SALT),
};
