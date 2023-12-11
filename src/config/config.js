import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongoose: {
        url: process.env.MONGODB_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
        cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
    },
    cors: {
        prodOrigin: process.env.PROD_ORIGIN,
        devOrigin: process.env.DEV_ORIGIN,
    },
};
