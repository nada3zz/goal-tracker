import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
  }),
);
