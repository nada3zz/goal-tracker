import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { ErrorMessagesMapping } from 'src/app/shared/Enums/error-messages-mapping';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class userAuthService extends AuthService {
  async register(registeredUser: RegisterDto) {
    await this.isUser(registeredUser.email);

    const password = await this.hashPassword(registeredUser.password);
    const { username, email } = registeredUser;

    const createdUser = await this.prismaService.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    const accessToken = await this.buildUserTokenResponse(
      createdUser.id,
      email,
    );

    return {
      message: ErrorMessagesMapping.REGISTRATION_SUCCESS,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.getAuthenticatedUser(
      loginDto.email,
      loginDto.password,
    );

    const accessToken = await this.buildUserTokenResponse(user.id, user.email);

    return {
      message: ErrorMessagesMapping.LOGIN_SUCCESS,
      accessToken,
    };
  }
}
