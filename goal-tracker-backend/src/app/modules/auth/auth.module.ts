import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AccessTokenStrategy } from './strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { userAuthService } from './service/userAuth.service';
import { PrismaModule } from 'src/app/shared/prisma';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    userAuthService,
    AccessTokenStrategy,
  ],
  exports: [
    AuthService,
    userAuthService,
    AccessTokenStrategy,
  ],
})
export class AuthModule {}
