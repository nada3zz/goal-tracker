import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
        expirationTime: 1000,
      },
    },
  }),
);

