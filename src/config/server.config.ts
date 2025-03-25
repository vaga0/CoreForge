import dotenv from 'dotenv';

dotenv.config();

export const config = {
    httpPort: process.env.HTTP_PORT || 3000,
    httpsPort: process.env.HTTPS_PORT || 3443,
}