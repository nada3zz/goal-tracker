import { Module, MiddlewareConsumer } from '@nestjs/common';
import { GoalModule } from './modules/goal/goal.module';
import { PrismaModule } from './shared/prisma';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Configs from './shared/config';
import { APP_FILTER} from '@nestjs/core';
import { PrismaExceptionFilter } from './shared/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggerMiddleWare } from './shared/middlewares/logger.middleware';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    GoalModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleWare).forRoutes('*');
  }
}
