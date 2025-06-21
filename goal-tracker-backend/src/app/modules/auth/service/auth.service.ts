import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ErrorMessagesMapping } from 'src/app/shared/Enums/error-messages-mapping';
import { PrismaService } from 'src/app/shared/prisma';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    protected readonly configService: ConfigService,
    protected jwtService: JwtService,
    protected prismaService: PrismaService,
  ) {}

  protected async isUser(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user) {
      throw new BadRequestException(ErrorMessagesMapping.USER_ALREADY_EXISTS);
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  private async verifyPassword(
    Password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(Password, hashedPassword);

    if (!isPasswordMatching) {
      throw new UnauthorizedException(ErrorMessagesMapping.INVALID_CREDENTIALS);
    }
  }

  private async generateTokens(id: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { id, email },
      {
        secret: this.configService.get<string>(
          'auth.jwt.accessToken.secretKey',
        ),
        expiresIn: this.configService.get<number>(
          'auth.jwt.accessToken.expirationTime',
        ),
      },
    );
    return {
      accessToken,
    };
  }

  protected async getAccessToken(id: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { id, email },
      {
        secret: this.configService.get<string>(
          'auth.jwt.accessToken.secretKey',
        ),
        expiresIn: this.configService.get<number>(
          'auth.jwt.accessToken.expirationTime',
        ),
      },
    );
    return accessToken;
  }

  async getAuthenticatedUser(
    email: string,
    Password: string,
  ): Promise<Partial<User>> {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException(ErrorMessagesMapping.USER_NOT_FOUND);
    }

    await this.verifyPassword(Password, user.password);
    const { id, username } = user;

    return { id, username, email }
  }

  async buildUserTokenResponse(id: string, email: string) {
    const { accessToken } = await this.generateTokens(id, email);

    return accessToken ;
  }
}
