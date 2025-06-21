import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info) {
    if (info instanceof Error) {
      throw new UnauthorizedException({
        status: 401,
        error: 'Invalid Token!',
      });
    }
    return user;
  }
}
